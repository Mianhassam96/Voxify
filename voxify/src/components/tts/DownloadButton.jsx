import { useDownload } from '../../hooks/useDownload'

export function DownloadButton({ text, voice, rate, pitch }) {
  const { isRecording, progress, downloadSpeech, cancel } = useDownload()

  const handleClick = async () => {
    if (isRecording) { cancel(); return }
    const ok = await downloadSpeech({ text, voice, rate, pitch })
    if (ok === false) alert('Download failed. Make sure you are using Chrome or Edge.')
  }

  return (
    <button
      onClick={handleClick}
      disabled={!text.trim() && !isRecording}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 overflow-hidden disabled:opacity-40 disabled:cursor-not-allowed
        ${isRecording
          ? 'bg-red-500 hover:bg-red-400 text-white shadow-md shadow-red-200 dark:shadow-red-900/30'
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'
        }`}
      title={isRecording ? 'Cancel recording' : 'Download as audio file'}
    >
      {/* Progress bar */}
      {isRecording && (
        <div
          className="absolute inset-0 bg-red-400/30 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative">
        {isRecording ? `⏹ ${progress < 90 ? `Recording ${progress}%` : 'Saving...'}` : '⬇ Download Audio'}
      </span>
    </button>
  )
}
