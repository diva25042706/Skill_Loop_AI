import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEMO_STUDENT,
  STUDENT_SKILLS,
  SKILLS,
  STUDENT_ANALYTICS,
  DEMO_PROJECTS,
  DEMO_CLASSROOM,
  DEMO_LEARNING_PATH,
  DEMO_TUTOR_MESSAGES,
} from '@/lib/data/seed'
import type { TutorMessage, LearningPathItem } from '@/lib/models/types'

// ─────────────────────────────────────────────────────────────────────────────
// Mastery calculation — SkillLoop Learning Intelligence Score
// A product heuristic, not a clinically validated measurement.
// ─────────────────────────────────────────────────────────────────────────────
export interface MasteryInput {
  previousMastery: number
  assessmentScore: number   // 0-100: % of questions correct
  hintsUsed: number         // reduces independent solving component
  totalQuestions: number
}

export function calculateUpdatedMastery(input: MasteryInput): number {
  const { previousMastery, assessmentScore, hintsUsed } = input

  // Hint penalty: each hint used reduces independent score by ~8 points
  const hintPenalty = Math.min(hintsUsed * 8, 32)
  const independentScore = Math.max(0, assessmentScore - hintPenalty)

  // Weighted blend of old mastery and new evidence
  const rawScore = Math.round(
    assessmentScore * 0.40 +
    independentScore * 0.30 +
    previousMastery * 0.30
  )

  return Math.max(previousMastery - 5, Math.min(100, rawScore))
}

export const PROJECT_UNLOCK_THRESHOLD = 70

// ─────────────────────────────────────────────────────────────────────────────
// Store types
// ─────────────────────────────────────────────────────────────────────────────
export interface SkillState {
  id: string
  skillId: string
  subject: string
  name: string
  parentSkill: string
  mastery: number
  confidence: number
  aiAssistanceIndex: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface RecentActivity {
  id: string
  date: string
  event: string
  score?: number
  type: 'assessment' | 'tutor' | 'mastery' | 'project' | 'info'
}

export interface AssessmentResult {
  skillId: string
  skillName: string
  masteryBefore: number
  masteryAfter: number
  assessmentScore: number
  hintsUsed: number
  completedAt: string
}

export interface ProofOfLearningResult {
  understanding: number
  independentReasoning: number
  aiAssistance: number
  confidence: number
}

export interface DemoStoreState {
  // Auth State
  isAuthenticated: boolean
  authRole: 'student' | 'teacher'
  authEmail: string

  // User Data
  currentUser: typeof DEMO_STUDENT

  // Skills
  skills: SkillState[]

  // Metrics
  metrics: {
    overallMastery: number
    streak: number
    aiDependencyScore: 'Low' | 'Medium' | 'High'
    aiDependencyIndex: number
    projectsBuilt: number
  }

  // Weekly progress
  weeklyProgress: { day: string; mastery: number }[]

  // Recent activity
  recentActivity: RecentActivity[]

  // Assessment
  lastAssessmentResult: AssessmentResult | null

  // Tutor session & Challenge Mode
  tutorMessages: TutorMessage[]
  tutorHintsUsed: number
  isDemoAIMode: boolean
  isChallengeMode: boolean
  proofOfLearningResult: ProofOfLearningResult | null

  // Learning path
  learningPath: LearningPathItem[]

  // Classroom (teacher view)
  classroomRecursionMastery: number

  // ─── Actions ───────────────────────────────────────────────────────────────
  login: (email: string) => 'student' | 'teacher' | null
  logout: () => void

  toggleChallengeMode: () => void
  setProofOfLearningResult: (res: ProofOfLearningResult | null) => void

  completeAssessment: (result: {
    skillId: string
    assessmentScore: number
    hintsUsed: number
    totalQuestions: number
  }) => void

