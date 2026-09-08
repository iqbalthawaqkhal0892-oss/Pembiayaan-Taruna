import React, { useState } from 'react';
import { Code, Copy, Check, Download, Database, ShieldAlert, Sparkles, X, ExternalLink } from 'lucide-react';
import { AppStorageService } from '../services/storage';
import { PengaturanAplikasi } from '../types';

interface BloggerXmlModalProps {
  isOpen: boolean;
  onClose: () => void;
  pengaturan: PengaturanAplikasi;
  onSavePengaturan: (pengaturan: PengaturanAplikasi) => void;
}

export const BloggerXmlModal: React.FC<BloggerXmlModalProps> = ({
  isOpen,
  onClose,
  pengaturan,
  onSavePengaturan,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'xml' | 'firestore'>('xml');
  const [firebaseConfig, setFirebaseConfig] = useState(
    pengaturan.firebaseConfig || {
      apiKey: 'AIzaSyA8890_TB_DEMO_KEY_CLOUD_FIRESTORE',
      authDomain: 'taruna-bangsa-keuangan.firebaseapp.com',
      projectId: 'taruna-bangsa-keuangan',
      storageBucket: 'taruna-bangsa-keuangan.appspot.com',
      messagingSenderId: '528508716300',
      appId: '1:528508716300:web:981273981273',
    }
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.origin || 'https://pembiayaan-taruna-bangsa.web.app';
  const xmlContent = AppStorageService.generateBloggerXmlTemplate(currentUrl, pengaturan.namaLembaga);

  const handleCopy = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tema-pembiayaan-taruna-bangsa.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveFirebase = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...pengaturan, firebaseConfig };
    onSavePengaturan(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>Blogger XML &amp; Firebase Cloud Firestore</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-orange-500/20 text-orange-300 font-normal">
                  Blogger Ready
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Template XML Blogger valid terintegrasi Cloud Firestore tanpa Realtime DB, Cloud Functions &amp; Storage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5">
          <button
            onClick={() => setActiveTab('xml')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'xml'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Ekspor Tema Blogger XML</span>
          </button>
          <button
            onClick={() => setActiveTab('firestore')}
            className={`py-3 px-4 font-semibold text-sm border-b-2 flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'firestore'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Konfigurasi Firebase Cloud Firestore</span>
          </button>
        </div>

        {/* Tab 1: Blogger XML */}
        {activeTab === 'xml' && (
          <div className="p-6 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-amber-950 mb-1">Panduan Memasang di Blogger (Blogspot):</p>
                <ol className="list-decimal list-inside space-y-1 text-amber-800">
                  <li>Unduh file XML di bawah atau salin kode template.</li>
                  <li>Buka dashboard <b>Blogger.com</b> &gt; menu <b>Tema (Theme)</b>.</li>
                  <li>Klik tombol panah di samping 'Sesuaikan' &gt; pilih <b>Pulihkan (Restore)</b> atau <b>Edit HTML</b>.</li>
                  <li>Upload file <code className="bg-amber-100 px-1 py-0.5 rounded">.xml</code> atau timpa seluruh kodenya.</li>
                  <li>Aplikasi Pembiayaan Taruna Bangsa langsung aktif di domain Blogspot Anda!</li>
                </ol>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Kode Template XML Blogger (Valid b:skin &amp; b:section)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Tersalin!' : 'Salin Kode XML'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh File .XML</span>
                </button>
              </div>
            </div>

            <pre className="bg-slate-950 text-slate-200 text-xs p-4 rounded-xl overflow-x-auto max-h-64 font-mono leading-relaxed border border-slate-800">
              <code>{xmlContent}</code>
            </pre>
          </div>
        )}

        {/* Tab 2: Firestore Config */}
        {activeTab === 'firestore' && (
          <form onSubmit={handleSaveFirebase} className="p-6 space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-blue-950 mb-0.5">Arsitektur Cloud Firestore:</p>
                <p className="text-slate-600 leading-relaxed">
                  Sesuai spesifikasi Anda, aplikasi hanya menggunakan <b>Firebase Cloud Firestore Client SDK</b> untuk menyimpan data master, tagihan, pembayaran, kas, tabungan, dan PPDB tanpa menggunakan Realtime Database, Cloud Functions, atau Cloud Storage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">API Key Firebase</label>
                <input
                  type="text"
                  value={firebaseConfig.apiKey}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, apiKey: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="AIzaSy..."
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project ID</label>
                <input
                  type="text"
                  value={firebaseConfig.projectId}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="taruna-bangsa-keuangan"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={firebaseConfig.authDomain}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, authDomain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="taruna-bangsa.firebaseapp.com"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">App ID</label>
                <input
                  type="text"
                  value={firebaseConfig.appId}
                  onChange={(e) => setFirebaseConfig({ ...firebaseConfig, appId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="1:528508716300:web:..."
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {saveSuccess ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <Check className="w-4 h-4" /> Konfigurasi tersimpan ke sistem lokal!
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Data otomatis tersinkron ke local persistence &amp; Firestore.
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition cursor-pointer shadow-sm"
              >
                Simpan Konfigurasi Firestore
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
