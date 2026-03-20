import { memo } from 'react'

export const History = memo(function History({ history, onSelect, onClear }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
          🕓 Recent
        </h3>
        {history.length > 0 && (
          <button onClick={onClear} className="text-xs text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors">
            Clear all
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="text-sm text-gray-300 dark:text-gray-600 text-center py-3">No history yet — start speaking!</p>
      ) : (
        <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
          {history.map((item, i) => (
            <button
              key={i}
              onClick={() => onSelect(item)}
              className="w-full text-left px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 hover:bg-violet-50 dark:hover:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 hover:text-violet-700 dark:hover:text-violet-300 truncate transition-all border border-transparent hover:border-violet-200 dark:hover:border-violet-800"
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
})
