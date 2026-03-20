import { useState, useEffect, useRef } from 'react'
import { useDownload } from '../../hooks/useDownload'

const isChrome = typeof navigator !== 'undefined' &&
  /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent)
const isEdge = typeof navigator !== 'undefined' && /Edg/.test(navigator.userAgent)
const isFirefox = typeof navigator !== 'undefined' && /Firefox/.test(navigator.userAgent)
const isSafari = typeof navigator !== 'undefined' && /Safari/.test(navigator.userAgent) && !isChrome

function BrowserBadge() {
  if (isChrome) return <span className="text-green-500 font-bold">Chrome ✓</span>
  if (isEdge) return <span className="text-blue-500 font-bold">Edge ✓</span>
  if (isFirefox) return <span className="text-orange-500 font-bold">Firefox ✗</span>
  if (isSafari) return <span className="text-orange-500 font-bold">Safari ✗</span>
  return <span className="text-gray-500">Unknown</span>
}

export function DownloadButton({ text, voice, rate, pitch, volume }) {
  const { status, progress, errorType, isSupported, downloadSpeech, cancel, clearError } = useDownload()
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef(null)
  const isActive = status !== 'idle'

  // Show guide when no-audio error
  useEffect(() => {
    if (errorType === 'no-audio') setShowModal(true)
  }, [errorType])

  // Close modal on outside click
  useEffect(() => {
    if (!showModal) return
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowModal(false)
        clearError()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showModal, clearError])

  const handleClick = async () => {
    if (isActive) { cancel(); return }
    if (!isSupported || isFirefox || isSafari) {
      setShowModal(true)
      return
    }
    clearError()
    setShowModal(false)
    await downloadSpeech({ text, voice, rate, pitch, volume })
  }

  const statusLabel = {
    idle: '⬇ Download',
    waiting: '⏳ Starting...',
    recording: `🔴 ${progress}%`,
    saving: '💾 Saving...',
  }[status]

  return (
    <div className="relative">
      {/* Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl p-6 space-y-4 animate-scale-in"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-gray-900 dark:text-white text-lg">Download Audio</h3>
                <p className="text-xs text-gray-400 mt-0.5">Browser: <BrowserBadge /></p>
              </div>
              <button
                onClick={() => { setShowModal(false); clearError() }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >✕</button>
            </div>

            {(isFirefox || isSafari || !isSupported) ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 text-sm text-orange-700 dark:text-orange-300">
                  ⚠️ Your browser doesn't support tab audio capture. Please use <strong>Chrome</strong> or <strong>Edge</strong> for audio download.
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Alternatively, use your system's audio recording software while playing the speech.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Follow these steps to capture the audio:
                </p>
                <ol className="space-y-2.5">
                  {[
                    ['1', 'Click "Start Recording" below'],
                    ['2', 'A screen share dialog will appear'],
                    ['3', 'Select the "Chrome Tab" option'],
                    ['4', '✅ Check "Share tab audio" checkbox'],
                    ['5', 'Click "Share" — recording starts automatically'],
                  ].map(([n, step]) => (
                    <li key={n} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                      <span dangerouslySetInnerHTML={{ __html: step.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ol>
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={async () => {
                      setShowModal(false)
                      await downloadSpeech({ text, voice, rate, pitch, volume })
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold hover:from-indigo-500 hover:to-violet-500 transition-all active:scale-95"
                  >
                    🎙 Start Recording
                  </button>
                  <button
                    onClick={() => { setShowModal(false); clearError() }}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={!text?.trim() && !isActive}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed
          ${isActive
            ? 'bg-red-500 hover:bg-red-400 text-white shadow-md shadow-red-200 dark:shadow-red-900/30'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
          }`}
        title={isActive ? 'Cancel recording' : 'Download speech as audio file'}
      >
        {isActive && (
          <div
            className="absolute inset-0 bg-white/20 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        )}
        <span className="relative">{statusLabel}</span>
        {isActive && (
          <span className="relative text-xs opacity-70">Cancel</span>
        )}
      </button>
    </div>
  )
}
