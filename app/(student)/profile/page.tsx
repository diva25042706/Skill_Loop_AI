"use client"
import { useMemo } from "react"
import { useDemoStore } from "@/lib/store/demo-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles, Flame, Brain, Code2, AlertTriangle, Network,
  Activity, Download, Award, CheckCircle2, ShieldCheck
} from "lucide-react"

export default function ProfilePage() {
  const { currentUser, metrics, skills } = useDemoStore()

  const recursionSkill = skills.find(s => s.name === 'Recursion')
  const recursionMastery = recursionSkill?.mastery ?? 32

  const handleDownloadPassport = () => {
    window.print()
  }

  return (
    <div className="space-y-8 pb-8 print:p-0 print:space-y-4">
      {/* User Header */}
      <div className="flex items-center gap-5 p-7 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl print:border-none print:shadow-none glass-card">
        <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-md">
          {currentUser.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{currentUser.name}</h1>
          <p className="text-blue-600 dark:text-cyan-400 font-mono text-sm mt-0.5 font-bold">{currentUser.course} · Student ID: {currentUser.id}</p>
          <div className="flex gap-2 mt-2.5">
            <Badge variant="default" className="font-mono font-bold">Active Learner</Badge>
            <Badge variant="success" className="font-mono font-bold">Socratic Mode</Badge>
          </div>
        </div>
      </div>

      {/* PART 3: My Learning Twin */}
      <Card className="border-purple-300 dark:border-purple-500/40 shadow-sm dark:shadow-2xl bg-gradient-to-r from-purple-50/60 via-white to-blue-50/60 dark:from-purple-950/40 dark:via-[#080B18] dark:to-blue-950/40 print:hidden glass-card">
        <CardHeader className="pb-3 border-b border-purple-200 dark:border-purple-500/20">
          <CardTitle className="text-xl font-extrabold flex items-center gap-2 text-purple-900 dark:text-purple-300">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" />
            My Learning Twin (AI Persona Model)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
            AI-generated cognitive understanding of your learning behaviors and retention patterns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-5">
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed p-4 bg-white dark:bg-[#050816]/80 rounded-xl border border-purple-200 dark:border-purple-500/30 font-medium">
            <strong className="text-slate-900 dark:text-white">Divakaran</strong> demonstrates high proficiency in <strong className="text-emerald-600 dark:text-emerald-400">Python</strong> and <strong className="text-blue-600 dark:text-cyan-400">Java fundamentals</strong>. His current primary growth vector is <strong className="text-red-600 dark:text-red-400">Recursion</strong> and complex algorithmic backtracking. He achieves highest mastery through guided Socratic hints prior to independent assessment.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white dark:bg-[#050816]/70 rounded-xl border border-emerald-300 dark:border-emerald-500/30 space-y-2 shadow-sm">
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono text-[10px]">Verified Strengths</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-200 font-semibold">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Python Fundamentals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Java OOP & Methods</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" /> Arrays & Linear Data</li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-[#050816]/70 rounded-xl border border-amber-300 dark:border-amber-500/30 space-y-2 shadow-sm">
              <span className="font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-widest font-mono text-[10px]">Active Growth Focus</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-200 font-semibold">
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" /> Recursion ({recursionMastery}%)</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" /> Collections Framework</li>
                <li className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" /> Recursive Backtracking</li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-[#050816]/70 rounded-xl border border-blue-300 dark:border-blue-500/30 space-y-2 shadow-sm">
              <span className="font-extrabold text-blue-700 dark:text-cyan-400 uppercase tracking-widest font-mono text-[10px]">Cognitive Pattern</span>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 font-medium">
                <li>• Example-driven reasoning</li>
                <li>• Rapid gains with progressive hints</li>
                <li>• High retention with adaptive quizzes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PART 8: Skill Passport Card */}
      <Card className="glass-card border-blue-300 dark:border-cyan-500/40 shadow-sm dark:shadow-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" /> SkillLoop AI Verified Learning Passport
            </div>
            <CardTitle className="text-2xl font-black text-slate-900 dark:text-white">Skill Passport Record</CardTitle>
          </div>
          <Button onClick={handleDownloadPassport} variant="outline" size="sm" className="print:hidden border-slate-300 bg-slate-50 text-blue-600 hover:bg-blue-50 dark:border-cyan-500/40 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/60 font-bold">
            <Download className="w-4 h-4 mr-2" /> Download Skill Passport (PDF)
          </Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {skills.map((s) => (
              <div key={s.id} className="p-3.5 bg-slate-50 dark:bg-[#050816]/80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                <div>
                  {/* BOLD TOPIC NAME */}
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white">{s.name}</p>
                  <p className={`text-lg font-black font-mono ${s.mastery >= 80 ? 'text-emerald-600 dark:text-emerald-400' : s.mastery >= 60 ? 'text-blue-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {s.mastery}%
                  </p>
                </div>
                <Badge variant={s.mastery >= 70 ? 'success' : 'secondary'} className="text-[10px] font-mono font-bold">
                  {s.mastery >= 70 ? 'Verified' : 'In Progress'}
                </Badge>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>Completed Projects: <strong className="text-slate-900 dark:text-white font-bold">{metrics.projectsBuilt}</strong></span>
            <span>Learning Streak: <strong className="text-slate-900 dark:text-white font-bold">{metrics.streak} Days</strong></span>
            <span>AI Assistance Index: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">Low (22%)</strong></span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
