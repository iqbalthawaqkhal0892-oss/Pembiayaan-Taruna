import * as XLSX from 'xlsx';
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
  Transaksi,
  AkunKas,
  ArusKas,
  TabunganSiswa,
  PendaftarPPDB,
  PengaturanPPDB,
  PengaturanAplikasi,
  BeritaArtikel,
  Pengumuman,
  LogAktivitas,
} from '../types';

// Default Data Master Initial Seed for Yayasan Taruna Bangsa
export const initialUnits: UnitJenjang[] = [
  { id: 'unit-1', kode: 'SMK-TB', nama: 'SMK Taruna Bangsa', deskripsi: 'Pendidikan Vokasi & Kejuruan Unggulan Berdisiplin' },
  { id: 'unit-2', kode: 'SMA-TB', nama: 'SMA Taruna Bangsa', deskripsi: 'Pendidikan Menengah Atas Berbasis Sains & Kepemimpinan' },
  { id: 'unit-3', kode: 'SMP-TB', nama: 'SMP Taruna Bangsa', deskripsi: 'Pendidikan Menengah Pertama Berkarakter Kebangsaan' },
];

export const initialTahunAjaran: TahunAjaran[] = [
  { id: 'ta-1', nama: '2025/2026', semester: 'Genap', isAktif: true },
  { id: 'ta-2', nama: '2025/2026', semester: 'Ganjil', isAktif: false },
  { id: 'ta-3', nama: '2024/2025', semester: 'Genap', isAktif: false },
];

export const initialKelas: Kelas[] = [
  { id: 'kls-1', unitId: 'unit-1', nama: 'X TKJ 1', tingkat: 'X', waliKelas: 'Drs. Hendra Irawan', kapasitas: 36 },
  { id: 'kls-2', unitId: 'unit-1', nama: 'XI TKJ 1', tingkat: 'XI', waliKelas: 'Siti Aminah, M.Pd.', kapasitas: 36 },
  { id: 'kls-3', unitId: 'unit-1', nama: 'XII RPL 1', tingkat: 'XII', waliKelas: 'Bambang Sudibyo, S.Kom', kapasitas: 34 },
  { id: 'kls-4', unitId: 'unit-2', nama: 'X MIPA 1', tingkat: 'X', waliKelas: 'Nur Hidayah, S.Pd', kapasitas: 32 },
  { id: 'kls-5', unitId: 'unit-3', nama: 'VII A', tingkat: 'VII', waliKelas: 'Agus Pratama, S.Pd', kapasitas: 30 },
];

export const initialPetugas: Petugas[] = [
  { id: 'ptg-1', nama: 'Muhammad Ridwan, S.Kom', email: 'admin@tarunabangsa.sch.id', username: 'admin', role: 'admin', noHp: '081234567890', status: 'Aktif' },
  { id: 'ptg-2', nama: 'Endang Lestari, S.E.', email: 'keuangan@tarunabangsa.sch.id', username: 'keuangan', role: 'keuangan', noHp: '081298765432', status: 'Aktif' },
  { id: 'ptg-3', nama: 'Ahmad Fauzi, S.Sos', email: 'tu@tarunabangsa.sch.id', username: 'tatausaha', role: 'tata_usaha', noHp: '085712348899', status: 'Aktif' },
  { id: 'ptg-4', nama: 'Dewi Sartika, S.Pd', email: 'dewi@tarunabangsa.sch.id', username: 'guru.dewi', role: 'guru', noHp: '087812998811', status: 'Aktif' },
  { id: 'ptg-5', nama: 'Kapten (Purn) Suryadi', email: 'ppdb@tarunabangsa.sch.id', username: 'panitia.ppdb', role: 'ppdb', noHp: '082133445566', status: 'Aktif' },
];

export const initialKategoriTagihan: KategoriTagihan[] = [
  { id: 'kat-1', kode: 'SPP', nama: 'SPP / Iuran Bulanan', tipe: 'Bulanan', nominalDefault: 350000, unitId: 'unit-1' },
  { id: 'kat-2', kode: 'GDG', nama: 'Uang Pengembangan / Gedung', tipe: 'Sekali', nominalDefault: 2500000, unitId: 'unit-1' },
  { id: 'kat-3', kode: 'SRG', nama: 'Paket Seragam & Atribut Taruna', tipe: 'Sekali', nominalDefault: 1200000, unitId: 'unit-1' },
  { id: 'kat-4', kode: 'PRK', nama: 'Biaya Praktikum Komputer & Bengkel', tipe: 'Bulanan', nominalDefault: 100000, unitId: 'unit-1' },
  { id: 'kat-5', kode: 'UAS', nama: 'Iuran Ujian Semester', tipe: 'Bulanan', nominalDefault: 150000, unitId: 'unit-1' },
];

export const initialRekening: RekeningPembayaran[] = [
  { id: 'rek-1', bank: 'Bank Mandiri', noRekening: '137-00-1289382-9', atasNama: 'Yayasan Taruna Bangsa Utama', isAktif: true },
  { id: 'rek-2', bank: 'Bank BNI', noRekening: '028-112-9844', atasNama: 'SMK Taruna Bangsa Keuangan', isAktif: true },
  { id: 'rek-3', bank: 'Bank BRI', noRekening: '0019-01-087654-50-8', atasNama: 'Bendahara Taruna Bangsa', isAktif: true },
];

