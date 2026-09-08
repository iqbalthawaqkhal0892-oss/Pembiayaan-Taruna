import React, { useState } from 'react';
import {
  PiggyBank,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  QrCode,
  Download,
  Plus,
  Search,
  CheckCircle,
  CreditCard,
  Building,
} from 'lucide-react';
import { TabunganTransaksi, Siswa, Petugas } from '../../types';
import { AppStorageService } from '../../services/storage';

interface TabunganTabProps {
  tabunganList: TabunganTransaksi[];
  onUpdateTabungan: (data: TabunganTransaksi[]) => void;
  siswaList: Siswa[];
  onUpdateSiswa: (data: Siswa[]) => void;
  currentPetugas: Petugas;
  onOpenCardModal: (siswa: Siswa) => void;
}

export const TabunganTab: React.FC<TabunganTabProps> = ({
  tabunganList,
  onUpdateTabungan,
  siswaList,
  onUpdateSiswa,
  currentPetugas,
  onOpenCardModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipe, setFilterTipe] = useState<'Semua' | 'Setor' | 'Tarik'>('Semua');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'Setor' | 'Tarik'>('Setor');

  // Form State
  const [selectedSiswaId, setSelectedSiswaId] = useState(siswaList[0]?.id || '');
  const [nominal, setNominal] = useState<number>(50000);
  const [keterangan, setKeterangan] = useState('');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const totalSaldoSemuaSiswa = siswaList.reduce((acc, s) => acc + (s.saldoTabungan || 0), 0);
  const totalSetoran = tabunganList.filter((t) => t.tipe === 'Setor').reduce((acc, t) => acc + t.nominal, 0);
  const totalPenarikan = tabunganList.filter((t) => t.tipe === 'Tarik').reduce((acc, t) => acc + t.nominal, 0);

  const handleProcessTabungan = (e: React.FormEvent) => {
    e.preventDefault();
    const siswa = siswaList.find((s) => s.id === selectedSiswaId);
    if (!siswa) {
      alert('Pilih siswa terlebih dahulu.');
      return;
    }
    const amount = Number(nominal);
    if (amount <= 0) {
      alert('Nominal harus lebih dari 0.');
      return;
    }

    if (transactionType === 'Tarik' && siswa.saldoTabungan < amount) {
      alert(`Saldo tidak mencukupi! Saldo saat ini: ${formatRupiah(siswa.saldoTabungan)}`);
      return;
    }

    const newSaldo = transactionType === 'Setor' ? siswa.saldoTabungan + amount : siswa.saldoTabungan - amount;
    const noNota = 'TB-TAB-' + Date.now();

    const createdTrx: TabunganTransaksi = {
      id: 'tab-trx-' + Date.now(),
      noNota,
      siswaId: siswa.id,
      tgl: new Date().toISOString().slice(0, 10),
      tipe: transactionType,
      nominal: amount,
      saldoAkhir: newSaldo,
      keterangan: keterangan || (transactionType === 'Setor' ? 'Setoran Tabungan Siswa' : 'Penarikan Tabungan Siswa'),
      petugasId: currentPetugas.id,
    };

    // Update Siswa Balance
    const updatedSiswaList = siswaList.map((s) => (s.id === siswa.id ? { ...s, saldoTabungan: newSaldo } : s));
    onUpdateSiswa(updatedSiswaList);
    AppStorageService.saveSiswa(updatedSiswaList);

    // Save Transaction
    const updatedTabungan = [createdTrx, ...tabunganList];
    onUpdateTabungan(updatedTabungan);
    AppStorageService.saveTabungan(updatedTabungan);

    // Add to Arus Kas
    const currentKas = AppStorageService.getArusKas();
    const kasEntry = {
      id: 'kas-tab-' + Date.now(),
      noTransaksi: 'KAS-TAB-' + Date.now(),
      tgl: new Date().toISOString().slice(0, 10),
      tipe: (transactionType === 'Setor' ? 'Masuk' : 'Keluar') as 'Masuk' | 'Keluar',
      kategori: 'Tabungan Siswa',
      akunKasId: 'kas-1',
      nominal: amount,
      deskripsi: `${transactionType} Tabungan Siswa: ${siswa.nama}`,
      noReferensi: noNota,
    };
    AppStorageService.saveArusKas([kasEntry, ...currentKas]);

    // Add to General Transaksi
    const currentTrx = AppStorageService.getTransaksi();
    const generalTrx = {
      id: 'trx-' + Date.now(),
      noReferensi: noNota,
      jenis: 'Tabungan' as const,
      arah: (transactionType === 'Setor' ? 'Masuk' : 'Keluar') as 'Masuk' | 'Keluar',
      nominal: amount,
      tanggal: new Date().toLocaleString('id-ID'),
      keterangan: `${transactionType} Tabungan: ${siswa.nama}`,
      siswaNama: siswa.nama,
      status: 'Selesai' as const,
      petugas: currentPetugas.nama,
    };
    AppStorageService.saveTransaksi([generalTrx, ...currentTrx]);

    AppStorageService.addLog('TRANSAKSI_TABUNGAN', 'Tabungan', `${transactionType} Tabungan ${siswa.nama} sebesar ${formatRupiah(amount)}`);

    setShowTransactionModal(false);
    setNominal(50000);
    setKeterangan('');
    alert(`Transaksi ${transactionType} ${formatRupiah(amount)} untuk ${siswa.nama} berhasil.`);
  };

  const handleExportExcel = () => {
    const exportData = tabunganList.map((t) => {
      const s = siswaList.find((sis) => sis.id === t.siswaId);
      return {
        'No. Nota': t.noNota,
        'Tanggal': t.tgl,
        'NISN': s?.nisn || '',
        'Nama Siswa': s?.nama || '',
        'Tipe': t.tipe,
        'Nominal': t.nominal,
        'Saldo Akhir': t.saldoAkhir,
        'Keterangan': t.keterangan,
      };
    });
    AppStorageService.exportToExcel(exportData, 'Laporan_Tabungan_Siswa_Taruna_Bangsa', 'Tabungan');
  };

  const filtered = tabunganList.filter((t) => {
    const s = siswaList.find((sis) => sis.id === t.siswaId);
    const matchesSearch =
      t.noNota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s?.nisn.includes(searchQuery) ||
      t.keterangan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTipe = filterTipe === 'Semua' || t.tipe === filterTipe;
    return matchesSearch && matchesTipe;
  });

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-5 rounded-2xl border border-blue-900 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/30 flex items-center justify-center shrink-0">
            <PiggyBank className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">4. Rekap Total Saldo Tabungan</p>
            <h3 className="text-xl font-black text-emerald-400 mt-0.5">{formatRupiah(totalSaldoSemuaSiswa)}</h3>
            <p className="text-[10px] text-blue-300 font-medium">{siswaList.length} rekening siswa terdaftar</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Akumulasi Setoran</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{formatRupiah(totalSetoran)}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Kas masuk tabungan</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Akumulasi Penarikan</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{formatRupiah(totalPenarikan)}</h3>
            <p className="text-[10px] text-rose-600 font-semibold">Tarik tunai &amp; jajan E-Kantin</p>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-64">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi, siswa, no nota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterTipe}
            onChange={(e) => setFilterTipe(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Mutasi</option>
            <option value="Setor">Setoran Saldo</option>
            <option value="Tarik">Penarikan Saldo</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>6. Cetak Laporan Tabungan</span>
          </button>

          {/* Setor Saldo Button */}
          <button
            onClick={() => {
              setTransactionType('Setor');
              setShowTransactionModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>1. Setoran Saldo</span>
          </button>

          {/* Penarikan Saldo Button */}
          <button
            onClick={() => {
              setTransactionType('Tarik');
              setShowTransactionModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>2. Penarikan Saldo</span>
          </button>
        </div>
      </div>

      {/* Table Mutasi Tabungan */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Nota &amp; Tanggal</th>
                <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                <th className="py-3 px-4">Jenis Transaksi</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-right">Saldo Akhir</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4 text-center">QR E-Kantin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trx) => {
                const siswa = siswaList.find((s) => s.id === trx.siswaId);
                return (
                  <tr key={trx.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <p className="font-bold text-slate-900 text-xs">{trx.noNota}</p>
                      <p className="text-[11px] text-slate-400">{trx.tgl}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{siswa?.nama || 'Siswa'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">NISN: {siswa?.nisn}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          trx.tipe === 'Setor' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {trx.tipe === 'Setor' ? '+ Setoran Saldo' : '- Penarikan Saldo'}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-black text-sm ${trx.tipe === 'Setor' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {trx.tipe === 'Setor' ? '+' : '-'}{formatRupiah(trx.nominal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatRupiah(trx.saldoAkhir)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {trx.keterangan}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {siswa && (
                        <button
                          onClick={() => onOpenCardModal(siswa)}
                          title="7. Cetak Kode QR Tabungan (E-Kantin)"
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition cursor-pointer"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Transaksi Setor / Tarik Tabungan */}
      {showTransactionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-base text-slate-900">
              <PiggyBank className="w-5 h-5 text-blue-600" />
              <span>Proses {transactionType === 'Setor' ? 'Setoran Tabungan Siswa' : 'Penarikan Tabungan Siswa'}</span>
            </div>
            <form onSubmit={handleProcessTabungan} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa</label>
                <select
                  value={selectedSiswaId}
                  onChange={(e) => setSelectedSiswaId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  {siswaList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} (Saldo: {formatRupiah(s.saldoTabungan)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  value={nominal}
                  onChange={(e) => setNominal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  placeholder={transactionType === 'Setor' ? 'Contoh: Tabungan mingguan' : 'Contoh: Penarikan jajan E-Kantin'}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTransactionModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white rounded-xl font-semibold cursor-pointer shadow-xs ${
                    transactionType === 'Setor' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Proses {transactionType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
