"use client"
import { useState } from "react"
import { classroomService } from "@/lib/services/classroomService"
import { InterventionRecord } from "@/lib/data/classroomSeed"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GraduationCap, PlusCircle, CheckCircle2, Clock, Sparkles, X, User } from "lucide-react"
import Link from "next/link"

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<InterventionRecord[]>(() =>
    classroomService.getInterventions()
  )

  const stats = classroomService.getClassroomStats()

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  const handleCreateNew = () => {
    const newInt: InterventionRecord = {
      id: `int-${Date.now()}`,
      studentId: 'class-all',
      studentName: 'Classroom Group (11 Students)',
      rollNumber: 'CLASS-2A',
      skill: 'Recursion',
      reason: '11 Students below 50% Recursion mastery',
      priority: 'High',
      recommendedAction: '15-min guided whiteboard base-case activity + 5-question adaptive quiz.',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      assignedTo: 'Dr. Priya Sharma',
    }

    setInterventions(prev => [newInt, ...prev])
    setSuccessMsg(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setSuccessMsg(false)
    }, 1500)
  }

  const handleResolve = (id: string) => {
    setInterventions(prev =>
      prev.map(item => item.id === id ? { ...item, status: 'Completed' as const } : item)
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            Classroom Interventions
          </h1>
          <p className="text-slate-500 mt-1 text-base">
            Targeted AI-recommended learning interventions for struggling students
          </p>
        </div>
        <div>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Intervention
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-amber-700 uppercase">Active Flagged Students</p>
            <p className="text-3xl font-bold text-amber-800 mt-1">{stats.needsInterventionCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase">Interventions In Progress</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">
              {interventions.filter(i => i.status === 'In Progress' || i.status === 'Pending').length}
            </p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-5">
            <p className="text-xs font-semibold text-green-700 uppercase">Completed Interventions</p>
            <p className="text-3xl font-bold text-green-800 mt-1">
              {interventions.filter(i => i.status === 'Completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interventions List */}
      <Card>
        <CardHeader>
          <CardTitle>Active & Past Interventions</CardTitle>
          <CardDescription>Actions assigned to address classroom skill gaps</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {interventions.map((item) => (
            <div key={item.id} className="p-5 border border-slate-200 rounded-xl bg-white space-y-3 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                    {item.studentName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{item.studentName}</h4>
                    <p className="text-xs text-slate-500">{item.rollNumber} · Skill: <span className="font-semibold text-slate-700">{item.skill}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.priority === 'Critical' ? 'destructive' : item.priority === 'High' ? 'warning' : 'secondary'}>
                    {item.priority} Priority
                  </Badge>
                  <Badge variant={item.status === 'Completed' ? 'success' : 'outline'}>
                    {item.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-slate-600">
                  <strong className="text-slate-800">Issue / Trigger:</strong> {item.reason}
                </p>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  <strong className="text-blue-900 block mb-1">Recommended Action:</strong>
                  {item.recommendedAction}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Assigned by {item.assignedTo || 'Dr. Priya Sharma'}
                </span>
                <div className="flex items-center gap-2">
                  {item.status !== 'Completed' && (
                    <>
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        Assign Adaptive Quiz
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs" onClick={() => handleResolve(item.id)}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal Dialog: Create Intervention */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Create Custom Intervention
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {successMsg ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg">Intervention Created!</h4>
                <p className="text-sm text-slate-500">Successfully created and logged intervention activity.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Target Skill</label>
                  <input
                    type="text"
                    defaultValue="Recursion"
                    className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase">Intervention Action</label>
                  <textarea
                    rows={3}
                    defaultValue="Run a 15-minute guided whiteboard activity on recursion base cases followed by a 5-question adaptive assessment."
                    className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-700 outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleCreateNew}>
                    Create Intervention
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
