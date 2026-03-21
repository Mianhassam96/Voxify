import { useState, useRef, useEffect } from 'react'
import { useDownload } from '../../hooks/useDownload'

export function DownloadButton({ text, lang }) {
  const { status, progress, error, audioBlob, blobUrl, generateAudio, downloadMp3, cancel, reset } = useDownload()
  const [showPanel, setShowPanel] = useState(false)
  const [copied, setCopied] = useState(false)
  const audioRef = useRef(null)
  const panelRef = useRef(null)

  const isFetching = status === 'fetching'
  const isReady = status === 'ready'
  const isError = status === 'error'

  // Close panel on outside click
  useEffect(() => {
    if (!showPanel) return
    const h = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false)
      }
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [showPanel])

  // Reset when text changes
  useEffect(() => { reset() }, [text]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerate = async () => {
    const result = await generateAudio({ text, lang })
    if (result) setShowPanel(true)
    else if (status !== 'idle') setShowPanel(true) // show error panel
  }

  const handleCopyLink = async () => {
    if (!blobUrl) return
    try {
      await navigator.clipboard.writeText(blobUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = blobUrl
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const disabled = !text?.trim()

  return (
    <div className="relative" ref={panelRef}>
      {/* Trigger button */}
      <button
        onClick={() => {
          if (isFetching) { cancel(); return }
          if (isReady || isError) { setShowPanel(v => !v); return }
          handleGenerate()
        }}
        disabled={disabled && !isFetching}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed
          ${isFetching
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900/30'
            : isReady
              ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30'
              : isError
                ? 'bg-red-500 hover:bg-red-400 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        title="Generate & download MP3 audio"
      >
        {/* Progress fill bar */}
        {isFetching && (
          <div
            className="absolute inset-0 bg-white/20 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative">
          {isFetching ? `⏳ ${progress}%` : isReady ? '✅ Audio Ready' : isError ? '⚠ Retry' : '🎵 Get MP3'}
        </span>
        {isFetching && (
          <span className="relative text-xs opacity-70 ml-1">Cancel</span>
        )}
      </button>

      {/* Dropdown panel */}
      {showPanel && (isReady || isError) && (
        <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl z-50 overflow-hidden animate-scale-in">

          {isError ? (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-sm">Generation Failed</span>
                <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none">✕</button>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-sm text-red-700 dark:text-red-300">
                ⚠️ Could not fetch audio. Check your internet connection and try again.
              </div>
              <button
                onClick={() => { setShowPanel(false); handleGenerate() }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95"
              >
                🔄 Try Again
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Audio Generated
                </span>
                <button
                  onClick={() => { setShowPanel(false); reset() }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
                >✕</button>
              </div>

              {/* Audio preview player */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                <audio
                  ref={audioRef}
                  src={blobUrl}
                  controls
                  className="w-full h-8"
                  style={{ colorScheme: 'light dark' }}
                />
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => downloadMp3(audioBlob)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95 shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
                >
                  ⬇ Download MP3
                </button>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 border
                    ${copied
                      ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }`}
                >
                  {copied ? '✅ Copied!' : '🔗 Copy Link'}
                </button>
              </div>

              {/* Link note */}
              <p className="text-xs text-gray-400 dark:text-gray-600 text-center">
                Link is valid for this session only
              </p>

              {/* Regenerate */}
              <button
                onClick={() => { setShowPanel(false); reset(); setTimeout(handleGenerate, 100) }}
                className="w-full py-2 rounded-xl text-xs text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                🔄 Regenerate
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
