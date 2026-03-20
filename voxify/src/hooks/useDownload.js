import { useRef, useState, useCallback } from 'react'

/**
 * Downloads speech audio by capturing tab audio via getDisplayMedia.
 * Chrome/Edge: user must select "This Tab" + check "Share tab audio".
 * Firefox: not supported (no tab audio capture).
 */
export function useDownload() {
  const [status, setStatus] = useState('idle') // idle | waiting | recording | saving | error
  const [progress, setProgress] = useState(0)
  const [errorType, setErrorType] = useState(null) // null | 'no-audio' | 'cancelled' | 'unsupported' | 'error'
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  const isSupported = typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices?.getDisplayMedia === 'function'

  const downloadSpeech = useCallback(async ({ text, voice, rate = 1, pitch = 1, volume = 1 }) => {
    if (!text?.trim()) return 'no-text'
    if (!isSupported) {
      setErrorType('unsupported')
      return 'unsupported'
    }

    setErrorType(null)
    setStatus('waiting')
    setProgress(0)

    let stream
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: { suppressLocalAudioPlayback: false },
        preferCurrentTab: true,
      })
    } catch {
      setStatus('idle')
      setErrorType('cancelled')
      return 'cancelled'
    }

    // Stop video tracks — we only need audio
    stream.getVideoTracks().forEach(t => t.stop())
    const audioTracks = stream.getAudioTracks()

    if (!audioTracks.length) {
      stream.getTracks().forEach(t => t.stop())
      setStatus('idle')
      setErrorType('no-audio')
      return 'no-audio'
    }

    const audioStream = new MediaStream(audioTracks)
    chunksRef.current = []

    const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg']
      .find(t => MediaRecorder.isTypeSupported(t)) || ''

    const recorder = new MediaRecorder(audioStream, mimeType ? { mimeType } : {})
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorderRef.current = recorder

    recorder.onstop = () => {
      const ext = mimeType.includes('ogg') ? 'ogg' : 'webm'
      const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `voxify-audio-${Date.now()}.${ext}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      audioStream.getTracks().forEach(t => t.stop())
      recorderRef.current = null
      setStatus('idle')
      setProgress(0)
    }

    recorder.start(100)
    setStatus('recording')
    setProgress(15)

    // Speak the text
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = volume
    if (voice) utterance.voice = voice

    utterance.onstart = () => setProgress(30)

    utterance.onboundary = (e) => {
      if (e.name === 'word' && e.charIndex != null) {
        const pct = Math.min(90, 30 + Math.round((e.charIndex / text.length) * 60))
        setProgress(pct)
      }
    }

    utterance.onend = () => {
      setProgress(95)
      setStatus('saving')
      setTimeout(() => {
        if (recorder.state !== 'inactive') recorder.stop()
      }, 600)
    }

    utterance.onerror = () => {
      if (recorder.state !== 'inactive') recorder.stop()
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)

    return 'ok'
  }, [isSupported])

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel()
    if (recorderRef.current?.state !== 'inactive') {
      recorderRef.current?.stop()
    }
    setStatus('idle')
    setProgress(0)
    setErrorType(null)
  }, [])

  const clearError = useCallback(() => setErrorType(null), [])

  return { status, progress, errorType, isSupported, downloadSpeech, cancel, clearError }
}
