import React from 'react';
import { X, Volume2, VolumeX, Music, Sliders, Sparkles, RotateCcw, Check } from 'lucide-react';
import type { AppSettings, SoundtrackTrack, SparkIntensity } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onResetSettings: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetSettings,
  onClose,
}) => {
  const tracks: { id: SoundtrackTrack; title: string; desc: string; icon: string }[] = [
    {
      id: 'cyber-storm',
      title: 'Badai Cyber Halilintar',
      desc: 'Arpegio synth elektrik bertempo 116 BPM & bass analog',
      icon: '⚡',
    },
    {
      id: 'dark-ambient',
      title: 'Guntur Kosmis (Ambient)',
      desc: 'Dengungan drone meditatif & resonansi ruang kosmis',
      icon: '🌌',
    },
    {
      id: 'thunder-rain',
      title: 'Hujan Badai Elektrik',
      desc: 'Deru hujan atmosferik & gemuruh guntur berulang',
      icon: '🌧️',
    },
    {
      id: 'none',
      title: 'Tanpa Musik Latar',
      desc: 'Hanya efek suara permainan tanpa soundtrack',
      icon: '🔇',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#07132c]/95 border-2 border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] text-slate-100 font-['Rajdhani'] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-blue-900/60 bg-blue-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_#00f0ff]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Chakra_Petch'] tracking-wide">
                Pengaturan Permainan
              </h2>
              <p className="text-xs text-slate-400">
                Kustomisasi audio, soundtrack, dan visual medan petir
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Pengaturan"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-blue-900/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Section 1: Soundtrack & Musik Latar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
                <Music className="w-4 h-4 text-cyan-400" />
                <span>1. Soundtrack Musik Latar (BGM)</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {settings.soundtrack === 'none' ? 'Mati' : `${settings.musicVolume}%`}
              </span>
            </div>

            {/* Track selector grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tracks.map((t) => {
                const isActive = settings.soundtrack === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onUpdateSettings({ soundtrack: t.id })}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'border-blue-950 bg-slate-900/40 hover:bg-blue-950/40 text-slate-300'
                    }`}
                  >
                    <span className="text-lg leading-none mt-0.5">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span className="truncate">{t.title}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {t.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Music Volume Slider */}
            {settings.soundtrack !== 'none' && (
              <div className="pt-1 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Volume Musik</span>
                  <span className="font-mono text-cyan-300">{settings.musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => onUpdateSettings({ musicVolume: Number(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Section 2: Efek Suara (SFX) */}
          <div className="space-y-3 pt-2 border-t border-blue-900/40">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>2. Efek Suara (SFX)</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ isMuted: !settings.isMuted })}
                className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold cursor-pointer transition-colors ${
                  settings.isMuted
                    ? 'bg-red-950/60 text-red-300 border border-red-800'
                    : 'bg-blue-950 text-cyan-300 border border-blue-800'
                }`}
              >
                {settings.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{settings.isMuted ? 'Dibisukan' : 'Aktif'}</span>
              </button>
            </div>

            {/* SFX Volume Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Volume Efek Sambaran</span>
                <span className="font-mono text-cyan-300">
                  {settings.isMuted ? '0%' : `${settings.sfxVolume}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                disabled={settings.isMuted}
                value={settings.sfxVolume}
                onChange={(e) => onUpdateSettings({ sfxVolume: Number(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg disabled:opacity-40"
              />
            </div>

            {/* Sound Style Choice */}
            <div className="pt-1">
              <label className="text-xs text-slate-300 block mb-1.5">
                Gaya Suara Langkah:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundStyle: 'electric' })}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    settings.soundStyle === 'electric'
                      ? 'border-cyan-400 bg-cyan-950/50 text-white'
                      : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  ⚡ Sengatan Petir (Default)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ soundStyle: 'classic' })}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    settings.soundStyle === 'classic'
                      ? 'border-cyan-400 bg-cyan-950/50 text-white'
                      : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                  }`}
                >
                  ♟️ Ketukan Klasik Kayu
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: Tampilan & Visual FX */}
          <div className="space-y-3 pt-2 border-t border-blue-900/40">
            <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5 font-['Chakra_Petch']">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>3. Visual & Antarmuka</span>
            </div>

            {/* Live Eval Bar Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-950/30 border border-blue-900/50">
              <div>
                <div className="text-xs font-bold text-white">
                  Tampilkan Bar Evaluasi Posisi
                </div>
                <div className="text-[11px] text-slate-400">
                  Indikator kekuatan posisi langsung (Stockfish style) di samping papan
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ showEvalBar: !settings.showEvalBar })}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer border ${
                  settings.showEvalBar ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-slate-950 absolute top-0.5 transition-transform ${
                    settings.showEvalBar ? 'translate-x-5 bg-white shadow-[0_0_8px_#00f0ff]' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Spark Intensity */}
            <div>
              <label className="text-xs text-slate-300 block mb-1.5">
                Intensitas Partikel Sambaran Petir:
              </label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {(['high', 'medium', 'low'] as SparkIntensity[]).map((level) => {
                  const label =
                    level === 'high' ? 'Penuh (Maksimal)' : level === 'medium' ? 'Seimbang' : 'Ringan';
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => onUpdateSettings({ sparkIntensity: level })}
                      className={`p-2 rounded-xl border font-semibold transition-all cursor-pointer ${
                        settings.sparkIntensity === level
                          ? 'border-cyan-400 bg-cyan-950/50 text-cyan-200 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'border-blue-950 bg-slate-900/40 text-slate-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-blue-900/60 bg-blue-950/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onResetSettings}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-900/60 hover:bg-blue-900/40 text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer font-['Chakra_Petch']"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
