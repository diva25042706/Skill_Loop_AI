import {
  DEMO_TEACHER_PROFILE,
  DEMO_CLASSROOM_INFO,
  DEMO_60_STUDENTS,
  INITIAL_INTERVENTIONS,
  INITIAL_CLASSROOM_ACTIVITY,
  StudentRecord,
  InterventionRecord,
  ClassroomActivityRecord,
} from '@/lib/data/classroomSeed'
import { useDemoStore } from '@/lib/store/demo-store'

// Helper to resolve live Divakaran data from Zustand store
function getLiveStudents(): StudentRecord[] {
  let liveDivakaranRecursion = 32
  let liveDivakaranOverall = 72

  try {
    const storeState = useDemoStore.getState()
    if (storeState && storeState.skills) {
      const recSkill = storeState.skills.find(s => s.name === 'Recursion')
      if (recSkill) {
        liveDivakaranRecursion = recSkill.mastery
      }
      if (storeState.metrics && storeState.metrics.overallMastery) {
        liveDivakaranOverall = storeState.metrics.overallMastery
      }
    }
  } catch (e) {
    // SSR or store uninitialized fallback
  }

  return DEMO_60_STUDENTS.map(student => {
    if (student.id === 'student-001') {
      const updatedIntervention = liveDivakaranRecursion < 50
      return {
        ...student,
        recursionMastery: liveDivakaranRecursion,
        overallMastery: liveDivakaranOverall,
        interventionRequired: updatedIntervention,
        interventionPriority: updatedIntervention ? 'Medium' : 'Low',
        interventionReason: updatedIntervention ? 'Struggling: Recursion base-case logic' : '',
        lastActive: liveDivakaranRecursion > 32 ? 'Just now (Completed Assessment)' : 'Just now',
      }
    }
    return student
  })
}

