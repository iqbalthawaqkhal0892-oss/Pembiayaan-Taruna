import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  Upload,
  Percent,
  Search,
  Filter,
  CreditCard,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Tagihan, Siswa, KategoriTagihan, Kelas, UnitJenjang } from '../../types';
import { AppStorageService } from '../../services/storage';

interface TagihanTabProps {
  tagihanList: Tagihan[];
  onUpdateTagihan: (data: Tagihan[]) => void;
  siswaList: Siswa[];
  kategoriList: KategoriTagihan[];
  kelasList: Kelas[];
  units: UnitJenjang[];
  onOpenPaymentModal: (tagihan: Tagihan) => void;
}

export const TagihanTab: React.FC<TagihanTabProps> = ({
  tagihanList,
  onUpdateTagihan,
  siswaList,
  kategoriList,
  kelasList,
  units,
  onOpenPaymentModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Lunas' | 'Belum Lunas' | 'Sebagian'>('Semua');
  const [kelasFilter, setKelasFilter] = useState('Semua');
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPotonganModal, setShowPotonganModal] = useState(false);
  const [selectedTagihan, setSelectedTagihan] = useState<Tagihan | null>(null);
  const [potonganNominal, setPotonganNominal] = useState<number>(0);
  const [potonganKeterangan, setPotonganKeterangan] = useState('');

  // Bulk Generator State
  const [bulkParams, setBulkParams] = useState({
    kategoriId: kategoriList[0]?.id || '',
    namaTagihan: 'SPP Bulan Mei 2026',
    nominal: 350000,
    periodeBulan: 'Mei 2026',
    tglJatuhTempo: '2026-05-10',
    targetType: 'semua' as 'semua' | 'unit' | 'kelas',
    targetId: '',
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleExportExcel = () => {
    const exportData = tagihanList.map((t) => {
      const s = siswaList.find((sis) => sis.id === t.siswaId);
      const kat = kategoriList.find((k) => k.id === t.kategoriId);
      return {
        'ID Tagihan': t.id,
        'NISN': s?.nisn || '',
        'Nama Siswa': s?.nama || '',
        'Kategori': kat?.nama || '',
        'Nama Tagihan': t.namaTagihan,
        'Nominal Asli': t.nominal,
        'Potongan': t.potongan,
        'Terbayar': t.terbayar,
        'Sisa Tagihan': t.sisaTagihan,
        'Status': t.status,
        'Jatuh Tempo': t.tglJatuhTempo,
        'Periode': t.periodeBulan,
      };
    });
    AppStorageService.exportToExcel(exportData, 'Data_Tagihan_Taruna_Bangsa', 'Tagihan');
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    AppStorageService.importFromExcel(file, (data) => {
      if (Array.isArray(data) && data.length > 0) {
        alert(`Berhasil membaca ${data.length} baris data tagihan dari Excel.`);
      }
    });
  };

  const handleGenerateBulk = (e: React.FormEvent) => {
    e.preventDefault();
    const count = AppStorageService.generateTagihanBulk(bulkParams);
    onUpdateTagihan(AppStorageService.getTagihan());
    setShowBulkModal(false);
    alert(`Berhasil membuat ${count} tagihan baru secara otomatis!`);
  };

  const handleApplyPotongan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTagihan) return;
    const newPotongan = Number(potonganNominal);
    const newSisa = Math.max(0, selectedTagihan.nominal - newPotongan - selectedTagihan.terbayar);
    const newStatus = newSisa === 0 ? 'Lunas' : selectedTagihan.terbayar > 0 ? 'Sebagian' : 'Belum Lunas';

    const updated = tagihanList.map((t) =>
      t.id === selectedTagihan.id
        ? {
            ...t,
            potongan: newPotongan,
            sisaTagihan: newSisa,
            status: newStatus as any,
          }
        : t
    );

    onUpdateTagihan(updated);
    AppStorageService.saveTagihan(updated);
    AppStorageService.addLog('POTONGAN_TAGIHAN', 'Tagihan', `Memberikan potongan Rp ${newPotongan.toLocaleString()} pada tagihan ${selectedTagihan.namaTagihan} (${potonganKeterangan})`);
    setShowPotonganModal(false);
    setSelectedTagihan(null);
    alert('Potongan biaya tagihan berhasil diterapkan.');
  };

  // Filtering
  const filteredTagihan = tagihanList.filter((t) => {
    const siswa = siswaList.find((s) => s.id === t.siswaId);
    const matchesSearch =
      t.namaTagihan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      siswa?.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      siswa?.nisn.includes(searchQuery);

    const matchesStatus = statusFilter === 'Semua' || t.status === statusFilter;
    const matchesKelas = kelasFilter === 'Semua' || siswa?.kelasId === kelasFilter;

    return matchesSearch && matchesStatus && matchesKelas;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 flex-1 min-w-64">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari tagihan, siswa, NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Belum Lunas">Belum Lunas</option>
            <option value="Sebagian">Sebagian (Cicil)</option>
            <option value="Lunas">Lunas</option>
          </select>

          {/* Kelas Filter */}
          <select
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Excel Export */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel</span>
          </button>

          {/* Excel Import */}
          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Excel</span>
            <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" />
          </label>

          {/* Bulk Generator Button */}
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tambah Tagihan Otomatis</span>
          </button>
        </div>
      </div>

      {/* Tagihan Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Tagihan &amp; Siswa</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-right">Potongan</th>
                <th className="py-3 px-4 text-right">Terbayar</th>
                <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTagihan.map((tag) => {
                const siswa = siswaList.find((s) => s.id === tag.siswaId);
                const kelas = kelasList.find((k) => k.id === siswa?.kelasId);
                return (
                  <tr key={tag.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{tag.namaTagihan}</p>
                        <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                          {siswa?.nama} ({kelas?.nama || '-'}) • NISN: {siswa?.nisn}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-700">{tag.periodeBulan}</p>
                      <p className="text-[10px] text-slate-400">Tempo: {tag.tglJatuhTempo}</p>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatRupiah(tag.nominal)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-amber-600">
                      {tag.potongan > 0 ? `-${formatRupiah(tag.potongan)}` : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                      {formatRupiah(tag.terbayar)}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-slate-900">
                      {formatRupiah(tag.sisaTagihan)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tag.status === 'Lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tag.status === 'Sebagian'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tag.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Bayar Tagihan Button */}
                        {tag.status !== 'Lunas' && (
                          <button
                            onClick={() => onOpenPaymentModal(tag)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition cursor-pointer shadow-2xs"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Bayar</span>
                          </button>
                        )}
                        {/* Potongan Button */}
                        <button
                          onClick={() => {
                            setSelectedTagihan(tag);
                            setPotonganNominal(tag.potongan);
                            setShowPotonganModal(true);
                          }}
                          title="Beri Potongan / Keringanan Biaya"
                          className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition cursor-pointer"
                        >
                          <Percent className="w-3.5 h-3.5" />
                        </button>
                        {/* Hapus Tagihan */}
                        <button
                          onClick={() => {
                            if (confirm(`Hapus tagihan ${tag.namaTagihan}?`)) {
                              const updated = tagihanList.filter((t) => t.id !== tag.id);
                              onUpdateTagihan(updated);
                              AppStorageService.saveTagihan(updated);
                            }
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Tagihan Otomatis (Bulk) */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 mb-2 font-bold text-base text-slate-900">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Tambah Tagihan Siswa Otomatis (Bulk Generator)</span>
            </div>
            <p className="text-slate-500 mb-4">
              Buat tagihan serentak untuk seluruh siswa atau filter berdasarkan unit/kelas tertentu.
            </p>
            <form onSubmit={handleGenerateBulk} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kategori Tagihan</label>
                <select
                  value={bulkParams.kategoriId}
                  onChange={(e) => {
                    const kat = kategoriList.find((k) => k.id === e.target.value);
                    setBulkParams({
                      ...bulkParams,
                      kategoriId: e.target.value,
                      nominal: kat?.nominalDefault || bulkParams.nominal,
                      namaTagihan: `${kat?.nama || 'Tagihan'} Periode Baru`,
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {kategoriList.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama} ({formatRupiah(k.nominalDefault)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul / Nama Tagihan</label>
                <input
                  type="text"
                  required
                  value={bulkParams.namaTagihan}
                  onChange={(e) => setBulkParams({ ...bulkParams, namaTagihan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nominal Tagihan (Rp)</label>
                  <input
                    type="number"
                    required
                    value={bulkParams.nominal}
                    onChange={(e) => setBulkParams({ ...bulkParams, nominal: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Periode Bulan</label>
                  <input
                    type="text"
                    required
                    value={bulkParams.periodeBulan}
                    onChange={(e) => setBulkParams({ ...bulkParams, periodeBulan: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="Contoh: Mei 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal Jatuh Tempo</label>
                  <input
                    type="date"
                    required
                    value={bulkParams.tglJatuhTempo}
                    onChange={(e) => setBulkParams({ ...bulkParams, tglJatuhTempo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Siswa</label>
                  <select
                    value={bulkParams.targetType}
                    onChange={(e) => setBulkParams({ ...bulkParams, targetType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="semua">Semua Siswa Aktif</option>
                    <option value="unit">Berdasarkan Unit / Jenjang</option>
                    <option value="kelas">Berdasarkan Kelas</option>
                  </select>
                </div>
              </div>

              {bulkParams.targetType === 'unit' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Unit</label>
                  <select
                    value={bulkParams.targetId}
                    onChange={(e) => setBulkParams({ ...bulkParams, targetId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Pilih Unit</option>
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.nama}</option>
                    ))}
                  </select>
                </div>
              )}

              {bulkParams.targetType === 'kelas' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Kelas</label>
                  <select
                    value={bulkParams.targetId}
                    onChange={(e) => setBulkParams({ ...bulkParams, targetId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBulkModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Generate Tagihan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Potongan Biaya Tagihan */}
      {showPotonganModal && selectedTagihan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Potongan Biaya Tagihan</h3>
            <p className="text-slate-600 mb-3">
              Tagihan: <b>{selectedTagihan.namaTagihan}</b> ({formatRupiah(selectedTagihan.nominal)})
            </p>
            <form onSubmit={handleApplyPotongan} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nominal Potongan / Keringanan (Rp)</label>
                <input
                  type="number"
                  required
                  value={potonganNominal}
                  onChange={(e) => setPotonganNominal(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keterangan / Alasan Potongan</label>
                <input
                  type="text"
                  value={potonganKeterangan}
                  onChange={(e) => setPotonganKeterangan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  placeholder="Contoh: Beasiswa Prestasi Juara 1 / Anak Yatim"
                />
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                <p className="font-semibold">Simulasi Sisa Tagihan:</p>
                <p className="text-sm font-bold text-amber-950 mt-0.5">
                  {formatRupiah(Math.max(0, selectedTagihan.nominal - potonganNominal - selectedTagihan.terbayar))}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPotonganModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Terapkan Potongan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
