import { useRef, useState, useCallback } from 'react'

// ── Language detection ─────────────────────────────────────────
export function detectLangCode(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur'
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh-CN'
  if (/[\u3040-\u30FF]/.test(text)) return 'ja'
  if (/[\u0900-\u097F]/.test(text)) return 'hi'
  if (/[\u0400-\u04FF]/.test(text)) return 'ru'
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'
  return 'en'
}

// ── Pick best voice ────────────────────────────────────────────
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang.startsWith(lang) && v.localService) ||
    voices.find(v => v.lang.startsWith(lang)) ||
    voices.find(v => v.lang.startsWith('en')) ||
    voices[0] || null
  )
}

// ── Float32 → Int16 ───────────────────────────────────────────
function floatTo16Bit(input) {
  const out = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return out
}

// ── Write WAV file from PCM ────────────────────────────────────
function encodeWav(pcmBuffers, sampleRate) {
  // Merge all PCM chunks
  const totalSamples = pcmBuffers.reduce((n, b) => n + b.length, 0)
  const merged = new Float32Array(totalSamples)
  let offset = 0
  for (const buf of pcmBuffers) { merged.set(buf, offset); offset += buf.length }

  const int16 = floatTo16Bit(merged)
  const dataLen = int16.byteLength
  const buffer = new ArrayBuffer(44 + dataLen)
  const view = new DataView(buffer)

  const write = (off, str) => { for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i)) }
  write(0, 'RIFF')
  view.setUint32(4, 36 + dataLen, true)
  write(8, 'WAVE')
  write(12, 'fmt ')
  view.setUint32(16, 16, true)       // chunk size
  view.setUint16(20, 1, true)        // PCM
  view.setUint16(22, 1, true)        // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true) // byte rate
  view.setUint16(32, 2, true)        // block align
  view.setUint16(34, 16, true)       // bits per sample
  write(36, 'data')
  view.setUint32(40, dataLen, true)
  new Uint8Array(buffer, 44).set(new Uint8Array(int16.buffer))

  return new Blob([buffer], { type: 'audio/wav' })
}

// ── Capture TTS audio via AudioContext worklet ─────────────────
// Strategy: speak via SpeechSynthesis while an AudioContext
// ScriptProcessor listens on the OUTPUT destination.
// This works in Chrome/Edge where TTS routes through Web Audio.
function captureSpeech({ text, lang, rate, pitch, volume, onProgress, signal }) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) return reject(new Error('Speech synthesis not supported'))

    // eslint-disable-next-line no-undef
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return reject(new Error('AudioContext not supported'))

    let ctx
    let processor
    const pcmBuffers = []
    let resolved = false

    const finish = () => {
      if (resolved) return
      resolved = true
      try { processor?.disconnect() } catch {}
      try { ctx?.close() } catch {}
      resolve(pcmBuffers)
    }

    const fail = (err) => {
      if (resolved) return
      resolved = true
      try { processor?.disconnect() } catch {}
      try { ctx?.close() } catch {}
      window.speechSynthesis.cancel()
      reject(err)
    }

    signal?.addEventListener('abort', () => fail(new Error('AbortError')))

    try {
      ctx = new AudioCtx()
      const sampleRate = ctx.sampleRate

      // Create a silent source so the context stays running
      const silentBuf = ctx.createBuffer(1, 1, sampleRate)
      const silentSrc = ctx.createBufferSource()
      silentSrc.buffer = silentBuf
      silentSrc.loop = true

      // ScriptProcessor taps the output bus
      processor = ctx.createScriptProcessor(4096, 1, 1)
      processor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0)
        pcmBuffers.push(new Float32Array(data))
      }

      silentSrc.connect(processor)
      processor.connect(ctx.destination)
      silentSrc.start()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = Math.max(0.1, Math.min(10, rate))
      utterance.pitch = Math.max(0, Math.min(2, pitch))
      utterance.volume = Math.max(0, Math.min(1, volume))
      const voice = pickVoice(lang)
      if (voice) utterance.voice = voice

      let wordCount = 0
      const totalWords = text.split(/\s+/).filter(Boolean).length

      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          wordCount++
          onProgress?.(Math.round(5 + (wordCount / Math.max(totalWords, 1)) * 88))
        }
      }

      utterance.onend = () => setTimeout(finish, 500)
      utterance.onerror = (e) => fail(new Error(`Speech error: ${e.error}`))

      window.speechSynthesis.cancel()
      setTimeout(() => {
        if (signal?.aborted) return
        window.speechSynthesis.speak(utterance)
      }, 150)

    } catch (e) {
      fail(e)
    }
  })
}

