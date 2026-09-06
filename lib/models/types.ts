// ===== Core Data Models =====

export type UserRole = 'STUDENT' | 'TEACHER'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  classId?: string
  avatarInitials: string
  course?: string
  createdAt: string
}

export type SkillDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'

export interface Skill {
  id: string
  subject: string
  name: string
  parentSkillId?: string
  difficulty: SkillDifficulty
  description: string
}

export type AIAssistanceLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface StudentSkill {
  userId: string
  skillId: string
  masteryScore: number        // 0-100
  confidenceScore: number     // 0-100
  aiAssistanceIndex: number   // 0-100 (higher = more AI dependent)
  independentSolvingScore: number // 0-100
  attempts: number
  lastUpdated: string
  trend: 'improving' | 'stable' | 'declining'
}

export interface QuestionOption {
  id: string
  text: string
}

export interface AssessmentQuestion {
  id: string
  skillId: string
  text: string
  type: 'multiple-choice' | 'code' | 'explanation'
  options?: QuestionOption[]
  correctAnswerId?: string
  correctAnswer?: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  hint?: string
  explanation: string
}

export interface AssessmentResponse {
  questionId: string
  answer: string
  isCorrect: boolean
  timeSpent: number
  hintUsed: boolean
}

export interface Assessment {
  id: string
  userId: string
  skillId: string
  questions: AssessmentQuestion[]
  responses: AssessmentResponse[]
  score: number
  masteryBefore: number
  masteryAfter: number
  createdAt: string
  completed: boolean
}

export interface TutorMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  type?: 'hint' | 'explanation' | 'question' | 'summary' | 'normal'
}

export interface LearningSession {
  id: string
  userId: string
  skillId: string
  messages: TutorMessage[]
  hintsUsed: number
  independentAttempts: number
  masteryBefore: number
  masteryAfter: number
  createdAt: string
  duration: number // minutes
}

export interface ProjectMilestone {
  id: string
  title: string
  description: string
  completed: boolean
  aiGuidanceAvailable: boolean
}

export interface Project {
  id: string
  userId: string
  title: string
  description: string
  skills: string[]
  milestones: ProjectMilestone[]
  progress: number // 0-100
  createdAt: string
  status: 'recommended' | 'in-progress' | 'completed'
  difficulty: string
  estimatedHours: number
}

export interface ClassStudent {
  userId: string
  name: string
  masteryAvg: number
  aiAssistanceIndex: number
  weakSkills: string[]
  lastActive: string
  interventionNeeded: boolean
}

export interface Classroom {
  id: string
  teacherId: string
  name: string
  subject: string
  students: ClassStudent[]
  overallMastery: number
  topicMastery: Record<string, number>
  commonMisconceptions: string[]
  aiInsight: string
  recommendedIntervention: string
}

// ===== Computed / UI Types =====

export interface SkillNode {
  skill: Skill
  studentSkill: StudentSkill
  children: SkillNode[]
}

export interface MasteryBreakdown {
  assessmentScore: number
  explanationScore: number
  independentSolvingScore: number
  practicalApplicationScore: number
  consistencyScore: number
  finalScore: number
}

export interface LearningPathItem {
  id: string
  title: string
  type: 'review' | 'practice' | 'assessment' | 'project'
  skillId: string
  completed: boolean
  priority: number
}

export interface StudentAnalytics {
  userId: string
  overallMastery: number
  learningStreak: number
  aiDependencyScore: number
  projectsBuilt: number
  weeklyProgress: { day: string; mastery: number }[]
  skillsBreakdown: { name: string; mastery: number; category: string }[]
  recentActivity: { date: string; event: string; score?: number }[]
}
