import React, { useState } from 'react';
import {
  Wrench,
  Newspaper,
  BellRing,
  Send,
  History,
  Code2,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import { LogAktivitas, Tagihan, Siswa, PengaturanAplikasi } from '../../types';
import { AppStorageService } from '../../services/storage';

interface PeralatanTabProps {
  logs: LogAktivitas[];
  tagihanList: Tagihan[];
  siswaList: Siswa[];
  pengaturan: PengaturanAplikasi;
  onOpenBloggerXml: () => void;
}

type SubPeralatan = 'berita' | 'pengumuman' | 'pengingat' | 'log' | 'blogger';

export const PeralatanTab: React.FC<PeralatanTabProps> = ({
  logs,
  tagihanList,
  siswaList,
  pengaturan,
  onOpenBloggerXml,
}) => {
  const [activeSub, setActiveSub] = useState<SubPeralatan>('pengingat');
  
  // Berita CMS State
  const [beritaList, setBeritaList] = useState([
    {
      id: 'news-1',
      judul: 'Penerimaan Peserta Didik Baru (PPDB) Taruna Bangsa Resmi Dibuka',
      tgl: '2026-03-01',
      kategori: 'PPDB',
      ringkasan: 'Pendaftaran gelombang 1 dibuka dengan potongan formulir dan kemudahan cicilan daftar ulang.',
    },
    {
      id: 'news-2',
      judul: 'Peluncuran Kartu Tabungan Digital & Pembayaran E-Kantin Tanpa Tunai',
      tgl: '2026-02-15',
      kategori: 'Finansial',
      ringkasan: 'Seluruh siswa dibekali Kartu Digital Taruna Bangsa untuk jajan di kantin sehat sekolah via QR Code.',
    },
  ]);

  // Pengumuman WA Blast State
  const [pesanPengumuman, setPesanPengumuman] = useState(
    'Diberitahukan kepada seluruh wali murid, Ujian Tengah Semester Genap akan dilaksanakan mulai hari Senin depan. Mohon memperhatikan kelengkapan administrasi putra-putri Anda. Terima kasih.'
  );

  // Send WhatsApp Reminder to Student's Parent
  const handleSendWAReminder = (tagihan: Tagihan) => {
    const siswa = siswaList.find((s) => s.id === tagihan.siswaId);
    if (!siswa || !siswa.noHpWali) {
      alert('Nomor HP wali murid belum terdaftar pada siswa ini.');
      return;
    }
    const cleanPhone = siswa.noHpWali.replace(/\D/g, '');
    const textMsg = pengaturan.templateWhatsAppTagihan
      .replace('[NAMA]', siswa.nama)
      .replace('[TAGIHAN]', tagihan.namaTagihan)
      .replace('[NOMINAL]', 'Rp ' + tagihan.sisaTagihan.toLocaleString('id-ID'))
      .replace('[TEMPO]', tagihan.tglJatuhTempo);

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMsg)}`, '_blank');
    AppStorageService.addLog('PENGINGAT_WA', 'Peralatan', `Mengirim pengingat WhatsApp tagihan ${tagihan.namaTagihan} ke ${siswa.nama}`);
  };

  return (
    <div className="space-y-6">
      {/* Sub Menu Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'pengingat', label: '3. Pengingat Tagihan (WhatsApp)', icon: BellRing },
          { id: 'pengumuman', label: '2. Broadcast / Info WA', icon: Send },
          { id: 'berita', label: '1. Portal Berita & CMS', icon: Newspaper },
          { id: 'log', label: '4. Log Aktivitas Sistem', icon: History },
          { id: 'blogger', label: '5. Blogger XML & Cloud Firestore', icon: Code2 },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSub(item.id as SubPeralatan)}
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

      {/* 1. PENGINGAT TAGIHAN WHATSAPP */}
      {activeSub === 'pengingat' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">
              Daftar Tagihan Belum Lunas Siap Kirim Pengingat WhatsApp
            </span>
            <span className="text-emerald-700 font-medium">1-Klik langsung buka chat WhatsApp wali</span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Nama Siswa &amp; NISN</th>
                <th className="py-3 px-4">Tagihan &amp; Periode</th>
                <th className="py-3 px-4 text-right">Sisa Tagihan</th>
                <th className="py-3 px-4">Wali &amp; No. WA</th>
                <th className="py-3 px-4 text-center">Kirim Notifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tagihanList
                .filter((t) => t.status !== 'Lunas')
                .map((tag) => {
                  const s = siswaList.find((sis) => sis.id === tag.siswaId);
                  return (
                    <tr key={tag.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <p>{s?.nama}</p>
                        <p className="text-[11px] text-slate-500 font-mono">NISN: {s?.nisn}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{tag.namaTagihan}</p>
                        <p className="text-[10px] text-slate-400">Tempo: {tag.tglJatuhTempo}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-rose-600 text-sm">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(tag.sisaTagihan)}
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{s?.namaWali || 'Wali Murid'}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{s?.noHpWali || '-'}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleSendWAReminder(tag)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition cursor-pointer shadow-2xs mx-auto text-[11px]"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Kirim Pengingat WA</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      {/* 2. BROADCAST WA */}
      {activeSub === 'pengumuman' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Pusat Informasi / Broadcast Pengumuman via WhatsApp</span>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Teks Pesan Pengumuman</label>
            <textarea
              rows={4}
              value={pesanPengumuman}
              onChange={(e) => setPesanPengumuman(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-slate-500">Pesan akan dikirimkan ke kontak wali murid terdaftar.</span>
            <button
              onClick={() => {
                alert('Broadcast pengumuman disiapkan untuk disebarkan.');
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Broadcast</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. PORTAL BERITA CMS */}
      {activeSub === 'berita' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="font-bold text-sm text-slate-900">Manajemen Berita &amp; Artikel Sekolah</h4>
            <button
              onClick={() => {
                const jdl = prompt('Judul Berita:');
                if (!jdl) return;
                const rsk = prompt('Ringkasan Berita:');
                if (!rsk) return;
                setBeritaList([
                  {
                    id: 'news-' + Date.now(),
                    judul: jdl,
                    tgl: new Date().toISOString().slice(0, 10),
                    kategori: 'Umum',
                    ringkasan: rsk,
                  },
                  ...beritaList,
                ]);
              }}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Tulis Berita Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beritaList.map((n) => (
              <div key={n.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    {n.kategori}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{n.tgl}</span>
                </div>
                <h5 className="font-bold text-slate-900 text-sm mb-1.5">{n.judul}</h5>
                <p className="text-xs text-slate-600 line-clamp-2">{n.ringkasan}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LOG AKTIVITAS */}
      {activeSub === 'log' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-900">Audit Trail &amp; Log Aktivitas Sistem</span>
            <span className="text-slate-500">Mencatat seluruh mutasi dan aktivitas petugas secara kronologis</span>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Aksi &amp; Modul</th>
                <th className="py-3 px-4">Detail Aktivitas</th>
                <th className="py-3 px-4">Petugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">{log.waktu}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-100 text-slate-800">
                      {log.aksi}
                    </span>
                    <span className="ml-1.5 text-[11px] text-slate-500">({log.modul})</span>
                  </td>
                  <td className="py-3 px-4 text-slate-800">{log.detail}</td>
                  <td className="py-3 px-4 font-semibold text-blue-700">{log.petugasNama}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. BLOGGER XML & CLOUD FIRESTORE SHORTCUT */}
      {activeSub === 'blogger' && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
              ARSITEKTUR BLOGGER XML &amp; CLOUD FIRESTORE
            </span>
            <h3 className="text-xl font-black text-white">
              Unduh Template XML Blogger Valid atau Sesuaikan Firebase
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Aplikasi ini dirancang khusus agar dapat dipasang ke akun Google Blogger Anda sebagai tema mandiri, terhubung langsung ke Firebase Cloud Firestore tanpa memerlukan Realtime Database, Cloud Functions, atau Cloud Storage.
            </p>
          </div>
          <button
            onClick={onOpenBloggerXml}
            className="flex items-center gap-2 px-5 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shrink-0"
          >
            <Code2 className="w-4 h-4" />
            <span>Buka Panel Blogger XML &amp; Firestore</span>
          </button>
        </div>
      )}
    </div>
  );
};
