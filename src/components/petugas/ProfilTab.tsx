import React, { useState } from 'react';
import { User, Lock, Save, Check, ShieldCheck, KeyRound } from 'lucide-react';
import { Petugas } from '../../types';

interface ProfilTabProps {
  currentPetugas: Petugas;
  onUpdateCurrentPetugas: (petugas: Petugas) => void;
}

export const ProfilTab: React.FC<ProfilTabProps> = ({
  currentPetugas,
  onUpdateCurrentPetugas,
}) => {
  const [nama, setNama] = useState(currentPetugas.nama);
  const [email, setEmail] = useState(currentPetugas.email);
  const [noHp, setNoHp] = useState(currentPetugas.noHp);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCurrentPetugas({
      ...currentPetugas,
      nama,
      email,
      noHp,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordBaru || passwordBaru.length < 6) {
      alert('Password baru minimal 6 karakter.');
      return;
    }
    if (passwordBaru !== konfirmasiPassword) {
      alert('Konfirmasi password tidak cocok!');
      return;
    }
    setPwMsg('Kata sandi akun berhasil diperbarui!');
    setPasswordLama('');
    setPasswordBaru('');
    setKonfirmasiPassword('');
    setTimeout(() => setPwMsg(''), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl text-xs">
      {/* Profil Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-base">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">1. Pengaturan Detail Profil Akun</h4>
            <p className="text-[11px] text-slate-500">Informasi identitas akun petugas yang aktif</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Petugas</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                disabled
                value={currentPetugas.username}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono text-slate-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hak Akses / Role</label>
              <input
                type="text"
                disabled
                value={currentPetugas.role}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-blue-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Resmi</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">No. WhatsApp Aktif</label>
            <input
              type="text"
              required
              value={noHp}
              onChange={(e) => setNoHp(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {isSaved ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Profil tersimpan!
              </span>
            ) : <span />}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-xs"
            >
              Simpan Profil
            </button>
          </div>
        </form>
      </div>

      {/* Password Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-base">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">2. Pengaturan Kata Sandi Akun</h4>
            <p className="text-[11px] text-slate-500">Perbarui kata sandi untuk keamanan akses</p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Saat Ini</label>
            <input
              type="password"
              required
              value={passwordLama}
              onChange={(e) => setPasswordLama(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Kata Sandi Baru (Min. 6 Karakter)</label>
            <input
              type="password"
              required
              value={passwordBaru}
              onChange={(e) => setPasswordBaru(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input
              type="password"
              required
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {pwMsg ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> {pwMsg}
              </span>
            ) : <span />}
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition cursor-pointer shadow-xs"
            >
              Ubah Kata Sandi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
