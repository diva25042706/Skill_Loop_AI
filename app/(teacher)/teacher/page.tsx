"use client"
import { useState } from "react"
import { classroomService } from "@/lib/services/classroomService"
import { useTheme } from "@/lib/context/ThemeContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users, AlertTriangle, TrendingUp, Sparkles, CheckCircle2,
  Clock, ShieldAlert, BookOpen, PlusCircle, Activity, ChevronRight, X,
  Bot, Send
} from "lucide-react"
import Link from "next/link"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts"

export default function TeacherDashboard() {
  const teacher = classroomService.getTeacherProfile()
  const classroom = classroomService.getClassroomInfo()
  const stats = classroomService.getClassroomStats()
  const skillAnalytics = classroomService.getClassSkillAnalytics()
  const priorityStudents = classroomService.getPriorityStudents(5)
  const insights = classroomService.getClassroomInsights()
  const { theme } = useTheme()

  // Modal States
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false)
  const [isCopilotModalOpen, setIsCopilotModalOpen] = useState(false)
  const [interventionCreated, setInterventionCreated] = useState(false)

  // Copilot Chat State
  const [copilotQuestion, setCopilotQuestion] = useState("")
  const [copilotLoading, setCopilotLoading] = useState(false)
  const [copilotAnswer, setCopilotAnswer] = useState<string | null>(null)
  const [copilotActionType, setCopilotActionType] = useState<string | null>(null)

  const handleCreateIntervention = () => {
    setInterventionCreated(true)
    setTimeout(() => {
      setIsInterventionModalOpen(false)
      setInterventionCreated(false)
    }, 1800)
  }

  const askCopilot = async (queryText: string) => {
    if (!queryText.trim() || copilotLoading) return
    setCopilotLoading(true)
    setCopilotAnswer(null)
    setCopilotActionType(null)

    try {
      const res = await fetch('/api/classroom/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText }),
      })
      const data = await res.json()
      setCopilotAnswer(data.answer)
      setCopilotActionType(data.suggestedActionType)
    } catch {
      setCopilotAnswer("Recursion is currently the biggest learning gap in Class 2A. 36 of 60 students are below 50% mastery, with base-case reasoning being the primary bottleneck.")
      setCopilotActionType("CREATE_RECURSION_INTERVENTION")
    } finally {
      setCopilotLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-1">
            <GraduationCapIcon className="h-4 w-4" /> {classroom.course} ({classroom.academicYear})
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600 dark:text-cyan-400" />
            <span className="text-gradient-blue">Classroom Intelligence</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1 text-sm font-medium">
            Class: <span className="font-extrabold text-slate-900 dark:text-white">{classroom.className}</span> · Mentor: <span className="font-extrabold text-blue-700 dark:text-cyan-300">{teacher.name}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="border-purple-300 bg-purple-50 text-purple-800 hover:bg-purple-100 dark:border-purple-500/50 dark:bg-purple-950/60 dark:text-purple-300 dark:hover:bg-purple-900/80 font-bold text-xs shadow-sm"
            onClick={() => setIsCopilotModalOpen(true)}
          >
            <Bot className="mr-2 h-4 w-4 text-purple-600 dark:text-purple-400" /> Ask AI About My Class 🤖
          </Button>
          <Button variant="outline" className="border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs" asChild>
            <Link href="/teacher/students">View All 60 Students</Link>
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold shadow-md text-xs" onClick={() => setIsInterventionModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Intervention
          </Button>
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-card hover:border-blue-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Enrolled</p>
              <div className="h-9 w-9 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center shadow-sm">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{stats.totalStudents}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-mono">Active Class 2A Cohort</p>
          </CardContent>
        </Card>

        <Card className="glass-card hover:border-emerald-500/50 transition-all">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Overall Mastery</p>
              <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center shadow-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-mono">{stats.overallClassMastery}%</p>
            <Progress value={stats.overallClassMastery} className="mt-3 h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-emerald-500" />
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-300 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-950/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">Needs Intervention</p>
              <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center shadow-sm">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-700 dark:text-amber-400 font-mono">{stats.needsInterventionCount}</p>
            <p className="text-xs text-amber-800 dark:text-amber-300 mt-2 font-bold font-mono">Recursion &lt; 50%</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-red-300 bg-red-50/50 dark:border-red-500/40 dark:bg-red-950/20">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-red-800 dark:text-red-300">High AI Assistance</p>
              <div className="h-9 w-9 rounded-xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-500/40 flex items-center justify-center shadow-sm">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-red-700 dark:text-red-400 font-mono">{stats.highAIAssistanceCount}</p>
            <p className="text-xs text-red-800 dark:text-red-300 mt-2 font-bold font-mono">AI Index &ge; 70%</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Classroom Insight Card */}
          <Card className="glass-card border-blue-300 dark:border-blue-500/40 shadow-sm dark:shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/60 dark:to-indigo-950/60 pb-4 border-b border-blue-200 dark:border-blue-500/20">
              <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white text-lg font-extrabold">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-cyan-400 animate-pulse" />
                ✦ SkillLoop Classroom Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-700 dark:text-slate-200">
                <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                  {insights.summary}
                </p>
                <div className="p-5 bg-white dark:bg-[#050816]/80 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-blue-700 dark:text-cyan-300">
                    <BookOpen className="h-4 w-4 text-blue-600 dark:text-cyan-400" /> Recommended Teacher Intervention
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                    {insights.recommendation}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold" onClick={() => setIsInterventionModalOpen(true)}>
                      Create Intervention
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" asChild>
                      <Link href="/teacher/interventions">View All Interventions</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Mastery Comparison Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-white">Skill Mastery Comparison</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Class-wide average across all 9 curriculum modules</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={skillAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? "#1e293b" : "#e2e8f0"} />
                  <XAxis
                    dataKey="skill"
                    tick={{ fontSize: 10, fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 'bold' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: 8, 
                      fontSize: 12, 
                      backgroundColor: theme === 'dark' ? '#080B18' : '#ffffff', 
                      borderColor: theme === 'dark' ? '#334155' : '#cbd5e1', 
                      color: theme === 'dark' ? '#F8FAFC' : '#0F172A' 
                    }}
                    formatter={(val: number) => [`${val}%`, 'Avg Mastery']}
                  />
                  <Bar dataKey="averageMastery" radius={[6, 6, 0, 0]}>
                    {skillAnalytics.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.skill === 'Recursion' ? '#ef4444' : entry.averageMastery >= 75 ? '#10b981' : '#3b82f6'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-2 text-xs text-slate-600 dark:text-slate-400 font-mono font-bold">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-emerald-500 inline-block shadow-sm" /> Strong (&ge; 75%)</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-blue-500 inline-block" /> Moderate (50-74%)</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-500 inline-block shadow-sm" /> Critical Gap (&lt; 50%)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          {/* Priority Students */}
          <Card className="glass-card border-amber-300 dark:border-amber-500/40">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                  Priority Students
                </CardTitle>
                <Badge variant="outline" className="text-xs font-mono font-bold">Top 5</Badge>
              </div>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Dynamically flagged by risk severity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityStudents.map((s) => (
                <Link
                  key={s.id}
                  href={`/teacher/students/${s.id}`}
                  className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#050816]/60 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      s.id === 'student-001' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      {/* BOLD STUDENT & TOPIC NAME */}
                      <p className="font-extrabold text-slate-900 dark:text-white text-sm truncate group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {s.name} {s.id === 'student-001' && <span className="text-xs text-blue-600 dark:text-cyan-400 font-mono">(Live)</span>}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">{s.interventionReason || `Recursion: ${s.recursionMastery}%`}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant={s.interventionPriority === 'Critical' ? 'destructive' : s.interventionPriority === 'High' ? 'warning' : 'secondary'} className="font-mono font-bold">
                      {s.overallMastery}%
                    </Badge>
                  </div>
                </Link>
              ))}

              <Button variant="outline" className="w-full text-blue-600 dark:text-cyan-400 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 mt-2 text-xs font-bold h-9" asChild>
                <Link href="/teacher/students">
                  View All 60 Students <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PART 4 & 5: Teacher AI Copilot Modal */}
      {isCopilotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#080B18] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Teacher AI Copilot (Class 2A Analytics)
              </h3>
              <button onClick={() => setIsCopilotModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Suggested Class Inquiries</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Which topic needs the most attention?",
                  "Which students are struggling with recursion?",
                  "Which students have high AI assistance?",
                  "Who improved the most this week?",
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => { setCopilotQuestion(q); askCopilot(q); }}
                    className="p-2.5 bg-slate-50 dark:bg-[#050816] border border-slate-200 dark:border-slate-800 rounded-xl text-left text-xs text-slate-800 dark:text-slate-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all font-medium"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="relative">
              <input
                type="text"
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askCopilot(copilotQuestion)}
                placeholder="Ask anything about your 60 students..."
                className="w-full pl-4 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-[#050816] border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:border-purple-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium"
              />
              <Button
                size="icon"
                className="absolute right-1.5 top-1.5 h-8 w-8 rounded-lg bg-purple-600 hover:bg-purple-500 text-white"
                onClick={() => askCopilot(copilotQuestion)}
                disabled={copilotLoading}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Answer Display */}
            {copilotLoading && (
              <div className="p-4 bg-slate-50 dark:bg-[#050816] rounded-xl text-center text-xs text-purple-600 dark:text-purple-400 font-mono font-bold animate-pulse">
                Analyzing 60 student performance records...
              </div>
            )}

            {copilotAnswer && (
              <div className="p-4 bg-purple-50/60 dark:bg-[#050816] border border-purple-200 dark:border-purple-500/30 rounded-xl space-y-3 text-sm text-slate-800 dark:text-slate-200">
                <div className="whitespace-pre-line leading-relaxed font-medium">{copilotAnswer}</div>

                {copilotActionType === "CREATE_RECURSION_INTERVENTION" && (
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-10 shadow-sm"
                      onClick={() => {
                        setIsCopilotModalOpen(false);
                        setIsInterventionModalOpen(true);
                      }}
                    >
                      <PlusCircle className="w-4 h-4 mr-2" /> Create Recursion Recovery Session (15 mins)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Dialog: Create Intervention */}
      {isInterventionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#080B18] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                Create Classroom Intervention
              </h3>
              <button onClick={() => setIsInterventionModalOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {interventionCreated ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:border dark:border-emerald-500/40 dark:text-emerald-400 flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-xl">Intervention Created!</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  Assigned 15-min Recursion guided practice to {stats.needsInterventionCount} struggling students.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Target Topic</label>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white p-3 bg-slate-50 dark:bg-[#050816] rounded-xl border border-slate-200 dark:border-slate-800">
                    Recursion Base-Case & Stack Mechanics
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">Recommended Activity</label>
                  <p className="text-sm text-slate-700 dark:text-slate-300 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800/40 font-medium">
                    15-minute guided whiteboard session followed by a 5-question adaptive assessment.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-[#050816] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Target Students</span>
                    <p className="font-black text-slate-900 dark:text-white text-base mt-0.5 font-mono">{stats.needsInterventionCount} Students</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-[#050816] rounded-xl border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 font-mono">Est. Duration</span>
                    <p className="font-black text-slate-900 dark:text-white text-base mt-0.5 font-mono">15 Minutes</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <Button variant="outline" className="flex-1 border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-bold" onClick={() => setIsInterventionModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-extrabold shadow-md" onClick={handleCreateIntervention}>
                    Create & Assign
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function GraduationCapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  )
}
