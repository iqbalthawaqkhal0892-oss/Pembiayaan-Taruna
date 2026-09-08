import React, { useState } from 'react';
import {
  Database,
  FileText,
  CreditCard,
  FileSpreadsheet,
  Wallet,
  Printer,
  PiggyBank,
  FileCheck2,
  Settings,
  Wrench,
  User,
  ChevronRight,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Menu,
  X,
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
  Tagihan,
  Pembayaran,
  ArusKas,
  AkunKas,
  TabunganTransaksi,
  PendaftarPPDB,
  Transaksi,
  LogAktivitas,
  PengaturanAplikasi,
} from '../types';

import { MasterDataTab } from './petugas/MasterDataTab';
import { TagihanTab } from './petugas/TagihanTab';
import { PembayaranTab } from './petugas/PembayaranTab';
import { TransaksiTab } from './petugas/TransaksiTab';
import { ArusKasTab } from './petugas/ArusKasTab';
import { LaporanTab } from './petugas/LaporanTab';
import { TabunganTab } from './petugas/TabunganTab';
import { PPDBTab } from './petugas/PPDBTab';
import { PengaturanTab } from './petugas/PengaturanTab';
import { PeralatanTab } from './petugas/PeralatanTab';
import { ProfilTab } from './petugas/ProfilTab';

interface PetugasPortalProps {
  currentPetugas: Petugas;
  onUpdateCurrentPetugas: (p: Petugas) => void;
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
  tagihanList: Tagihan[];
  onUpdateTagihan: (data: Tagihan[]) => void;
  pembayaranList: Pembayaran[];
  onUpdatePembayaran: (data: Pembayaran[]) => void;
  arusKasList: ArusKas[];
  onUpdateArusKas: (data: ArusKas[]) => void;
  akunKasList: AkunKas[];
  onUpdateAkunKas: (data: AkunKas[]) => void;
  tabunganList: TabunganTransaksi[];
  onUpdateTabungan: (data: TabunganTransaksi[]) => void;
  pendaftarList: PendaftarPPDB[];
  onUpdatePendaftar: (data: PendaftarPPDB[]) => void;
  transaksiList: Transaksi[];
  onUpdateTransaksi: (data: Transaksi[]) => void;
  logs: LogAktivitas[];
  pengaturan: PengaturanAplikasi;
  onUpdatePengaturan: (data: PengaturanAplikasi) => void;
  onOpenReceipt: (pembayaran: Pembayaran, siswa: Siswa, tagihan?: Tagihan) => void;
  onOpenCardModal: (siswa: Siswa) => void;
  onOpenBloggerXml: () => void;
}

export type PetugasMenuKey =
  | 'master'
  | 'tagihan'
  | 'pembayaran'
  | 'transaksi'
  | 'arus_kas'
  | 'laporan'
  | 'tabungan'
  | 'ppdb'
  | 'pengaturan'
  | 'peralatan'
  | 'profil';

