import { useState, useEffect, useRef, useCallback } from 'react'

export function useSpeech() {
  const [voices, setVoices] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [wordIndex, setWordIndex] = useState(-1)
  const utteranceRef = useRef(null)

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices()
      if (v.length) setVoices(v)
    }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
    return () => { window.speechSynthesis.onvoiceschanged = null }
  }, [])

  const speak = useCallback(({ text, voice, rate = 1, pitch = 1, volume = 1, onBoundary }) => {
    window.speechSynthesis.cancel()
    if (!text.trim()) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    if (voice) utterance.voice = voice

    utterance.onstart = () => { setIsSpeaking(true); setIsPaused(false) }
    utterance.onend = () => { setIsSpeaking(false); setIsPaused(false); setWordIndex(-1) }
    utterance.onerror = () => { setIsSpeaking(false); setIsPaused(false) }
    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        setWordIndex(e.charIndex)
        onBoundary?.(e.charIndex)
      }
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const pause = useCallback(() => {
    window.speechSynthesis.pause()
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    window.speechSynthesis.resume()
    setIsPaused(false)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setIsPaused(false)
    setWordIndex(-1)
  }, [])

  return { voices, isSpeaking, isPaused, wordIndex, speak, pause, resume, stop }
}
