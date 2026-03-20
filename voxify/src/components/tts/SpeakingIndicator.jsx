export function SpeakingIndicator({ isSpeaking, isPaused }) {
  if (!isSpeaking) return null
  return (
    <div className="flex items-center gap-2 text-xs font-medium text-violet-600 dark:text-violet-400">
      <span className={`flex gap-0.5 items-end h-4 ${isPaused ? 'opacity-40' : ''}`}>
        {[1, 2, 3, 4].map(i => (
          <span
            key={i}
            className="w-1 bg-violet-500 rounded-full"
            style={{
              height: `${[60, 100, 75, 90][i - 1]}%`,
              animation: isPaused ? 'none' : `bounce-bar 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
            }}
          />
        ))}
      </span>
      {isPaused ? 'Paused' : 'Speaking...'}
    </div>
  )
}
