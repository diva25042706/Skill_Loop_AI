"use client"
import { useState } from "react"
import { useDemoStore } from "@/lib/store/demo-store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { ArrowRight, UserCheck, GraduationCap, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useDemoStore()

  const [email, setEmail] = useState("divakaranperumal27@gmail.com")
  const [error, setError] = useState("")

  const handleLogin = (loginEmail?: string) => {
    const targetEmail = loginEmail || email
    setError("")

    const role = login(targetEmail)
    if (role === 'student') {
      router.push('/dashboard')
    } else if (role === 'teacher') {
      router.push('/teacher')
    } else {
      setError("Demo account not found. Try the Student or Teacher demo account below.")
    }
  }

  const fillStudentDemo = () => {
    setEmail("divakaranperumal27@gmail.com")
    handleLogin("divakaranperumal27@gmail.com")
  }

  const fillTeacherDemo = () => {
    setEmail("priya.sharma@skillloop.demo")
    handleLogin("priya.sharma@skillloop.demo")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern selection:bg-blue-600 transition-colors duration-200">
      {/* Top right theme toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_35px_rgba(34,211,238,0.7)] transition-all">
              <span className="text-white font-extrabold text-2xl tracking-wider">S</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SkillLoop <span className="text-blue-600 dark:text-cyan-400 text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-cyan-950/80 border border-blue-200 dark:border-cyan-500/30 font-mono">AI</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">AI Learning Intelligence Platform</span>
            </div>
          </Link>
          <p className="text-slate-600 dark:text-slate-400 text-xs font-medium">Don't just use AI. Learn with it. Build with it.</p>
        </div>

        {/* Login Card */}
        <Card className="glass-card shadow-xl dark:shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back</CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Sign in to continue your learning journey.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800/80 rounded-xl flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 uppercase">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#050816] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all"
              />
            </div>

            <Button onClick={() => handleLogin()} className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-md text-sm">
              Continue <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-[#080B18] px-2 text-slate-500 font-mono">Or Quick Demo Sign In</span></div>
            </div>

            {/* Quick Demo Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={fillStudentDemo}
                className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 hover:border-blue-500 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 font-bold text-xs">
                  <UserCheck className="w-4 h-4" /> Student Demo
                </div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Divakaran A P</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">divakaranperumal27@...</p>
              </button>

              <button
                onClick={fillTeacherDemo}
                className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/50 hover:border-purple-500 hover:bg-purple-100/70 dark:hover:bg-purple-900/40 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-1 text-purple-600 dark:text-purple-400 font-bold text-xs">
                  <GraduationCap className="w-4 h-4" /> Teacher Demo
                </div>
                <p className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Dr. Priya Sharma</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">priya.sharma@skillloop...</p>
              </button>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 dark:bg-[#050816]/60 border-t border-slate-200 dark:border-slate-800/80 p-4 text-center justify-center">
            <p className="text-xs text-slate-500">
              Smart Education Hackathon Demo · Pre-seeded with 60 students
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
