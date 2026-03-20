const MAX_CHARS = 5000

export function TextArea({ text, setText, highlightIndex, words }) {
  if (highlightIndex >= 0 && words.length > 0) {
    let charCount = 0
    return (
      <div className="w-full min-h-[180px] p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50/30 dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-base leading-relaxed font-sans whitespace-pre-wrap break-words ring-2 ring-violet-300/50 dark:ring-violet-700/50">
        {words.map((word, i) => {
          const start = charCount
          charCount += word.length + 1
          const isActive = start <= highlightIndex && highlightIndex < start + word.length
          return (
            <span
              key={i}
              className={`transition-colors duration-100 ${isActive ? 'bg-violet-400 dark:bg-violet-600 text-white rounded px-0.5' : ''}`}
            >
              {word}{' '}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className="relative">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
        placeholder="Paste or type your text here..."
        rows={7}
        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-300 dark:placeholder-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:ring-violet-600 text-base leading-relaxed transition-colors"
      />
      <span className={`absolute bottom-3 right-3 text-xs tabular-nums ${text.length > MAX_CHARS * 0.9 ? 'text-orange-400' : 'text-gray-300 dark:text-gray-600'}`}>
        {text.length}/{MAX_CHARS}
      </span>
    </div>
  )
}
