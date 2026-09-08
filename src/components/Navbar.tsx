import React from 'react';
import {
  School,
  Shield,
  GraduationCap,
  FileCheck2,
  Code2,
  RotateCcw,
  User,
  Sparkles,
} from 'lucide-react';
import { PengaturanAplikasi, Petugas } from '../types';

interface NavbarProps {
  currentPortal: 'petugas' | 'siswa' | 'ppdb';
  onSelectPortal: (portal: 'petugas' | 'siswa' | 'ppdb') => void;
  pengaturan: PengaturanAplikasi;
  currentPetugas: Petugas;
  onOpenBloggerXml: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPortal,
  onSelectPortal,
  pengaturan,
  currentPetugas,
  onOpenBloggerXml,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-2 ring-white/10">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white font-['Outfit',sans-serif]">
                  Pembiayaan Taruna Bangsa
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  DIGITAL &amp; FIRESTORE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-xs sm:max-w-none">
                Sistem Keuangan, Tabungan E-Kantin &amp; PPDB Online Terpadu
              </p>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button
              onClick={() => onSelectPortal('petugas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPortal === 'petugas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Portal Petugas</span>
              <span className="md:hidden">Petugas</span>
            </button>

            <button
              onClick={() => onSelectPortal('siswa')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPortal === 'siswa'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Dashboard Siswa / Wali</span>
              <span className="md:hidden">Siswa</span>
            </button>

            <button
              onClick={() => onSelectPortal('ppdb')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                currentPortal === 'ppdb'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">PPDB Mandiri</span>
              <span className="md:hidden">PPDB</span>
            </button>
          </nav>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Blogger XML Tool Button */}
            <button
              onClick={onOpenBloggerXml}
              title="Blogger XML & Cloud Firestore"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Blogger XML</span>
            </button>

            {/* Reset Seed Button */}
            <button
              onClick={onResetData}
              title="Reset Data Contoh"
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* User Pill */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-900/60 border border-blue-500/40 flex items-center justify-center text-blue-300 text-xs font-bold">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left leading-tight hidden lg:block">
                <p className="text-xs font-bold text-slate-200 truncate max-w-28">{currentPetugas.nama}</p>
                <p className="text-[10px] text-blue-400 font-semibold uppercase">{currentPetugas.role}</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
