export function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🔊</span>
              <span className="text-lg font-bold gradient-text">Voxify</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Turn any text into natural-sounding voice instantly. Fast, smart, and beautifully simple.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="#app" className="hover:text-indigo-500 transition-colors">Try Voxify</a></li>
              <li><a href="#features" className="hover:text-indigo-500 transition-colors">Features</a></li>
            </ul>
          </div>

          {/* Built by */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Built by</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              MultiMian —{' '}
              <a
                href="https://github.com/Mianhassam96"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-500 hover:text-indigo-400 transition-colors"
              >
                @Mianhassam96
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} Voxify by MultiMian. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
