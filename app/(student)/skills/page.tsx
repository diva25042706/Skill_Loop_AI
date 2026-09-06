"use client"
import { useMemo } from "react"
import { useDemoStore, PROJECT_UNLOCK_THRESHOLD } from "@/lib/store/demo-store"
import { useTheme } from "@/lib/context/ThemeContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Network, AlertCircle, Target, TrendingUp, PlayCircle } from "lucide-react"
import Link from "next/link"
import {
  RadarChart, PolarGrid, PolarAngleAxis,
  Radar, ResponsiveContainer, Tooltip
} from "recharts"

function SkillCard({ name, mastery, confidence }: { name: string; mastery: number; confidence: number }) {
  const isCritical = mastery < 50
  const isProficient = mastery >= 80

  return (
    <div className={cn(
      "p-4 rounded-xl border transition-all glass-card",
      isCritical ? "border-red-300 bg-red-50/50 dark:border-red-500/40 dark:bg-red-950/20" :
      isProficient ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-950/20" :
      "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#080B18]/70 hover:border-blue-500/40"
    )}>
      <div className="flex justify-between items-start mb-3">
        {/* BOLD TOPIC NAME */}
        <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-wide">{name}</span>
        <Badge variant={isCritical ? 'destructive' : isProficient ? 'success' : 'default'} className="text-xs font-mono font-bold">
          {mastery}%
        </Badge>
      </div>
      <Progress
        value={mastery}
        className={cn(
          "h-2 bg-slate-200 dark:bg-slate-800",
          isCritical ? '[&>div]:bg-red-500' :
          isProficient ? '[&>div]:bg-emerald-500' : '[&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-cyan-400'
        )}
      />
      <div className="mt-3 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-mono">
        <span>Confidence: <strong className="text-slate-700 dark:text-slate-200">{confidence}%</strong></span>
        {isCritical && (
          <span className="text-red-600 dark:text-red-400 flex items-center gap-1 font-bold">
            <AlertCircle className="h-3.5 w-3.5" /> Needs Focus
          </span>
        )}
        {isProficient && (
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5" /> Verified
          </span>
        )}
      </div>
    </div>
  )
}

