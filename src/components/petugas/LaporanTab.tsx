import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Filter,
  Eye,
  Calendar,
  Layers,
  School,
  Sparkles,
} from 'lucide-react';
import {
  Tagihan,
  Pembayaran,
  ArusKas,
  TabunganTransaksi,
  Siswa,
  Kelas,
  UnitJenjang,
  PengaturanAplikasi,
} from '../../types';
import { AppStorageService } from '../../services/storage';

interface LaporanTabProps {
  tagihanList: Tagihan[];
  pembayaranList: Pembayaran[];
  arusKasList: ArusKas[];
  tabunganList: TabunganTransaksi[];
  siswaList: Siswa[];
  kelasList: Kelas[];
  units: UnitJenjang[];
  pengaturan: PengaturanAplikasi;
}

type JenisLaporan = 'tagihan' | 'pembayaran' | 'arus_kas' | 'tabungan';

export const LaporanTab: React.FC<LaporanTabProps> = ({
  tagihanList,
  pembayaranList,
  arusKasList,
  tabunganList,
  siswaList,
  kelasList,
  units,
  pengaturan,
}) => {
  const [jenisLaporan, setJenisLaporan] = useState<JenisLaporan>('tagihan');
  const [tglMulai, setTglMulai] = useState('2026-01-01');
  const [tglSelesai, setTglSelesai] = useState(new Date().toISOString().slice(0, 10));
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    if (jenisLaporan === 'tagihan') {
      const data = tagihanList.map((t) => {
        const s = siswaList.find((sis) => sis.id === t.siswaId);
        return {
          'ID Tagihan': t.id,
          'Siswa': s?.nama || '',
          'NISN': s?.nisn || '',
          'Tagihan': t.namaTagihan,
          'Nominal': t.nominal,
          'Terbayar': t.terbayar,
          'Sisa': t.sisaTagihan,
          'Status': t.status,
        };
      });
      AppStorageService.exportToExcel(data, `Laporan_Tagihan_${tglMulai}_sd_${tglSelesai}`, 'Tagihan');
    } else if (jenisLaporan === 'pembayaran') {
      const data = pembayaranList.map((p) => {
        const s = siswaList.find((sis) => sis.id === p.siswaId);
        return {
          'No Nota': p.noNota,
          'Tanggal': p.tglBayar,
          'Siswa': s?.nama || '',
          'Metode': p.metode,
          'Nominal': p.nominalBayar,
          'Status': p.statusVerifikasi,
        };
      });
      AppStorageService.exportToExcel(data, `Laporan_Pembayaran_${tglMulai}_sd_${tglSelesai}`, 'Pembayaran');
    } else if (jenisLaporan === 'arus_kas') {
      AppStorageService.exportToExcel(arusKasList, `Laporan_Arus_Kas_${tglMulai}_sd_${tglSelesai}`, 'ArusKas');
    } else if (jenisLaporan === 'tabungan') {
      AppStorageService.exportToExcel(tabunganList, `Laporan_Tabungan_${tglMulai}_sd_${tglSelesai}`, 'Tabungan');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Control Box */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 no-print">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>5. Filter Data Laporan Lengkap</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>7. Cetak PDF / Print</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>7. Ekspor Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Jenis Laporan</label>
            <select
              value={jenisLaporan}
              onChange={(e) => setJenisLaporan(e.target.value as JenisLaporan)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-blue-700"
            >
              <option value="tagihan">1. Rekap Laporan Tagihan Siswa</option>
              <option value="pembayaran">2. Rekap Laporan Transaksi Pembayaran</option>
              <option value="arus_kas">3. Rekap Laporan Transaksi Arus Kas</option>
              <option value="tabungan">4. Rekap Transaksi &amp; Saldo Tabungan</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Periode Tanggal Mulai</label>
            <input
              type="date"
              value={tglMulai}
              onChange={(e) => setTglMulai(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={tglSelesai}
              onChange={(e) => setTglSelesai(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Filter Kelas</label>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            >
              <option value="Semua">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>{k.nama}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 6. Pratinjau Data Laporan (Printable Formal View) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs printable-area">
        {/* Formal School Letterhead */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-900 text-white flex items-center justify-center font-black text-2xl">
              TB
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-wide">
                {pengaturan.namaLembaga}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                SISTEM KEUANGAN SEKOLAH DIGITAL &amp; CLOUD FIRESTORE
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {pengaturan.alamatLembaga} • Telp: {pengaturan.noTelepon}
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-slate-900 uppercase">
              {jenisLaporan === 'tagihan' && 'Laporan Rekapitulasi Tagihan'}
              {jenisLaporan === 'pembayaran' && 'Laporan Transaksi Penerimaan'}
              {jenisLaporan === 'arus_kas' && 'Laporan Arus Kas Sekolah'}
              {jenisLaporan === 'tabungan' && 'Laporan Tabungan Siswa'}
            </p>
            <p className="text-slate-500 font-mono mt-0.5">Periode: {tglMulai} s/d {tglSelesai}</p>
          </div>
        </div>

        {/* Report Content Based on Type */}
        {jenisLaporan === 'tagihan' && (
          <div className="space-y-4">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">No</th>
                  <th className="p-2.5 border-r border-slate-200">Nama Siswa &amp; NISN</th>
                  <th className="p-2.5 border-r border-slate-200">Tagihan</th>
                  <th className="p-2.5 border-r border-slate-200 text-right">Nominal</th>
                  <th className="p-2.5 border-r border-slate-200 text-right">Terbayar</th>
                  <th className="p-2.5 border-r border-slate-200 text-right">Sisa Tagihan</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {tagihanList.map((t, idx) => {
                  const s = siswaList.find((sis) => sis.id === t.siswaId);
                  return (
                    <tr key={t.id}>
                      <td className="p-2.5 border-r border-slate-200 text-center">{idx + 1}</td>
                      <td className="p-2.5 border-r border-slate-200 font-bold">{s?.nama} ({s?.nisn})</td>
                      <td className="p-2.5 border-r border-slate-200">{t.namaTagihan}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-medium">{formatRupiah(t.nominal)}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-medium text-emerald-600">{formatRupiah(t.terbayar)}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-bold text-slate-900">{formatRupiah(t.sisaTagihan)}</td>
                      <td className="p-2.5 text-center font-bold">{t.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {jenisLaporan === 'pembayaran' && (
          <div className="space-y-4">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">No. Nota</th>
                  <th className="p-2.5 border-r border-slate-200">Tanggal</th>
                  <th className="p-2.5 border-r border-slate-200">Nama Siswa</th>
                  <th className="p-2.5 border-r border-slate-200">Metode</th>
                  <th className="p-2.5 border-r border-slate-200 text-right">Nominal</th>
                  <th className="p-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pembayaranList.map((p) => {
                  const s = siswaList.find((sis) => sis.id === p.siswaId);
                  return (
                    <tr key={p.id}>
                      <td className="p-2.5 border-r border-slate-200 font-mono font-bold text-blue-700">{p.noNota}</td>
                      <td className="p-2.5 border-r border-slate-200">{p.tglBayar}</td>
                      <td className="p-2.5 border-r border-slate-200 font-bold">{s?.nama}</td>
                      <td className="p-2.5 border-r border-slate-200">{p.metode}</td>
                      <td className="p-2.5 border-r border-slate-200 text-right font-bold text-emerald-600">{formatRupiah(p.nominalBayar)}</td>
                      <td className="p-2.5 text-center font-bold">{p.statusVerifikasi}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {jenisLaporan === 'arus_kas' && (
          <div className="space-y-4">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">Tanggal</th>
                  <th className="p-2.5 border-r border-slate-200">Tipe</th>
                  <th className="p-2.5 border-r border-slate-200">Kategori &amp; Keterangan</th>
                  <th className="p-2.5 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {arusKasList.map((k) => (
                  <tr key={k.id}>
                    <td className="p-2.5 border-r border-slate-200 font-mono">{k.tgl}</td>
                    <td className="p-2.5 border-r border-slate-200 font-bold">{k.tipe}</td>
                    <td className="p-2.5 border-r border-slate-200">
                      <p className="font-bold">{k.kategori}</p>
                      <p className="text-[11px] text-slate-500">{k.deskripsi}</p>
                    </td>
                    <td className={`p-2.5 text-right font-black ${k.tipe === 'Masuk' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {k.tipe === 'Masuk' ? '+' : '-'}{formatRupiah(k.nominal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {jenisLaporan === 'tabungan' && (
          <div className="space-y-4">
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-200">Nama Siswa</th>
                  <th className="p-2.5 border-r border-slate-200">NISN</th>
                  <th className="p-2.5 border-r border-slate-200">Virtual Account</th>
                  <th className="p-2.5 text-right">Saldo Tabungan Saat Ini</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {siswaList.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2.5 border-r border-slate-200 font-bold">{s.nama}</td>
                    <td className="p-2.5 border-r border-slate-200 font-mono">{s.nisn}</td>
                    <td className="p-2.5 border-r border-slate-200 font-mono">{s.virtualAccount}</td>
                    <td className="p-2.5 text-right font-black text-emerald-600">{formatRupiah(s.saldoTabungan)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures */}
        <div className="mt-12 pt-6 grid grid-cols-2 text-center text-xs">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-bold text-slate-900 mt-1">Kepala Sekolah</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">Drs. H. M. Arifin, M.Pd.</p>
            <p className="text-[10px] text-slate-500">NIP. 19780512 200501 1 008</p>
          </div>
          <div>
            <p className="text-slate-500">Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="font-bold text-slate-900 mt-1">Bendahara Sekolah</p>
            <div className="h-16" />
            <p className="font-bold text-slate-900 underline">Siti Rahmawati, S.E.</p>
            <p className="text-[10px] text-slate-500">NIP. 19890415 201202 2 003</p>
          </div>
        </div>
      </div>
    </div>
  );
};