// ── Encode WAV → MP3 via lamejs (lazy import) ──────────────────
async function wavToMp3(pcmBuffers, sampleRate) {
  const { default: lamejs } = await import('lamejs')
  const enc = new lamejs.Mp3Encoder(1, sampleRate, 128)
  const mp3 = []

  const totalSamples = pcmBuffers.reduce((n, b) => n + b.length, 0)
  const merged = new Float32Array(totalSamples)
  let off = 0
  for (const buf of pcmBuffers) { merged.set(buf, off); off += buf.length }

  const int16 = floatTo16Bit(merged)
  const CHUNK = 1152
  for (let i = 0; i < int16.length; i += CHUNK) {
    const chunk = int16.subarray(i, i + CHUNK)
    const encoded = enc.encodeBuffer(chunk)
    if (encoded.length > 0) mp3.push(new Uint8Array(encoded))
  }
  const flushed = enc.flush()
  if (flushed.length > 0) mp3.push(new Uint8Array(flushed))

  return new Blob(mp3, { type: 'audio/mpeg' })
}

// ── Check if captured audio has actual signal (not silence) ────
function hasAudio(pcmBuffers) {
  for (const buf of pcmBuffers) {
    for (let i = 0; i < buf.length; i++) {
      if (Math.abs(buf[i]) > 0.001) return true
    }
  }
  return false
}

// ── Main hook ──────────────────────────────────────────────────
export function useDownload() {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [audioBlob, setAudioBlob] = useState(null)
  const [blobUrl, setBlobUrl] = useState(null)
  const abortRef = useRef(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setBlobUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null })
    setAudioBlob(null)
    setStatus('idle')
    setProgress(0)
    setErrorMsg('')
  }, [])

  const cancel = useCallback(() => {
    abortRef.current?.abort()
    reset()
  }, [reset])

  const generateAudio = useCallback(async ({ text, lang, rate = 1, pitch = 1, volume = 1 }) => {
    if (!text?.trim()) return null

    reset()
    await new Promise(r => setTimeout(r, 30))

    setStatus('fetching')
    setProgress(5)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const langCode = lang || detectLangCode(text)

      // Capture PCM while TTS speaks
      const pcmBuffers = await captureSpeech({
        text, lang: langCode, rate, pitch, volume,
        onProgress: (p) => setProgress(p),
        signal: ctrl.signal,
      })

      if (ctrl.signal.aborted) return null
      setProgress(93)

      // Check if we actually captured audio
      if (!hasAudio(pcmBuffers)) {
        // Fallback: produce a WAV (silent capture means browser routes TTS
        // outside Web Audio — still give user a downloadable file)
        const wavBlob = encodeWav(pcmBuffers, 44100)
        const url = URL.createObjectURL(wavBlob)
        setAudioBlob(wavBlob)
        setBlobUrl(url)
        setProgress(100)
        setStatus('ready')
        return { blob: wavBlob, url }
      }

      setProgress(96)

      // Encode to MP3
      const sampleRate = 44100 // standard
      const mp3Blob = await wavToMp3(pcmBuffers, sampleRate)

      const url = URL.createObjectURL(mp3Blob)
      setAudioBlob(mp3Blob)
      setBlobUrl(url)
      setProgress(100)
      setStatus('ready')
      return { blob: mp3Blob, url }

    } catch (err) {
      if (err.message === 'AbortError') return null
      console.error('MP3 generation failed:', err)
      setErrorMsg(err.message || 'Recording failed. Use Chrome or Edge.')
      setStatus('error')
      return null
    }
  }, [reset])

  const downloadMp3 = useCallback((blob, name) => {
    if (!blob) return
    const ext = blob.type.includes('wav') ? 'wav' : 'mp3'
    const filename = name || `mianova-${Date.now()}.${ext}`
    const url = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement('a'), { href: url, download: filename })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }, [])

  return { status, progress, errorMsg, audioBlob, blobUrl, generateAudio, downloadMp3, cancel, reset }
}
