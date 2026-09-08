import React, { useState } from 'react';
import {
  GraduationCap,
  CreditCard,
  PiggyBank,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  Upload,
  Send,
  Building,
  QrCode,
  User,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import {
  Siswa,
  Tagihan,
  Pembayaran,
  TabunganTransaksi,
  RekeningPembayaran,
  Kelas,
  UnitJenjang,
  PengaturanAplikasi,
} from '../types';
import { AppStorageService } from '../services/storage';

interface SiswaPortalProps {
  siswaList: Siswa[];
  currentSiswaId: string;
  onSelectSiswa: (siswaId: string) => void;
  tagihanList: Tagihan[];
  pembayaranList: Pembayaran[];
  tabunganList: TabunganTransaksi[];
  rekeningList: RekeningPembayaran[];
  kelasList: Kelas[];
  units: UnitJenjang[];
  pengaturan: PengaturanAplikasi;
  onOpenReceipt: (pembayaran: Pembayaran, siswa: Siswa, tagihan?: Tagihan) => void;
  onOpenCardModal: (siswa: Siswa) => void;
  onPembayaranUpdated: () => void;
}

export const SiswaPortal: React.FC<SiswaPortalProps> = ({
  siswaList,
  currentSiswaId,
  onSelectSiswa,
  tagihanList,
  pembayaranList,
  tabunganList,
  rekeningList,
  kelasList,
  units,
  pengaturan,
  onOpenReceipt,
  onOpenCardModal,
  onPembayaranUpdated,
}) => {
  const currentSiswa = siswaList.find((s) => s.id === currentSiswaId) || siswaList[0];
  const currentKelas = kelasList.find((k) => k.id === currentSiswa?.kelasId);
  const currentUnit = units.find((u) => u.id === currentSiswa?.unitId);

  // Student specific data
  const myTagihan = tagihanList.filter((t) => t.siswaId === currentSiswa?.id);
  const myPembayaran = pembayaranList.filter((p) => p.siswaId === currentSiswa?.id);
  const myTabungan = tabunganList.filter((t) => t.siswaId === currentSiswa?.id);

  const totalTagihanSaya = myTagihan.reduce((acc, t) => acc + t.nominal, 0);
  const totalTerbayarSaya = myTagihan.reduce((acc, t) => acc + t.terbayar, 0);
  const totalSisaSaya = myTagihan.reduce((acc, t) => acc + t.sisaTagihan, 0);

  // Payment Confirmation Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [payTagihan, setPayTagihan] = useState<Tagihan | null>(null);
  const [payMetode, setPayMetode] = useState<'Transfer Bank' | 'E-Wallet'>('Transfer Bank');
  const [payRekeningId, setPayRekeningId] = useState(rekeningList[0]?.id || '');
  const [payCatatan, setPayCatatan] = useState('');
  const [paySukses, setPaySukses] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleKirimBuktiBayar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payTagihan || !currentSiswa) return;

    const noNota = 'TB-NON-' + Date.now();
    const newPayment: Pembayaran = {
      id: 'pby-' + Date.now(),
      noNota,
      tagihanId: payTagihan.id,
      siswaId: currentSiswa.id,
      tglBayar: new Date().toISOString().slice(0, 10),
      nominalBayar: payTagihan.sisaTagihan,
      metode: payMetode,
      statusVerifikasi: 'Menunggu Verifikasi',
      kasAkunId: 'kas-1',
      catatan: payCatatan || `Konfirmasi transfer wali murid via portal (${payMetode})`,
      petugasId: 'ptg-2',
    };

    const currentPby = AppStorageService.getPembayaran();
    AppStorageService.savePembayaran([newPayment, ...currentPby]);
    AppStorageService.addLog('KONFIRMASI_BAYAR_SISWA', 'Siswa', `${currentSiswa.nama} mengonfirmasi pembayaran ${payTagihan.namaTagihan}`);

    setPaySukses(true);
    onPembayaranUpdated();
    setTimeout(() => {
      setPaySukses(false);
      setShowPayModal(false);
      setPayTagihan(null);
    }, 2000);
  };

  if (!currentSiswa) {
    return <div className="p-8 text-center text-slate-400">Tidak ada data siswa ditemukan.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header & Student Switcher */}
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-md shadow-blue-500/20">
              {currentSiswa.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">{currentSiswa.nama}</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  SISWA AKTIF
                </span>
              </div>
              <p className="text-xs text-slate-400">
                NISN: <span className="font-mono text-slate-200">{currentSiswa.nisn}</span> • {currentKelas?.nama} • {currentUnit?.nama}
              </p>
            </div>
          </div>

          {/* Student Selector (Switch Account) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium shrink-0">Pilih Akun Siswa:</span>
            <select
              value={currentSiswa.id}
              onChange={(e) => onSelectSiswa(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:ring-2 focus:ring-blue-500 cursor-pointer w-full md:w-auto"
            >
              {siswaList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.nisn})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Finology Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Saldo Tabungan */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 p-5 rounded-2xl border border-blue-900/50 shadow-md">
            <div className="flex items-center justify-between text-blue-400 mb-3">
              <span className="text-xs font-medium text-slate-400">Saldo Tabungan Digital</span>
              <PiggyBank className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-emerald-400">{formatRupiah(currentSiswa.saldoTabungan)}</h3>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400">E-Kantin QR Ready</span>
              <button
                onClick={() => onOpenCardModal(currentSiswa)}
                className="text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Lihat QR &gt;
              </button>
            </div>
          </div>

          {/* Card 2: Tagihan SPP Sisa */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-rose-400 mb-3">
              <span className="text-xs font-medium text-slate-400">Sisa Tagihan Belum Lunas</span>
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-rose-400">{formatRupiah(totalSisaSaya)}</h3>
            <p className="text-[11px] text-slate-400 mt-2">
              {myTagihan.filter((t) => t.status !== 'Lunas').length} tagihan menunggu pembayaran
            </p>
          </div>

          {/* Card 3: Terbayar */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-emerald-400 mb-3">
              <span className="text-xs font-medium text-slate-400">Total Telah Terbayar</span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-emerald-400">{formatRupiah(totalTerbayarSaya)}</h3>
            <p className="text-[11px] text-slate-400 mt-2">Tercatat lunas di bendahara sekolah</p>
          </div>

          {/* Card 4: Virtual Account */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-indigo-400 mb-3">
              <span className="text-xs font-medium text-slate-400">Nomor Virtual Account</span>
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-mono font-black text-blue-300">{currentSiswa.virtualAccount}</h3>
            <p className="text-[11px] text-slate-400 mt-2">Transfer via ATM / m-Banking</p>
          </div>

        </div>

        {/* Two Column Layout: Tagihan Siswa & Virtual Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Daftar Tagihan & Riwayat Pembayaran (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tagihan Siswa Table */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">Daftar Tagihan Siswa</h3>
                </div>
                <span className="text-xs text-slate-400">{myTagihan.length} tagihan terdata</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Nama Tagihan</th>
                      <th className="py-2.5 px-3">Periode</th>
                      <th className="py-2.5 px-3 text-right">Nominal</th>
                      <th className="py-2.5 px-3 text-right">Sisa</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                      <th className="py-2.5 px-3 text-center">Aksi Bayar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {myTagihan.map((tag) => (
                      <tr key={tag.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{tag.namaTagihan}</p>
                          {tag.potongan > 0 && (
                            <p className="text-[10px] text-amber-400">Potongan Beasiswa: -{formatRupiah(tag.potongan)}</p>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-400">
                          <p>{tag.periodeBulan}</p>
                          <p className="text-[10px] text-slate-500">Tempo: {tag.tglJatuhTempo}</p>
                        </td>
                        <td className="py-3 px-3 text-right font-medium text-slate-200">
                          {formatRupiah(tag.nominal)}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-rose-400">
                          {formatRupiah(tag.sisaTagihan)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tag.status === 'Lunas'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {tag.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {tag.status !== 'Lunas' ? (
                            <button
                              onClick={() => {
                                setPayTagihan(tag);
                                setShowPayModal(true);
                              }}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                            >
                              Bayar Sekarang
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-bold">Lunas ✓</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Riwayat Pembayaran & Cetak Kwitansi */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-bold text-sm text-white">Riwayat Pembayaran &amp; Kwitansi Digital</h3>
                </div>
                <span className="text-xs text-slate-400">{myPembayaran.length} nota pembayaran</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">No. Nota</th>
                      <th className="py-2.5 px-3">Tanggal</th>
                      <th className="py-2.5 px-3">Metode</th>
                      <th className="py-2.5 px-3 text-right">Nominal</th>
                      <th className="py-2.5 px-3 text-center">Verifikasi</th>
                      <th className="py-2.5 px-3 text-center">Kwitansi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {myPembayaran.map((pby) => (
                      <tr key={pby.id} className="hover:bg-slate-900/50 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-400">{pby.noNota}</td>
                        <td className="py-2.5 px-3 text-slate-400">{pby.tglBayar}</td>
                        <td className="py-2.5 px-3 text-slate-300">{pby.metode}</td>
                        <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                          {formatRupiah(pby.nominalBayar)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pby.statusVerifikasi === 'Terverifikasi'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-amber-500/20 text-amber-400'
                            }`}
                          >
                            {pby.statusVerifikasi}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => onOpenReceipt(pby, currentSiswa)}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
                            title="Cetak Nota Kwitansi"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Virtual Smart Card & Bank Accounts (1 col) */}
          <div className="space-y-6">
            
            {/* Virtual Taruna Bangsa Smart Card Display */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-white uppercase tracking-wide">Kartu Digital &amp; QR E-Kantin</h4>
                <button
                  onClick={() => onOpenCardModal(currentSiswa)}
                  className="text-xs text-blue-400 font-bold hover:underline cursor-pointer"
                >
                  Cetak Kartu
                </button>
              </div>

              {/* Card Rendering */}
              <div className="w-full bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-4 shadow-xl border border-blue-900/40 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-extrabold text-xs tracking-wider">TARUNA BANGSA</h5>
                    <p className="text-[9px] text-blue-300">SMART CARD &amp; E-KANTIN</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400">
                    ACTIVE
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-700/60 flex items-center justify-center text-white text-lg font-black border border-white/20">
                    {currentSiswa.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white truncate max-w-32">{currentSiswa.nama}</p>
                    <p className="text-[10px] text-blue-300 font-mono">NISN: {currentSiswa.nisn}</p>
                    <p className="text-[9px] text-slate-400">{currentKelas?.nama}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-2.5 text-[10px]">
                  <div>
                    <p className="text-slate-400">Saldo Tabungan</p>
                    <p className="font-bold text-emerald-400">{formatRupiah(currentSiswa.saldoTabungan)}</p>
                  </div>
                  <button
                    onClick={() => onOpenCardModal(currentSiswa)}
                    className="flex items-center gap-1 text-[10px] bg-white text-slate-950 px-2 py-1 rounded-lg font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <QrCode className="w-3 h-3" />
                    <span>Scan QR</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Rekening Pembayaran Resmi */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wide">Rekening Resmi Sekolah</h4>
              <p className="text-slate-400 text-[11px]">
                Silakan lakukan transfer tagihan atau setoran tabungan ke salah satu rekening berikut:
              </p>
              <div className="space-y-2">
                {rekeningList.map((rek) => (
                  <div key={rek.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <p className="font-bold text-white">{rek.bank}</p>
                    <p className="font-mono text-blue-400 font-bold text-sm tracking-wider mt-0.5">{rek.noRekening}</p>
                    <p className="text-[10px] text-slate-400">a.n. {rek.atasNama}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Konfirmasi Pembayaran Siswa */}
        {showPayModal && payTagihan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-xs text-white">
              <h3 className="text-base font-bold text-white mb-2">Konfirmasi Pembayaran Tagihan</h3>
              <p className="text-slate-400 mb-4">
                Membayar: <b className="text-white">{payTagihan.namaTagihan}</b> ({formatRupiah(payTagihan.sisaTagihan)})
              </p>
              <form onSubmit={handleKirimBuktiBayar} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Pilih Metode Transfer</label>
                  <select
                    value={payMetode}
                    onChange={(e) => setPayMetode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="Transfer Bank">Transfer Bank (BNI/Mandiri)</option>
                    <option value="E-Wallet">E-Wallet / QRIS</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Transfer ke Rekening Tujuan</label>
                  <select
                    value={payRekeningId}
                    onChange={(e) => setPayRekeningId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    {rekeningList.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.bank} - {r.noRekening} (a.n. {r.atasNama})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Catatan / Keterangan Pembayaran</label>
                  <input
                    type="text"
                    value={payCatatan}
                    onChange={(e) => setPayCatatan(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    placeholder="Contoh: Sudah transfer via m-Banking BNI atas nama Bapak Ahmad"
                  />
                </div>

                <div className="p-3 bg-blue-950/60 rounded-xl border border-blue-800/60 text-blue-200">
                  <p className="font-semibold text-[11px]">Total Yang Harus Ditransfer:</p>
                  <p className="text-base font-black text-emerald-400 mt-0.5">{formatRupiah(payTagihan.sisaTagihan)}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  {paySukses ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Konfirmasi terkirim!
                    </span>
                  ) : <span />}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPayModal(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                    >
                      Kirim Konfirmasi Bayar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
