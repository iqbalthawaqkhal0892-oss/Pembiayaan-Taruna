import React from 'react';
import { Printer, X, CheckCircle2, Download } from 'lucide-react';
import { Pembayaran, Siswa, Tagihan, PengaturanAplikasi } from '../types';

interface ReceiptModalProps {
  pembayaran: Pembayaran;
  siswa: Siswa;
  tagihan?: Tagihan;
  pengaturan: PengaturanAplikasi;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  pembayaran,
  siswa,
  tagihan,
  pengaturan,
  onClose,
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-900 my-8">
        
        {/* Modal Action Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">Kwitansi Pembayaran Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-8 space-y-6 text-xs printable-receipt">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4">
            <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">
              {pengaturan.namaLembaga}
            </h3>
            <p className="text-[11px] text-slate-600">{pengaturan.alamatLembaga}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Telp: {pengaturan.noTelepon} • WA: {pengaturan.noWhatsApp}
            </p>
            <div className="inline-block mt-3 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase border border-slate-300">
              BUKTI PEMBAYARAN SAH (KWITANSI)
            </div>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-200 pb-4">
            <div>
              <p className="text-slate-500">Nomor Nota / Transaksi:</p>
              <p className="font-mono font-black text-blue-800 text-sm">{pembayaran.noNota}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Tanggal Pembayaran:</p>
              <p className="font-semibold text-slate-800">{pembayaran.tglBayar}</p>
            </div>
            <div className="mt-2">
              <p className="text-slate-500">Telah Terima Dari:</p>
              <p className="font-bold text-slate-900">{siswa.nama}</p>
              <p className="text-[11px] text-slate-500 font-mono">NISN: {siswa.nisn}</p>
            </div>
            <div className="mt-2 text-right">
              <p className="text-slate-500">Metode Bayar:</p>
              <p className="font-bold text-slate-800">{pembayaran.metode}</p>
              <span className="inline-block px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">
                LUNAS / SAH
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-xs text-left border border-slate-200">
              <thead className="bg-slate-100 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Keterangan Pembayaran</th>
                  <th className="p-2.5 text-right">Jumlah Dibayar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2.5 font-semibold">
                    {tagihan?.namaTagihan || 'Pembayaran Biaya Pendidikan'}
                    {pembayaran.catatan && (
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">Catatan: {pembayaran.catatan}</p>
                    )}
                  </td>
                  <td className="p-2.5 text-right font-black text-sm text-slate-900">
                    {formatRupiah(pembayaran.nominalBayar)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Terbilang */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-sm font-black border-b border-slate-200 pb-2">
              <span>TOTAL DITERIMA:</span>
              <span className="text-emerald-700 text-base">{formatRupiah(pembayaran.nominalBayar)}</span>
            </div>
            <p className="text-[11px] text-slate-600 italic mt-2">
              * Nota ini adalah bukti transaksi sah yang diterbitkan oleh sistem keuangan digital {pengaturan.namaLembaga}.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-4 text-center text-xs pt-4">
            <div>
              <p className="text-slate-500">Penyetor / Wali Murid,</p>
              <div className="h-14" />
              <p className="font-bold text-slate-900">({siswa.namaWali || siswa.nama})</p>
            </div>
            <div>
              <p className="text-slate-500">Petugas Kasir / Bendahara,</p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest border border-blue-300 px-2 py-0.5 rounded">
                  LUNAS
                </span>
              </div>
              <p className="font-bold text-slate-900 underline">Siti Rahmawati, S.E.</p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            {pengaturan.footerKwitansi}
          </div>
        </div>

      </div>
    </div>
  );
};
