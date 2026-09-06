"use client"
import { useState, useMemo } from "react"
import { classroomService } from "@/lib/services/classroomService"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, Search, ArrowUpDown, ChevronLeft, ChevronRight, Eye, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function StudentsListPage() {
  const allStudents = useMemo(() => classroomService.getStudents(), [])
  
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<"all" | "high" | "intervention" | "ai" | "attendance">("all")
  const [sortBy, setSortBy] = useState<"mastery" | "attendance" | "ai" | "name">("mastery")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const pageSize = 15

  // Filter & Search Logic
  const filteredStudents = useMemo(() => {
    return allStudents.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.rollNumber.toLowerCase().includes(search.toLowerCase())
      
      if (!matchSearch) return false

      if (filterCategory === "high") return s.overallMastery >= 80
      if (filterCategory === "intervention") return s.overallMastery < 55 || s.recursionMastery < 50
      if (filterCategory === "ai") return s.aiAssistanceIndex >= 70
      if (filterCategory === "attendance") return s.attendance < 75

      return true
    })
  }, [allStudents, search, filterCategory])

  // Sort Logic
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA = 0
      let valB = 0

      if (sortBy === "mastery") { valA = a.overallMastery; valB = b.overallMastery }
      else if (sortBy === "attendance") { valA = a.attendance; valB = b.attendance }
      else if (sortBy === "ai") { valA = a.aiAssistanceIndex; valB = b.aiAssistanceIndex }
      else if (sortBy === "name") { return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name) }

      return sortOrder === "desc" ? valB - valA : valA - valB
    })
  }, [filteredStudents, sortBy, sortOrder])

  // Pagination
  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedStudents.slice(start, start + pageSize)
  }, [sortedStudents, page])

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600 dark:text-cyan-400" />
            Classroom Roster ({allStudents.length} Students)
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1 text-base font-medium">
            CSE AI & ML — Class 2A · Complete student performance & risk index
          </p>
        </div>
      </div>

      {/* Filters & Search Controls */}
      <Card className="p-4 shadow-sm glass-card">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or roll no..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#050816] text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {[
              { id: "all", label: `All (${allStudents.length})` },
              { id: "high", label: "High Performers (80%+)" },
              { id: "intervention", label: "Needs Intervention" },
              { id: "ai", label: "High AI Assistance" },
              { id: "attendance", label: "Low Attendance (<75%)" },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setFilterCategory(tab.id as any); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterCategory === tab.id
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 text-xs bg-white dark:bg-[#050816] text-slate-900 dark:text-white focus:outline-none font-medium"
            >
              <option value="mastery">Overall Mastery</option>
              <option value="attendance">Attendance</option>
              <option value="ai">AI Assistance</option>
              <option value="name">Student Name</option>
            </select>
            <button
              onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
              className="p-1.5 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Students Data Table */}
      <Card className="overflow-hidden shadow-sm glass-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-[#050816] border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Roll No</th>
                <th className="p-4">Overall Mastery</th>
                <th className="p-4">Recursion</th>
                <th className="p-4">Attendance</th>
                <th className="p-4">AI Assistance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80 bg-transparent">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                    <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        student.id === 'student-001' ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{student.name}</span>
                          {student.id === 'student-001' && (
                            <Badge className="bg-blue-100 text-blue-700 dark:bg-cyan-950 dark:text-cyan-400 border-none text-[10px] font-mono">Live Student</Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-normal font-mono">{student.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-400 font-mono text-xs">{student.rollNumber}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white w-9 font-mono">{student.overallMastery}%</span>
                        <Progress value={student.overallMastery} className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800" />
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={student.recursionMastery < 50 ? "destructive" : student.recursionMastery >= 75 ? "success" : "secondary"} className="font-mono font-bold">
                        {student.recursionMastery}%
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold font-mono ${student.attendance < 75 ? "text-red-600 dark:text-red-400" : "text-slate-700 dark:text-slate-300"}`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className={`font-bold ${student.aiAssistanceIndex >= 70 ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-300"}`}>
                          {student.aiAssistanceIndex}%
                        </span>
                        {student.aiAssistanceIndex >= 70 && (
                          <ShieldAlert className="h-3.5 w-3.5 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {student.interventionRequired ? (
                        <Badge variant={student.interventionPriority === "Critical" ? "destructive" : "warning"} className="font-mono font-bold">
                          {student.interventionPriority} Risk
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:border-green-500/40 dark:bg-green-950/40 dark:text-green-300 font-mono font-bold">
                          On Track
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost" asChild className="h-8 text-blue-600 dark:text-cyan-400 hover:text-blue-700 dark:hover:text-cyan-300 font-bold">
                        <Link href={`/teacher/students/${student.id}`}>
                          <Eye className="w-4 h-4 mr-1" /> View
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#050816] font-mono">
          <span>
            Showing {paginatedStudents.length === 0 ? 0 : (page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedStudents.length)} of {sortedStudents.length} students
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="h-8 border-slate-300 dark:border-slate-700 text-xs font-bold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="font-bold px-2 text-slate-900 dark:text-white">Page {page} of {totalPages}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="h-8 border-slate-300 dark:border-slate-700 text-xs font-bold"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