export const initialSiswa: Siswa[] = [
  {
    id: 'sis-1',
    nisn: '0071238910',
    nis: '23241001',
    nama: 'Arya Dimas Prasetyo',
    unitId: 'unit-1',
    kelasId: 'kls-1',
    jenisKelamin: 'L',
    tempatLahir: 'Jakarta',
    tglLahir: '2008-04-12',
    namaWali: 'Bambang Prasetyo',
    noHpWali: '081388776655',
    alamat: 'Jl. Garuda No. 45, Komplek Perwira',
    saldoTabungan: 450000,
    virtualAccount: '88010071238910',
    status: 'Aktif',
  },
  {
    id: 'sis-2',
    nisn: '0075549012',
    nis: '23241002',
    nama: 'Nabila Putri Azzahra',
    unitId: 'unit-1',
    kelasId: 'kls-1',
    jenisKelamin: 'P',
    tempatLahir: 'Bogor',
    tglLahir: '2008-08-20',
    namaWali: 'Dedi Iskandar',
    noHpWali: '085611223344',
    alamat: 'Jl. Merak Hijau No. 12',
    saldoTabungan: 720000,
    virtualAccount: '88010075549012',
    status: 'Aktif',
  },
  {
    id: 'sis-3',
    nisn: '0069988112',
    nis: '22231045',
    nama: 'Rifki Pratama Yudha',
    unitId: 'unit-1',
    kelasId: 'kls-2',
    jenisKelamin: 'L',
    tempatLahir: 'Depok',
    tglLahir: '2007-02-15',
    namaWali: 'Agus Yudha',
    noHpWali: '081299887711',
    alamat: 'Jl. Kenari Raya Blok B3',
    saldoTabungan: 250000,
    virtualAccount: '88010069988112',
    status: 'Aktif',
  },
  {
    id: 'sis-4',
    nisn: '0054432110',
    nis: '21221088',
    nama: 'Danu Sanjaya Putra',
    unitId: 'unit-1',
    kelasId: 'kls-3',
    jenisKelamin: 'L',
    tempatLahir: 'Bekasi',
    tglLahir: '2006-11-05',
    namaWali: 'Surya Sanjaya',
    noHpWali: '087788990011',
    alamat: 'Kavling Taruna No. 18',
    saldoTabungan: 1250000,
    virtualAccount: '88010054432110',
    status: 'Aktif',
  },
  {
    id: 'sis-5',
    nisn: '0076612345',
    nis: '23242005',
    nama: 'Clarissa Maharani',
    unitId: 'unit-2',
    kelasId: 'kls-4',
    jenisKelamin: 'P',
    tempatLahir: 'Tangerang',
    tglLahir: '2008-01-30',
    namaWali: 'dr. H. Hendrawan',
    noHpWali: '081122334455',
    alamat: 'Perumahan Cendana Hill No. 9',
    saldoTabungan: 890000,
    virtualAccount: '88020076612345',
    status: 'Aktif',
  },
];

export const initialAkunSiswa: AkunSiswa[] = [
  { id: 'akn-1', siswaId: 'sis-1', username: '0071238910', passwordDefault: 'TB1234', status: 'Aktif' },
  { id: 'akn-2', siswaId: 'sis-2', username: '0075549012', passwordDefault: 'TB1234', status: 'Aktif' },
  { id: 'akn-3', siswaId: 'sis-3', username: '0069988112', passwordDefault: 'TB1234', status: 'Aktif' },
  { id: 'akn-4', siswaId: 'sis-4', username: '0054432110', passwordDefault: 'TB1234', status: 'Aktif' },
  { id: 'akn-5', siswaId: 'sis-5', username: '0076612345', passwordDefault: 'TB1234', status: 'Aktif' },
];

export const initialTagihan: Tagihan[] = [
  {
    id: 'tag-1',
    siswaId: 'sis-1',
    kategoriId: 'kat-1',
    namaTagihan: 'SPP Bulan Maret 2026',
    nominal: 350000,
    potongan: 50000, // Beasiswa prestasi
    terbayar: 300000,
    sisaTagihan: 0,
    status: 'Lunas',
    tglJatuhTempo: '2026-03-10',
    periodeBulan: 'Maret 2026',
    tahunAjaranId: 'ta-1',
  },
  {
    id: 'tag-2',
    siswaId: 'sis-1',
    kategoriId: 'kat-1',
    namaTagihan: 'SPP Bulan April 2026',
    nominal: 350000,
    potongan: 50000,
    terbayar: 0,
    sisaTagihan: 300000,
    status: 'Belum Lunas',
    tglJatuhTempo: '2026-04-10',
    periodeBulan: 'April 2026',
    tahunAjaranId: 'ta-1',
  },
  {
    id: 'tag-3',
    siswaId: 'sis-1',
    kategoriId: 'kat-4',
    namaTagihan: 'Praktikum Komputer & Jaringan Semester Genap',
    nominal: 100000,
    potongan: 0,
    terbayar: 0,
    sisaTagihan: 100000,
    status: 'Belum Lunas',
    tglJatuhTempo: '2026-04-15',
    periodeBulan: 'Semester Genap',
    tahunAjaranId: 'ta-1',
  },
  {
    id: 'tag-4',
    siswaId: 'sis-2',
    kategoriId: 'kat-1',
    namaTagihan: 'SPP Bulan Maret 2026',
    nominal: 350000,
    potongan: 0,
    terbayar: 350000,
    sisaTagihan: 0,
    status: 'Lunas',
    tglJatuhTempo: '2026-03-10',
    periodeBulan: 'Maret 2026',
    tahunAjaranId: 'ta-1',
  },
  {
    id: 'tag-5',
    siswaId: 'sis-2',
    kategoriId: 'kat-1',
    namaTagihan: 'SPP Bulan April 2026',
    nominal: 350000,
    potongan: 0,
    terbayar: 150000,
    sisaTagihan: 200000,
    status: 'Sebagian',
    tglJatuhTempo: '2026-04-10',
    periodeBulan: 'April 2026',
    tahunAjaranId: 'ta-1',
  },
  {
    id: 'tag-6',
    siswaId: 'sis-3',
    kategoriId: 'kat-1',
    namaTagihan: 'SPP Bulan April 2026',
    nominal: 350000,
    potongan: 0,
    terbayar: 0,
    sisaTagihan: 350000,
    status: 'Belum Lunas',
    tglJatuhTempo: '2026-04-10',
    periodeBulan: 'April 2026',
    tahunAjaranId: 'ta-1',
  },
  {
    id: 'tag-7',
    siswaId: 'sis-4',
    kategoriId: 'kat-5',
    namaTagihan: 'Biaya Uji Kompetensi Keahlian (UKK)',
    nominal: 450000,
    potongan: 0,
    terbayar: 450000,
    sisaTagihan: 0,
    status: 'Lunas',
    tglJatuhTempo: '2026-03-25',
    periodeBulan: 'Semester Genap',
    tahunAjaranId: 'ta-1',
  },
];