  addTutorMessage: (msg: TutorMessage) => void
  setDemoAIMode: (val: boolean) => void
  incrementTutorHints: () => void
  resetTutorSession: () => void
  completeLearningPathItem: (id: string) => void
  getSkillMastery: (skillName: string) => number
  isProjectUnlocked: () => boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Build initial skills from seed data
// ─────────────────────────────────────────────────────────────────────────────
function buildInitialSkills(): SkillState[] {
  return STUDENT_SKILLS.map((ss) => {
    const skill = SKILLS.find(s => s.id === ss.skillId)!
    const parentMap: Record<string, string> = {
      'java-fundamentals': 'Fundamentals',
      'java-ds': 'Data Structures',
      'java-algorithms': 'Algorithms',
    }
    return {
      id: ss.skillId,
      skillId: ss.skillId,
      subject: skill.subject,
      name: skill.name,
      parentSkill: parentMap[skill.parentSkillId ?? ''] ?? 'Other',
      mastery: ss.masteryScore,
      confidence: ss.confidenceScore,
      aiAssistanceIndex: ss.aiAssistanceIndex,
      trend: ss.trend,
    }
  })
}

function calcOverallMastery(skills: SkillState[]): number {
  if (!skills.length) return 0
  return Math.round(skills.reduce((sum, s) => sum + s.mastery, 0) / skills.length)
}

function calcAIDependency(skills: SkillState[]): number {
  if (!skills.length) return 0
  return Math.round(skills.reduce((sum, s) => sum + s.aiAssistanceIndex, 0) / skills.length)
}

function aiDependencyLabel(index: number): 'Low' | 'Medium' | 'High' {
  if (index <= 30) return 'Low'
  if (index <= 60) return 'Medium'
  return 'High'
}

const initialSkills = buildInitialSkills()
const initialOverallMastery = calcOverallMastery(initialSkills)
const initialAIIndex = calcAIDependency(initialSkills)

const initialActivity: RecentActivity[] = STUDENT_ANALYTICS.recentActivity.map((a, i) => ({
  id: `activity-seed-${i}`,
  date: a.date,
  event: a.event,
  score: a.score,
  type: a.event.includes('assessment') ? 'assessment' : a.event.includes('Tutor') ? 'tutor' : 'info',
}))

// ─────────────────────────────────────────────────────────────────────────────
// Store definition
// ─────────────────────────────────────────────────────────────────────────────
export const useDemoStore = create<DemoStoreState>()(
  persist(
    (set, get) => ({
      // Auth State
      isAuthenticated: true,
      authRole: 'student',
      authEmail: 'divakaranperumal27@gmail.com',

      currentUser: DEMO_STUDENT,
      skills: initialSkills,

      metrics: {
        overallMastery: initialOverallMastery,
        streak: STUDENT_ANALYTICS.learningStreak,
        aiDependencyScore: aiDependencyLabel(initialAIIndex),
        aiDependencyIndex: initialAIIndex,
        projectsBuilt: STUDENT_ANALYTICS.projectsBuilt,
      },

      weeklyProgress: STUDENT_ANALYTICS.weeklyProgress,
      recentActivity: initialActivity,
      lastAssessmentResult: null,

      tutorMessages: DEMO_TUTOR_MESSAGES,
      tutorHintsUsed: 0,
      isDemoAIMode: false,
      isChallengeMode: false,
      proofOfLearningResult: null,

      learningPath: DEMO_LEARNING_PATH,
      classroomRecursionMastery: DEMO_CLASSROOM.topicMastery['Recursion'] ?? 39,

      // ─── Actions ─────────────────────────────────────────────────────────

      login: (email: string) => {
        const cleaned = email.trim().toLowerCase()
        if (cleaned === 'divakaranperumal27@gmail.com' || cleaned.includes('student')) {
          set({
            isAuthenticated: true,
            authRole: 'student',
            authEmail: 'divakaranperumal27@gmail.com',
          })
          return 'student'
        }
        if (cleaned === 'priya.sharma@skillloop.demo' || cleaned.includes('priya') || cleaned.includes('teacher')) {
          set({
            isAuthenticated: true,
            authRole: 'teacher',
            authEmail: 'priya.sharma@skillloop.demo',
          })
          return 'teacher'
        }
        return null
      },

      logout: () => {
        set({
          isAuthenticated: false,
          authEmail: '',
        })
      },

      toggleChallengeMode: () => {
        set((state) => ({ isChallengeMode: !state.isChallengeMode }))
      },

      setProofOfLearningResult: (res) => {
        set({ proofOfLearningResult: res })
      },

      completeAssessment: ({ skillId, assessmentScore, hintsUsed, totalQuestions }) => {
        const state = get()
        const skillEntry = state.skills.find(s => s.skillId === skillId)
        if (!skillEntry) return

        const previousMastery = skillEntry.mastery
        const newMastery = calculateUpdatedMastery({
          previousMastery,
          assessmentScore,
          hintsUsed,
          totalQuestions,
        })

        const updatedSkills = state.skills.map(s =>
          s.skillId === skillId
            ? { ...s, mastery: newMastery, trend: 'improving' as const }
            : s
        )

        const newOverallMastery = calcOverallMastery(updatedSkills)
        const newAIIndex = calcAIDependency(updatedSkills)

        const result: AssessmentResult = {
          skillId,
          skillName: skillEntry.name,
          masteryBefore: previousMastery,
          masteryAfter: newMastery,
          assessmentScore,
          hintsUsed,
          completedAt: new Date().toISOString(),
        }

        const today = new Date().toISOString().split('T')[0]
        const newActivities: RecentActivity[] = [
          {
            id: `activity-${Date.now()}-1`,
            date: today,
            event: `Completed ${skillEntry.name} assessment`,
            score: assessmentScore,
            type: 'assessment',
          },
          {
            id: `activity-${Date.now()}-2`,
            date: today,
            event: `Mastery increased: ${skillEntry.name} ${previousMastery}% → ${newMastery}%`,
            type: 'mastery',
          },
        ]

        if (previousMastery < PROJECT_UNLOCK_THRESHOLD && newMastery >= PROJECT_UNLOCK_THRESHOLD) {
          newActivities.push({
            id: `activity-${Date.now()}-3`,
            date: today,
            event: 'Project unlocked: Maze Solver using Recursion 🎉',
            type: 'project',
          })
        }

        const updatedWeekly = [...state.weeklyProgress]
        updatedWeekly[updatedWeekly.length - 1] = {
          ...updatedWeekly[updatedWeekly.length - 1],
          mastery: newOverallMastery,
        }

        const updatedPath = state.learningPath.map(item =>
          item.type === 'assessment' && item.skillId === skillId
            ? { ...item, completed: true }
            : item
        )

        set({
          skills: updatedSkills,
          metrics: {
            ...state.metrics,
            overallMastery: newOverallMastery,
            aiDependencyScore: aiDependencyLabel(newAIIndex),
            aiDependencyIndex: newAIIndex,
          },
          weeklyProgress: updatedWeekly,
          recentActivity: [...newActivities, ...state.recentActivity].slice(0, 20),
          lastAssessmentResult: result,
          learningPath: updatedPath,
          classroomRecursionMastery: Math.min(
            100,
            state.classroomRecursionMastery + Math.round((newMastery - previousMastery) * 0.1)
          ),
        })
      },

      addTutorMessage: (msg) =>
        set((state) => ({
          tutorMessages: [...state.tutorMessages, msg],
        })),

      setDemoAIMode: (val) => set({ isDemoAIMode: val }),

      incrementTutorHints: () =>
        set((state) => ({ tutorHintsUsed: state.tutorHintsUsed + 1 })),

      resetTutorSession: () =>
        set({
          tutorMessages: DEMO_TUTOR_MESSAGES,
          tutorHintsUsed: 0,
          isDemoAIMode: false,
          isChallengeMode: false,
          proofOfLearningResult: null,
        }),

      completeLearningPathItem: (id) =>
        set((state) => ({
          learningPath: state.learningPath.map(item =>
            item.id === id ? { ...item, completed: true } : item
          ),
        })),

      getSkillMastery: (skillName) => {
        const skill = get().skills.find(s =>
          s.name.toLowerCase() === skillName.toLowerCase()
        )
        return skill?.mastery ?? 0
      },

      isProjectUnlocked: () => {
        const recursionMastery = get().getSkillMastery('Recursion')
        return recursionMastery >= PROJECT_UNLOCK_THRESHOLD
      },
    }),
    {
      name: 'skillloop-demo-state',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        authRole: state.authRole,
        authEmail: state.authEmail,
        skills: state.skills,
        metrics: state.metrics,
        weeklyProgress: state.weeklyProgress,
        recentActivity: state.recentActivity,
        lastAssessmentResult: state.lastAssessmentResult,
        tutorMessages: state.tutorMessages,
        tutorHintsUsed: state.tutorHintsUsed,
        isDemoAIMode: state.isDemoAIMode,
        isChallengeMode: state.isChallengeMode,
        proofOfLearningResult: state.proofOfLearningResult,
        learningPath: state.learningPath,
        classroomRecursionMastery: state.classroomRecursionMastery,
      }),
    }
  )
)
