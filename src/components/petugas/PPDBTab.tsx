import React, { useState } from 'react';
import {
  FileCheck2,
  Users,
  Download,
  Upload,
  UserPlus,
  CreditCard,
  FileText,
  Calendar,
  Bell,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { PendaftarPPDB, Siswa, UnitJenjang, GelombangPPDB } from '../../types';
import { AppStorageService } from '../../services/storage';

interface PPDBTabProps {
  pendaftarList: PendaftarPPDB[];
  onUpdatePendaftar: (data: PendaftarPPDB[]) => void;
  siswaList: Siswa[];
  onUpdateSiswa: (data: Siswa[]) => void;
  units: UnitJenjang[];
}

type SubPPDB = 'pendaftar' | 'tagihan_ppdb' | 'berkas' | 'periode' | 'pengumuman' | 'pengaturan';

export const PPDBTab: React.FC<PPDBTabProps> = ({
  pendaftarList,
  onUpdatePendaftar,
  siswaList,
  onUpdateSiswa,
  units,
}) => {
  const [activeSub, setActiveSub] = useState<SubPPDB>('pendaftar');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [selectedPendaftar, setSelectedPendaftar] = useState<PendaftarPPDB | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Gelombang PPDB State
  const [gelombangList, setGelombangList] = useState<GelombangPPDB[]>([
    {
      id: 'gel-1',
      nama: 'Gelombang 1 (Jalur Prestasi & Minat)',
      tglBuka: '2026-01-05',
      tglTutup: '2026-03-31',
      biayaPendaftaran: 150000,
      biayaDaftarUlang: 2500000,
      kuota: 150,
      terisi: 85,
      isAktif: true,
    },
    {
      id: 'gel-2',
      nama: 'Gelombang 2 (Jalur Reguler)',
      tglBuka: '2026-04-01',
      tglTutup: '2026-06-30',
      biayaPendaftaran: 200000,
      biayaDaftarUlang: 2800000,
      kuota: 120,
      terisi: 30,
      isAktif: false,
    },
  ]);

  // Pengumuman PPDB List
  const [pengumumanList, setPengumumanList] = useState([
    {
      id: 'ann-1',
      judul: 'Jadwal Tes Seleksi Kemampuan Dasar Gelombang 1',
      tgl: '2026-04-05',
      isi: 'Tes seleksi dilaksanakan online melalui portal Taruna Bangsa tanggal 10 April 2026 jam 08:00 WIB.',
    },
    {
      id: 'ann-2',
      judul: 'Daftar Ulang dan Pengukuran Seragam',
      tgl: '2026-04-12',
      isi: 'Bagi calon siswa yang telah dinyatakan Diterima, silakan datang ke sekolah untuk pengukuran seragam.',
    },
  ]);

  // PPDB Settings State
  const [ppdbSettings, setPpdbSettings] = useState({
    kontakPanitia: '081298765432',
    namaPanitia: 'Panitia PPDB Taruna Bangsa',
    rekPembayaranPPDB: 'BNI 9812739812 - Panitia PPDB Taruna Bangsa',
    syaratBerkas: 'Ijazah / SKL, Kartu Keluarga (KK), Akta Kelahiran, Pas Foto 3x4 (3 lembar)',
  });

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const getNama = (p: PendaftarPPDB) => p.nama || p.namaLengkap || 'Calon Siswa';
  const getNoHp = (p: PendaftarPPDB) => p.noHp || p.noHpOrtu || '-';
  const getBiayaNominal = (b: any, fallback: number = 0) => (typeof b === 'number' ? b : b?.nominal || fallback);
  const getBiayaStatus = (b: any, fallback: string = 'Belum Lunas') => (typeof b === 'object' ? b?.status || fallback : fallback);

  const handleExportExcel = () => {
    AppStorageService.exportToExcel(pendaftarList, 'Data_Pendaftar_PPDB_Taruna_Bangsa', 'PPDB');
  };

  // Verifikasi Status Seleksi
  const handleUpdateStatus = (pendaftar: PendaftarPPDB, status: 'Diterima' | 'Ditolak' | 'Cadangan') => {
    const updated = pendaftarList.map((p) => (p.id === pendaftar.id ? { ...p, statusSeleksi: status } : p));
    onUpdatePendaftar(updated);
    AppStorageService.savePendaftarPPDB(updated);
    AppStorageService.addLog('VERIFIKASI_PPDB', 'PPDB', `Status calon siswa ${getNama(pendaftar)} diubah menjadi ${status}`);
    alert(`Status pendaftar ${getNama(pendaftar)} diubah menjadi ${status}.`);
  };

  // Verifikasi Pembayaran PPDB
  const handleVerifyPembayaranPPDB = (pendaftar: PendaftarPPDB, jenis: 'biayaPendaftaran' | 'biayaDaftarUlang') => {
    const currentBiaya = (pendaftar as any)[jenis];
    const nominal = getBiayaNominal(currentBiaya, jenis === 'biayaPendaftaran' ? 150000 : 2500000);
    const updated = pendaftarList.map((p) => {
      if (p.id === pendaftar.id) {
        return {
          ...p,
          [jenis]: {
            nominal,
            status: 'Lunas' as const,
          },
        };
      }
      return p;
    });
    onUpdatePendaftar(updated);
    AppStorageService.savePendaftarPPDB(updated);
    AppStorageService.addLog('BAYAR_PPDB', 'PPDB', `Pembayaran ${jenis} calon siswa ${getNama(pendaftar)} diverifikasi lunas`);
    alert(`Pembayaran ${jenis} untuk ${getNama(pendaftar)} berhasil diverifikasi Lunas!`);
  };

  // Sinkronisasi Calon Siswa Diterima ke Data Master Siswa
  const handleSinkronisasiMaster = (pendaftar: PendaftarPPDB) => {
    const res = AppStorageService.sinkronPPDBkeSiswa(pendaftar.id, 'kls-1');
    if (res) {
      onUpdateSiswa(AppStorageService.getSiswa());
      alert(`Selamat! ${getNama(pendaftar)} resmi disinkronkan menjadi Siswa Aktif Taruna Bangsa.`);
    }
  };

  // Kirim Pesan WhatsApp Berkas / Pengingat
  const handleKirimPesanWA = (pendaftar: PendaftarPPDB, pesan: string) => {
    const rawPhone = getNoHp(pendaftar);
    const phone = rawPhone.replace(/\D/g, '');
    const text = encodeURIComponent(`Halo ${getNama(pendaftar)} (No. Daftar: ${pendaftar.noPendaftaran}),\n\n${pesan}\n\nPanitia PPDB Taruna Bangsa`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const filteredPendaftar = pendaftarList.filter((p) => {
    const nama = getNama(p).toLowerCase();
    const matchesSearch =
      nama.includes(searchQuery.toLowerCase()) ||
      p.noPendaftaran.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.asalSekolah.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'Semua' || p.statusSeleksi === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Sub Menu Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'pendaftar', label: '1. Data Pendaftar', icon: Users },
          { id: 'tagihan_ppdb', label: '2. Tagihan & Pembayaran PPDB', icon: CreditCard },
          { id: 'berkas', label: '3. Data Berkas & Verifikasi', icon: FileCheck2 },
          { id: 'periode', label: '4. Periode / Gelombang', icon: Calendar },
          { id: 'pengumuman', label: '5. Pengumuman PPDB', icon: Bell },
          { id: 'pengaturan', label: '6. Pengaturan PPDB', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSub(item.id as SubPPDB)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                activeSub === item.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. DATA PENDAFTAR PPDB */}
      {activeSub === 'pendaftar' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 flex-1 min-w-64">
              <input
                type="text"
                placeholder="Cari pendaftar, no daftar, asal sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full max-w-sm px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                <option value="Semua">Semua Status Seleksi</option>
                <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                <option value="Diterima">Diterima</option>
                <option value="Ditolak">Ditolak</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor Excel Pendaftar</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. Daftar &amp; Tanggal</th>
                    <th className="py-3 px-4">Nama Calon Siswa</th>
                    <th className="py-3 px-4">Asal Sekolah &amp; Pilihan</th>
                    <th className="py-3 px-4">Status Biaya</th>
                    <th className="py-3 px-4 text-center">Status Seleksi</th>
                    <th className="py-3 px-4 text-center">Aksi Panitia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPendaftar.map((p) => {
                    const unit = units.find((u) => u.id === p.unitPilihanId);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 font-mono">
                          <p className="font-bold text-blue-700">{p.noPendaftaran}</p>
                          <p className="text-[11px] text-slate-400">{p.tglDaftar}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900 text-sm">{getNama(p)}</p>
                          <p className="text-[11px] text-slate-500 font-mono">NISN: {p.nisn} • WA: {getNoHp(p)}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-semibold text-slate-800">{unit?.nama || 'Unit'}</p>
                          <p className="text-[11px] text-slate-500">Asal: {p.asalSekolah}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                getBiayaStatus(p.biayaPendaftaran) === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              Formulir: {getBiayaStatus(p.biayaPendaftaran)}
                            </span>
                            <br />
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                getBiayaStatus(p.biayaDaftarUlang) === 'Lunas' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Daftar Ulang: {getBiayaStatus(p.biayaDaftarUlang)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.statusSeleksi === 'Diterima'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.statusSeleksi === 'Ditolak'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.statusSeleksi}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Verifikasi Status */}
                            {p.statusSeleksi !== 'Diterima' && (
                              <button
                                onClick={() => handleUpdateStatus(p, 'Diterima')}
                                title="Terima Calon Siswa"
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* Sinkron ke Master Siswa */}
                            {p.statusSeleksi === 'Diterima' && (
                              <button
                                onClick={() => handleSinkronisasiMaster(p)}
                                title="Sinkronkan ke Data Master Siswa"
                                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Sinkron Siswa</span>
                              </button>
                            )}

                            {/* Hubungi WhatsApp */}
                            <button
                              onClick={() => handleKirimPesanWA(p, 'Halo, panitia menginformasikan berkas pendaftaran Anda telah kami terima.')}
                              title="Kirim Pesan WhatsApp"
                              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition cursor-pointer"
                            >
                              <Send className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* 2. TAGIHAN PPDB */}
      {activeSub === 'tagihan_ppdb' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-800">Manajemen Pembayaran Biaya Masuk &amp; Formulir PPDB</span>
            <span className="text-slate-500">Dapat diverifikasi tunai di posko PPDB atau transfer rekening</span>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Calon Siswa</th>
                <th className="py-3 px-4">Biaya Pendaftaran</th>
                <th className="py-3 px-4">Biaya Daftar Ulang</th>
                <th className="py-3 px-4 text-center">Aksi Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendaftarList.map((p) => {
                const formStatus = getBiayaStatus(p.biayaPendaftaran);
                const regStatus = getBiayaStatus(p.biayaDaftarUlang);
                const formNominal = getBiayaNominal(p.biayaPendaftaran, 150000);
                const regNominal = getBiayaNominal(p.biayaDaftarUlang, 2500000);
                return (
                <tr key={p.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{getNama(p)}</p>
                    <p className="text-[11px] text-slate-500 font-mono">No: {p.noPendaftaran}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{formatRupiah(formNominal)}</p>
                    <span className={`text-[10px] font-semibold ${formStatus === 'Lunas' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {formStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-800">{formatRupiah(regNominal)}</p>
                    <span className={`text-[10px] font-semibold ${regStatus === 'Lunas' ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {regStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {formStatus !== 'Lunas' && (
                        <button
                          onClick={() => handleVerifyPembayaranPPDB(p, 'biayaPendaftaran')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Verifikasi Formulir
                        </button>
                      )}
                      {regStatus !== 'Lunas' && (
                        <button
                          onClick={() => handleVerifyPembayaranPPDB(p, 'biayaDaftarUlang')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Verifikasi Daftar Ulang
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. DATA BERKAS PPDB */}
      {activeSub === 'berkas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-900">Kelola Berkas &amp; Dokumen Calon Siswa</h4>
            <span className="text-xs text-slate-500">Verifikasi kelengkapan berkas fisik &amp; digital</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendaftarList.map((p) => (
              <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-slate-900">{p.namaLengkap}</h5>
                    <p className="text-[11px] text-slate-500 font-mono">No. {p.noPendaftaran}</p>
                  </div>
                  <button
                    onClick={() => handleKirimPesanWA(p, 'Mohon segera melengkapi fotokopi Ijazah & Kartu Keluarga untuk verifikasi PPDB.')}
                    className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg font-semibold hover:bg-emerald-200 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Kirim Pengingat WA</span>
                  </button>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Kartu Keluarga (KK):</span>
                    <span className="font-semibold text-emerald-700">Lengkap (Terverifikasi)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">Akta Kelahiran:</span>
                    <span className="font-semibold text-emerald-700">Lengkap (Terverifikasi)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-600">SKL / Ijazah SMP:</span>
                    <span className="font-semibold text-amber-600">Menyusul (SKL Sementara)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-600">Pas Foto 3x4:</span>
                    <span className="font-semibold text-emerald-700">3 Lembar Diterima</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. PERIODE PENDAFTARAN */}
      {activeSub === 'periode' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gelombangList.map((gel) => (
            <div key={gel.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${gel.isAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                  {gel.isAktif ? 'PERIODE AKTIF' : 'SEGERA / DITUTUP'}
                </span>
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">{gel.nama}</h4>
              <p className="text-xs text-slate-500 font-mono mb-4">
                {gel.tglBuka} s/d {gel.tglTutup}
              </p>
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Formulir:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(gel.biayaPendaftaran)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Biaya Daftar Ulang:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(gel.biayaDaftarUlang)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kuota Pendaftar:</span>
                  <span className="font-bold text-blue-700">{gel.terisi} / {gel.kuota} Kursi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. PENGUMUMAN PPDB */}
      {activeSub === 'pengumuman' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900">Pusat Informasi &amp; Pengumuman PPDB</h4>
            <button
              onClick={() => {
                const jdl = prompt('Masukkan Judul Pengumuman PPDB:');
                if (!jdl) return;
                const isi = prompt('Masukkan Isi Pengumuman:');
                if (!isi) return;
                setPengumumanList([{ id: 'ann-' + Date.now(), judul: jdl, tgl: new Date().toISOString().slice(0, 10), isi }, ...pengumumanList]);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Tambah Pengumuman
            </button>
          </div>

          <div className="space-y-3">
            {pengumumanList.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-bold text-slate-900 text-sm">{p.judul}</h5>
                  <span className="text-[11px] text-slate-400 font-mono">{p.tgl}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.isi}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PENGATURAN PPDB */}
      {activeSub === 'pengaturan' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-4 text-xs">
          <h4 className="font-bold text-sm text-slate-900">Pengaturan Konfigurasi PPDB Taruna Bangsa</h4>
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Panitia Pelaksana</label>
              <input
                type="text"
                value={ppdbSettings.namaPanitia}
                onChange={(e) => setPpdbSettings({ ...ppdbSettings, namaPanitia: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Helpdesk / CS PPDB</label>
              <input
                type="text"
                value={ppdbSettings.kontakPanitia}
                onChange={(e) => setPpdbSettings({ ...ppdbSettings, kontakPanitia: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rekening Pembayaran Resmi PPDB</label>
              <input
                type="text"
                value={ppdbSettings.rekPembayaranPPDB}
                onChange={(e) => setPpdbSettings({ ...ppdbSettings, rekPembayaranPPDB: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Syarat &amp; Dokumen Berkas Masuk</label>
              <textarea
                rows={2}
                value={ppdbSettings.syaratBerkas}
                onChange={(e) => setPpdbSettings({ ...ppdbSettings, syaratBerkas: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <button
              onClick={() => alert('Pengaturan PPDB berhasil disimpan.')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold cursor-pointer"
            >
              Simpan Pengaturan PPDB
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
