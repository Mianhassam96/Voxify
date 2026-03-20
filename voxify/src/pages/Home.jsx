import { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react'
import { useSpeech } from '../hooks/useSpeech'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { TextArea } from '../components/tts/TextArea'
import { SmartPlay } from '../components/tts/SmartPlay'
import { Presets } from '../components/tts/Presets'
import { History } from '../components/tts/History'
import { DownloadButton } from '../components/tts/DownloadButton'
import { Navbar } from '../components/layout/Navbar'
import { Hero } from '../components/layout/Hero'
import { Features } from '../components/layout/Features'
import { Footer } from '../components/layout/Footer'
import { detectLang, findBestVoice, cleanText } from '../utils/language'

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

  const appRef = useRef(null)
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  const smartPlay = useCallback(() => {
    const cleaned = cleanText(text)
    if (!cleaned) return
    const lang = detectLang(cleaned)
    const voice = selectedVoice || findBestVoice(voices, lang)
    speak({ text: cleaned, voice, rate, pitch, onBoundary: (idx) => setHighlightIndex(idx) })
    setHistory(prev => [cleaned, ...prev.filter(h => h !== cleaned)].slice(0, 8))
  }, [text, voices, rate, pitch, selectedVoice, speak, setHistory])

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); smartPlay() }
      if (e.key === 'Escape') stop()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [smartPlay, stop])

  useEffect(() => { if (!isSpeaking) setHighlightIndex(-1) }, [isSpeaking])

  const handlePreset = useCallback(({ label, rate: r, pitch: p }) => {
    setRate(r); setPitch(p); setActivePreset(label)
  }, [setRate, setPitch])

  const handleTextChange = useCallback((t) => {
    setText(t); if (isSpeaking) stop()
  }, [isSpeaking, stop])

  const handleHistorySelect = useCallback((item) => { setText(item); stop() }, [stop])
  const handleHistoryClear = useCallback(() => setHistory([]), [setHistory])
  const toggleAdvanced = useCallback(() => setIsAdvanced(v => !v), [])

  const scrollToApp = () => appRef.current?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 transition-colors duration-300">
      <Navbar onTryNow={scrollToApp} />

      {/* Hero */}
      <Hero onTryNow={scrollToApp} />

      {/* App Section */}
      <section id="app" ref={appRef} className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Start Speaking
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Paste your text and hit Smart Play</p>
          </div>

          {/* Main glass card */}
          <div className="gradient-border rounded-3xl shadow-2xl shadow-indigo-100 dark:shadow-indigo-900/20 overflow-hidden">
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 sm:p-8 space-y-5">

              {/* TextArea */}
              <TextArea
                text={text}
                setText={handleTextChange}
                highlightIndex={highlightIndex}
                words={words}
              />

              {/* Presets */}
              <Presets onSelect={handlePreset} active={activePreset} />

              {/* Smart Play */}
              <SmartPlay
                isSpeaking={isSpeaking}
                isPaused={isPaused}
                onPlay={smartPlay}
                onPause={pause}
                onResume={resume}
                onStop={stop}
                disabled={!text.trim()}
              />

              {/* Bottom row */}
              <div className="flex items-center gap-2 flex-wrap">
                <DownloadButton onRequestPlay={smartPlay} isSpeaking={isSpeaking} text={text} />
                <button
                  onClick={toggleAdvanced}
                  className="ml-auto text-xs text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-gray-800 border border-transparent hover:border-indigo-100 dark:hover:border-gray-700"
                >
                  {isAdvanced ? '▲ Less' : '⚙ Advanced'}
                </button>
              </div>

              {/* Advanced controls */}
              {isAdvanced && (
                <Suspense fallback={<div className="h-36 rounded-2xl bg-gray-50 dark:bg-gray-800 animate-pulse" />}>
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
          <div className="mt-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <History
              history={history}
              onSelect={handleHistorySelect}
              onClear={handleHistoryClear}
            />
          </div>

          <p className="text-center text-xs text-gray-300 dark:text-gray-700 mt-4 select-none">
            Ctrl+Enter to play · Esc to stop
          </p>
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* Footer */}
      <Footer />
    </div>
  )
}
