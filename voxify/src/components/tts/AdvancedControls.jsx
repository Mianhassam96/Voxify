import { memo } from 'react'

export const AdvancedControls = memo(function AdvancedControls({
  voices, selectedVoice, setSelectedVoice,
  rate, setRate, pitch, setPitch, volume, setVolume
}) {
  const sliders = [
    { label: 'Speed', val: rate, set: setRate, min: 0.5, max: 2, step: 0.1, unit: '×', lo: '0.5×', hi: '2×' },
    { label: 'Pitch', val: pitch, set: setPitch, min: 0.5, max: 2, step: 0.1, unit: '', lo: 'Low', hi: 'High' },
    { label: 'Volume', val: volume, set: setVolume, min: 0, max: 1, step: 0.05, unit: '', lo: '🔇', hi: '🔊' },
  ]

  return (
    <div className="space-y-4 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
      {/* Voice */}
      <div>
        <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Voice</label>
        <select
          value={selectedVoice?.name || ''}
          onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value) || null)}
          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
        >
          <option value="">🤖 Auto detect language</option>
          {voices.map((v) => (
            <option key={v.name} value={v.name}>{v.name} — {v.lang}</option>
          ))}
        </select>
      </div>

      {/* Sliders */}
      {sliders.map(({ label, val, set, min, max, step, unit, lo, hi }) => (
        <div key={label}>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</label>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
              {label === 'Volume' ? `${Math.round(val * 100)}%` : `${val}${unit}`}
            </span>
          </div>
          <div className="relative">
            <input
              type="range" min={min} max={max} step={step} value={val}
              onChange={(e) => set(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full accent-indigo-600 cursor-pointer"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${((val - min) / (max - min)) * 100}%, #e5e7eb ${((val - min) / (max - min)) * 100}%, #e5e7eb 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-300 dark:text-gray-600 mt-1">
            <span>{lo}</span><span>{hi}</span>
          </div>
        </div>
      ))}
    </div>
  )
})
