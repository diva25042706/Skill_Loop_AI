"use client"
import { useDemoStore, PROJECT_UNLOCK_THRESHOLD } from "@/lib/store/demo-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Code2, Sparkles, Terminal, Lock, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ProjectsPage() {
  const { skills, isProjectUnlocked } = useDemoStore()
  
  const recursionSkill = skills.find(s => s.name === 'Recursion')
  const recursionMastery = recursionSkill?.mastery ?? 32
  const arraysSkill = skills.find(s => s.name === 'Arrays')
  const arraysMastery = arraysSkill?.mastery ?? 81
  const conditionsSkill = skills.find(s => s.name === 'Conditions')
  const conditionsMastery = conditionsSkill?.mastery ?? 90

  const unlocked = isProjectUnlocked()

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Code2 className="h-8 w-8 text-blue-600 dark:text-cyan-400" />
          <span className="text-gradient-blue">AI Developer Workspace</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-base">
          Bridge theoretical algorithmic reasoning with real-world software project builds.
        </p>
      </div>

      {!unlocked ? (
        <Card className="glass-card border-dashed border-2 border-slate-300 dark:border-slate-700">
          <CardContent className="flex flex-col items-center text-center p-12 space-y-4">
            <div className="h-20 w-20 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner">
              <Lock className="h-10 w-10 text-blue-600 dark:text-cyan-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Maze Solver Project Locked</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-md font-medium leading-relaxed">
              Projects unlock when you achieve <strong className="text-blue-600 dark:text-cyan-400 font-mono">{PROJECT_UNLOCK_THRESHOLD}% mastery</strong> in prerequisite skills. Your current Recursion mastery is <strong className="text-red-600 dark:text-red-400 font-mono">{recursionMastery}%</strong>.
            </p>
            <div className="flex gap-4 pt-2">
              <Button asChild variant="outline" className="border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold">
                <Link href="/tutor">
                  <BookOpen className="w-4 h-4 mr-2" /> Start AI Tutor
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-md">
                <Link href="/assessment">
                  Take Assessment <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="p-7 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900/90 dark:via-indigo-900/90 dark:to-cyan-900/90 rounded-2xl text-white border-none dark:border dark:border-cyan-500/50 shadow-md dark:shadow-[0_0_35px_rgba(34,211,238,0.25)] flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-cyan-200 dark:text-cyan-300 animate-pulse" />
                <span className="font-mono font-extrabold text-cyan-100 dark:text-cyan-300 uppercase tracking-widest text-xs">
                  Skill Verified · Project Unlocked 🎉
                </span>
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Maze Solver Using Recursive Backtracking</h2>
              <p className="text-blue-50 dark:text-slate-200 text-sm max-w-2xl leading-relaxed">
                You have demonstrated proficiency across <strong className="text-white">Java</strong>, <strong className="text-white">Arrays ({arraysMastery}%)</strong>, <strong className="text-white">Conditions ({conditionsMastery}%)</strong>, and <strong className="text-white">Recursion ({recursionMastery}%)</strong>. Build a visual maze solver algorithm using backtracking.
              </p>
            </div>
            <Button size="lg" className="h-12 px-6 bg-white text-blue-700 hover:bg-blue-50 font-black shadow-md whitespace-nowrap hidden md:flex">
              Start Workspace →
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Project Roadmap & Milestones</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">Step-by-step developer implementation with AI mentorship.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="relative pl-8 pb-6 border-l-2 border-emerald-500">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-emerald-500 shadow-sm"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">1. Understand Requirements & 2D Grid Setup</h4>
                      <Badge variant="success">Completed</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Define 2D matrix representations, start/end coordinate points, and wall collision rules.</p>
                  </div>

                  <div className="relative pl-8 pb-6 border-l-2 border-blue-500 dark:border-cyan-500">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-sm"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base">2. Design Backtracking Algorithm (In Progress)</h4>
                      <Badge variant="default">Current</Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Structure the recursive state space. Verify base cases and recursive exploration branching.</p>
                    
                    {/* Adaptive Code Scaffolding */}
                    <div className="bg-slate-900 dark:bg-[#050816] p-4 rounded-xl border border-slate-800 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
                          <Terminal className="h-4 w-4 text-cyan-400"/> Code Scaffolding
                        </span>
                        <Button variant="outline" size="sm" className="h-7 text-xs font-bold border-cyan-500/40 text-cyan-300 bg-cyan-950/40">Ask AI Mentor</Button>
                      </div>
                      <code className="text-xs text-green-400 font-mono block p-3 bg-slate-950 rounded-lg border border-slate-800">
                        // TODO: Implement boolean solveMaze(int[][] grid, int row, int col)<br/>
                        // Base Case 1: If (row, col) is goal -&gt; return true<br/>
                        // Base Case 2: If (row, col) is wall / visited -&gt; return false
                      </code>
                    </div>
                  </div>

                  <div className="relative pl-8 pb-6 border-l-2 border-slate-300 dark:border-slate-800 opacity-60">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-400 dark:bg-slate-800"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-slate-500 dark:text-slate-400 text-base">3. Implement Recursive Exploration & Unmarking</h4>
                    </div>
                  </div>

                  <div className="relative pl-8 border-l-2 border-transparent opacity-60">
                    <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-slate-400 dark:bg-slate-800"></div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-extrabold text-slate-500 dark:text-slate-400 text-base">4. Test Edge Cases & Dynamic Visualizer</h4>
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>

            {/* Applied Skills Sidebar */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">Applied Skills Verified</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#050816]/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs">
                      {/* BOLD TOPIC NAME */}
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">Recursion</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black text-sm">{recursionMastery}%</span>
                    </div>
                    <Progress value={recursionMastery} className="h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-emerald-500" />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#050816]/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs">
                      {/* BOLD TOPIC NAME */}
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">Arrays (2D)</span>
                      <span className="text-blue-600 dark:text-cyan-400 font-mono font-black text-sm">{arraysMastery}%</span>
                    </div>
                    <Progress value={arraysMastery} className="h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-cyan-400" />
                  </div>

                  <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 dark:bg-[#050816]/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between text-xs">
                      {/* BOLD TOPIC NAME */}
                      <span className="font-extrabold text-slate-900 dark:text-white text-sm">Conditions</span>
                      <span className="text-blue-600 dark:text-cyan-400 font-mono font-black text-sm">{conditionsMastery}%</span>
                    </div>
                    <Progress value={conditionsMastery} className="h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