export default function SkillsPage() {
  const { skills, isProjectUnlocked } = useDemoStore()
  const { theme } = useTheme()

  const groupedSkills = useMemo(() =>
    skills.reduce((acc, skill) => {
      const parent = skill.parentSkill || 'Other'
      if (!acc[parent]) acc[parent] = []
      acc[parent].push(skill)
      return acc
    }, {} as Record<string, typeof skills>),
    [skills]
  )

  const focusSkill = useMemo(() =>
    [...skills].sort((a, b) => a.mastery - b.mastery)[0],
    [skills]
  )

  const radarData = useMemo(() => {
    const RADAR_SKILLS = ['Arrays', 'Searching', 'Sorting', 'Collections', 'Recursion']
    return RADAR_SKILLS.map(name => {
      const s = skills.find(sk => sk.name === name)
      return { skill: name, mastery: s?.mastery ?? 0 }
    })
  }, [skills])

  const projectUnlocked = isProjectUnlocked()
  const overallMastery = useMemo(() =>
    Math.round(skills.reduce((sum, s) => sum + s.mastery, 0) / skills.length),
    [skills]
  )

  return (
    <div className="space-y-8">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Network className="h-8 w-8 text-blue-600 dark:text-cyan-400 animate-pulse" />
          <span className="text-gradient-blue">AI Skill Knowledge Graph</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-300 font-medium text-base">
          Interactive knowledge representation across all core Java and DSA competencies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Skill Groups ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">Java & DSA Curriculum</CardTitle>
                  <CardDescription className="mt-1 text-slate-500 dark:text-slate-400">Track competency mastery across all interconnected concepts.</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400">Class Average</p>
                  <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono">{overallMastery}%</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              {Object.entries(groupedSkills).map(([parent, categorySkills]) => (
                <div key={parent} className="space-y-3">
                  <h3 className="text-sm font-extrabold text-blue-700 dark:text-cyan-300 flex items-center gap-2 uppercase font-mono tracking-wider">
                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    {parent}
                    <Badge variant="default" className="text-xs ml-auto font-mono font-bold">
                      Avg {Math.round(categorySkills.reduce((s, sk) => s + sk.mastery, 0) / categorySkills.length)}%
                    </Badge>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-1">
                    {categorySkills.map(skill => (
                      <SkillCard
                        key={skill.id}
                        name={skill.name}
                        mastery={skill.mastery}
                        confidence={skill.confidence}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ── Right Panel ───────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white">Skill Intelligence Radar</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Multi-axis algorithm mastery profile</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={theme === 'dark' ? "#1e293b" : "#e2e8f0"} />
                  <PolarAngleAxis
                    dataKey="skill"
                    tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 'bold' }}
                  />
                  <Radar
                    name="Mastery"
                    dataKey="mastery"
                    stroke={theme === 'dark' ? "#22d3ee" : "#2563eb"}
                    fill={theme === 'dark' ? "#3b82f6" : "#2563eb"}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{ 
                      fontSize: 12, 
                      borderRadius: 8, 
                      backgroundColor: theme === 'dark' ? '#080B18' : '#ffffff', 
                      borderColor: theme === 'dark' ? '#334155' : '#cbd5e1', 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A' 
                    }}
                    formatter={(v: number) => [`${v}%`, 'Mastery']}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Focus Area */}
          {focusSkill && (
            <Card className="bg-gradient-to-br from-red-50 to-amber-50/40 border-red-200 dark:from-slate-900 dark:via-red-950/40 dark:to-slate-900 dark:border-red-500/40 shadow-sm dark:shadow-[0_0_20px_rgba(239,68,68,0.2)]">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white flex items-center gap-2 text-base font-extrabold">
                  <Target className="h-5 w-5 text-red-500 dark:text-red-400" />
                  Priority Skill Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white dark:bg-[#050816]/70 rounded-xl border border-red-200 dark:border-red-500/30">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      {/* BOLD TOPIC NAME */}
                      <h4 className="font-black text-red-600 dark:text-red-400 text-xl">{focusSkill.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{focusSkill.parentSkill}</p>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{focusSkill.mastery}%</span>
                  </div>
                  <Progress
                    value={focusSkill.mastery}
                    className="mt-3 h-2 bg-red-100 dark:bg-slate-800 [&>div]:bg-red-500"
                  />
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-medium">
                    {focusSkill.name === 'Recursion'
                      ? 'Define base cases clearly and visualize the call stack before attempting Dynamic Programming.'
                      : `Focus on strengthening ${focusSkill.name} to improve overall classroom ranking.`}
                  </p>
                  <Button asChild size="sm" className="mt-4 w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs h-9 shadow-sm">
                    <Link href="/tutor">
                      <PlayCircle className="h-4 w-4 mr-2" /> Start Guided Socratic Session
                    </Link>
                  </Button>
                </div>

                {/* Project Unlock Status */}
                <div className={cn(
                  "p-3 rounded-xl border text-xs font-medium",
                  projectUnlocked
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-300"
                    : "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-900/80 dark:border-slate-800 dark:text-slate-300"
                )}>
                  {projectUnlocked ? (
                    <>🎉 <strong className="text-slate-900 dark:text-white font-bold">Maze Solver project unlocked!</strong> Your Recursion mastery crossed {PROJECT_UNLOCK_THRESHOLD}%.</>
                  ) : (
                    <>🔒 Reach <strong className="text-blue-600 dark:text-cyan-400 font-bold">{PROJECT_UNLOCK_THRESHOLD}% Recursion mastery</strong> to unlock the Maze Solver project ({PROJECT_UNLOCK_THRESHOLD - (focusSkill.mastery ?? 0)} more points needed).</>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
