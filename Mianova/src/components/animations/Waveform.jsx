import { memo } from 'react'

export const Waveform = memo(function Waveform({ active, bars = 28, className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-0.5 ${className}`}>
      {Array.from({ length: bars }).map((_, i) => {
        const heights = [30, 55, 75, 90, 100, 85, 65, 45, 70, 95, 80, 60, 40, 55, 75, 90, 70, 50, 85, 65, 45, 80, 95, 60, 75, 40, 55, 70]
        const h = heights[i % heights.length]
        return (
          <span
            key={i}
            className="w-1 rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all"
            style={{
              height: active ? `${h}%` : '20%',
              animation: active ? `bounce-bar ${0.6 + (i % 5) * 0.1}s ease-in-out ${(i % 7) * 0.07}s infinite alternate` : 'none',
              opacity: active ? 1 : 0.3,
              transition: 'height 0.3s ease, opacity 0.3s ease',
            }}
          />
        )
      })}
    </div>
  )
})
