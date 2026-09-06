"use client"
import { use } from "react"
import { classroomService } from "@/lib/services/classroomService"
import { useTheme } from "@/lib/context/ThemeContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, ArrowLeft, Brain, AlertTriangle, ShieldAlert, CheckCircle2, Network } from "lucide-react"
import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip
} from "recharts"

export default function StudentDetailPage() {
  const routerParams = useParams()
  const id = typeof routerParams?.id === 'string' ? routerParams.id : Array.isArray(routerParams?.id) ? routerParams.id[0] : ''
  const student = classroomService.getStudentById(id)
  const { theme } = useTheme()

  if (!student) {
    notFound()
  }

  const radarData = [
    { skill: 'Python', mastery: student.pythonMastery },
    { skill: 'Java', mastery: student.javaMastery },
    { skill: 'Arrays', mastery: student.arraysMastery },
    { skill: 'Recursion', mastery: student.recursionMastery },
    { skill: 'ML', mastery: student.mlMastery },
    { skill: 'AI', mastery: student.aiMastery },
  ]

  return (
    <div className="space-y-8 pb-8">
      {/* Back button */}
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Link href="/teacher/students">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Students Roster
          </Link>
        </Button>
      </div>

      {/* Student Overview Header Card */}
      <Card className="p-6 shadow-sm glass-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-cyan-500 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{student.name}</h1>
                {student.id === 'student-001' && (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-cyan-950 dark:text-cyan-400 border-none text-xs font-mono">Live Demo Student</Badge>
                )}
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                Roll No: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{student.rollNumber}</span> · {student.course} · Year {student.year}
              </p>
              <p className="text-slate-400 text-xs mt-1 font-mono">Email: {student.email} · Last Active: {student.lastActive}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 border-slate-200 dark:border-slate-800 pt-4 md:pt-0 w-full md:w-auto justify-between font-mono">
            <div className="text-center px-4 border-r border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Overall Mastery</span>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{student.overallMastery}%</p>
            </div>
            <div className="text-center px-4 border-r border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-400">Attendance</span>
              <p className={`text-3xl font-bold ${student.attendance < 75 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-white"}`}>
                {student.attendance}%
              </p>
            </div>
            <div className="text-center px-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Streak</span>
              <p className="text-3xl font-bold text-orange-500">{student.streak}d</p>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI & Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className={student.interventionRequired ? 'border-amber-300 bg-amber-50/40 dark:border-amber-500/40 dark:bg-amber-950/20' : 'glass-card'}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${student.interventionRequired ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-emerald-950 dark:text-emerald-400'}`}>
              {student.interventionRequired ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Intervention Status</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {student.interventionRequired ? `${student.interventionPriority} Priority Risk` : 'On Track'}
              </p>
              {student.interventionReason && (
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-0.5">{student.interventionReason}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className={student.aiAssistanceIndex >= 70 ? 'border-red-300 bg-red-50/40 dark:border-red-500/40 dark:bg-red-950/20' : 'glass-card'}>
          <CardContent className="p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${student.aiAssistanceIndex >= 70 ? 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'}`}>
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">AI Assistance Index</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{student.aiAssistanceIndex}% Dependency</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {student.aiAssistanceIndex >= 70 ? 'High reliance on full AI answers' : 'Healthy independent solving'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400 rounded-xl">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Recursion Mastery</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white font-mono">{student.recursionMastery}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Key curriculum bottleneck topic</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Radar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
              Skill Radar Analysis
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Individual module breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={theme === 'dark' ? "#1e293b" : "#e2e8f0"} />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontWeight: 'bold' }} />
                <Radar name="Mastery" dataKey="mastery" stroke={theme === 'dark' ? "#22d3ee" : "#2563eb"} fill={theme === 'dark' ? "#3b82f6" : "#2563eb"} fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: 8, 
                    fontSize: 12, 
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

        {/* Detailed Module Scores */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">Curriculum Module Performance</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Detailed mastery per topic</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Python', score: student.pythonMastery },
              { name: 'Java', score: student.javaMastery },
              { name: 'Arrays', score: student.arraysMastery },
              { name: 'Searching', score: student.searchingMastery },
              { name: 'Sorting', score: student.sortingMastery },
              { name: 'Collections', score: student.collectionsMastery },
              { name: 'Recursion', score: student.recursionMastery },
              { name: 'Machine Learning', score: student.mlMastery },
              { name: 'Artificial Intelligence', score: student.aiMastery },
            ].map(mod => (
              <div key={mod.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{mod.name}</span>
                  <span className={`font-mono font-bold ${mod.score < 50 ? 'text-red-500' : mod.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-cyan-400'}`}>
                    {mod.score}%
                  </span>
                </div>
                <Progress value={mod.score} className="h-1.5 bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
