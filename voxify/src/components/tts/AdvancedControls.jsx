import { memo } from 'react'

export const AdvancedControls = memo(function AdvancedControls({ voices, selectedVoice, setSelectedVoice, rate, setRate, pitch, setPitch }) {
  return (
    <div className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60">
      {/* Voice */}
      <div>
        <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">Voice</label>
        <select
          value={selectedVoice?.name || ''}
          onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value) || null)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 transition-colors"
        >
          <option value="">🤖 Auto detect</option>
          {voices.map((v) => (
            <option key={v.name} value={v.name}>{v.name} — {v.lang}</option>
          ))}
        </select>
      </div>

      {/* Rate */}
      <div>
        <label className="flex justify-between text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
          <span>Speed</span>
          <span className="text-violet-500 dark:text-violet-400 font-bold">{rate}×</span>
        </label>
        <input type="range" min="0.5" max="2" step="0.1" value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="w-full h-1.5 accent-violet-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-300 dark:text-gray-600 mt-1">
          <span>0.5×</span><span>2×</span>
        </div>
      </div>

      {/* Pitch */}
      <div>
        <label className="flex justify-between text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1.5">
          <span>Pitch</span>
          <span className="text-violet-500 dark:text-violet-400 font-bold">{pitch}</span>
        </label>
        <input type="range" min="0.5" max="2" step="0.1" value={pitch}
          onChange={(e) => setPitch(parseFloat(e.target.value))}
          className="w-full h-1.5 accent-violet-600 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-300 dark:text-gray-600 mt-1">
          <span>Low</span><span>High</span>
        </div>
      </div>
    </div>
  )
})