export const initialAkunKas: AkunKas[] = [
  { id: 'kas-1', kode: 'KAS-01', nama: 'Kas Utama Bendahara', saldoAwal: 15000000, saldoSaatIni: 24850000 },
  { id: 'kas-2', kode: 'BNI-OP', nama: 'Rekening Bank BNI Operasional', saldoAwal: 50000000, saldoSaatIni: 68400000 },
  { id: 'kas-3', kode: 'MDR-PPDB', nama: 'Kas Penerimaan PPDB Mandiri', saldoAwal: 5000000, saldoSaatIni: 14250000 },
  { id: 'kas-4', kode: 'KAS-KCL', nama: 'Kas Kecil Kantor TU', saldoAwal: 2000000, saldoSaatIni: 1450000 },
];

export const initialPembayaran: Pembayaran[] = [
  {
    id: 'pby-1',
    noNota: 'TB-BYR-20260308-001',
    tagihanId: 'tag-1',
    siswaId: 'sis-1',
    tglBayar: '2026-03-08',
    nominalBayar: 300000,
    metode: 'Tunai',
    statusVerifikasi: 'Terverifikasi',
    kasAkunId: 'kas-1',
    catatan: 'Pelunasan SPP Maret (Potongan Prestasi Rp 50.000)',
    petugasId: 'ptg-2',
  },
  {
    id: 'pby-2',
    noNota: 'TB-BYR-20260308-002',
    tagihanId: 'tag-4',
    siswaId: 'sis-2',
    tglBayar: '2026-03-08',
    nominalBayar: 350000,
    metode: 'Transfer Bank',
    statusVerifikasi: 'Terverifikasi',
    buktiTransferUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&auto=format&fit=crop',
    kasAkunId: 'kas-2',
    catatan: 'Transfer via BNI Mobile Banking',
    petugasId: 'ptg-2',
  },
  {
    id: 'pby-3',
    noNota: 'TB-BYR-20260309-003',
    tagihanId: 'tag-5',
    siswaId: 'sis-2',
    tglBayar: '2026-03-09',
    nominalBayar: 150000,
    metode: 'Tunai',
    statusVerifikasi: 'Terverifikasi',
    kasAkunId: 'kas-1',
    catatan: 'Pembayaran Sebagian (Cicilan ke-1 SPP April)',
    petugasId: 'ptg-2',
  },
];

export const initialTransaksi: Transaksi[] = [
  {
    id: 'trx-1',
    noReferensi: 'TB-BYR-20260308-001',
    jenis: 'Tagihan',
    arah: 'Masuk',
    nominal: 300000,
    tanggal: '2026-03-08 10:15',
    keterangan: 'Pembayaran SPP Bulan Maret 2026',
    siswaNama: 'Arya Dimas Prasetyo (X TKJ 1)',
    status: 'Selesai',
    petugas: 'Endang Lestari, S.E.',
  },
  {
    id: 'trx-2',
    noReferensi: 'TB-BYR-20260308-002',
    jenis: 'Tagihan',
    arah: 'Masuk',
    nominal: 350000,
    tanggal: '2026-03-08 11:30',
    keterangan: 'Pembayaran SPP Bulan Maret 2026 Non-Tunai',
    siswaNama: 'Nabila Putri Azzahra (X TKJ 1)',
    status: 'Selesai',
    petugas: 'Endang Lestari, S.E.',
  },
  {
    id: 'trx-3',
    noReferensi: 'TB-TAB-20260308-001',
    jenis: 'Tabungan',
    arah: 'Masuk',
    nominal: 100000,
    tanggal: '2026-03-08 13:00',
    keterangan: 'Setoran Tabungan Mingguan',
    siswaNama: 'Arya Dimas Prasetyo (X TKJ 1)',
    status: 'Selesai',
    petugas: 'Muhammad Ridwan, S.Kom',
  },
  {
    id: 'trx-4',
    noReferensi: 'TB-PPDB-20260307-001',
    jenis: 'PPDB',
    arah: 'Masuk',
    nominal: 250000,
    tanggal: '2026-03-07 09:40',
    keterangan: 'Biaya Pendaftaran Calon Siswa Baru TB-2026-001',
    siswaNama: 'Fauzan Adhitama (Calon Siswa SMK)',
    status: 'Selesai',
    petugas: 'Kapten (Purn) Suryadi',
  },
];

