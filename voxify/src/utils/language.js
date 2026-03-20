// Detect language from text and find best matching voice
export function detectLang(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'ur'   // Urdu/Arabic
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh'   // Chinese
  if (/[\u3040-\u30FF]/.test(text)) return 'ja'   // Japanese
  if (/[\u0900-\u097F]/.test(text)) return 'hi'   // Hindi
  return 'en'
}

export function findBestVoice(voices, lang) {
  if (!voices.length) return null
  const match = voices.find(v => v.lang.startsWith(lang))
  return match || voices.find(v => v.lang.startsWith('en')) || voices[0]
}

export function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim()
}
