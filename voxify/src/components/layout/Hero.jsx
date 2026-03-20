import { Waveform } from '../animations/Waveform'

export function Hero({ onTryNow }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/30 rounded-full blur-3xl opacity-40 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-200 dark:bg-sky-900/30 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Waveform decoration */}
      <div className="w-full max-w-sm h-12 mb-8 animate-fade-up">
        <Waveform active={true} bars={40} className="h-full opacity-30" />
      </div>

      {/* Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-center leading-tight animate-fade-up-delay-1">
        <span className="text-gray-900 dark:text-white">Turn Text into</span>
        <br />
        <span className="gradient-text">Natural Voice</span>
        <br />
        <span className="text-gray-900 dark:text-white">Instantly</span>
      </h1>

      {/* Subtext */}
      <p className="mt-6 text-lg sm:text-xl text-gray-500 dark:text-gray-400 text-center max-w-xl animate-fade-up-delay-2">
        Fast, smart, and beautifully simple text-to-speech. Powered by your browser — no signup needed.
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-up-delay-3">
        <button
          onClick={onTryNow}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white text-lg font-bold shadow-xl shadow-indigo-200 dark:shadow-indigo-900/50 transition-all active:scale-95 animate-pulse-glow"
        >
          🎙 Try Voxify
        </button>
        <a
          href="#features"
          className="px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-semibold hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
        >
          See features →
        </a>
      </div>

      {/* Badges */}
      <div className="mt-10 flex flex-wrap justify-center gap-3 animate-fade-up-delay-4">
        {['🆓 Free forever', '🔒 No signup', '🌍 Multi-language', '⚡ Instant'].map(b => (
          <span key={b} className="px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400 shadow-sm">
            {b}
          </span>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-gray-300 dark:text-gray-600 text-2xl">↓</div>
    </section>
  )
}
