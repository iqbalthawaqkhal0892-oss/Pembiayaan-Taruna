import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Ban,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import { Transaksi, Pembayaran, Siswa } from '../../types';
import { AppStorageService } from '../../services/storage';

interface TransaksiTabProps {
  transaksiList: Transaksi[];
  onUpdateTransaksi: (data: Transaksi[]) => void;
  pembayaranList: Pembayaran[];
  siswaList: Siswa[];
  onOpenReceiptByNoNota: (noNota: string) => void;
}

export const TransaksiTab: React.FC<TransaksiTabProps> = ({
  transaksiList,
  onUpdateTransaksi,
  pembayaranList,
  siswaList,
  onOpenReceiptByNoNota,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterJenis, setFilterJenis] = useState<'Semua' | 'Tagihan' | 'Tabungan' | 'PPDB'>('Semua');
  const [filterStatus, setFilterStatus] = useState<'Semua' | 'Selesai' | 'Dibatalkan'>('Semua');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleExportExcel = () => {
    AppStorageService.exportToExcel(transaksiList, 'Rekap_Transaksi_Taruna_Bangsa', 'Transaksi');
  };

  const handleBatalkanTransaksi = (trx: Transaksi) => {
    if (trx.status === 'Dibatalkan') {
      alert('Transaksi ini sudah dibatalkan sebelumnya.');
      return;
    }
    const alasan = prompt(`Masukkan alasan pembatalan transaksi #${trx.noReferensi}:`);
    if (alasan === null) return;

    const updated = transaksiList.map((t) =>
      t.id === trx.id ? { ...t, status: 'Dibatalkan' as const, keterangan: `${t.keterangan} (Dibatalkan: ${alasan || 'Permintaan Petugas'})` } : t
    );

    onUpdateTransaksi(updated);
    AppStorageService.saveTransaksi(updated);
    AppStorageService.addLog('BATALKAN_TRANSAKSI', 'Transaksi', `Membatalkan transaksi ${trx.noReferensi} alasan: ${alasan || '-'}`);
    alert(`Transaksi #${trx.noReferensi} berhasil dibatalkan.`);
  };

  const filtered = transaksiList.filter((trx) => {
    const matchesSearch =
      trx.noReferensi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trx.siswaNama?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJenis = filterJenis === 'Semua' || trx.jenis === filterJenis;
    const matchesStatus = filterStatus === 'Semua' || trx.status === filterStatus;

    return matchesSearch && matchesJenis && matchesStatus;
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
              placeholder="Cari transaksi, no referensi, siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Jenis Transaksi</option>
            <option value="Tagihan">Tagihan SPP / Iuran</option>
            <option value="Tabungan">Tabungan Siswa</option>
            <option value="PPDB">PPDB Calon Siswa</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
          >
            <option value="Semua">Semua Status</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Ekspor Excel Transaksi</span>
        </button>
      </div>

      {/* Table Transaksi */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">No. Ref &amp; Waktu</th>
                <th className="py-3 px-4">Jenis &amp; Arah</th>
                <th className="py-3 px-4">Keterangan / Siswa</th>
                <th className="py-3 px-4 text-right">Nominal</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Petugas</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono">
                    <p className="font-bold text-blue-700 text-xs">{trx.noReferensi}</p>
                    <p className="text-[11px] text-slate-400">{trx.tanggal}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`p-1 rounded-md ${trx.arah === 'Masuk' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                        {trx.arah === 'Masuk' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      </span>
                      <span className="font-bold text-slate-800">{trx.jenis}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-900">{trx.keterangan}</p>
                    {trx.siswaNama && <p className="text-[11px] text-slate-500">{trx.siswaNama}</p>}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-slate-900 text-sm">
                    {formatRupiah(trx.nominal)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        trx.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800 line-through'
                      }`}
                    >
                      {trx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {trx.petugas}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* Cetak Ulang Nota */}
                      <button
                        onClick={() => onOpenReceiptByNoNota(trx.noReferensi)}
                        title="Cetak Ulang Nota"
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5 text-blue-600" />
                      </button>

                      {/* Batalkan Transaksi */}
                      {trx.status === 'Selesai' && (
                        <button
                          onClick={() => handleBatalkanTransaksi(trx)}
                          title="Batalkan Transaksi (Void)"
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
