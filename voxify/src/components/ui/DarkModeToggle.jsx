import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('voxify_theme') === 'dark' ||
    (!localStorage.getItem('voxify_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('voxify_theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <button
      onClick={() => setDark(d => !d)}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
