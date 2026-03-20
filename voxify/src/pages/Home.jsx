import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TextArea } from '../components/tts/TextArea'
import { Player } from '../components/tts/Player'
import { Presets } from '../components/tts/Presets'
import { History } from '../components/tts/History'
import { DownloadButton } from '../components/tts/DownloadButton'
import { SpeakingIndicator } from '../components/tts/SpeakingIndicator'
import { DarkModeToggle } from '../components/ui/DarkModeToggle'
import { detectLang, findBestVoice, cleanText } from '../utils/language'

// Lazy load advanced controls — only needed when user opens it
const AdvancedControls = lazy(() =>
  import('../components/tts/AdvancedControls').then(m => ({ default: m.AdvancedControls }))
)

export default function Home() {
  const { voices, isSpeaking, isPaused, speak, pause, resume, stop } = useSpeech()

  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [rate, setRate] = useLocalStorage('voxify_rate', 1)
  const [pitch, setPitch] = useLocalStorage('voxify_pitch', 1)
  const [isAdvanced, setIsAdvanced] = useState(false)
  const [activePreset, setActivePreset] = useState('Normal')
  const [history, setHistory] = useLocalStorage('voxify_history', [])
  const [highlightIndex, setHighlightIndex] = useState(-1)

  // Only recompute words when text changes
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  const smartPlay = useCallback(() => {
    const cleaned = cleanText(text)
    if (!cleaned) return
    const lang = detectLang(cleaned)
    const voice = selectedVoice || findBestVoice(voices, lang)
    speak({ text: cleaned, voice, rate, pitch, onBoundary: (idx) => setHighlightIndex(idx) })
    setHistory(prev => [cleaned, ...prev.filter(h => h !== cleaned)].slice(0, 8))
  }, [text, voices, rate, pitch, selectedVoice, speak, setHistory])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); smartPlay() }
      if (e.key === 'Escape') stop()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [smartPlay, stop])

  useEffect(() => { if (!isSpeaking) setHighlightIndex(-1) }, [isSpeaking])

  // Stable callbacks — won't cause child re-renders on unrelated state changes
  const handlePreset = useCallback(({ label, rate: r, pitch: p }) => {
    setRate(r); setPitch(p); setActivePreset(label)
  }, [setRate, setPitch])

  const handleTextChange = useCallback((t) => {
    setText(t)
    if (isSpeaking) stop()
  }, [isSpeaking, stop])

  const handleHistorySelect = useCallback((item) => {
    setText(item)
    stop()
  }, [stop])

  const handleHistoryClear = useCallback(() => setHistory([]), [setHistory])

  const toggleAdvanced = useCallback(() => setIsAdvanced(v => !v), [])

  const hasText = text.trim().length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 transition-colors duration-300">

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔊</span>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">Voxify</h1>
              <p className="text-xs text-gray-400 dark:text-gray-500">Text to Speech</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SpeakingIndicator isSpeaking={isSpeaking} isPaused={isPaused} />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4 pb-24">

        {/* Main card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-5 space-y-4">
            <TextArea
              text={text}
              setText={handleTextChange}
              highlightIndex={highlightIndex}
              words={words}
            />
            <Presets onSelect={handlePreset} active={activePreset} />
          </div>

          {/* Player bar */}
          <div className="px-5 pb-4 space-y-3">
            <Player
              isSpeaking={isSpeaking}
              isPaused={isPaused}
              onPlay={smartPlay}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              disabled={!hasText}
            />

            <div className="flex items-center gap-2">
              <DownloadButton onRequestPlay={smartPlay} isSpeaking={isSpeaking} text={text} />
              <button
                onClick={toggleAdvanced}
                className="ml-auto text-xs text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-violet-50 dark:hover:bg-gray-800"
              >
                {isAdvanced ? '▲ Less' : '⚙ Advanced'}
              </button>
            </div>

            {isAdvanced && (
              <Suspense fallback={<div className="h-32 rounded-xl bg-gray-50 dark:bg-gray-800 animate-pulse" />}>
                <AdvancedControls
                  voices={voices}
                  selectedVoice={selectedVoice}
                  setSelectedVoice={setSelectedVoice}
                  rate={rate}
                  setRate={setRate}
                  pitch={pitch}
                  setPitch={setPitch}
                />
              </Suspense>
            )}
          </div>
        </div>

        {/* History card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5">
          <History
            history={history}
            onSelect={handleHistorySelect}
            onClear={handleHistoryClear}
          />
        </div>

        <p className="text-center text-xs text-gray-300 dark:text-gray-700 select-none">
          Ctrl+Enter to play · Esc to stop
        </p>
      </main>
    </div>
  )
}
