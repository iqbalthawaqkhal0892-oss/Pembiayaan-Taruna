import React from 'react';
import { X, Printer, QrCode, CreditCard, School, ShieldCheck } from 'lucide-react';
import { Siswa, PengaturanAplikasi } from '../types';

interface StudentCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  siswa: Siswa | null;
  pengaturan: PengaturanAplikasi;
  kelasNama?: string;
  unitNama?: string;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  isOpen,
  onClose,
  siswa,
  pengaturan,
  kelasNama = 'X TKJ 1',
  unitNama = 'SMK Taruna Bangsa',
}) => {
  if (!isOpen || !siswa) return null;

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white no-print">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <QrCode className="w-4 h-4 text-blue-400" />
            <span>Kartu Tabungan Digital &amp; QR E-Kantin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div className="p-6 printable-area bg-slate-50 flex flex-col items-center">
          
          {/* Virtual Card Preview (Finology Card Look) */}
          <div className="w-full max-w-md bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden border border-blue-900/40">
            {/* Background pattern */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -left-8 -top-8 w-36 h-36 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between relative z-10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide text-white leading-tight">
                    TARUNA BANGSA
                  </h3>
                  <p className="text-[10px] text-blue-300 font-medium">SMART CARD &amp; E-KANTIN</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            {/* Middle Section: Photo & QR */}
            <div className="flex items-center gap-4 relative z-10 mb-5">
              {/* Student Avatar */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-white text-xl font-black border-2 border-white/20 shadow-inner">
                {siswa.nama.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-slate-400 font-medium uppercase">Nama Pemegang Kartu</p>
                <h4 className="text-base font-bold text-white tracking-wide truncate">{siswa.nama}</h4>
                <p className="text-xs text-blue-300 font-mono mt-0.5">NISN: {siswa.nisn}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{kelasNama} • {unitNama}</p>
              </div>
              {/* QR Code Container */}
              <div className="bg-white p-2 rounded-xl text-slate-900 shadow-md flex flex-col items-center">
                {/* SVG QR Code Simulation */}
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none">
                  <rect width="100" height="100" fill="white" />
                  {/* Outer corner markers */}
                  <rect x="5" y="5" width="30" height="30" fill="black" />
                  <rect x="10" y="10" width="20" height="20" fill="white" />
                  <rect x="15" y="15" width="10" height="10" fill="black" />

                  <rect x="65" y="5" width="30" height="30" fill="black" />
                  <rect x="70" y="10" width="20" height="20" fill="white" />
                  <rect x="75" y="15" width="10" height="10" fill="black" />

                  <rect x="5" y="65" width="30" height="30" fill="black" />
                  <rect x="10" y="70" width="20" height="20" fill="white" />
                  <rect x="15" y="75" width="10" height="10" fill="black" />

                  {/* Inner dynamic dots */}
                  <rect x="42" y="10" width="8" height="8" fill="black" />
                  <rect x="52" y="18" width="6" height="6" fill="black" />
                  <rect x="42" y="30" width="16" height="6" fill="black" />
                  <rect x="12" y="45" width="6" height="12" fill="black" />
                  <rect x="25" y="48" width="10" height="6" fill="black" />
                  <rect x="42" y="44" width="16" height="16" fill="black" />
                  <rect x="65" y="44" width="8" height="8" fill="black" />
                  <rect x="80" y="45" width="12" height="6" fill="black" />
                  <rect x="45" y="70" width="8" height="14" fill="black" />
                  <rect x="62" y="68" width="14" height="8" fill="black" />
                  <rect x="80" y="75" width="12" height="14" fill="black" />
                </svg>
                <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter mt-1">E-KANTIN QR</span>
              </div>
            </div>

            {/* Bottom Card Row */}
            <div className="flex items-center justify-between border-t border-white/10 pt-3 relative z-10">
              <div>
                <p className="text-[10px] text-slate-400 font-medium">Saldo Tabungan Saat Ini</p>
                <p className="text-sm font-black text-emerald-400">{formatRupiah(siswa.saldoTabungan)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-medium">Virtual Account</p>
                <p className="text-xs font-mono font-bold text-white">{siswa.virtualAccount}</p>
              </div>
            </div>
          </div>

          {/* Info Card Instructions */}
          <div className="mt-4 bg-white p-4 rounded-xl border border-slate-200 w-full text-xs text-slate-600 no-print">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Kegunaan Kartu Digital:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600">
              <li>Pindai QR di E-Kantin Taruna Bangsa untuk pembayaran jajan tanpa uang tunai.</li>
              <li>Tunjukkan saat setor/tarik tabungan di ruang Tata Usaha atau Kasir Bendahara.</li>
              <li>Virtual Account dapat digunakan untuk transfer pembayaran SPP langsung dari ATM/m-Banking.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
