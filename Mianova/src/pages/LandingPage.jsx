import { Hero } from '../components/layout/Hero'
import { Features } from '../components/layout/Features'
import { Footer } from '../components/layout/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 transition-colors duration-300">
      <Hero />
      <Features />
      <Footer />
    </div>
  )
}
