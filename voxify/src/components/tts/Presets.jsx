import { memo } from 'react'

const PRESETS = [
  { label: '🎙 Normal', key: 'Normal', rate: 1, pitch: 1 },
  { label: '⚡ Fast', key: 'Fast', rate: 1.5, pitch: 1 },
  { label: '🐢 Slow', key: 'Slow', rate: 0.7, pitch: 1 },
  { label: '🎧 Podcast', key: 'Podcast', rate: 0.9, pitch: 1.2 },
]

export const Presets = memo(function Presets({ onSelect, active }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Presets</p>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => onSelect({ ...p, label: p.key })}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border
              ${active === p.key
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200 dark:shadow-violet-900/40'
                : 'bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
})
