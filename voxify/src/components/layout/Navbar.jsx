import { DarkModeToggle } from '../ui/DarkModeToggle'

export function Navbar({ onTryNow }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-white/20 dark:border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔊</span>
          <span className="text-xl font-bold gradient-text">Voxify</span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <a href="#app" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How it works</a>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={onTryNow}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all active:scale-95 shadow-md shadow-indigo-200 dark:shadow-indigo-900/40"
          >
            Try Now
          </button>
        </div>
      </div>
    </nav>
  )
}
