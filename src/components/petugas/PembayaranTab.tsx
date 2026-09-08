import React, { useState } from 'react';
import {
  CreditCard,
  Printer,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Check,
  AlertCircle,
  DollarSign,
  FileText,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Pembayaran, Tagihan, Siswa, AkunKas, Petugas } from '../../types';
import { AppStorageService } from '../../services/storage';

interface PembayaranTabProps {
  pembayaranList: Pembayaran[];
  onUpdatePembayaran: (data: Pembayaran[]) => void;
  tagihanList: Tagihan[];
  onUpdateTagihan: (data: Tagihan[]) => void;
  siswaList: Siswa[];
  akunKasList: AkunKas[];
  onUpdateAkunKas: (data: AkunKas[]) => void;
  currentPetugas: Petugas;
  onOpenReceipt: (pembayaran: Pembayaran, siswa: Siswa, tagihan?: Tagihan) => void;
  preSelectedTagihan?: Tagihan | null;
  onClearPreSelectedTagihan?: () => void;
}

export const PembayaranTab: React.FC<PembayaranTabProps> = ({
  pembayaranList,
  onUpdatePembayaran,
  tagihanList,
  onUpdateTagihan,
  siswaList,
  akunKasList,
  onUpdateAkunKas,
  currentPetugas,
  onOpenReceipt,
  preSelectedTagihan,
  onClearPreSelectedTagihan,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMetode, setFilterMetode] = useState('Semua');
  const [filterVerifikasi, setFilterVerifikasi] = useState('Semua');
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(!!preSelectedTagihan);

  // Form State for Payment
  const [selectedTagihanId, setSelectedTagihanId] = useState<string>(preSelectedTagihan?.id || '');
  const [nominalBayar, setNominalBayar] = useState<number>(preSelectedTagihan?.sisaTagihan || 0);
  const [metode, setMetode] = useState<'Tunai' | 'Transfer Bank' | 'E-Wallet'>('Tunai');
  const [kasAkunId, setKasAkunId] = useState<string>(akunKasList[0]?.id || 'kas-1');
  const [catatan, setCatatan] = useState('');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const tagihan = tagihanList.find((t) => t.id === selectedTagihanId);
    if (!tagihan) {
      alert('Pilih tagihan terlebih dahulu.');
      return;
    }
    const payAmount = Number(nominalBayar);
    if (payAmount <= 0) {
      alert('Nominal pembayaran harus lebih dari 0.');
      return;
    }

    const siswa = siswaList.find((s) => s.id === tagihan.siswaId);
    const newNota = 'TB-BYR-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const newPayment: Pembayaran = {
      id: 'pby-' + Date.now(),
      noNota: newNota,
      tagihanId: tagihan.id,
      siswaId: tagihan.siswaId,
      tglBayar: new Date().toISOString().slice(0, 10),
      nominalBayar: payAmount,
      metode,
      statusVerifikasi: 'Terverifikasi',
      kasAkunId,
      catatan: catatan || `Pembayaran ${tagihan.namaTagihan}`,
      petugasId: currentPetugas.id,
    };

    // Update Tagihan Balance
    const newTerbayar = tagihan.terbayar + payAmount;
    const newSisa = Math.max(0, tagihan.nominal - tagihan.potongan - newTerbayar);
    const newStatus = newSisa === 0 ? 'Lunas' : 'Sebagian';

    const updatedTagihanList = tagihanList.map((t) =>
      t.id === tagihan.id
        ? {
            ...t,
            terbayar: newTerbayar,
            sisaTagihan: newSisa,
            status: newStatus as any,
          }
        : t
    );
    onUpdateTagihan(updatedTagihanList);
    AppStorageService.saveTagihan(updatedTagihanList);

    // Save Payment
    const updatedPembayaran = [newPayment, ...pembayaranList];
    onUpdatePembayaran(updatedPembayaran);
    AppStorageService.savePembayaran(updatedPembayaran);

    // Add to Arus Kas automatically
    const kasAccount = akunKasList.find((k) => k.id === kasAkunId);
    const currentKas = AppStorageService.getArusKas();
    const newKasEntry = {
      id: 'kas-in-' + Date.now(),
      noTransaksi: 'KAS-IN-' + Date.now(),
      tgl: new Date().toISOString().slice(0, 10),
      tipe: 'Masuk' as const,
      kategori: 'Penerimaan Tagihan Siswa',
      akunKasId: kasAkunId,
      nominal: payAmount,
      deskripsi: `Input Otomatis Pembayaran Nota ${newNota} (${siswa?.nama || 'Siswa'})`,
      noReferensi: newNota,
    };
    AppStorageService.saveArusKas([newKasEntry, ...currentKas]);

    // Update Kas Balance
    if (kasAccount) {
      const updatedKasAccounts = akunKasList.map((k) =>
        k.id === kasAkunId ? { ...k, saldoSaatIni: k.saldoSaatIni + payAmount } : k
      );
      onUpdateAkunKas(updatedKasAccounts);
      AppStorageService.saveAkunKas(updatedKasAccounts);
    }

    // Add to Transaksi
    const currentTrx = AppStorageService.getTransaksi();
    const newTrx = {
      id: 'trx-' + Date.now(),
      noReferensi: newNota,
      jenis: 'Tagihan' as const,
      arah: 'Masuk' as const,
      nominal: payAmount,
      tanggal: new Date().toLocaleString('id-ID'),
      keterangan: `Pembayaran ${tagihan.namaTagihan}`,
      siswaNama: `${siswa?.nama || 'Siswa'} (${tagihan.periodeBulan})`,
      status: 'Selesai' as const,
      petugas: currentPetugas.nama,
    };
    AppStorageService.saveTransaksi([newTrx, ...currentTrx]);
    AppStorageService.addLog('PROSES_PEMBAYARAN', 'Pembayaran', `Menerima pembayaran ${formatRupiah(payAmount)} untuk ${tagihan.namaTagihan}`);

    setShowNewPaymentModal(false);
    if (onClearPreSelectedTagihan) onClearPreSelectedTagihan();

    // Directly open receipt modal
    if (siswa) {
      onOpenReceipt(newPayment, siswa, tagihan);
    }
  };

  // Verification Handler for Non-Cash Transfer
  const handleVerifyNonTunai = (pby: Pembayaran, status: 'Terverifikasi' | 'Ditolak') => {
    const updated = pembayaranList.map((p) => (p.id === pby.id ? { ...p, statusVerifikasi: status } : p));
    onUpdatePembayaran(updated);
    AppStorageService.savePembayaran(updated);
    AppStorageService.addLog('VERIFIKASI_PEMBAYARAN', 'Pembayaran', `Status verifikasi pembayaran nota ${pby.noNota} diubah menjadi ${status}`);
    alert(`Pembayaran nota ${pby.noNota} berhasil diubah ke status ${status}.`);
  };

  const filteredList = pembayaranList.filter((p) => {
    const siswa = siswaList.find((s) => s.id === p.siswaId);
    const matchesSearch =
      p.noNota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.catatan?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMetode = filterMetode === 'Semua' || p.metode === filterMetode;
    const matchesVerifikasi = filterVerifikasi === 'Semua' || p.statusVerifikasi === filterVerifikasi;

    return matchesSearch && matchesMetode && matchesVerifikasi;
  });

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-64">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nomor nota, siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterMetode}
            onChange={(e) => setFilterMetode(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Metode</option>
            <option value="Tunai">Tunai</option>
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="E-Wallet">E-Wallet</option>
          </select>

          <select
            value={filterVerifikasi}
            onChange={(e) => setFilterVerifikasi(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Status Verifikasi</option>
            <option value="Terverifikasi">Terverifikasi</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedTagihanId(tagihanList[0]?.id || '');
            setNominalBayar(tagihanList[0]?.sisaTagihan || 0);
            setShowNewPaymentModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Input Pembayaran Baru</span>
        </button>
      </div>

      {/* Pembayaran Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Nota &amp; Tanggal</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Tagihan &amp; Catatan</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Nominal Bayar</th>
                <th className="py-3 px-4 text-center">Status Verifikasi</th>
                <th className="py-3 px-4 text-center">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((pby) => {
                const siswa = siswaList.find((s) => s.id === pby.siswaId);
                const tagihan = tagihanList.find((t) => t.id === pby.tagihanId);
                return (
                  <tr key={pby.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <p className="font-bold text-blue-700 text-xs">{pby.noNota}</p>
                      <p className="text-[11px] text-slate-400">{pby.tglBayar}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{siswa?.nama || 'Siswa'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">NISN: {siswa?.nisn}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{tagihan?.namaTagihan || 'Tagihan'}</p>
                      {pby.catatan && <p className="text-[11px] text-slate-500 italic">{pby.catatan}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {pby.metode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-600 text-sm">
                      {formatRupiah(pby.nominalBayar)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pby.statusVerifikasi === 'Terverifikasi'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pby.statusVerifikasi === 'Menunggu Verifikasi'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pby.statusVerifikasi}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Print Receipt */}
                        <button
                          onClick={() => {
                            if (siswa) onOpenReceipt(pby, siswa, tagihan);
                          }}
                          title="Cetak Nota Kwitansi"
                          className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-blue-600" />
                          <span>Nota</span>
                        </button>

                        {/* Verify Non-Tunai Action if pending */}
                        {pby.statusVerifikasi === 'Menunggu Verifikasi' && (
                          <>
                            <button
                              onClick={() => handleVerifyNonTunai(pby, 'Terverifikasi')}
                              title="Verifikasi Valid"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleVerifyNonTunai(pby, 'Ditolak')}
                              title="Tolak Pembayaran"
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Pembayaran Baru */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Proses Pembayaran Tagihan Siswa</h3>
            <p className="text-slate-500 mb-4">
              Mendukung pembayaran tunai langsung di kasir atau konfirmasi transfer bank/non-tunai dengan nominal kustom/cicilan.
            </p>
            <form onSubmit={handleProcessPayment} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Tagihan Siswa *</label>
                <select
                  value={selectedTagihanId}
                  onChange={(e) => {
                    setSelectedTagihanId(e.target.value);
                    const tag = tagihanList.find((t) => t.id === e.target.value);
                    if (tag) setNominalBayar(tag.sisaTagihan);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="">-- Pilih Tagihan Belum Lunas --</option>
                  {tagihanList
                    .filter((t) => t.status !== 'Lunas')
                    .map((t) => {
                      const sis = siswaList.find((s) => s.id === t.siswaId);
                      return (
                        <option key={t.id} value={t.id}>
                          {sis?.nama} - {t.namaTagihan} (Sisa: {formatRupiah(t.sisaTagihan)})
                        </option>
                      );
                    })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Metode Pembayaran</label>
                  <select
                    value={metode}
                    onChange={(e) => setMetode(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Tunai">Tunai (Kasir TU/Bendahara)</option>
                    <option value="Transfer Bank">Transfer Bank (BNI/Mandiri)</option>
                    <option value="E-Wallet">E-Wallet (QRIS / VA)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Masuk ke Akun Kas</label>
                  <select
                    value={kasAkunId}
                    onChange={(e) => setKasAkunId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {akunKasList.map((kas) => (
                      <option key={kas.id} value={kas.id}>{kas.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nominal Pembayaran (Rp) - <i>Bisa Bayar Penuh atau Sebagian (Kustom)</i>
                </label>
                <input
                  type="number"
                  required
                  value={nominalBayar}
                  onChange={(e) => setNominalBayar(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="Contoh: Cicilan ke-1 / Titip Wali Kelas"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewPaymentModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Proses &amp; Cetak Kwitansi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
