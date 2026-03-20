const FEATURES = [
  { icon: '⚡', title: 'Smart Play', desc: 'Auto-detects language and picks the best voice for your text.' },
  { icon: '🌍', title: 'Multi-language', desc: 'Supports English, Urdu, Arabic, Chinese, Japanese, Hindi and more.' },
  { icon: '🎚', title: 'Full Controls', desc: 'Adjust speed, pitch, and voice. Save your preferences automatically.' },
  { icon: '🧾', title: 'History', desc: 'Your last 8 texts are saved locally. Click any to replay instantly.' },
  { icon: '⬇', title: 'Download Audio', desc: 'Record and download your speech as a .webm audio file.' },
  { icon: '🌙', title: 'Dark Mode', desc: 'Easy on the eyes. Remembers your preference across sessions.' },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Everything you need
          </h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg">No fluff. Just the features that matter.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