// Service Methods
export const classroomService = {
  getTeacherProfile() {
    return DEMO_TEACHER_PROFILE
  },

  getClassroomInfo() {
    return DEMO_CLASSROOM_INFO
  },

  getStudents(): StudentRecord[] {
    return getLiveStudents()
  },

  getStudentById(id: string): StudentRecord | undefined {
    return getLiveStudents().find(s => s.id === id)
  },

  getClassroomStats() {
    const students = getLiveStudents()
    const totalStudents = students.length

    const overallMasterySum = students.reduce((sum, s) => sum + s.overallMastery, 0)
    const overallClassMastery = Math.round(overallMasterySum / totalStudents)

    const needsInterventionCount = students.filter(
      s => s.overallMastery < 55 || s.recursionMastery < 50 || s.attendance < 75
    ).length

    const highAIAssistanceCount = students.filter(s => s.aiAssistanceIndex >= 70).length

    return {
      totalStudents,
      overallClassMastery,
      needsInterventionCount,
      highAIAssistanceCount,
      averageAttendance: Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / totalStudents),
    }
  },

  getClassSkillAnalytics() {
    const students = getLiveStudents()
    const N = students.length

    const skillsList = [
      { key: 'pythonMastery', name: 'Python' },
      { key: 'javaMastery', name: 'Java' },
      { key: 'arraysMastery', name: 'Arrays' },
      { key: 'searchingMastery', name: 'Searching' },
      { key: 'sortingMastery', name: 'Sorting' },
      { key: 'collectionsMastery', name: 'Collections' },
      { key: 'recursionMastery', name: 'Recursion' },
      { key: 'mlMastery', name: 'Machine Learning' },
      { key: 'aiMastery', name: 'Artificial Intelligence' },
    ] as const

    return skillsList.map(item => {
      const avg = Math.round(students.reduce((sum, s) => sum + (s[item.key] || 0), 0) / N)
      const below50 = students.filter(s => (s[item.key] || 0) < 50).length
      const above80 = students.filter(s => (s[item.key] || 0) >= 80).length
      return {
        skill: item.name,
        averageMastery: avg,
        studentsBelow50: below50,
        studentsAbove80: above80,
      }
    })
  },

  getPriorityStudents(limit: number = 5): StudentRecord[] {
    const students = getLiveStudents()
    const flagged = students.filter(s => s.interventionRequired || s.overallMastery < 55 || s.recursionMastery < 45 || s.aiAssistanceIndex >= 75)

    const priorityWeight = { Critical: 3, High: 2, Medium: 1, Low: 0 }

    return flagged
      .sort((a, b) => {
        const wA = priorityWeight[a.interventionPriority] || 0
        const wB = priorityWeight[b.interventionPriority] || 0
        if (wB !== wA) return wB - wA
        return a.overallMastery - b.overallMastery
      })
      .slice(0, limit)
  },

  getMasteryDistribution() {
    const students = getLiveStudents()
    return [
      { range: '90–100', count: students.filter(s => s.overallMastery >= 90).length },
      { range: '80–89', count: students.filter(s => s.overallMastery >= 80 && s.overallMastery < 90).length },
      { range: '70–79', count: students.filter(s => s.overallMastery >= 70 && s.overallMastery < 80).length },
      { range: '60–69', count: students.filter(s => s.overallMastery >= 60 && s.overallMastery < 70).length },
      { range: '50–59', count: students.filter(s => s.overallMastery >= 50 && s.overallMastery < 60).length },
      { range: 'Below 50', count: students.filter(s => s.overallMastery < 50).length },
    ]
  },

  getAIAssistanceDistribution() {
    const students = getLiveStudents()
    return [
      { category: 'Low (0-30%)', count: students.filter(s => s.aiAssistanceIndex <= 30).length, fill: '#22c55e' },
      { category: 'Moderate (31-69%)', count: students.filter(s => s.aiAssistanceIndex > 30 && s.aiAssistanceIndex < 70).length, fill: '#f59e0b' },
      { category: 'High (70-100%)', count: students.filter(s => s.aiAssistanceIndex >= 70).length, fill: '#ef4444' },
    ]
  },

  getClassroomInsights() {
    const analytics = this.getClassSkillAnalytics()
    const weakest = analytics.reduce((min, cur) => (cur.averageMastery < min.averageMastery ? cur : min), analytics[0])
    const strongest = analytics.reduce((max, cur) => (cur.averageMastery > max.averageMastery ? cur : max), analytics[0])
    const stats = this.getClassroomStats()

    return {
      weakestSkill: weakest.skill,
      weakestMastery: weakest.averageMastery,
      studentsBelowThreshold: weakest.studentsBelow50,
      strongestSkill: strongest.skill,
      strongestMastery: strongest.averageMastery,
      needsInterventionCount: stats.needsInterventionCount,
      summary: `Classroom ${weakest.skill} Mastery is currently at ${weakest.averageMastery}%. ${weakest.studentsBelow50} of 60 students are below 50% mastery, with base-case reasoning and call stack limits being the primary bottleneck.`,
      recommendation: `Run a 15-minute guided ${weakest.skill.toLowerCase()} activity followed by a 5-question adaptive assessment. Pair high-mastery students (${strongest.skill} leaders) with struggling peers.`,
    }
  },

  getInterventions(): InterventionRecord[] {
    return INITIAL_INTERVENTIONS
  },

  getRecentActivity(): ClassroomActivityRecord[] {
    const students = getLiveStudents()
    const divakaran = students.find(s => s.id === 'student-001')

    const activity = [...INITIAL_CLASSROOM_ACTIVITY]

    if (divakaran && divakaran.recursionMastery > 32) {
      activity.unshift({
        id: `act-live-${Date.now()}`,
        timestamp: 'Just now',
        studentName: 'Divakaran A P',
        event: `Improved Recursion mastery from 32% to ${divakaran.recursionMastery}%! 🎉`,
        type: 'mastery',
      })
    }

    return activity
  },
}