export const initialArusKas: ArusKas[] = [
  {
    id: 'kas-m-1',
    noTransaksi: 'KAS-IN-20260308-01',
    tgl: '2026-03-08',
    tipe: 'Masuk',
    kategori: 'Penerimaan Tagihan Siswa',
    akunKasId: 'kas-1',
    nominal: 300000,
    deskripsi: 'Input Otomatis Pembayaran Nota TB-BYR-20260308-001 (Arya Dimas)',
    noReferensi: 'TB-BYR-20260308-001',
  },
  {
    id: 'kas-m-2',
    noTransaksi: 'KAS-IN-20260308-02',
    tgl: '2026-03-08',
    tipe: 'Masuk',
    kategori: 'Penerimaan Tagihan Non-Tunai BNI',
    akunKasId: 'kas-2',
    nominal: 350000,
    deskripsi: 'Input Otomatis Pembayaran Nota TB-BYR-20260308-002 (Nabila Putri)',
    noReferensi: 'TB-BYR-20260308-002',
  },
  {
    id: 'kas-k-1',
    noTransaksi: 'KAS-OUT-20260307-01',
    tgl: '2026-03-07',
    tipe: 'Keluar',
    kategori: 'Operasional TU & ATK',
    akunKasId: 'kas-4',
    nominal: 550000,
    deskripsi: 'Pembelian Kertas F4, Tinta Printer Epson, dan Map Raport',
    noReferensi: 'NOTA-ATK-881',
  },
  {
    id: 'kas-k-2',
    noTransaksi: 'KAS-OUT-20260306-01',
    tgl: '2026-03-06',
    tipe: 'Keluar',
    kategori: 'Pemeliharaan Sarana & Prasarana',
    akunKasId: 'kas-1',
    nominal: 1200000,
    deskripsi: 'Perbaikan Router Mikrotik Lab Komputer & Kabel Jaringan',
    noReferensi: 'KWT-LAB-04',
  },
];

export const initialTabungan: TabunganSiswa[] = [
  {
    id: 'tab-1',
    noTransaksi: 'TB-TAB-20260301-01',
    siswaId: 'sis-1',
    tipe: 'Setor',
    nominal: 150000,
    saldoSebelum: 300000,
    saldoSesudah: 450000,
    tanggal: '2026-03-01 08:30',
    keterangan: 'Setoran Awal Bulan',
    petugas: 'Endang Lestari, S.E.',
  },
  {
    id: 'tab-2',
    noTransaksi: 'TB-TAB-20260305-02',
    siswaId: 'sis-1',
    tipe: 'Tarik',
    nominal: 50000,
    saldoSebelum: 450000,
    saldoSesudah: 400000,
    tanggal: '2026-03-05 12:15',
    keterangan: 'Penarikan E-Kantin Belanja Siang',
    petugas: 'Siti Aminah, M.Pd.',
  },
  {
    id: 'tab-3',
    noTransaksi: 'TB-TAB-20260308-03',
    siswaId: 'sis-1',
    tipe: 'Setor',
    nominal: 50000,
    saldoSebelum: 400000,
    saldoSesudah: 450000,
    tanggal: '2026-03-08 09:00',
    keterangan: 'Setoran Kas Tabungan Siswa',
    petugas: 'Muhammad Ridwan, S.Kom',
  },
  {
    id: 'tab-4',
    noTransaksi: 'TB-TAB-20260303-01',
    siswaId: 'sis-2',
    tipe: 'Setor',
    nominal: 200000,
    saldoSebelum: 520000,
    saldoSesudah: 720000,
    tanggal: '2026-03-03 10:00',
    keterangan: 'Setoran Uang Saku Tabungan',
    petugas: 'Endang Lestari, S.E.',
  },
];

export const initialPPDB: PendaftarPPDB[] = [
  {
    id: 'ppdb-1',
    noPendaftaran: 'PPDB-TB-2026-001',
    nama: 'Fauzan Adhitama Nugraha',
    nik: '3201123456780001',
    nisn: '0089123456',
    unitId: 'unit-1',
    jurusanPilihan: 'Teknik Komputer & Jaringan (TKJ)',
    jalurPendaftaran: 'Jalur Prestasi Akademik',
    asalSekolah: 'SMP Negeri 1 Taruna Cibinong',
    namaOrtu: 'Kol. Inf. Nugraha Wibowo',
    noHpOrtu: '081288997766',
    pekerjaanOrtu: 'TNI / POLRI',
    penghasilanOrtu: 'Rp 5.000.000 - Rp 10.000.000',
    pendidikanOrtu: 'S1 / Sarjana',
    statusPendaftaran: 'Lulus Seleksi',
    tglDaftar: '2026-03-02',
    biayaPendaftaran: 250000,
    biayaDaftarUlang: 2500000,
    statusBiayaPendaftaran: 'Lunas',
    statusBiayaDaftarUlang: 'Belum Lunas',
    berkas: {
      ijazah: { status: 'Lengkap', catatan: 'SKL Asli Legalisir' },
      kartuKeluarga: { status: 'Lengkap', catatan: 'KK barcode valid' },
      aktaKelahiran: { status: 'Lengkap' },
      pasFoto: { status: 'Lengkap', catatan: 'Latar Merah 3x4' },
      rapor: { status: 'Lengkap', catatan: 'Rata-rata 88.5' },
    },
  },
  {
    id: 'ppdb-2',
    noPendaftaran: 'PPDB-TB-2026-002',
    nama: 'Salsabila Khairunnisa',
    nik: '3201987654320002',
    nisn: '0087654321',
    unitId: 'unit-1',
    jurusanPilihan: 'Rekayasa Perangkat Lunak (RPL)',
    jalurPendaftaran: 'Jalur Reguler / Umum',
    asalSekolah: 'SMP IT Bina Bangsa',
    namaOrtu: 'Lukman Hakim, S.T.',
    noHpOrtu: '085712345678',
    pekerjaanOrtu: 'Karyawan Swasta / BUMN',
    penghasilanOrtu: 'Rp 10.000.000 - Rp 20.000.000',
    pendidikanOrtu: 'S2 / Magister',
    statusPendaftaran: 'Terverifikasi',
    tglDaftar: '2026-03-05',
    biayaPendaftaran: 250000,
    biayaDaftarUlang: 2500000,
    statusBiayaPendaftaran: 'Lunas',
    statusBiayaDaftarUlang: 'Belum Lunas',
    berkas: {
      ijazah: { status: 'Lengkap' },
      kartuKeluarga: { status: 'Lengkap' },
      aktaKelahiran: { status: 'Lengkap' },
      pasFoto: { status: 'Lengkap' },
      rapor: { status: 'Belum Lengkap', catatan: 'Rapor Semester 5 belum terupload' },
    },
  },
  {
    id: 'ppdb-3',
    noPendaftaran: 'PPDB-TB-2026-003',
    nama: 'Bagus Prakoso',
    nik: '3201445566770003',
    nisn: '0081122334',
    unitId: 'unit-2',
    jurusanPilihan: 'MIPA (Sains & Teknologi)',
    jalurPendaftaran: 'Jalur Afirmasi / KIP',
    asalSekolah: 'SMP Negeri 3 Bogor',
    namaOrtu: 'Suparno',
    noHpOrtu: '087899001122',
    pekerjaanOrtu: 'Wiraswasta / Pedagang',
    penghasilanOrtu: '< Rp 3.000.000',
    pendidikanOrtu: 'SMA / Sederajat',
    statusPendaftaran: 'Draft',
    tglDaftar: '2026-03-07',
    biayaPendaftaran: 250000,
    biayaDaftarUlang: 2000000,
    statusBiayaPendaftaran: 'Belum Lunas',
    statusBiayaDaftarUlang: 'Belum Lunas',
    berkas: {
      ijazah: { status: 'Belum Lengkap' },
      kartuKeluarga: { status: 'Lengkap' },
      aktaKelahiran: { status: 'Lengkap' },
      pasFoto: { status: 'Belum Lengkap' },
      rapor: { status: 'Belum Lengkap' },
    },
  },
];

