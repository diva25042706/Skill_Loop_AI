import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import {
  Brain, Sparkles, Code2, Users, ArrowRight, ShieldCheck,
  Zap, CheckCircle2, Network, Cpu, Lock
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-[#F8FAFC] relative overflow-hidden bg-grid-pattern selection:bg-blue-600 selection:text-white transition-colors duration-200">
      {/* Background Radial Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/10 dark:from-blue-600/20 via-cyan-500/5 dark:via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[400px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="h-20 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#080B18]/70 backdrop-blur-xl sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto h-full px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.7)] transition-all">
              <span className="text-white font-extrabold text-2xl tracking-wider">S</span>
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              SkillLoop <span className="text-blue-600 dark:text-cyan-400 text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-cyan-950/80 border border-blue-200 dark:border-cyan-500/30 font-mono">AI</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">How It Works</a>
            <a href="#teachers" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">For Teachers</a>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <Link href="/login" className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Link href="/login">
                Start Demo <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 max-w-7xl mx-auto px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-cyan-950/80 border border-blue-200 dark:border-cyan-500/30 text-blue-700 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-8 shadow-sm dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-blue-600 dark:text-cyan-300" />
          AI Learning Intelligence Platform
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] max-w-5xl mx-auto">
          Don't just use AI. <br className="hidden sm:inline" />
          <span className="text-gradient-blue">Learn with it. Build with it.</span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
          SkillLoop AI evaluates what you truly understand, prevents AI copy-pasting with Proof-of-Learning verification, and guides you from foundational concepts to real-world software projects.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="h-13 px-8 text-base bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold shadow-[0_0_30px_rgba(37,99,235,0.4)]">
            <Link href="/login">
              Start Learning →
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="h-13 px-8 text-base bg-white dark:bg-slate-900/60 border-slate-300 dark:border-slate-700 hover:border-slate-500 text-slate-800 dark:text-slate-200 backdrop-blur-md font-bold shadow-sm">
            <Link href="/login">
              Explore Demo
            </Link>
          </Button>
        </div>

        {/* Abstract AI Intelligence Network Graph */}
        <div className="mt-16 relative max-w-4xl mx-auto p-8 rounded-3xl glass-card shadow-xl dark:shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 space-y-1">
              <span className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold">STEP 1</span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Socratic AI Tutor</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Guided problem solving</p>
            </div>
            <div className="p-4 rounded-2xl bg-cyan-50/80 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/40 space-y-1">
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold">STEP 2</span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Proof-of-Learning</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Verifies understanding</p>
            </div>
            <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 space-y-1">
              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-bold">STEP 3</span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Adaptive Assessment</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Calculates skill mastery</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-1">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">STEP 4</span>
              <p className="font-extrabold text-slate-900 dark:text-white text-sm">Project Builder</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Build real-world apps</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ────────────────────────────────────────────── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-8 relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-xs font-mono font-extrabold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
            Powered by SkillLoop AI Intelligence
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed for Modern Developers & Classrooms
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="glass-card glass-card-hover">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Socratic AI Tutor</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Guides you with progressive hints and diagnostic questions instead of dumping raw code answers.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glass-card-hover">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/50 flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Proof-of-Learning</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Verifies genuine concept comprehension before generating code, ensuring true skill retention.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card glass-card-hover">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Classroom Intelligence</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                Gives faculty real-time analytics across 60+ students, automated risk flags, and 1-click AI interventions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#080B18] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              S
            </div>
            <span className="font-extrabold text-base text-slate-900 dark:text-white">SkillLoop AI</span>
          </div>
          <p className="text-xs text-slate-500">
            © 2026 SkillLoop AI · Smart Education Hackathon Prototype
          </p>
        </div>
      </footer>
    </div>
  )
}
