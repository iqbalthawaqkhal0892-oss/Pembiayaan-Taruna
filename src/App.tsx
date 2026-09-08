import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PetugasPortal } from './components/PetugasPortal';
import { SiswaPortal } from './components/SiswaPortal';
import { PPDBPortal } from './components/PPDBPortal';
import { BloggerXmlModal } from './components/BloggerXmlModal';
import { StudentCardModal } from './components/StudentCardModal';
import { ReceiptModal } from './components/ReceiptModal';
import { AppStorageService } from './services/storage';
import {
  PortalType,
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
} from './types';

export default function App() {
  // Active Portal State
  const [currentPortal, setCurrentPortal] = useState<PortalType>('petugas');

  // Master Data Collections
  const [petugasList, setPetugasList] = useState<Petugas[]>(() => AppStorageService.getPetugas());
  const [currentPetugas, setCurrentPetugas] = useState<Petugas>(() => petugasList[0]);
  const [units, setUnits] = useState<UnitJenjang[]>(() => AppStorageService.getUnits());
  const [tahunAjaran, setTahunAjaran] = useState<TahunAjaran[]>(() => AppStorageService.getTahunAjaran());
  const [kelasList, setKelasList] = useState<Kelas[]>(() => AppStorageService.getKelas());
  const [siswaList, setSiswaList] = useState<Siswa[]>(() => AppStorageService.getSiswa());
  const [akunSiswaList, setAkunSiswaList] = useState<AkunSiswa[]>(() => AppStorageService.getAkunSiswa());
  const [kategoriList, setKategoriList] = useState<KategoriTagihan[]>(() => AppStorageService.getKategoriTagihan());
  const [rekeningList, setRekeningList] = useState<RekeningPembayaran[]>(() => AppStorageService.getRekening());

  // Financial & Operational Collections
  const [tagihanList, setTagihanList] = useState<Tagihan[]>(() => AppStorageService.getTagihan());
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>(() => AppStorageService.getPembayaran());
  const [arusKasList, setArusKasList] = useState<ArusKas[]>(() => AppStorageService.getArusKas());
  const [akunKasList, setAkunKasList] = useState<AkunKas[]>(() => AppStorageService.getAkunKas());
  const [tabunganList, setTabunganList] = useState<TabunganTransaksi[]>(() => AppStorageService.getTabungan());
  const [pendaftarList, setPendaftarList] = useState<PendaftarPPDB[]>(() => AppStorageService.getPendaftarPPDB());
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>(() => AppStorageService.getTransaksi());
  const [logs, setLogs] = useState<LogAktivitas[]>(() => AppStorageService.getLogs());
  const [pengaturan, setPengaturan] = useState<PengaturanAplikasi>(() => AppStorageService.getPengaturan());

  // Siswa Portal selection
  const [currentSiswaId, setCurrentSiswaId] = useState<string>(() => siswaList[0]?.id || '');

  // Modals state
  const [showBloggerModal, setShowBloggerModal] = useState(false);
  const [cardModalSiswa, setCardModalSiswa] = useState<Siswa | null>(null);
  const [receiptModalData, setReceiptModalData] = useState<{
    pembayaran: Pembayaran;
    siswa: Siswa;
    tagihan?: Tagihan;
  } | null>(null);

  // Sync helpers
  const handleUpdatePetugas = (data: Petugas[]) => {
    setPetugasList(data);
    AppStorageService.savePetugas(data);
  };

  const handleUpdateUnits = (data: UnitJenjang[]) => {
    setUnits(data);
    AppStorageService.saveUnits(data);
  };

  const handleUpdateTahunAjaran = (data: TahunAjaran[]) => {
    setTahunAjaran(data);
    AppStorageService.saveTahunAjaran(data);
  };

  const handleUpdateKelas = (data: Kelas[]) => {
    setKelasList(data);
    AppStorageService.saveKelas(data);
  };

  const handleUpdateSiswa = (data: Siswa[]) => {
    setSiswaList(data);
    AppStorageService.saveSiswa(data);
  };

  const handleUpdateAkunSiswa = (data: AkunSiswa[]) => {
    setAkunSiswaList(data);
    AppStorageService.saveAkunSiswa(data);
  };

  const handleUpdateKategori = (data: KategoriTagihan[]) => {
    setKategoriList(data);
    AppStorageService.saveKategoriTagihan(data);
  };

  const handleUpdateRekening = (data: RekeningPembayaran[]) => {
    setRekeningList(data);
    AppStorageService.saveRekening(data);
  };

  const handleUpdateTagihan = (data: Tagihan[]) => {
    setTagihanList(data);
    AppStorageService.saveTagihan(data);
  };

  const handleUpdatePembayaran = (data: Pembayaran[]) => {
    setPembayaranList(data);
    AppStorageService.savePembayaran(data);
  };

  const handleUpdateArusKas = (data: ArusKas[]) => {
    setArusKasList(data);
    AppStorageService.saveArusKas(data);
  };

  const handleUpdateAkunKas = (data: AkunKas[]) => {
    setAkunKasList(data);
    AppStorageService.saveAkunKas(data);
  };

  const handleUpdateTabungan = (data: TabunganTransaksi[]) => {
    setTabunganList(data);
    AppStorageService.saveTabungan(data);
  };

  const handleUpdatePendaftar = (data: PendaftarPPDB[]) => {
    setPendaftarList(data);
    AppStorageService.savePendaftarPPDB(data);
  };

  const handleUpdateTransaksi = (data: Transaksi[]) => {
    setTransaksiList(data);
    AppStorageService.saveTransaksi(data);
  };

  const handleUpdatePengaturan = (data: PengaturanAplikasi) => {
    setPengaturan(data);
    AppStorageService.savePengaturan(data);
  };

  // Re-fetch when student payment updated
  const handleRefreshData = () => {
    setPembayaranList(AppStorageService.getPembayaran());
    setTagihanList(AppStorageService.getTagihan());
    setSiswaList(AppStorageService.getSiswa());
    setTransaksiList(AppStorageService.getTransaksi());
    setLogs(AppStorageService.getLogs());
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar
        currentPortal={currentPortal}
        onSelectPortal={setCurrentPortal}
        onOpenBloggerXml={() => setShowBloggerModal(true)}
      />

      {/* Main View According to Portal Selection */}
      <div className="flex-1">
        {currentPortal === 'petugas' && (
          <PetugasPortal
            currentPetugas={currentPetugas}
            onUpdateCurrentPetugas={setCurrentPetugas}
            petugasList={petugasList}
            onUpdatePetugas={handleUpdatePetugas}
            units={units}
            onUpdateUnits={handleUpdateUnits}
            tahunAjaran={tahunAjaran}
            onUpdateTahunAjaran={handleUpdateTahunAjaran}
            kelasList={kelasList}
            onUpdateKelas={handleUpdateKelas}
            siswaList={siswaList}
            onUpdateSiswa={handleUpdateSiswa}
            akunSiswaList={akunSiswaList}
            onUpdateAkunSiswa={handleUpdateAkunSiswa}
            kategoriList={kategoriList}
            onUpdateKategori={handleUpdateKategori}
            rekeningList={rekeningList}
            onUpdateRekening={handleUpdateRekening}
            tagihanList={tagihanList}
            onUpdateTagihan={handleUpdateTagihan}
            pembayaranList={pembayaranList}
            onUpdatePembayaran={handleUpdatePembayaran}
            arusKasList={arusKasList}
            onUpdateArusKas={handleUpdateArusKas}
            akunKasList={akunKasList}
            onUpdateAkunKas={handleUpdateAkunKas}
            tabunganList={tabunganList}
            onUpdateTabungan={handleUpdateTabungan}
            pendaftarList={pendaftarList}
            onUpdatePendaftar={handleUpdatePendaftar}
            transaksiList={transaksiList}
            onUpdateTransaksi={handleUpdateTransaksi}
            logs={logs}
            pengaturan={pengaturan}
            onUpdatePengaturan={handleUpdatePengaturan}
            onOpenReceipt={(pby, sis, tag) => setReceiptModalData({ pembayaran: pby, siswa: sis, tagihan: tag })}
            onOpenCardModal={(sis) => setCardModalSiswa(sis)}
            onOpenBloggerXml={() => setShowBloggerModal(true)}
          />
        )}

        {currentPortal === 'siswa' && (
          <SiswaPortal
            siswaList={siswaList}
            currentSiswaId={currentSiswaId}
            onSelectSiswa={setCurrentSiswaId}
            tagihanList={tagihanList}
            pembayaranList={pembayaranList}
            tabunganList={tabunganList}
            rekeningList={rekeningList}
            kelasList={kelasList}
            units={units}
            pengaturan={pengaturan}
            onOpenReceipt={(pby, sis, tag) => setReceiptModalData({ pembayaran: pby, siswa: sis, tagihan: tag })}
            onOpenCardModal={(sis) => setCardModalSiswa(sis)}
            onPembayaranUpdated={handleRefreshData}
          />
        )}

        {currentPortal === 'ppdb' && (
          <PPDBPortal
            pendaftarList={pendaftarList}
            onUpdatePendaftar={handleUpdatePendaftar}
            units={units}
            pengaturan={pengaturan}
          />
        )}
      </div>

      {/* Global Modals */}
      {showBloggerModal && (
        <BloggerXmlModal
          isOpen={showBloggerModal}
          onClose={() => setShowBloggerModal(false)}
          pengaturan={pengaturan}
          onSavePengaturan={handleUpdatePengaturan}
        />
      )}

      {cardModalSiswa && (
        <StudentCardModal
          siswa={cardModalSiswa}
          kelasName={kelasList.find((k) => k.id === cardModalSiswa.kelasId)?.nama}
          unitName={units.find((u) => u.id === cardModalSiswa.unitId)?.nama}
          onClose={() => setCardModalSiswa(null)}
        />
      )}

      {receiptModalData && (
        <ReceiptModal
          pembayaran={receiptModalData.pembayaran}
          siswa={receiptModalData.siswa}
          tagihan={receiptModalData.tagihan}
          pengaturan={pengaturan}
          onClose={() => setReceiptModalData(null)}
        />
      )}
    </div>
  );
}