export const initialPengaturanPPDB: PengaturanPPDB = {
  periodeAktif: 'Gelombang I - Tahun Ajaran 2026/2027',
  biayaPendaftaran: 250000,
  biayaDaftarUlang: 2500000,
  isPendaftaranBuka: true,
  jalurList: ['Jalur Reguler / Umum', 'Jalur Prestasi Akademik & Non-Akademik', 'Jalur Afirmasi / KIP', 'Jalur Putra/Putri Korps TNI-POLRI'],
  jurusanList: ['Teknik Komputer & Jaringan (TKJ)', 'Rekayasa Perangkat Lunak (RPL)', 'Teknik Kendaraan Ringan (TKR)', 'MIPA (Sains & Kepemimpinan)', 'IPS (Sosial & Humaniora)'],
  komponenPekerjaan: ['PNS / ASN', 'TNI / POLRI', 'Karyawan Swasta / BUMN', 'Wiraswasta / Pengusaha', 'Petani / Nelayan / Buruh', 'Lainnya'],
  komponenPenghasilan: ['< Rp 3.000.000', 'Rp 3.000.000 - Rp 5.000.000', 'Rp 5.000.000 - Rp 10.000.000', 'Rp 10.000.000 - Rp 20.000.000', '> Rp 20.000.000'],
  komponenPendidikan: ['SD / Sederajat', 'SMP / Sederajat', 'SMA / SMK Sederajat', 'Diploma (D3/D4)', 'Sarjana (S1)', 'Magister / Doktor (S2/S3)'],
  kontakPanitia: [
    { nama: 'Kapten (Purn) Suryadi', jabatan: 'Ketua Panitia PPDB', noHp: '082133445566' },
    { nama: 'Dewi Sartika, S.Pd', jabatan: 'Sekretaris & Verifikator Berkas', noHp: '087812998811' },
    { nama: 'Endang Lestari, S.E.', jabatan: 'Bendahara PPDB', noHp: '081298765432' },
  ],
  pesanNotifikasi: 'Halo Calon Taruna/i! Terima kasih telah mendaftar di Lembaga Pendidikan Taruna Bangsa. Nomor Pendaftaran Anda: [NO_DAFTAR]. Mohon segera lengkapi berkas dan konfirmasi pembayaran pendaftaran.',
};

export const initialPengaturanAplikasi: PengaturanAplikasi = {
  namaLembaga: 'Lembaga Pendidikan Taruna Bangsa',
  alamat: 'Jl. Pemuda Pendidikan No. 88, Lembah Taruna, Jawa Barat',
  telepon: '(0251) 8876543 / 0812-3456-7890',
  email: 'info@tarunabangsa.sch.id',
  website: 'https://pembiayaan.tarunabangsa.sch.id',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
  warnaTema: '#1E40AF',
  gambarLatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80',
  portalMode: 'CMS',
  sliderImages: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80',
  ],
  formatKwitansi: 'TB-KWT-[TAHUN][BULAN]-[ID]',
  waApiKey: 'TB_GATEWAY_LIVE_998',
  waSenderNo: '081234567890',
  templatePesanTagihan: 'Yth. Bapak/Ibu Wali dari [NAMA_SISWA], kami informasikan tagihan [NAMA_TAGIHAN] sebesar [NOMINAL] jatuh tempo pada [TGL_TEMPO]. Silakan bayar melalui VA/Rekening Taruna Bangsa. Terima kasih.',
  templatePesanPembayaran: 'Alhamdulillah, pembayaran [NAMA_TAGIHAN] atas nama [NAMA_SISWA] sebesar [NOMINAL] telah BERHASIL diterima pada [TANGGAL]. No Nota: [NO_NOTA]. Unduh kwitansi resmi di portal siswa.',
  templatePesanPPDB: 'Selamat [NAMA_PENDAFTAR], berkas PPDB Taruna Bangsa Anda telah berhasil DIVERIFIKASI. Langkah berikutnya silakan lakukan konfirmasi daftar ulang.',
};

