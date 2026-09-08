import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Download,
  Building,
  DollarSign,
  Search,
  Filter,
  Trash2,
} from 'lucide-react';
import { ArusKas, AkunKas } from '../../types';
import { AppStorageService } from '../../services/storage';

interface ArusKasTabProps {
  arusKasList: ArusKas[];
  onUpdateArusKas: (data: ArusKas[]) => void;
  akunKasList: AkunKas[];
  onUpdateAkunKas: (data: AkunKas[]) => void;
}

export const ArusKasTab: React.FC<ArusKasTabProps> = ({
  arusKasList,
  onUpdateArusKas,
  akunKasList,
  onUpdateAkunKas,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTipe, setFilterTipe] = useState<'Semua' | 'Masuk' | 'Keluar'>('Semua');
  const [filterAkun, setFilterAkun] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAkunModal, setShowAkunModal] = useState(false);

  // New Kas Form State
  const [newKas, setNewKas] = useState({
    tipe: 'Keluar' as 'Masuk' | 'Keluar',
    kategori: 'Operasional Sekolah',
    akunKasId: akunKasList[0]?.id || 'kas-1',
    nominal: 150000,
    deskripsi: '',
    tgl: new Date().toISOString().slice(0, 10),
  });

  // New Akun Kas Form State
  const [newAkunKas, setNewAkunKas] = useState({
    nama: '',
    tipe: 'Kas Tunai' as 'Kas Tunai' | 'Bank' | 'E-Wallet',
    noRek: '',
    saldoAwal: 0,
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Calculations
  const totalMasuk = arusKasList.filter((k) => k.tipe === 'Masuk').reduce((acc, k) => acc + k.nominal, 0);
  const totalKeluar = arusKasList.filter((k) => k.tipe === 'Keluar').reduce((acc, k) => acc + k.nominal, 0);
  const saldoBersih = totalMasuk - totalKeluar;

  const handleExportExcel = () => {
    const exportData = arusKasList.map((k) => {
      const akun = akunKasList.find((a) => a.id === k.akunKasId);
      return {
        'No. Transaksi': k.noTransaksi,
        'Tanggal': k.tgl,
        'Tipe': k.tipe,
        'Kategori': k.kategori,
        'Akun Kas': akun?.nama || '',
        'Nominal': k.nominal,
        'Deskripsi': k.deskripsi,
        'No. Referensi': k.noReferensi || '-',
      };
    });
    AppStorageService.exportToExcel(exportData, 'Laporan_Arus_Kas_Taruna_Bangsa', 'ArusKas');
  };

  const handleSaveKasManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKas.deskripsi || newKas.nominal <= 0) {
      alert('Isi deskripsi dan nominal transaksi dengan benar.');
      return;
    }

    const created: ArusKas = {
      id: 'kas-' + Date.now(),
      noTransaksi: 'KAS-' + (newKas.tipe === 'Masuk' ? 'IN' : 'OUT') + '-' + Date.now(),
      tgl: newKas.tgl,
      tipe: newKas.tipe,
      kategori: newKas.kategori,
      akunKasId: newKas.akunKasId,
      nominal: Number(newKas.nominal),
      deskripsi: newKas.deskripsi,
      noReferensi: 'MANUAL-' + Math.floor(100 + Math.random() * 900),
    };

    const updatedKas = [created, ...arusKasList];
    onUpdateArusKas(updatedKas);
    AppStorageService.saveArusKas(updatedKas);

    // Update Kas Account Balance
    const updatedAccounts = akunKasList.map((a) => {
      if (a.id === newKas.akunKasId) {
        return {
          ...a,
          saldoSaatIni: newKas.tipe === 'Masuk' ? a.saldoSaatIni + Number(newKas.nominal) : a.saldoSaatIni - Number(newKas.nominal),
        };
      }
      return a;
    });
    onUpdateAkunKas(updatedAccounts);
    AppStorageService.saveAkunKas(updatedAccounts);

    AppStorageService.addLog('INPUT_KAS_MANUAL', 'Arus Kas', `Input kas ${newKas.tipe}: ${newKas.deskripsi} sebesar ${formatRupiah(newKas.nominal)}`);
    setShowAddModal(false);
    setNewKas({ ...newKas, deskripsi: '', nominal: 150000 });
    alert('Transaksi arus kas manual berhasil disimpan.');
  };

  const handleSaveAkunKas = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAkunKas.nama) return;
    const created: AkunKas = {
      id: 'kas-acc-' + Date.now(),
      nama: newAkunKas.nama,
      tipe: newAkunKas.tipe,
      noRekening: newAkunKas.noRek || undefined,
      saldoAwal: Number(newAkunKas.saldoAwal),
      saldoSaatIni: Number(newAkunKas.saldoAwal),
    };
    const updated = [...akunKasList, created];
    onUpdateAkunKas(updated);
    AppStorageService.saveAkunKas(updated);
    setShowAkunModal(false);
    setNewAkunKas({ nama: '', tipe: 'Kas Tunai', noRek: '', saldoAwal: 0 });
    alert('Akun kas baru berhasil ditambahkan.');
  };

  const filtered = arusKasList.filter((k) => {
    const matchesSearch =
      k.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.noTransaksi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.kategori.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTipe = filterTipe === 'Semua' || k.tipe === filterTipe;
    const matchesAkun = filterAkun === 'Semua' || k.akunKasId === filterAkun;

    return matchesSearch && matchesTipe && matchesAkun;
  });

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards: Masuk, Keluar, Saldo Bersih */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">1. Kas Pemasukan</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{formatRupiah(totalMasuk)}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold">Tagihan SPP &amp; Setoran</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">2. Kas Pengeluaran</p>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">{formatRupiah(totalKeluar)}</h3>
            <p className="text-[10px] text-rose-600 font-semibold">Operasional, ATK, Gaji</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Saldo Kas Bersih</p>
            <h3 className="text-lg font-black text-emerald-400 mt-0.5">{formatRupiah(saldoBersih)}</h3>
            <p className="text-[10px] text-blue-300 font-medium">Tersedia di semua akun kas</p>
          </div>
        </div>
      </div>

      {/* Akun Kas Row Cards */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
            <Building className="w-4 h-4 text-blue-600" />
            <span>6. Kelola Akun Kas Transaksi</span>
          </div>
          <button
            onClick={() => setShowAkunModal(true)}
            className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:text-blue-500 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Akun Kas</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {akunKasList.map((akun) => (
            <div key={akun.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-slate-800">{akun.nama}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {akun.tipe}
                </span>
              </div>
              <p className="text-xs font-mono font-bold text-blue-700 mt-2">
                {formatRupiah(akun.saldoSaatIni)}
              </p>
              {akun.noRekening && (
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Rek: {akun.noRekening}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-64">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari deskripsi, no transaksi, kategori..."
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
            <option value="Semua">Semua Arus Kas</option>
            <option value="Masuk">Kas Masuk (Pemasukan)</option>
            <option value="Keluar">Kas Keluar (Pengeluaran)</option>
          </select>

          <select
            value={filterAkun}
            onChange={(e) => setFilterAkun(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Akun Kas</option>
            {akunKasList.map((a) => (
              <option key={a.id} value={a.id}>{a.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>5. Ekspor Excel</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>4. Input Manual Transaksi Kas</span>
          </button>
        </div>
      </div>

      {/* Table Arus Kas */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Transaksi &amp; Tanggal</th>
                <th className="py-3 px-4">Akun Kas</th>
                <th className="py-3 px-4">Kategori &amp; Deskripsi</th>
                <th className="py-3 px-4">No. Ref</th>
                <th className="py-3 px-4 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((k) => {
                const akun = akunKasList.find((a) => a.id === k.akunKasId);
                return (
                  <tr key={k.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono">
                      <p className="font-bold text-slate-900 text-xs">{k.noTransaksi}</p>
                      <p className="text-[11px] text-slate-400">{k.tgl}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      {akun?.nama || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${k.tipe === 'Masuk' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {k.tipe === 'Masuk' ? '+ Masuk' : '- Keluar'}
                        </span>
                        <span className="font-bold text-slate-800">{k.kategori}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{k.deskripsi}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {k.noReferensi || '-'}
                    </td>
                    <td className={`py-3 px-4 text-right font-black text-sm ${k.tipe === 'Masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {k.tipe === 'Masuk' ? '+' : '-'}{formatRupiah(k.nominal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Kas Manual */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Input Manual Transaksi Kas</h3>
            <p className="text-slate-500 mb-4">Catat pemasukan atau pengeluaran operasional sekolah.</p>
            <form onSubmit={handleSaveKasManual} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe Transaksi</label>
                  <select
                    value={newKas.tipe}
                    onChange={(e) => setNewKas({ ...newKas, tipe: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Keluar">Pengeluaran (Kas Keluar)</option>
                    <option value="Masuk">Pemasukan (Kas Masuk)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Akun Kas Sumber/Tujuan</label>
                  <select
                    value={newKas.akunKasId}
                    onChange={(e) => setNewKas({ ...newKas, akunKasId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {akunKasList.map((a) => (
                      <option key={a.id} value={a.id}>{a.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Transaksi</label>
                <input
                  type="text"
                  required
                  value={newKas.kategori}
                  onChange={(e) => setNewKas({ ...newKas, kategori: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="Contoh: Belanja ATK / Listrik & Internet"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="number"
                  required
                  value={newKas.nominal}
                  onChange={(e) => setNewKas({ ...newKas, nominal: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi / Keterangan Lengkap</label>
                <textarea
                  rows={2}
                  required
                  value={newKas.deskripsi}
                  onChange={(e) => setNewKas({ ...newKas, deskripsi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="Contoh: Pembelian kertas F4 5 rim & spidol whiteboard"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Transaksi Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Akun Kas */}
      {showAkunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Tambah Akun Kas Baru</h3>
            <form onSubmit={handleSaveAkunKas} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Akun</label>
                <input
                  type="text"
                  required
                  value={newAkunKas.nama}
                  onChange={(e) => setNewAkunKas({ ...newAkunKas, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="Contoh: Kas Kecil Perpustakaan"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Akun</label>
                <select
                  value={newAkunKas.tipe}
                  onChange={(e) => setNewAkunKas({ ...newAkunKas, tipe: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Kas Tunai">Kas Tunai</option>
                  <option value="Bank">Bank</option>
                  <option value="E-Wallet">E-Wallet / Payment Gateway</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Rekening (Opsional)</label>
                <input
                  type="text"
                  value={newAkunKas.noRek}
                  onChange={(e) => setNewAkunKas({ ...newAkunKas, noRek: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  placeholder="0819283719"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAkunModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
