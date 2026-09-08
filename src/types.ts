export type RolePetugas = 'admin' | 'keuangan' | 'tata_usaha' | 'guru' | 'ppdb';
export type PortalType = 'petugas' | 'siswa' | 'ppdb';

export interface Petugas {
  id: string;
  nama: string;
  email: string;
  username: string;
  role: RolePetugas;
  noHp: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface UnitJenjang {
  id: string;
  kode: string;
  nama: string;
  deskripsi: string;
}

export interface TahunAjaran {
  id: string;
  nama: string;
  semester: 'Ganjil' | 'Genap';
  isAktif: boolean;
}

export interface Kelas {
  id: string;
  unitId: string;
  nama: string;
  tingkat: string;
  waliKelas: string;
  kapasitas: number;
}

export interface Siswa {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  unitId: string;
  kelasId: string;
  jenisKelamin: 'L' | 'P';
  tempatLahir: string;
  tglLahir: string;
  namaWali: string;
  noHpWali: string;
  alamat: string;
  saldoTabungan: number;
  virtualAccount: string;
  status: 'Aktif' | 'Lulus' | 'Pindah';
}

export interface AkunSiswa {
  id: string;
  siswaId: string;
  username: string;
  passwordDefault: string;
  status: 'Aktif' | 'Nonaktif';
}

export interface KategoriTagihan {
  id: string;
  kode: string;
  nama: string;
  tipe: 'Bulanan' | 'Sekali' | 'Kustom';
  nominalDefault: number;
  unitId: string;
}

export interface RekeningPembayaran {
  id: string;
  bank: string;
  noRekening: string;
  atasNama: string;
  isAktif: boolean;
}

export interface Tagihan {
  id: string;
  siswaId: string;
  kategoriId: string;
  namaTagihan: string;
  nominal: number;
  potongan: number;
  terbayar: number;
  sisaTagihan: number;
  status: 'Lunas' | 'Belum Lunas' | 'Sebagian';
  tglJatuhTempo: string;
  periodeBulan: string;
  tahunAjaranId: string;
  keterangan?: string;
}

export interface Pembayaran {
  id: string;
  noNota: string;
  tagihanId: string;
  siswaId: string;
  tglBayar: string;
  nominalBayar: number;
  metode: 'Tunai' | 'Transfer Bank' | 'E-Wallet';
  statusVerifikasi: 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditolak';
  buktiTransferUrl?: string;
  kasAkunId: string;
  catatan?: string;
  petugasId: string;
}

export interface Transaksi {
  id: string;
  noReferensi: string;
  jenis: 'Tagihan' | 'Tabungan' | 'PPDB';
  arah: 'Masuk' | 'Keluar';
  nominal: number;
  tanggal: string;
  keterangan: string;
  siswaNama?: string;
  status: 'Selesai' | 'Dibatalkan';
  petugas: string;
}

export interface AkunKas {
  id: string;
  kode?: string;
  nama: string;
  saldoAwal: number;
  saldoSaatIni: number;
  tipe?: string;
  noRekening?: string;
}

export interface ArusKas {
  id: string;
  noTransaksi: string;
  tgl: string;
  tipe: 'Masuk' | 'Keluar';
  kategori: string;
  akunKasId: string;
  nominal: number;
  deskripsi: string;
  noReferensi?: string;
}

export interface TabunganSiswa {
  id: string;
  noTransaksi?: string;
  noNota?: string;
  siswaId: string;
  tipe: 'Setor' | 'Tarik';
  nominal: number;
  saldoSebelum?: number;
  saldoSesudah?: number;
  saldoAkhir?: number;
  tanggal?: string;
  tgl?: string;
  keterangan: string;
  petugas?: string;
  petugasId?: string;
}

export type TabunganTransaksi = TabunganSiswa;

export interface BerkasPendaftar {
  status: 'Lengkap' | 'Belum Lengkap' | 'Ditolak';
  catatan?: string;
  fileNama?: string;
}

export interface BiayaItem {
  nominal: number;
  status: 'Lunas' | 'Belum Lunas';
}

export interface PendaftarPPDB {
  id: string;
  noPendaftaran: string;
  nama: string;
  namaLengkap?: string;
  nik?: string;
  nisn: string;
  unitId?: string;
  unitPilihanId?: string;
  jurusanPilihan?: string;
  jalurPendaftaran?: string;
  asalSekolah: string;
  namaOrtu?: string;
  namaWali?: string;
  noHpOrtu?: string;
  noHp?: string;
  pekerjaanOrtu?: string;
  penghasilanOrtu?: string;
  pendidikanOrtu?: string;
  statusPendaftaran?: 'Draft' | 'Terverifikasi' | 'Lulus Seleksi' | 'Ditolak' | 'Sinkron Siswa';
  statusSeleksi?: 'Menunggu Verifikasi' | 'Diterima' | 'Ditolak' | 'Cadangan';
  tglDaftar: string;
  biayaPendaftaran: BiayaItem | number;
  biayaDaftarUlang: BiayaItem | number;
  statusBiayaPendaftaran?: 'Lunas' | 'Belum Lunas';
  statusBiayaDaftarUlang?: 'Lunas' | 'Belum Lunas';
  jenisKelamin?: 'L' | 'P';
  tempatLahir?: string;
  tglLahir?: string;
  alamat?: string;
  berkas?: {
    ijazah?: BerkasPendaftar;
    kartuKeluarga?: BerkasPendaftar;
    aktaKelahiran?: BerkasPendaftar;
    pasFoto?: BerkasPendaftar;
    rapor?: BerkasPendaftar;
  };
}

export interface GelombangPPDB {
  id: string;
  nama: string;
  tglBuka: string;
  tglTutup: string;
  biayaPendaftaran: number;
  biayaDaftarUlang: number;
  kuota: number;
  terisi: number;
  isAktif: boolean;
}

export interface PengaturanPPDB {
  periodeAktif: string;
  biayaPendaftaran: number;
  biayaDaftarUlang: number;
  isPendaftaranBuka: boolean;
  jalurList: string[];
  jurusanList: string[];
  komponenPekerjaan: string[];
  komponenPenghasilan: string[];
  komponenPendidikan: string[];
  kontakPanitia: { nama: string; jabatan: string; noHp: string }[];
  pesanNotifikasi: string;
}

export interface PengaturanAplikasi {
  namaLembaga: string;
  alamat?: string;
  alamatLembaga?: string;
  telepon?: string;
  noTelepon?: string;
  email: string;
  website: string;
  noWhatsApp?: string;
  logoUrl?: string;
  warnaTema?: string;
  temaWarna?: string;
  gambarLatar?: string;
  portalMode?: 'Statik' | 'CMS';
  sliderImages?: string[];
  formatKwitansi?: string;
  headerKwitansi?: string;
  footerKwitansi?: string;
  ukuranKertasKwitansi?: 'Thermal 80mm' | 'A4' | 'A5';
  waApiKey?: string;
  waSenderNo?: string;
  templatePesanTagihan?: string;
  templateWhatsAppTagihan?: string;
  templatePesanPembayaran?: string;
  templateWhatsAppPembayaran?: string;
  templatePesanPPDB?: string;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

export interface BeritaArtikel {
  id: string;
  judul: string;
  ringkasan: string;
  konten: string;
  kategori: string;
  tgl: string;
  coverUrl: string;
  author: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  target: 'Semua' | 'Siswa' | 'Wali Murid' | 'PPDB';
  tgl: string;
  kirimWhatsApp: boolean;
}

export interface LogAktivitas {
  id: string;
  waktu: string;
  user?: string;
  petugasNama?: string;
  aksi: string;
  modul: string;
  keterangan?: string;
  detail?: string;
}