export const initialBerita: BeritaArtikel[] = [
  {
    id: 'brt-1',
    judul: 'Sosialisasi Sistem Pembayaran Digital & E-Kantin Taruna Bangsa',
    ringkasan: 'Yayasan Taruna Bangsa resmi meluncurkan integrasi dompet digital dan QR Tabungan untuk transaksi kantin dan SPP.',
    konten: 'Dalam rangka mewujudkan ekosistem sekolah modern yang transparan dan akuntabel, Taruna Bangsa menghadirkan portal keuangan digital. Seluruh pembayaran SPP, uang gedung, hingga transaksi saku di kantin sekolah kini dapat dipantau langsung oleh wali murid melalui smartphone secara real-time.',
    kategori: 'Keuangan & Sistem',
    tgl: '2026-03-01',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80',
    author: 'Tim Humas Taruna Bangsa',
  },
  {
    id: 'brt-2',
    judul: 'Prestasi Juara 1 LKS Tingkat Provinsi Bidang IT Network Systems',
    ringkasan: 'Taruna SMK Taruna Bangsa kembali mengukir prestasi gemilang membanggakan daerah di kancah provinsi.',
    konten: 'Tim delegasi SMK Taruna Bangsa berhasil meraih Medali Emas pada Lomba Kompetensi Siswa (LKS) Kejuruan bidang Network Administration. Hal ini membuktikan kurikulum disiplin dan fasilitas laboratorium canggih mampu mencetak generasi taruna unggulan.',
    kategori: 'Prestasi Siswa',
    tgl: '2026-02-25',
    coverUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    author: 'Staf Pengajar',
  },
];

export const initialPengumuman: Pengumuman[] = [
  {
    id: 'pgm-1',
    judul: 'Batas Akhir Pelunasan SPP Bulan Maret 2026',
    isi: 'Diberitahukan kepada seluruh siswa dan wali murid, batas akhir pelunasan SPP Maret adalah tanggal 10 Maret 2026. Mohon cek portal siswa untuk rincian tagihan.',
    target: 'Semua',
    tgl: '2026-03-02',
    kirimWhatsApp: true,
  },
  {
    id: 'pgm-2',
    judul: 'Jadwal Tes Seleksi Fisik dan Akademik PPDB Gelombang 1',
    isi: 'Bagi seluruh calon peserta didik baru yang telah terverifikasi, tes seleksi fisik, postur tubuh, dan tes potensi akademik akan dilaksanakan Sabtu, 14 Maret 2026 pukul 07.30 WIB di Lapangan Utama.',
    target: 'PPDB',
    tgl: '2026-03-06',
    kirimWhatsApp: true,
  },
];

export const initialLogs: LogAktivitas[] = [
  {
    id: 'log-1',
    waktu: '2026-03-08 14:10:00',
    user: 'admin (Muhammad Ridwan)',
    aksi: 'LOGIN',
    modul: 'Autentikasi',
    keterangan: 'Masuk ke sistem kontrol petugas',
  },
  {
    id: 'log-2',
    waktu: '2026-03-08 11:30:22',
    user: 'keuangan (Endang Lestari)',
    aksi: 'VERIFIKASI_PEMBAYARAN',
    modul: 'Pembayaran',
    keterangan: 'Verifikasi transfer SPP Maret Nabila Putri Rp 350.000',
  },
  {
    id: 'log-3',
    waktu: '2026-03-08 09:12:05',
    user: 'keuangan (Endang Lestari)',
    aksi: 'TRANSAKSI_TABUNGAN',
    modul: 'Tabungan',
    keterangan: 'Setoran tabungan Arya Dimas Rp 50.000',
  },
  {
    id: 'log-4',
    waktu: '2026-03-07 16:45:00',
    user: 'panitia.ppdb (Kapten Suryadi)',
    aksi: 'VERIFIKASI_BERKAS',
    modul: 'PPDB',
    keterangan: 'Verifikasi berkas calon taruna Fauzan Adhitama (Lulus Seleksi)',
  },
];

// Local Storage Keys
const STORAGE_PREFIX = 'taruna_bangsa_';

