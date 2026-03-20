import { useRef, useState, useCallback } from 'react'

/**
 * Records speech synthesis output by routing it through Web Audio API.
 * Works in Chrome/Edge. Firefox has limited support.
 */
export function useDownload() {
  const [isRecording, setIsRecording] = useState(false)
  const recorderRef = useRef(null)
  const chunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      // Capture system audio (tab audio) — requires user gesture + browser support
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: false,
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100,
        },
      })

      chunksRef.current = []
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      return true
    } catch {
      return false
    }
  }, [])

  const stopAndDownload = useCallback((filename = 'voxify-speech.webm') => {
    const recorder = recorderRef.current
    if (!recorder) return

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      // Stop all tracks
      recorder.stream.getTracks().forEach(t => t.stop())
      setIsRecording(false)
    }
    recorder.stop()
  }, [])

  return { isRecording, startRecording, stopAndDownload }
}
