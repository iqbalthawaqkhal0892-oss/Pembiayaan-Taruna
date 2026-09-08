import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Building,
  CreditCard,
  Printer,
  Calendar,
  Sparkles,
  Phone,
  School,
} from 'lucide-react';
import { PendaftarPPDB, UnitJenjang, PengaturanAplikasi } from '../types';
import { AppStorageService } from '../services/storage';

interface PPDBPortalProps {
  pendaftarList: PendaftarPPDB[];
  onUpdatePendaftar: (data: PendaftarPPDB[]) => void;
  units: UnitJenjang[];
  pengaturan: PengaturanAplikasi;
}

export const PPDBPortal: React.FC<PPDBPortalProps> = ({
  pendaftarList,
  onUpdatePendaftar,
  units,
  pengaturan,
}) => {
  const [activeTab, setActiveTab] = useState<'daftar' | 'cek'>('daftar');
  
  // Registration Form State
  const [formData, setFormData] = useState({
    namaLengkap: '',
    nisn: '',
    jenisKelamin: 'L' as 'L' | 'P',
    tempatLahir: 'Jakarta',
    tglLahir: '2010-05-12',
    asalSekolah: '',
    unitPilihanId: units[0]?.id || 'unit-1',
    namaWali: '',
    noHp: '',
    alamat: '',
  });

  const [suksesDaftar, setSuksesDaftar] = useState<PendaftarPPDB | null>(null);

  // Search Check Status State
  const [searchNomor, setSearchNomor] = useState('');
  const [searchResult, setSearchResult] = useState<PendaftarPPDB | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handleSubmitDaftar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaLengkap || !formData.nisn || !formData.asalSekolah) {
      alert('Lengkapi semua data bertanda bintang.');
      return;
    }

    const year = new Date().getFullYear();
    const noPendaftaran = `PPDB-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    const created: PendaftarPPDB = {
      id: 'ppdb-' + Date.now(),
      noPendaftaran,
      nisn: formData.nisn,
      nama: formData.namaLengkap,
      namaLengkap: formData.namaLengkap,
      jenisKelamin: formData.jenisKelamin,
      tempatLahir: formData.tempatLahir,
      tglLahir: formData.tglLahir,
      asalSekolah: formData.asalSekolah,
      unitPilihanId: formData.unitPilihanId,
      namaWali: formData.namaWali,
      noHp: formData.noHp,
      alamat: formData.alamat,
      tglDaftar: new Date().toISOString().slice(0, 10),
      statusSeleksi: 'Menunggu Verifikasi',
      biayaPendaftaran: {
        nominal: 150000,
        status: 'Belum Lunas',
      },
      biayaDaftarUlang: {
        nominal: 2500000,
        status: 'Belum Lunas',
      },
    };

    const updated = [created, ...pendaftarList];
    onUpdatePendaftar(updated);
    AppStorageService.savePendaftarPPDB(updated);
    AppStorageService.addLog('PENDAFTARAN_PPDB_MANDIRI', 'PPDB', `Calon siswa mendaftar online: ${created.namaLengkap} (No. ${created.noPendaftaran})`);

    setSuksesDaftar(created);
  };

  const handleCariPendaftar = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const found = pendaftarList.find(
      (p) =>
        p.noPendaftaran.toLowerCase() === searchNomor.trim().toLowerCase() ||
        p.nisn === searchNomor.trim()
    );
    setSearchResult(found || null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Banner Hero PPDB */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-950 to-blue-950 p-8 rounded-3xl border border-emerald-900/50 shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              PORTAL PPDB MANDIRI &amp; TRANSPARAN 2026/2027
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Penerimaan Peserta Didik Baru Taruna Bangsa
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Daftar online mandiri tanpa ribet, pantau status seleksi real-time, dan nikmati kemudahan pembayaran biaya pendidikan digital.
            </p>
          </div>

          <div className="flex sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('daftar')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'daftar'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Formulir Pendaftaran
            </button>
            <button
              onClick={() => setActiveTab('cek')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'cek'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Cek Status Seleksi
            </button>
          </div>
        </div>

        {/* 1. FORMULIR PENDAFTARAN MANDIRI */}
        {activeTab === 'daftar' && (
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            {suksesDaftar ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Pendaftaran Berhasil Dikirim!</h3>
                  <p className="text-xs text-emerald-300 mt-1">
                    Simpan nomor pendaftaran berikut untuk mengecek status kelulusan Anda:
                  </p>
                  <p className="text-2xl font-mono font-black text-white tracking-widest my-3 bg-slate-900 py-2 px-4 rounded-xl border border-emerald-500/40 inline-block">
                    {suksesDaftar.noPendaftaran}
                  </p>
                </div>
                <div className="text-xs text-slate-300 max-w-md mx-auto space-y-1">
                  <p>Nama Calon Siswa: <b>{suksesDaftar.namaLengkap}</b></p>
                  <p>NISN: <b>{suksesDaftar.nisn}</b></p>
                  <p>Biaya Formulir: <b>{formatRupiah(suksesDaftar.biayaPendaftaran.nominal)}</b></p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Cetak Bukti Pendaftaran</span>
                  </button>
                  <button
                    onClick={() => {
                      setSuksesDaftar(null);
                      setFormData({
                        namaLengkap: '',
                        nisn: '',
                        jenisKelamin: 'L',
                        tempatLahir: 'Jakarta',
                        tglLahir: '2010-05-12',
                        asalSekolah: '',
                        unitPilihanId: units[0]?.id || 'unit-1',
                        namaWali: '',
                        noHp: '',
                        alamat: '',
                      });
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Daftar Calon Lain
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitDaftar} className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
                  Formulir Biodata Calon Siswa Baru
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1">Nama Lengkap Sesuai Ijazah / Akta *</label>
                    <input
                      type="text"
                      required
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500"
                      placeholder="Contoh: Muhammad Farhan"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">NISN (Nomor Induk Siswa Nasional) *</label>
                    <input
                      type="text"
                      required
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                      placeholder="0091234567"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                    <select
                      value={formData.jenisKelamin}
                      onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      <option value="L">Laki-Laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Asal Sekolah Sebelumnya *</label>
                    <input
                      type="text"
                      required
                      value={formData.asalSekolah}
                      onChange={(e) => setFormData({ ...formData, asalSekolah: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      placeholder="Contoh: SMP Negeri 1 Taruna"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Unit / Jenjang Dituju</label>
                    <select
                      value={formData.unitPilihanId}
                      onChange={(e) => setFormData({ ...formData, unitPilihanId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                    >
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>{u.nama}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Nama Orang Tua / Wali</label>
                    <input
                      type="text"
                      value={formData.namaWali}
                      onChange={(e) => setFormData({ ...formData, namaWali: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      placeholder="Nama Bapak / Ibu"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">No. WhatsApp Aktif (Untuk Info Hasil) *</label>
                    <input
                      type="text"
                      required
                      value={formData.noHp}
                      onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                      placeholder="081234567890"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1">Alamat Tempat Tinggal</label>
                    <textarea
                      rows={2}
                      value={formData.alamat}
                      onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white"
                      placeholder="Jl. Raya Taruna Bangsa No. 10..."
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-200">Informasi Biaya Pendaftaran:</p>
                  <p>Biaya pendaftaran formulir sebesar <b>Rp 150.000</b> dapat dibayarkan langsung saat verifikasi berkas di posko PPDB atau transfer ke rekening panitia.</p>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs transition cursor-pointer shadow-lg"
                  >
                    Kirim Formulir Pendaftaran
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 2. CEK STATUS SELEKSI MANDIRI */}
        {activeTab === 'cek' && (
          <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-2">
              Pengecekan Status Seleksi Mandiri Transparan
            </h3>
            <p className="text-xs text-slate-400">
              Masukkan Nomor Pendaftaran (misal: <code>PPDB-2026-1001</code>) atau NISN yang digunakan saat mendaftar.
            </p>

            <form onSubmit={handleCariPendaftar} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Contoh: PPDB-2026-1001 atau NISN 0081122334"
                value={searchNomor}
                onChange={(e) => setSearchNomor(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-md"
              >
                <Search className="w-4 h-4" />
                <span>Cari Status</span>
              </button>
            </form>

            {hasSearched && (
              <div className="pt-4">
                {searchResult ? (
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                      <div>
                        <p className="text-xs text-slate-400 font-mono">No. {searchResult.noPendaftaran}</p>
                        <h4 className="text-lg font-bold text-white mt-0.5">{searchResult.namaLengkap}</h4>
                        <p className="text-xs text-slate-400">Asal: {searchResult.asalSekolah} • NISN: {searchResult.nisn}</p>
                      </div>

                      <div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold ${
                            searchResult.statusSeleksi === 'Diterima'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : searchResult.statusSeleksi === 'Ditolak'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          STATUS: {searchResult.statusSeleksi.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-slate-400">Biaya Formulir PPDB:</p>
                        <p className="font-bold text-white mt-0.5">
                          {formatRupiah(typeof searchResult.biayaPendaftaran === 'number' ? searchResult.biayaPendaftaran : searchResult.biayaPendaftaran?.nominal || 150000)}
                        </p>
                        <p className="text-[10px] font-semibold mt-0.5 text-emerald-400">
                          Status: {typeof searchResult.biayaPendaftaran === 'object' ? searchResult.biayaPendaftaran?.status : searchResult.statusBiayaPendaftaran || 'Belum Lunas'}
                        </p>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                        <p className="text-slate-400">Biaya Daftar Ulang:</p>
                        <p className="font-bold text-white mt-0.5">
                          {formatRupiah(typeof searchResult.biayaDaftarUlang === 'number' ? searchResult.biayaDaftarUlang : searchResult.biayaDaftarUlang?.nominal || 2500000)}
                        </p>
                        <p className="text-[10px] font-semibold mt-0.5 text-slate-400">
                          Status: {typeof searchResult.biayaDaftarUlang === 'object' ? searchResult.biayaDaftarUlang?.status : searchResult.statusBiayaDaftarUlang || 'Belum Lunas'}
                        </p>
                      </div>
                    </div>

                    {searchResult.statusSeleksi === 'Diterima' && (
                      <div className="p-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-xs text-emerald-200">
                        <p className="font-bold text-emerald-300">Selamat! Anda dinyatakan LULUS seleksi penerimaan Taruna Bangsa.</p>
                        <p className="mt-1">Silakan melakukan pelunasan daftar ulang dan pengambilan seragam di loket Tata Usaha sekolah.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
                    <p className="font-bold text-slate-300 mb-1">Data Pendaftar Tidak Ditemukan</p>
                    <p>Pastikan nomor pendaftaran atau NISN yang Anda masukkan sudah benar.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer Contact Info */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p className="font-bold text-slate-400">Panitia PPDB Online Taruna Bangsa</p>
          <p>Butuh bantuan pendaftaran? Hubungi WhatsApp Panitia di 0812-9876-5432</p>
        </div>

      </div>
    </div>
  );
};
