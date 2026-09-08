import React, { useState } from 'react';
import {
  Settings,
  Building,
  Palette,
  Layout,
  Cpu,
  Bell,
  Check,
  Save,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { PengaturanAplikasi } from '../../types';

interface PengaturanTabProps {
  pengaturan: PengaturanAplikasi;
  onSavePengaturan: (data: PengaturanAplikasi) => void;
}

type SubPengaturan = 'umum' | 'tampilan' | 'portal' | 'sistem' | 'notifikasi';

export const PengaturanTab: React.FC<PengaturanTabProps> = ({
  pengaturan,
  onSavePengaturan,
}) => {
  const [activeSub, setActiveSub] = useState<SubPengaturan>('umum');
  const [formData, setFormData] = useState<PengaturanAplikasi>(pengaturan);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePengaturan(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Sub Menu Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'umum', label: '1. Pengaturan Umum', icon: Building },
          { id: 'tampilan', label: '2. Tampilan & Tema', icon: Palette },
          { id: 'portal', label: '3. Portal & Slider', icon: Layout },
          { id: 'sistem', label: '4. Pengaturan Sistem & Kwitansi', icon: Cpu },
          { id: 'notifikasi', label: '5. Notifikasi & WhatsApp Blast', icon: Bell },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSub(item.id as SubPengaturan)}
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

      {/* Main Settings Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-3xl space-y-5 text-xs">
        
        {/* 1. UMUM */}
        {activeSub === 'umum' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Pengaturan Identitas Lembaga Pendidikan
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Nama Lembaga / Sekolah</label>
                <input
                  type="text"
                  required
                  value={formData.namaLembaga}
                  onChange={(e) => setFormData({ ...formData, namaLembaga: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.alamatLembaga}
                  onChange={(e) => setFormData({ ...formData, alamatLembaga: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. Telepon Sekolah</label>
                <input
                  type="text"
                  value={formData.noTelepon}
                  onChange={(e) => setFormData({ ...formData, noTelepon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Resmi Sekolah</label>
                <input
                  type="text"
                  value={formData.noWhatsApp}
                  onChange={(e) => setFormData({ ...formData, noWhatsApp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Website Resmi</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. TAMPILAN */}
        {activeSub === 'tampilan' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Pengaturan Tampilan &amp; Estetika Finology
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warna Aksen Utama</label>
                <input
                  type="color"
                  value={formData.temaWarna}
                  onChange={(e) => setFormData({ ...formData, temaWarna: e.target.value })}
                  className="w-full h-10 border border-slate-300 rounded-lg p-1 cursor-pointer"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Background Portal</label>
                <select className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs">
                  <option>Finology Dark Gradient (Navy Slate)</option>
                  <option>Clean Modern Light</option>
                  <option>Corporate Blue Minimalist</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3. PORTAL */}
        {activeSub === 'portal' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Pengaturan Portal Statik &amp; Slider Beranda
            </h4>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teks Slider Utama Portal</label>
              <input
                type="text"
                defaultValue="Selamat Datang di Pembiayaan Taruna Bangsa - Transparansi & Kemudahan Keuangan Sekolah"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sub-judul Pengantar</label>
              <textarea
                rows={2}
                defaultValue="Cek tagihan SPP bulanan, pembayaran non-tunai, mutasi tabungan digital E-Kantin, dan pendaftaran siswa baru online."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        {/* 4. SISTEM */}
        {activeSub === 'sistem' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Pengaturan Sistem Keuangan &amp; Format Kwitansi
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Format Header Kwitansi</label>
                <input
                  type="text"
                  value={formData.headerKwitansi}
                  onChange={(e) => setFormData({ ...formData, headerKwitansi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ukuran Cetak Default</label>
                <select
                  value={formData.ukuranKertasKwitansi}
                  onChange={(e) => setFormData({ ...formData, ukuranKertasKwitansi: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="Thermal 80mm">Thermal Kasir 80mm (Struk Kecil)</option>
                  <option value="A4">A4 Standar / Invoice Formal</option>
                  <option value="A5">A5 Lanskap</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Catatan Kaki (Footer) Kwitansi</label>
                <input
                  type="text"
                  value={formData.footerKwitansi}
                  onChange={(e) => setFormData({ ...formData, footerKwitansi: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* 5. NOTIFIKASI */}
        {activeSub === 'notifikasi' && (
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Pengaturan Notifikasi &amp; Template Pesan WhatsApp
            </h4>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>Pesan otomatis disiapkan untuk dikirim ke nomor WhatsApp wali murid atau siswa.</span>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Template WhatsApp Pengingat Tagihan SPP</label>
              <textarea
                rows={3}
                value={formData.templateWhatsAppTagihan}
                onChange={(e) => setFormData({ ...formData, templateWhatsAppTagihan: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Variabel tersedia: [NAMA], [TAGIHAN], [NOMINAL], [TEMPO]</p>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Template WhatsApp Konfirmasi Pembayaran Sukses</label>
              <textarea
                rows={3}
                value={formData.templateWhatsAppPembayaran}
                onChange={(e) => setFormData({ ...formData, templateWhatsAppPembayaran: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">Variabel tersedia: [NAMA], [NOTA], [NOMINAL], [TANGGAL]</p>
            </div>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          {isSaved ? (
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-4 h-4" /> Pengaturan berhasil disimpan!
            </span>
          ) : (
            <span className="text-slate-400">Pastikan seluruh data lembaga terisi dengan benar.</span>
          )}

          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>

      </form>
    </div>
  );
};
