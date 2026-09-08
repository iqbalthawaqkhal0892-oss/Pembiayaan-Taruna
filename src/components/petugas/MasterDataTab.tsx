import React, { useState } from 'react';
import {
  Users,
  Building2,
  Calendar,
  Layers,
  GraduationCap,
  KeyRound,
  Tag,
  CreditCard,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ArrowUpRight,
  Search,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';
import {
  Petugas,
  UnitJenjang,
  TahunAjaran,
  Kelas,
  Siswa,
  AkunSiswa,
  KategoriTagihan,
  RekeningPembayaran,
} from '../../types';
import { AppStorageService } from '../../services/storage';

interface MasterDataTabProps {
  petugasList: Petugas[];
  onUpdatePetugas: (data: Petugas[]) => void;
  units: UnitJenjang[];
  onUpdateUnits: (data: UnitJenjang[]) => void;
  tahunAjaran: TahunAjaran[];
  onUpdateTahunAjaran: (data: TahunAjaran[]) => void;
  kelasList: Kelas[];
  onUpdateKelas: (data: Kelas[]) => void;
  siswaList: Siswa[];
  onUpdateSiswa: (data: Siswa[]) => void;
  akunSiswaList: AkunSiswa[];
  onUpdateAkunSiswa: (data: AkunSiswa[]) => void;
  kategoriList: KategoriTagihan[];
  onUpdateKategori: (data: KategoriTagihan[]) => void;
  rekeningList: RekeningPembayaran[];
  onUpdateRekening: (data: RekeningPembayaran[]) => void;
  onOpenCardModal: (siswa: Siswa) => void;
}

type SubMaster = 'petugas' | 'unit' | 'tahun_ajaran' | 'kelas' | 'siswa' | 'akun' | 'kategori' | 'rekening';

export const MasterDataTab: React.FC<MasterDataTabProps> = ({
  petugasList,
  onUpdatePetugas,
  units,
  onUpdateUnits,
  tahunAjaran,
  onUpdateTahunAjaran,
  kelasList,
  onUpdateKelas,
  siswaList,
  onUpdateSiswa,
  akunSiswaList,
  onUpdateAkunSiswa,
  kategoriList,
  onUpdateKategori,
  rekeningList,
  onUpdateRekening,
  onOpenCardModal,
}) => {
  const [activeSub, setActiveSub] = useState<SubMaster>('siswa');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKenaikanModal, setShowKenaikanModal] = useState(false);
  const [selectedSiswaIds, setSelectedSiswaIds] = useState<string[]>([]);
  const [targetKelasId, setTargetKelasId] = useState(kelasList[0]?.id || '');
  const [kenaikanStatus, setKenaikanStatus] = useState<'Naik' | 'Lulus' | 'Pindah'>('Naik');

  // New Siswa Form State
  const [newSiswa, setNewSiswa] = useState<Partial<Siswa>>({
    nama: '',
    nisn: '',
    nis: '',
    unitId: units[0]?.id || '',
    kelasId: kelasList[0]?.id || '',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tglLahir: '2008-01-01',
    namaWali: '',
    noHpWali: '',
    alamat: '',
    saldoTabungan: 0,
    status: 'Aktif',
  });

  // Excel Handlers
  const handleExport = () => {
    if (activeSub === 'petugas') {
      AppStorageService.exportToExcel(petugasList, 'Data_Petugas_Taruna_Bangsa', 'Petugas');
    } else if (activeSub === 'unit') {
      AppStorageService.exportToExcel(units, 'Data_Unit_Taruna_Bangsa', 'Unit');
    } else if (activeSub === 'kelas') {
      AppStorageService.exportToExcel(kelasList, 'Data_Kelas_Taruna_Bangsa', 'Kelas');
    } else if (activeSub === 'siswa') {
      AppStorageService.exportToExcel(siswaList, 'Data_Siswa_Taruna_Bangsa', 'Siswa');
    } else if (activeSub === 'akun') {
      AppStorageService.exportToExcel(akunSiswaList, 'Data_Akun_Siswa_Taruna_Bangsa', 'AkunSiswa');
    } else if (activeSub === 'kategori') {
      AppStorageService.exportToExcel(kategoriList, 'Data_Kategori_Tagihan_Taruna_Bangsa', 'KategoriTagihan');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    AppStorageService.importFromExcel(file, (data) => {
      if (activeSub === 'petugas' && Array.isArray(data)) {
        onUpdatePetugas([...data, ...petugasList]);
        alert(`Berhasil mengimpor ${data.length} data petugas.`);
      } else if (activeSub === 'unit' && Array.isArray(data)) {
        onUpdateUnits([...data, ...units]);
        alert(`Berhasil mengimpor ${data.length} data unit.`);
      } else if (activeSub === 'kelas' && Array.isArray(data)) {
        onUpdateKelas([...data, ...kelasList]);
        alert(`Berhasil mengimpor ${data.length} data kelas.`);
      } else if (activeSub === 'siswa' && Array.isArray(data)) {
        onUpdateSiswa([...data, ...siswaList]);
        alert(`Berhasil mengimpor ${data.length} data siswa.`);
      } else if (activeSub === 'kategori' && Array.isArray(data)) {
        onUpdateKategori([...data, ...kategoriList]);
        alert(`Berhasil mengimpor ${data.length} kategori tagihan.`);
      }
    });
  };

  const handleAutoGenerateAkun = () => {
    const created = AppStorageService.generateAkunSiswaOtomatis();
    onUpdateAkunSiswa(AppStorageService.getAkunSiswa());
    alert(`Berhasil membuat ${created} akun siswa baru.`);
  };

  const handleProsesKenaikan = () => {
    if (selectedSiswaIds.length === 0) {
      alert('Pilih minimal 1 siswa terlebih dahulu.');
      return;
    }
    AppStorageService.prosesKenaikanKelas(selectedSiswaIds, targetKelasId, kenaikanStatus);
    onUpdateSiswa(AppStorageService.getSiswa());
    setShowKenaikanModal(false);
    setSelectedSiswaIds([]);
    alert(`Proses ${kenaikanStatus} berhasil dijalankan untuk siswa terpilih.`);
  };

  const handleSaveNewSiswa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiswa.nama || !newSiswa.nisn) {
      alert('Nama dan NISN wajib diisi.');
      return;
    }
    const created: Siswa = {
      id: 'sis-' + Date.now(),
      nisn: newSiswa.nisn,
      nis: newSiswa.nis || '2627' + Math.floor(1000 + Math.random() * 9000),
      nama: newSiswa.nama,
      unitId: newSiswa.unitId || units[0]?.id || '',
      kelasId: newSiswa.kelasId || kelasList[0]?.id || '',
      jenisKelamin: (newSiswa.jenisKelamin as 'L' | 'P') || 'L',
      tempatLahir: newSiswa.tempatLahir || 'Jakarta',
      tglLahir: newSiswa.tglLahir || '2008-01-01',
      namaWali: newSiswa.namaWali || 'Orang Tua',
      noHpWali: newSiswa.noHpWali || '08123456789',
      alamat: newSiswa.alamat || 'Jl. Raya Taruna',
      saldoTabungan: Number(newSiswa.saldoTabungan) || 0,
      virtualAccount: '880' + (newSiswa.nisn || '00000'),
      status: 'Aktif',
    };
    onUpdateSiswa([created, ...siswaList]);
    AppStorageService.generateAkunSiswaOtomatis();
    onUpdateAkunSiswa(AppStorageService.getAkunSiswa());
    setShowAddModal(false);
    setNewSiswa({ nama: '', nisn: '', nis: '', saldoTabungan: 0 });
    alert('Siswa berhasil ditambahkan dan Akun Siswa telah digenerate.');
  };

  const filteredSiswa = siswaList.filter(
    (s) =>
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn.includes(searchQuery) ||
      s.nis.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Sub Menu Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'siswa', label: '8. Data Siswa', icon: GraduationCap },
          { id: 'akun', label: '11. Akun Siswa', icon: KeyRound },
          { id: 'petugas', label: '1. Petugas & Staf', icon: Users },
          { id: 'unit', label: '3. Unit / Jenjang', icon: Building2 },
          { id: 'tahun_ajaran', label: '5. Tahun Ajaran', icon: Calendar },
          { id: 'kelas', label: '6. Kelas', icon: Layers },
          { id: 'kategori', label: '14. Kategori Tagihan', icon: Tag },
          { id: 'rekening', label: '16. Rekening Bayar', icon: CreditCard },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSub(item.id as SubMaster)}
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

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 flex-1 min-w-64">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Cari data ${activeSub}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Excel Export */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Excel</span>
          </button>

          {/* Excel Import */}
          <label className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Excel</span>
            <input type="file" accept=".xlsx, .xls" onChange={handleImport} className="hidden" />
          </label>

          {/* Special Action for Akun Siswa */}
          {activeSub === 'akun' && (
            <button
              onClick={handleAutoGenerateAkun}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Akun Otomatis</span>
            </button>
          )}

          {/* Special Action for Siswa: Kenaikan Kelas */}
          {activeSub === 'siswa' && (
            <>
              <button
                onClick={() => setShowKenaikanModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Kenaikan / Pindah Kelas</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Siswa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sub Content View */}
      {/* 1. DATA SISWA */}
      {activeSub === 'siswa' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedSiswaIds.length === filteredSiswa.length && filteredSiswa.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedSiswaIds(filteredSiswa.map((s) => s.id));
                        else setSelectedSiswaIds([]);
                      }}
                      className="rounded text-blue-600 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                  <th className="py-3 px-4">Unit &amp; Kelas</th>
                  <th className="py-3 px-4">Wali Murid</th>
                  <th className="py-3 px-4">Saldo Tabungan</th>
                  <th className="py-3 px-4">Virtual Account</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSiswa.map((siswa) => {
                  const unit = units.find((u) => u.id === siswa.unitId);
                  const kelas = kelasList.find((k) => k.id === siswa.kelasId);
                  const isChecked = selectedSiswaIds.includes(siswa.id);
                  return (
                    <tr key={siswa.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSiswaIds([...selectedSiswaIds, siswa.id]);
                            else setSelectedSiswaIds(selectedSiswaIds.filter((id) => id !== siswa.id));
                          }}
                          className="rounded text-blue-600 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs">
                            {siswa.nama.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{siswa.nama}</p>
                            <p className="text-[11px] text-slate-500 font-mono">NISN: {siswa.nisn} | NIS: {siswa.nis}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{kelas?.nama || '-'}</p>
                        <p className="text-[11px] text-slate-500">{unit?.kode || '-'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{siswa.namaWali}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{siswa.noHpWali}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-emerald-600">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(siswa.saldoTabungan)}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {siswa.virtualAccount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {siswa.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onOpenCardModal(siswa)}
                            title="Cetak Kartu Siswa & QR E-Kantin"
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition cursor-pointer"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus data siswa ${siswa.nama}?`)) {
                                onUpdateSiswa(siswaList.filter((s) => s.id !== siswa.id));
                              }
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition cursor-pointer"
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
      )}

      {/* 2. DATA AKUN SISWA */}
      {activeSub === 'akun' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs text-slate-600">
            <span>Total Akun Siswa: <b>{akunSiswaList.length}</b> akun terdaftar</span>
            <span className="text-emerald-700 font-medium">Akun otomatis digunakan siswa untuk masuk ke portal digital</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Username (NISN)</th>
                  <th className="py-3 px-4">Password Default</th>
                  <th className="py-3 px-4 text-center">Status Akun</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {akunSiswaList.map((akun) => {
                  const siswa = siswaList.find((s) => s.id === akun.siswaId);
                  return (
                    <tr key={akun.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">{siswa?.nama || 'Siswa ID: ' + akun.siswaId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{akun.username}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{akun.passwordDefault}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {akun.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const updated = akunSiswaList.map((a) =>
                              a.id === akun.id ? { ...a, status: a.status === 'Aktif' ? 'Nonaktif' : 'Aktif' } : a
                            );
                            onUpdateAkunSiswa(updated as AkunSiswa[]);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition cursor-pointer"
                        >
                          Toggle Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DATA PETUGAS */}
      {activeSub === 'petugas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Petugas</th>
                  <th className="py-3 px-4">Email &amp; Username</th>
                  <th className="py-3 px-4">Role Akses</th>
                  <th className="py-3 px-4">No. WhatsApp</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {petugasList.map((ptg) => (
                  <tr key={ptg.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{ptg.nama}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{ptg.email} (@{ptg.username})</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wide">
                        {ptg.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{ptg.noHp}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {ptg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. DATA UNIT / JENJANG */}
      {activeSub === 'unit' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {units.map((unit) => (
            <div key={unit.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-mono font-bold text-xs rounded-lg">
                  {unit.kode}
                </span>
                <Building2 className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-1">{unit.nama}</h4>
              <p className="text-xs text-slate-500">{unit.deskripsi}</p>
            </div>
          ))}
        </div>
      )}

      {/* 5. DATA TAHUN AJARAN */}
      {activeSub === 'tahun_ajaran' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tahun Ajaran</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-center">Status Aktif</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tahunAjaran.map((ta) => (
                <tr key={ta.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">{ta.nama}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700">{ta.semester}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ta.isAktif ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {ta.isAktif ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        const updated = tahunAjaran.map((t) => ({ ...t, isAktif: t.id === ta.id }));
                        onUpdateTahunAjaran(updated);
                      }}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition cursor-pointer"
                    >
                      Set Sebagai Aktif
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. DATA KELAS */}
      {activeSub === 'kelas' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Kelas</th>
                <th className="py-3 px-4">Unit / Jenjang</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4 text-center">Kapasitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kelasList.map((kls) => {
                const unit = units.find((u) => u.id === kls.unitId);
                return (
                  <tr key={kls.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{kls.nama}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{unit?.nama || '-'}</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{kls.tingkat}</td>
                    <td className="py-3 px-4 text-slate-700">{kls.waliKelas}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{kls.kapasitas} Siswa</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. KATEGORI TAGIHAN */}
      {activeSub === 'kategori' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Kode</th>
                <th className="py-3 px-4">Nama Tagihan</th>
                <th className="py-3 px-4">Tipe Pembayaran</th>
                <th className="py-3 px-4 text-right">Nominal Standar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {kategoriList.map((kat) => (
                <tr key={kat.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{kat.kode}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{kat.nama}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {kat.tipe}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(kat.nominalDefault)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 8. REKENING PEMBAYARAN */}
      {activeSub === 'rekening' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rekeningList.map((rek) => (
            <div key={rek.id} className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-2xl shadow-md border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-sm tracking-wider uppercase">{rek.bank}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  AKTIF
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Nomor Rekening Resmi:</p>
              <p className="text-lg font-mono font-bold text-blue-300 tracking-wider mb-2">{rek.noRekening}</p>
              <p className="text-xs text-slate-300">a.n. <span className="font-bold text-white">{rek.atasNama}</span></p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah Siswa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Tambah Data Siswa Baru</h3>
            <form onSubmit={handleSaveNewSiswa} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  required
                  value={newSiswa.nama}
                  onChange={(e) => setNewSiswa({ ...newSiswa, nama: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Contoh: Budi Santoso"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    value={newSiswa.nisn}
                    onChange={(e) => setNewSiswa({ ...newSiswa, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    placeholder="0081234567"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={newSiswa.nis}
                    onChange={(e) => setNewSiswa({ ...newSiswa, nis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    placeholder="23241010"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit / Jenjang</label>
                  <select
                    value={newSiswa.unitId}
                    onChange={(e) => setNewSiswa({ ...newSiswa, unitId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {units.map((u) => (
                      <option key={u.id} value={u.id}>{u.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={newSiswa.kelasId}
                    onChange={(e) => setNewSiswa({ ...newSiswa, kelasId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Wali Murid</label>
                  <input
                    type="text"
                    value={newSiswa.namaWali}
                    onChange={(e) => setNewSiswa({ ...newSiswa, namaWali: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    placeholder="Bapak / Ibu Wali"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Wali</label>
                  <input
                    type="text"
                    value={newSiswa.noHpWali}
                    onChange={(e) => setNewSiswa({ ...newSiswa, noHpWali: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                    placeholder="081234567890"
                  />
                </div>
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
                  Simpan Siswa &amp; Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kenaikan Kelas */}
      {showKenaikanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-2">Proses Kenaikan / Pindah Kelas</h3>
            <p className="text-slate-600 mb-4">
              Terpilih <b>{selectedSiswaIds.length}</b> siswa untuk diproses.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jenis Pemindahan</label>
                <select
                  value={kenaikanStatus}
                  onChange={(e) => setKenaikanStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Naik">Kenaikan Kelas (Pindah ke Kelas Baru)</option>
                  <option value="Lulus">Lulus Sekolah</option>
                  <option value="Pindah">Pindah Sekolah (Keluar)</option>
                </select>
              </div>
              {kenaikanStatus === 'Naik' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Kelas Baru</label>
                  <select
                    value={targetKelasId}
                    onChange={(e) => setTargetKelasId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-6">
              <button
                onClick={() => setShowKenaikanModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleProsesKenaikan}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
              >
                Jalankan Pemindahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
