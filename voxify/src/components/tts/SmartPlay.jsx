import { memo } from 'react'
import { Waveform } from '../animations/Waveform'

export const SmartPlay = memo(function SmartPlay({ isSpeaking, isPaused, onPlay, onPause, onResume, onStop, disabled }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Main button */}
      {!isSpeaking ? (
        <button
          onClick={onPlay}
          disabled={disabled}
          className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-lg font-bold shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 animate-pulse-glow overflow-hidden"
        >
          🎙 Smart Play
        </button>
      ) : (
        <div className="w-full space-y-3">
          {/* Waveform */}
          <div className="h-10">
            <Waveform active={!isPaused} bars={32} className="h-full" />
          </div>
          <div className="flex gap-2">
            {isPaused ? (
              <button
                onClick={onResume}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 text-white font-bold transition-all active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
              >
                ▶ Resume
              </button>
            ) : (
              <button
                onClick={onPause}
                className="flex-1 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold transition-all active:scale-95 hover:border-indigo-300"
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={onStop}
              className="py-3.5 px-6 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-bold transition-all active:scale-95 shadow-md shadow-red-200 dark:shadow-red-900/40"
            >
              ■ Stop
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