export const PetugasPortal: React.FC<PetugasPortalProps> = ({
  currentPetugas,
  onUpdateCurrentPetugas,
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
  tagihanList,
  onUpdateTagihan,
  pembayaranList,
  onUpdatePembayaran,
  arusKasList,
  onUpdateArusKas,
  akunKasList,
  onUpdateAkunKas,
  tabunganList,
  onUpdateTabungan,
  pendaftarList,
  onUpdatePendaftar,
  transaksiList,
  onUpdateTransaksi,
  logs,
  pengaturan,
  onUpdatePengaturan,
  onOpenReceipt,
  onOpenCardModal,
  onOpenBloggerXml,
}) => {
  const [activeMenu, setActiveMenu] = useState<PetugasMenuKey>('tagihan');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTagihanToPay, setSelectedTagihanToPay] = useState<Tagihan | null>(null);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Aggregates for Top Dashboard Banner
  const totalTagihanNominal = tagihanList.reduce((acc, t) => acc + t.nominal, 0);
  const totalTerbayarNominal = tagihanList.reduce((acc, t) => acc + t.terbayar, 0);
  const totalTunggakanNominal = tagihanList.reduce((acc, t) => acc + t.sisaTagihan, 0);
  const totalKasBersih = akunKasList.reduce((acc, k) => acc + k.saldoSaatIni, 0);
  const totalSaldoTabungan = siswaList.reduce((acc, s) => acc + s.saldoTabungan, 0);

  const menuItems: { key: PetugasMenuKey; label: string; icon: React.FC<any>; badge?: string }[] = [
    { key: 'master', label: 'Data Master', icon: Database },
    { key: 'tagihan', label: 'Tagihan Siswa', icon: FileText, badge: `${tagihanList.filter((t) => t.status !== 'Lunas').length}` },
    { key: 'pembayaran', label: 'Pembayaran', icon: CreditCard },
    { key: 'transaksi', label: 'Rekap Transaksi', icon: FileSpreadsheet },
    { key: 'arus_kas', label: 'Arus KAS', icon: Wallet },
    { key: 'laporan', label: 'Cetak Laporan', icon: Printer },
    { key: 'tabungan', label: 'Tabungan & E-Kantin', icon: PiggyBank },
    { key: 'ppdb', label: 'PPDB Online', icon: FileCheck2, badge: `${pendaftarList.length}` },
    { key: 'pengaturan', label: 'Pengaturan Aplikasi', icon: Settings },
    { key: 'peralatan', label: 'Peralatan & WA', icon: Wrench },
    { key: 'profil', label: 'Profil Akun', icon: User },
  ];

  // Callback from Tagihan to switch to Pembayaran with preselected tagihan
  const handleOpenPaymentFromTagihan = (tag: Tagihan) => {
    setSelectedTagihanToPay(tag);
    setActiveMenu('pembayaran');
  };

  // Open receipt by noNota from Transaksi
  const handleOpenReceiptByNoNota = (noNota: string) => {
    const pby = pembayaranList.find((p) => p.noNota === noNota);
    if (pby) {
      const siswa = siswaList.find((s) => s.id === pby.siswaId);
      const tagihan = tagihanList.find((t) => t.id === pby.tagihanId);
      if (siswa) onOpenReceipt(pby, siswa, tagihan);
    } else {
      alert(`Nota ${noNota} tidak ditemukan dalam arsip pembayaran.`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Finology Metric Cards Banner */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Tagihan Terbayar */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
            <p className="text-[11px] text-slate-400 font-medium">Penerimaan Tagihan SPP</p>
            <p className="text-base font-black text-emerald-400 mt-0.5">{formatRupiah(totalTerbayarNominal)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Dari total {formatRupiah(totalTagihanNominal)}</p>
          </div>

          {/* Card 2: Tunggakan Belum Lunas */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
            <p className="text-[11px] text-slate-400 font-medium">Total Sisa Tunggakan</p>
            <p className="text-base font-black text-rose-400 mt-0.5">{formatRupiah(totalTunggakanNominal)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{tagihanList.filter((t) => t.status !== 'Lunas').length} tagihan aktif</p>
          </div>

          {/* Card 3: Saldo Kas Bersih */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
            <p className="text-[11px] text-slate-400 font-medium">Saldo Arus Kas Bersih</p>
            <p className="text-base font-black text-blue-400 mt-0.5">{formatRupiah(totalKasBersih)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Semua akun kas sekolah</p>
          </div>

          {/* Card 4: Tabungan E-Kantin */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 shadow-inner">
            <p className="text-[11px] text-slate-400 font-medium">Total Tabungan Siswa</p>
            <p className="text-base font-black text-indigo-300 mt-0.5">{formatRupiah(totalSaldoTabungan)}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Siap transaksi E-Kantin</p>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-slate-800 p-3 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="uppercase">{menuItems.find((m) => m.key === activeMenu)?.label}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 bg-slate-700 rounded-lg text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <aside
          className={`lg:w-64 shrink-0 space-y-1 ${
            mobileMenuOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="bg-slate-950/60 p-2 rounded-2xl border border-slate-800/80 shadow-md space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Modul Petugas Taruna Bangsa
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActiveMenu(item.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Blogger & Firestore Info Callout */}
          <div className="p-4 bg-gradient-to-br from-blue-950/50 to-slate-900 rounded-2xl border border-blue-900/40 text-xs text-slate-300">
            <p className="font-bold text-white mb-1">Blogger XML &amp; Firestore</p>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Koneksi mandiri tanpa Realtime DB, Cloud Functions &amp; Storage.
            </p>
            <button
              onClick={onOpenBloggerXml}
              className="w-full py-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 rounded-xl font-semibold text-[11px] transition cursor-pointer"
            >
              Unduh Template XML
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeMenu === 'master' && (
            <MasterDataTab
              petugasList={petugasList}
              onUpdatePetugas={onUpdatePetugas}
              units={units}
              onUpdateUnits={onUpdateUnits}
              tahunAjaran={tahunAjaran}
              onUpdateTahunAjaran={onUpdateTahunAjaran}
              kelasList={kelasList}
              onUpdateKelas={onUpdateKelas}
              siswaList={siswaList}
              onUpdateSiswa={onUpdateSiswa}
              akunSiswaList={akunSiswaList}
              onUpdateAkunSiswa={onUpdateAkunSiswa}
              kategoriList={kategoriList}
              onUpdateKategori={onUpdateKategori}
              rekeningList={rekeningList}
              onUpdateRekening={onUpdateRekening}
              onOpenCardModal={onOpenCardModal}
            />
          )}

          {activeMenu === 'tagihan' && (
            <TagihanTab
              tagihanList={tagihanList}
              onUpdateTagihan={onUpdateTagihan}
              siswaList={siswaList}
              kategoriList={kategoriList}
              kelasList={kelasList}
              units={units}
              onOpenPaymentModal={handleOpenPaymentFromTagihan}
            />
          )}

          {activeMenu === 'pembayaran' && (
            <PembayaranTab
              pembayaranList={pembayaranList}
              onUpdatePembayaran={onUpdatePembayaran}
              tagihanList={tagihanList}
              onUpdateTagihan={onUpdateTagihan}
              siswaList={siswaList}
              akunKasList={akunKasList}
              onUpdateAkunKas={onUpdateAkunKas}
              currentPetugas={currentPetugas}
              onOpenReceipt={onOpenReceipt}
              preSelectedTagihan={selectedTagihanToPay}
              onClearPreSelectedTagihan={() => setSelectedTagihanToPay(null)}
            />
          )}

          {activeMenu === 'transaksi' && (
            <TransaksiTab
              transaksiList={transaksiList}
              onUpdateTransaksi={onUpdateTransaksi}
              pembayaranList={pembayaranList}
              siswaList={siswaList}
              onOpenReceiptByNoNota={handleOpenReceiptByNoNota}
            />
          )}

          {activeMenu === 'arus_kas' && (
            <ArusKasTab
              arusKasList={arusKasList}
              onUpdateArusKas={onUpdateArusKas}
              akunKasList={akunKasList}
              onUpdateAkunKas={onUpdateAkunKas}
            />
          )}

          {activeMenu === 'laporan' && (
            <LaporanTab
              tagihanList={tagihanList}
              pembayaranList={pembayaranList}
              arusKasList={arusKasList}
              tabunganList={tabunganList}
              siswaList={siswaList}
              kelasList={kelasList}
              units={units}
              pengaturan={pengaturan}
            />
          )}

          {activeMenu === 'tabungan' && (
            <TabunganTab
              tabunganList={tabunganList}
              onUpdateTabungan={onUpdateTabungan}
              siswaList={siswaList}
              onUpdateSiswa={onUpdateSiswa}
              currentPetugas={currentPetugas}
              onOpenCardModal={onOpenCardModal}
            />
          )}

          {activeMenu === 'ppdb' && (
            <PPDBTab
              pendaftarList={pendaftarList}
              onUpdatePendaftar={onUpdatePendaftar}
              siswaList={siswaList}
              onUpdateSiswa={onUpdateSiswa}
              units={units}
            />
          )}

          {activeMenu === 'pengaturan' && (
            <PengaturanTab
              pengaturan={pengaturan}
              onSavePengaturan={onUpdatePengaturan}
            />
          )}

          {activeMenu === 'peralatan' && (
            <PeralatanTab
              logs={logs}
              tagihanList={tagihanList}
              siswaList={siswaList}
              pengaturan={pengaturan}
              onOpenBloggerXml={onOpenBloggerXml}
            />
          )}

          {activeMenu === 'profil' && (
            <ProfilTab
              currentPetugas={currentPetugas}
              onUpdateCurrentPetugas={onUpdateCurrentPetugas}
            />
          )}
        </main>
      </div>
    </div>
  );
};
