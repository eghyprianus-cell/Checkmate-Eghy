import React from 'react';
import { X, Zap, Shield, Sparkles, BookOpen } from 'lucide-react';

interface RulesModalProps {
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-[#07132c]/95 border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-blue-900/60 bg-blue-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_#00f0ff]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
                Panduan Petir Biru Chess
              </h2>
              <p className="text-xs text-cyan-300 font-['Rajdhani']">
                Instruksi Bertempur di Medan Badai Elektrik
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Panduan"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-slate-200 font-['Rajdhani']">
          {/* Section 1: Aturan Dasar */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
              <Zap className="w-4 h-4 text-cyan-400" />
              1. Aturan Catur Standar FIDE
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Permainan ini mengikuti peraturan catur internasional resmi:
            </p>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside bg-blue-950/30 p-3 rounded-xl border border-blue-900/40">
              <li><strong>Rokade (Castling)</strong>: Didukung penuh untuk sisi Raja dan Menteri.</li>
              <li><strong>En Passant</strong>: Tangkapan pion spesial saat pion lawan melangkah dua petak.</li>
              <li><strong>Promosi Pion</strong>: Saat pion mencapai ujung papan, pilih Ratu, Benteng, Uskup, atau Kuda.</li>
              <li><strong>Skak & Skakmat</strong>: Raja terlindungi dari langkah ilegal; skakmat mengakhiri permainan.</li>
            </ul>
          </div>

          {/* Section 2: Efek Visual Petir Biru */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              2. Efek Halilintar & Audio Prosedural
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Setiap langkah memicu <strong>sambaran busur petir fraktal</strong> dari petak asal ke petak tujuan. Penangkapan bidak menghasilkan <strong>ledakan percikan plasma dan dentuman guntur</strong> yang disintesis langsung melalui Web Audio API tanpa perlu unduhan berkas audio tambahan.
            </p>
          </div>

          {/* Section 3: Mode Kekuatan Badai */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
              <Shield className="w-4 h-4 text-cyan-400" />
              3. Mode Kekuatan Badai (Opsional)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dapat diaktifkan kapan saja untuk variasi strategi fantastis dengan mengumpulkan <strong>Energi Badai (0–100%)</strong>:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                <div className="text-xs font-bold text-amber-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Sambaran Lumpuh (40% Energi)
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Pilih bidak lawan (selain Raja) untuk melumpuhkannya dengan sengatan listrik bertegangan tinggi. Bidak yang dilumpuhkan tidak dapat digerakkan pada giliran lawan berikutnya!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
                <div className="text-xs font-bold text-cyan-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Perisai Ionik (50% Energi)
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Lindungi salah satu bidakmu dengan perisai elektromagnetik kebal. Bidak yang terlindungi tidak dapat ditangkap oleh lawan selama 1 putaran penuh!
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Tingkat AI */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
              ⚡ 4. Tingkatan AI Halilintar
            </h3>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-900/50">
                <div className="font-bold text-white">Percikan Api</div>
                <div className="text-[10px] text-slate-400">Pemula (ELO ~900)</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-950/40 border border-cyan-500/40">
                <div className="font-bold text-cyan-300">Badai Petir</div>
                <div className="text-[10px] text-slate-400">Menengah (ELO ~1500)</div>
              </div>
              <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-500/50">
                <div className="font-bold text-blue-300">Petir Abadi</div>
                <div className="text-[10px] text-slate-400">Master (ELO ~2000)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-blue-900/60 bg-blue-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer font-['Chakra_Petch']"
          >
            Masuki Medan Badai
          </button>
        </div>
      </div>
    </div>
  );
};