export class AppStorageService {
  private static getItem<T>(key: string, defaultData: T): T {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultData;
    } catch {
      return defaultData;
    }
  }

  private static setItem<T>(key: string, data: T): void {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  // Getters
  static getPetugas(): Petugas[] { return this.getItem('petugas', initialPetugas); }
  static getUnits(): UnitJenjang[] { return this.getItem('units', initialUnits); }
  static getTahunAjaran(): TahunAjaran[] { return this.getItem('tahun_ajaran', initialTahunAjaran); }
  static getKelas(): Kelas[] { return this.getItem('kelas', initialKelas); }
  static getSiswa(): Siswa[] { return this.getItem('siswa', initialSiswa); }
  static getAkunSiswa(): AkunSiswa[] { return this.getItem('akun_siswa', initialAkunSiswa); }
  static getKategoriTagihan(): KategoriTagihan[] { return this.getItem('kategori_tagihan', initialKategoriTagihan); }
  static getRekening(): RekeningPembayaran[] { return this.getItem('rekening', initialRekening); }
  static getTagihan(): Tagihan[] { return this.getItem('tagihan', initialTagihan); }
  static getPembayaran(): Pembayaran[] { return this.getItem('pembayaran', initialPembayaran); }
  static getTransaksi(): Transaksi[] { return this.getItem('transaksi', initialTransaksi); }
  static getAkunKas(): AkunKas[] { return this.getItem('akun_kas', initialAkunKas); }
  static getArusKas(): ArusKas[] { return this.getItem('arus_kas', initialArusKas); }
  static getTabungan(): TabunganSiswa[] { return this.getItem('tabungan', initialTabungan); }
  static getPPDB(): PendaftarPPDB[] { return this.getItem('ppdb', initialPPDB); }
  static getPendaftarPPDB(): PendaftarPPDB[] { return this.getPPDB(); }
  static getPengaturanPPDB(): PengaturanPPDB { return this.getItem('pengaturan_ppdb', initialPengaturanPPDB); }
  static getPengaturan(): PengaturanAplikasi { return this.getItem('pengaturan', initialPengaturanAplikasi); }
  static getPengaturanSingle(): PengaturanAplikasi { return this.getItem('pengaturan', initialPengaturanAplikasi); }
  static getBerita(): BeritaArtikel[] { return this.getItem('berita', initialBerita); }
  static getPengumuman(): Pengumuman[] { return this.getItem('pengumuman', initialPengumuman); }
  static getLogs(): LogAktivitas[] { return this.getItem('logs', initialLogs); }

  // Setters
  static savePetugas(data: Petugas[]) { this.setItem('petugas', data); }
  static saveUnits(data: UnitJenjang[]) { this.setItem('units', data); }
  static saveTahunAjaran(data: TahunAjaran[]) { this.setItem('tahun_ajaran', data); }
  static saveKelas(data: Kelas[]) { this.setItem('kelas', data); }
  static saveSiswa(data: Siswa[]) { this.setItem('siswa', data); }
  static saveAkunSiswa(data: AkunSiswa[]) { this.setItem('akun_siswa', data); }
  static saveKategoriTagihan(data: KategoriTagihan[]) { this.setItem('kategori_tagihan', data); }
  static saveRekening(data: RekeningPembayaran[]) { this.setItem('rekening', data); }
  static saveTagihan(data: Tagihan[]) { this.setItem('tagihan', data); }
  static savePembayaran(data: Pembayaran[]) { this.setItem('pembayaran', data); }
  static saveTransaksi(data: Transaksi[]) { this.setItem('transaksi', data); }
  static saveAkunKas(data: AkunKas[]) { this.setItem('akun_kas', data); }
  static saveArusKas(data: ArusKas[]) { this.setItem('arus_kas', data); }
  static saveTabungan(data: TabunganSiswa[]) { this.setItem('tabungan', data); }
  static savePPDB(data: PendaftarPPDB[]) { this.setItem('ppdb', data); }
  static savePendaftarPPDB(data: PendaftarPPDB[]) { this.savePPDB(data); }
  static savePengaturanPPDB(data: PengaturanPPDB) { this.setItem('pengaturan_ppdb', data); }
  static savePengaturan(data: PengaturanAplikasi) { this.setItem('pengaturan', data); }
  static saveBerita(data: BeritaArtikel[]) { this.setItem('berita', data); }
  static savePengumuman(data: Pengumuman[]) { this.setItem('pengumuman', data); }
  static addLog(aksi: string, modul: string, keterangan: string, user: string = 'Petugas') {
    const logs = this.getLogs();
    const newLog: LogAktivitas = {
      id: 'log-' + Date.now(),
      waktu: new Date().toLocaleString('id-ID'),
      user,
      aksi,
      modul,
      keterangan,
    };
    this.setItem('logs', [newLog, ...logs.slice(0, 199)]);
  }

  // Reset to default seed
  static resetAllData() {
    localStorage.clear();
    this.setItem('petugas', initialPetugas);
    this.setItem('units', initialUnits);
    this.setItem('tahun_ajaran', initialTahunAjaran);
    this.setItem('kelas', initialKelas);
    this.setItem('siswa', initialSiswa);
    this.setItem('akun_siswa', initialAkunSiswa);
    this.setItem('kategori_tagihan', initialKategoriTagihan);
    this.setItem('rekening', initialRekening);
    this.setItem('tagihan', initialTagihan);
    this.setItem('pembayaran', initialPembayaran);
    this.setItem('transaksi', initialTransaksi);
    this.setItem('akun_kas', initialAkunKas);
    this.setItem('arus_kas', initialArusKas);
    this.setItem('tabungan', initialTabungan);
    this.setItem('ppdb', initialPPDB);
    this.setItem('pengaturan_ppdb', initialPengaturanPPDB);
    this.setItem('pengaturan', initialPengaturanAplikasi);
    this.setItem('berita', initialBerita);
    this.setItem('pengumuman', initialPengumuman);
    this.setItem('logs', initialLogs);
  }

  // Automation: Generate Tagihan Siswa Otomatis (Bulk)
  static generateTagihanBulk(params: {
    kategoriId: string;
    namaTagihan: string;
    nominal: number;
    periodeBulan: string;
    tglJatuhTempo: string;
    targetType: 'semua' | 'unit' | 'kelas';
    targetId?: string;
  }): number {
    const siswaList = this.getSiswa();
    const currentTagihan = this.getTagihan();
    const activeTA = this.getTahunAjaran().find(ta => ta.isAktif) || initialTahunAjaran[0];

    let filteredSiswa = siswaList.filter(s => s.status === 'Aktif');
    if (params.targetType === 'unit' && params.targetId) {
      filteredSiswa = filteredSiswa.filter(s => s.unitId === params.targetId);
    } else if (params.targetType === 'kelas' && params.targetId) {
      filteredSiswa = filteredSiswa.filter(s => s.kelasId === params.targetId);
    }

    const newBills: Tagihan[] = [];
    filteredSiswa.forEach(siswa => {
      // Check if duplicate already exists for this student & period
      const exists = currentTagihan.some(
        t => t.siswaId === siswa.id && t.kategoriId === params.kategoriId && t.periodeBulan === params.periodeBulan
      );
      if (!exists) {
        newBills.push({
          id: 'tag-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          siswaId: siswa.id,
          kategoriId: params.kategoriId,
          namaTagihan: params.namaTagihan,
          nominal: params.nominal,
          potongan: 0,
          terbayar: 0,
          sisaTagihan: params.nominal,
          status: 'Belum Lunas',
          tglJatuhTempo: params.tglJatuhTempo,
          periodeBulan: params.periodeBulan,
          tahunAjaranId: activeTA.id,
        });
      }
    });

    if (newBills.length > 0) {
      this.saveTagihan([...newBills, ...currentTagihan]);
      this.addLog('GENERATE_TAGIHAN_OTOMATIS', 'Tagihan', `Membuat ${newBills.length} tagihan baru untuk ${params.namaTagihan}`);
    }
    return newBills.length;
  }

  // Automation: Generate Akun Siswa Otomatis
  static generateAkunSiswaOtomatis(): number {
    const siswaList = this.getSiswa();
    const currentAkun = this.getAkunSiswa();
    const newAccounts: AkunSiswa[] = [];

    siswaList.forEach(siswa => {
      const exists = currentAkun.some(a => a.siswaId === siswa.id);
      if (!exists) {
        newAccounts.push({
          id: 'akn-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
          siswaId: siswa.id,
          username: siswa.nisn || siswa.nis,
          passwordDefault: 'TB' + (siswa.nisn.slice(-4) || '1234'),
          status: 'Aktif',
        });
      }
    });

    if (newAccounts.length > 0) {
      this.saveAkunSiswa([...currentAkun, ...newAccounts]);
      this.addLog('GENERATE_AKUN_OTOMATIS', 'Akun Siswa', `Membuat ${newAccounts.length} akun siswa otomatis`);
    }
    return newAccounts.length;
  }

  // Automation: Kenaikan Kelas / Pindah Kelas
  static prosesKenaikanKelas(siswaIds: string[], targetKelasId: string, status: 'Naik' | 'Lulus' | 'Pindah'): number {
    const siswaList = this.getSiswa();
    let updatedCount = 0;

    const updated = siswaList.map(s => {
      if (siswaIds.includes(s.id)) {
        updatedCount++;
        if (status === 'Lulus') {
          return { ...s, status: 'Lulus' as const };
        } else if (status === 'Pindah') {
          return { ...s, status: 'Pindah' as const };
        } else {
          return { ...s, kelasId: targetKelasId };
        }
      }
      return s;
    });

    this.saveSiswa(updated);
    this.addLog('PROSES_KENAIKAN_KELAS', 'Siswa', `Memproses ${updatedCount} siswa ke status ${status}`);
    return updatedCount;
  }

  // Automation: Sinkronkan PPDB ke Data Siswa
  static sinkronPPDBkeSiswa(pendaftarId: string, targetKelasId: string): boolean {
    const ppdbList = this.getPPDB();
    const siswaList = this.getSiswa();
    const target = ppdbList.find(p => p.id === pendaftarId);
    if (!target) return false;

    const newNis = '2627' + Math.floor(1000 + Math.random() * 9000);
    const newSiswa: Siswa = {
      id: 'sis-' + Date.now(),
      nisn: target.nisn || '009' + Math.floor(1000000 + Math.random() * 9000000),
      nis: newNis,
      nama: target.nama,
      unitId: target.unitId,
      kelasId: targetKelasId,
      jenisKelamin: 'L',
      tempatLahir: 'Indonesia',
      tglLahir: '2010-01-01',
      namaWali: target.namaOrtu,
      noHpWali: target.noHpOrtu,
      alamat: 'Asal: ' + target.asalSekolah,
      saldoTabungan: 0,
      virtualAccount: '880' + (target.nisn || newNis),
      status: 'Aktif',
    };

    // Update PPDB Status
    const updatedPPDB = ppdbList.map(p => p.id === pendaftarId ? { ...p, statusPendaftaran: 'Sinkron Siswa' as const } : p);

    this.savePPDB(updatedPPDB);
    this.saveSiswa([newSiswa, ...siswaList]);
    this.generateAkunSiswaOtomatis();
    this.addLog('SINKRON_PPDB_SISWA', 'PPDB', `Menyinkronkan calon siswa ${target.nama} ke Master Siswa dengan NIS ${newNis}`);
    return true;
  }

  // Excel Exporter
  static exportToExcel(data: Record<string, any>[], fileName: string, sheetName: string = 'Sheet1') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  // Excel Importer
  static importFromExcel(file: File, callback: (data: any[]) => void) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        callback(json);
      } catch (err) {
        console.error('Failed to parse excel file:', err);
        alert('Gagal membaca file Excel. Pastikan format file .xlsx atau .xls valid.');
      }
    };
    reader.readAsBinaryString(file);
  }

  // WhatsApp Link Helper
  static generateWhatsAppLink(phoneNumber: string, message: string): string {
    let cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  // Generate Blogger XML Template
  static generateBloggerXmlTemplate(appUrl: string, schoolName: string): string {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html b:css='false' b:defaultwidgetversion='2' b:layoutsversion='3' xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
  <head>
    <meta charset='UTF-8'/>
    <meta content='width=device-width, initial-scale=1.0' name='viewport'/>
    <title><data:blog.pageTitle/> - ${schoolName}</title>
    <b:skin><![CDATA[
      /* ========================================================
       * TEMA BLOGGER XML: PEMBIAYAAN TARUNA BANGSA DIGITAL
       * Integrasi Cloud Firestore & Digital Financial System
       * ======================================================== */
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: #0f172a;
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }
      #taruna-bangsa-frame {
        width: 100%;
        height: 100vh;
        border: none;
        display: block;
      }
      .blogger-hidden-widgets {
        display: none !important;
      }
    ]]></b:skin>
    <link href='https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&amp;display=swap' rel='stylesheet'/>
  </head>
  <body>
    <!-- Kontainer Aplikasi Pembiayaan Taruna Bangsa -->
    <iframe id='taruna-bangsa-frame' src='${appUrl}' allow='fullscreen; camera; payment; clipboard-write'></iframe>

    <!-- Bagian Widget Standar Blogger (Wajib XML Valid) -->
    <div class='blogger-hidden-widgets'>
      <b:section id='main' maxwidgets='1' showaddelement='no'>
        <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog' version='2'>
          <b:includable id='main'>
            <div class='blog-posts'>
              <!-- App Embedded in Blogger Section -->
            </div>
          </b:includable>
        </b:widget>
      </b:section>
    </div>

    <script type='text/javascript'>
      //<![CDATA[
      console.log('Pembiayaan Taruna Bangsa Blogger XML Portal running with Cloud Firestore integration.');
      //]]>
    </script>
  </body>
</html>`;
  }
}
