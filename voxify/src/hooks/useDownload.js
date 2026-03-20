import { useRef, useState, useCallback } from 'react'

/**
 * Downloads speech as audio using SpeechSynthesis + AudioContext routing.
 * This approach speaks into a silent AudioContext and records via MediaRecorder.
 * Works in Chrome/Edge. Firefox has limited SpeechSynthesis support.
 */
export function useDownload() {
  const [isRecording, setIsRecording] = useState(false)
  const [progress, setProgress] = useState(0) // 0-100
  const recorderRef = useRef(null)
  const chunksRef = useRef([])
  const contextRef = useRef(null)

  const downloadSpeech = useCallback(async ({ text, voice, rate = 1, pitch = 1 }) => {
    if (!text.trim()) return

    try {
      setIsRecording(true)
      setProgress(10)

      // Create AudioContext
      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      contextRef.current = ctx

      // Create a destination node we can record from
      const dest = ctx.createMediaStreamDestination()

      // Also connect to speakers so user hears it
      const gainNode = ctx.createGain()
      gainNode.gain.value = 1
      gainNode.connect(ctx.destination)
      gainNode.connect(dest)

      setProgress(20)

      // Set up MediaRecorder on the stream
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      chunksRef.current = []
      const recorder = new MediaRecorder(dest.stream, { mimeType })
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorderRef.current = recorder

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `voxify-${Date.now()}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        ctx.close()
        setIsRecording(false)
        setProgress(0)
      }

      recorder.start(100)
      setProgress(40)

      // Speak using SpeechSynthesis
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.pitch = pitch
      if (voice) utterance.voice = voice

      utterance.onstart = () => setProgress(60)
      utterance.onend = () => {
        setProgress(90)
        // Small delay to capture tail audio
        setTimeout(() => {
          if (recorder.state !== 'inactive') recorder.stop()
        }, 500)
      }
      utterance.onerror = () => {
        recorder.stop()
        setIsRecording(false)
        setProgress(0)
      }

      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(utterance)

    } catch (err) {
      console.warn('Download failed:', err)
      setIsRecording(false)
      setProgress(0)
      return false
    }
    return true
  }, [])

  const cancel = useCallback(() => {
    window.speechSynthesis.cancel()
    if (recorderRef.current?.state !== 'inactive') recorderRef.current?.stop()
    contextRef.current?.close()
    setIsRecording(false)
    setProgress(0)
  }, [])

  return { isRecording, progress, downloadSpeech, cancel }
}
