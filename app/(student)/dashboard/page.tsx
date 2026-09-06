"use client"
import { useMemo } from "react"
import { useDemoStore, PROJECT_UNLOCK_THRESHOLD } from "@/lib/store/demo-store"
import { useTheme } from "@/lib/context/ThemeContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight, Flame, Brain, Code2, AlertTriangle,
  PlayCircle, ClipboardList, CheckCircle2, TrendingUp, Sparkles, Compass
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'GOOD MORNING'
  if (hour < 17) return 'GOOD AFTERNOON'
  return 'GOOD EVENING'
}

function PathStep({
  number, title, description, href, badge, completed, active,
}: {
  number: number
  title: string
  description: string
  href: string
  badge: string
  completed?: boolean
  active?: boolean
}) {
  return (
    <div className={cn(
      "flex gap-4 p-5 rounded-2xl border transition-all glass-card",
      completed ? "bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-500/40" :
      active ? "bg-blue-50/80 border-blue-300 dark:bg-blue-950/40 dark:border-blue-500/50 shadow-sm dark:shadow-[0_0_20px_rgba(59,130,246,0.2)]" :
      "bg-white dark:bg-[#080B18]/70 border-slate-200 dark:border-slate-800"
    )}>
      <div className="mt-0.5 shrink-0">
        {completed ? (
          <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-sm">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        ) : (
          <div className={cn(
            "h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-sm",
            active ? "bg-gradient-to-tr from-blue-600 to-cyan-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          )}>
            {number}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h4 className={cn(
            "font-extrabold text-base tracking-tight",
            completed ? "text-emerald-700 dark:text-emerald-300" :
            active ? "text-slate-900 dark:text-white" : "text-slate-800 dark:text-slate-200"
          )}>
            {completed ? `✓ ${title}` : title}
          </h4>
          <Badge variant={completed ? "success" : active ? "default" : "secondary"} className="shrink-0 font-mono text-xs font-bold">
            {badge}
          </Badge>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-4">{description}</p>
        {!completed && (
          <Button
            asChild
            size="sm"
            variant={active ? "default" : "outline"}
            className={cn(
              "h-9 text-xs font-bold px-4",
              active ? "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-sm" : "border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200"
            )}
          >
            <Link href={href}>
              {active ? (
                <><PlayCircle className="mr-1.5 h-4 w-4" /> Start Step</>
              ) : (
                <><ArrowRight className="mr-1.5 h-4 w-4" /> View Topic</>
              )}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { currentUser, skills, metrics, weeklyProgress, recentActivity, isProjectUnlocked } = useDemoStore()
  const { theme } = useTheme()

  const recursionSkill = skills.find(s => s.name === 'Recursion')
  const recursionMastery = recursionSkill?.mastery ?? 32
  const projectUnlocked = isProjectUnlocked()

  const topSkills = useMemo(() => [...skills].sort((a, b) => b.mastery - a.mastery).slice(0, 5), [skills])

  const greeting = getGreeting()

  return (
    <div className="space-y-8">
      {/* ── Page Header: BOLD GREETING ──────────────────────────── */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <span className="text-gradient-blue">{greeting}, {currentUser.name.toUpperCase()}</span> 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-base">
          Here's your real-time AI learning intelligence and skill progression.
        </p>
      </div>

      {/* ── Dynamic "Your Next Best Action" Card ───────────────── */}
      <Card className={cn(
        "border shadow-xl dark:shadow-2xl transition-all relative overflow-hidden",
        projectUnlocked
          ? "bg-gradient-to-r from-blue-100 via-indigo-50 to-cyan-100 dark:from-blue-900/90 dark:via-indigo-900/90 dark:to-cyan-900/90 border-cyan-400 dark:border-cyan-500/50"
          : "bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-blue-950/80 dark:to-slate-900 border-blue-300 dark:border-blue-500/40"
      )}>
        <CardContent className="p-7">
          <div className="flex items-center gap-2 mb-3">
            <Compass className="h-5 w-5 text-blue-600 dark:text-cyan-400 animate-spin [animation-duration:8s]" />
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-blue-700 dark:text-cyan-300">
              ✦ SkillLoop Intelligence · Next Best Action
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                {projectUnlocked
                  ? `Recursion mastery verified at ${recursionMastery}%! 🎉`
                  : `Recursion mastery is currently at ${recursionMastery}%.`
                }
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed max-w-2xl">
                {projectUnlocked
                  ? "Next step: Apply your verified recursion skills to build the Maze Solver Project with backtracking."
                  : "Next step: Complete a guided recursion challenge with your Socratic AI Tutor to unlock real-world projects."
                }
              </p>
            </div>

            <div>
              {projectUnlocked ? (
                <Button asChild size="lg" className="h-12 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold shadow-md whitespace-nowrap">
                  <Link href="/projects">
                    Start Maze Solver <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold shadow-md whitespace-nowrap">
                  <Link href="/tutor">
                    Start AI Challenge <PlayCircle className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── KPI Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card hover:border-blue-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Mastery</p>
              <div className="h-9 w-9 bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded-xl flex items-center justify-center shadow-sm">
                <Brain className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{metrics.overallMastery}%</p>
            <Progress value={metrics.overallMastery} className="mt-3 h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-cyan-400" />
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-orange-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Learning Streak</p>
              <div className="h-9 w-9 bg-orange-100 dark:bg-orange-950/80 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 rounded-xl flex items-center justify-center shadow-sm">
                <Flame className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{metrics.streak} <span className="text-lg font-bold text-orange-500">days</span></p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-3 font-bold flex items-center gap-1 font-mono">🔥 Active Streak</p>
          </CardContent>
        </Card>

        <Card className={cn("glass-card transition-all", metrics.aiDependencyScore === 'High' ? 'border-red-300 bg-red-50/50 dark:border-red-500/40 dark:bg-red-950/20' : 'hover:border-cyan-500/50')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Assistance</p>
              <div className={cn(
                "h-9 w-9 rounded-xl border flex items-center justify-center shadow-sm",
                metrics.aiDependencyScore === 'High' ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-950/80 dark:text-red-400 dark:border-red-500/30' :
                metrics.aiDependencyScore === 'Medium' ? 'bg-amber-100 text-amber-600 border-amber-200 dark:bg-amber-950/80 dark:text-amber-400 dark:border-amber-500/30' :
                'bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-400 dark:border-emerald-500/30'
              )}>
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <p className={cn(
              "text-3xl font-black font-mono",
              metrics.aiDependencyScore === 'High' ? 'text-red-600 dark:text-red-400' :
              metrics.aiDependencyScore === 'Medium' ? 'text-amber-600 dark:text-amber-400' :
              'text-emerald-600 dark:text-emerald-400'
            )}>
              {metrics.aiDependencyScore}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-mono">
              Index: <span className="text-slate-900 dark:text-white font-bold">{metrics.aiDependencyIndex}%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-purple-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Projects Built</p>
              <div className="h-9 w-9 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 rounded-xl flex items-center justify-center shadow-sm">
                <Code2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{metrics.projectsBuilt}</p>
            {projectUnlocked && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 font-bold flex items-center gap-1 font-mono">
                <TrendingUp className="h-3.5 w-3.5" /> Project Unlocked!
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Weekly Progress Chart: Adaptive Theme ──────────────── */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white">Weekly Mastery Progress</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Overall mastery trajectory across learning sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={weeklyProgress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="masteryGradDual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme === 'dark' ? "#22d3ee" : "#2563eb"} stopOpacity={theme === 'dark' ? 0.4 : 0.25} />
                  <stop offset="95%" stopColor={theme === 'dark' ? "#3b82f6" : "#2563eb"} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#1e293b" : "#e2e8f0"} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ 
                  fontSize: 12, 
                  borderRadius: 10, 
                  backgroundColor: theme === 'dark' ? '#080B18' : '#ffffff', 
                  borderColor: theme === 'dark' ? '#334155' : '#cbd5e1', 
                  color: theme === 'dark' ? '#F8FAFC' : '#0F172A' 
                }}
                formatter={(v: number) => [`${v}%`, 'Mastery Score']}
              />
              <Area
                type="monotone"
                dataKey="mastery"
                stroke={theme === 'dark' ? "#22d3ee" : "#2563eb"}
                strokeWidth={3}
                fill="url(#masteryGradDual)"
                dot={{ r: 4, fill: theme === 'dark' ? '#22d3ee' : '#2563eb', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#60a5fa' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Main Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Path */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Today's Learning Path</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Your adaptive, AI-guided milestones for today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PathStep
                number={1}
                title="Review Recursion Basics with AI Tutor"
                description={`Your Recursion mastery is ${recursionMastery}%. Trace base cases, call stack unwinding, and recursion trees with your Socratic AI Tutor.`}
                href="/tutor"
                badge="~15 mins"
                active={true}
                completed={false}
              />
              <PathStep
                number={2}
                title="Take Adaptive Assessment"
                description="Test your problem solving with 5 adaptive questions. Your skill score will dynamically update in the classroom registry."
                href="/assessment"
                badge="~10 mins"
                active={recursionMastery > 40}
                completed={false}
              />
              <PathStep
                number={3}
                title={projectUnlocked ? "Build Maze Solver Project (Unlocked! 🎉)" : "Build Maze Solver Project (Locked)"}
                description={
                  projectUnlocked
                    ? "Apply recursive backtracking to solve a 2D maze with Java. Your guided developer workspace is ready."
                    : `Requires Recursion mastery ≥ ${PROJECT_UNLOCK_THRESHOLD}%. Complete assessment to unlock.`
                }
                href="/projects"
                badge="~6 hours"
                active={projectUnlocked}
                completed={false}
              />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Activity & Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-start gap-3 text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#050816]/60 border border-slate-200 dark:border-slate-800">
                      <div className={cn(
                        "h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 shadow-sm",
                        a.type === 'mastery' ? 'bg-emerald-500' :
                        a.type === 'project' ? 'bg-purple-500' :
                        a.type === 'assessment' ? 'bg-blue-500' :
                        'bg-slate-400'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 dark:text-slate-100 font-semibold leading-snug">{a.event}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{a.date}</p>
                      </div>
                      {a.score !== undefined && (
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 shrink-0">{a.score}%</span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Skill Overview Sidebar: BOLD TOPIC NAMES */}
        <div className="space-y-6">
          <Card className="glass-card border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white">Skill Overview</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Java + DSA Curriculum Modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSkills.map((skill) => (
                  <div key={skill.id} className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-[#050816]/40 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      {/* BOLD TOPIC NAMES */}
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-wide">{skill.name}</span>
                      <span className={cn(
                        "font-mono font-black text-sm",
                        skill.mastery < 50 ? 'text-red-500 dark:text-red-400' :
                        skill.mastery >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-cyan-400'
                      )}>
                        {skill.mastery}%
                      </span>
                    </div>
                    <Progress
                      value={skill.mastery}
                      className={cn(
                        "h-2 bg-slate-200 dark:bg-slate-800",
                        skill.mastery < 50 ? '[&>div]:bg-red-500' :
                        skill.mastery >= 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-cyan-400'
                      )}
                    />
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-5 h-10 text-xs font-bold border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white" asChild>
                <Link href="/skills">View Full Skill Graph →</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Priority Focus Card */}
          <Card className="bg-gradient-to-br from-red-50 to-amber-50/30 border-red-200 dark:from-slate-900 dark:to-red-950/40 dark:border-red-500/40 shadow-sm dark:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <CardContent className="p-6">
              <p className="text-xs text-red-600 dark:text-red-400 font-mono font-extrabold uppercase tracking-widest mb-3">
                Priority Focus Module
              </p>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-2xl tracking-tight">Recursion</h4>
                  <p className="text-xs text-red-600 dark:text-red-300 font-bold mt-0.5">Algorithms & Backtracking</p>
                </div>
                <span className="text-3xl font-black text-red-600 dark:text-red-400 font-mono">{recursionMastery}%</span>
              </div>
              <Progress value={recursionMastery} className="mt-4 h-2 bg-red-100 dark:bg-slate-800 [&>div]:bg-red-500" />
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-medium">
                Base case identification and call stack unwinding logic need reinforcement before Dynamic Programming.
              </p>
              <Button asChild size="sm" className="mt-5 w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs h-10 shadow-sm">
                <Link href="/tutor">
                  <PlayCircle className="h-4 w-4 mr-2" /> Start AI Socratic Tutor
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
