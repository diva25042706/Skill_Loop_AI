import {
  User, Skill, StudentSkill, Assessment, AssessmentQuestion,
  Project, ProjectMilestone, Classroom, ClassStudent,
  StudentAnalytics, LearningPathItem, LearningSession, TutorMessage
} from '@/lib/models/types'

// ===== DEMO USERS =====
export const DEMO_STUDENT: User = {
  id: 'student-001',
  name: 'Divakaran',
  email: 'divakaran@skillloop.ai',
  role: 'STUDENT',
  classId: 'class-2a',
  avatarInitials: 'DK',
  course: 'B.E. CSE AI & ML',
  createdAt: '2024-08-01T00:00:00Z',
}

export const DEMO_TEACHER: User = {
  id: 'teacher-001',
  name: 'Dr. Priya',
  email: 'priya@skillloop.ai',
  role: 'TEACHER',
  classId: 'class-2a',
  avatarInitials: 'DP',
  createdAt: '2024-07-01T00:00:00Z',
}

// ===== SKILLS CATALOG =====
export const SKILLS: Skill[] = [
  // Fundamentals
  { id: 'java-vars', subject: 'Java + DSA', name: 'Variables & Types', parentSkillId: 'java-fundamentals', difficulty: 'BEGINNER', description: 'Primitive types, variables, and type casting in Java' },
  { id: 'java-loops', subject: 'Java + DSA', name: 'Loops & Iteration', parentSkillId: 'java-fundamentals', difficulty: 'BEGINNER', description: 'for, while, do-while loops and iteration patterns' },
  { id: 'java-conditions', subject: 'Java + DSA', name: 'Conditions & Logic', parentSkillId: 'java-fundamentals', difficulty: 'BEGINNER', description: 'if-else, switch statements and boolean logic' },
  // Data Structures
  { id: 'java-arrays', subject: 'Java + DSA', name: 'Arrays', parentSkillId: 'java-ds', difficulty: 'INTERMEDIATE', description: '1D/2D arrays, operations, and common patterns' },
  { id: 'java-strings', subject: 'Java + DSA', name: 'Strings', parentSkillId: 'java-ds', difficulty: 'INTERMEDIATE', description: 'String manipulation, StringBuilder, and common algorithms' },
  { id: 'java-collections', subject: 'Java + DSA', name: 'Collections', parentSkillId: 'java-ds', difficulty: 'INTERMEDIATE', description: 'ArrayList, HashMap, HashSet, and collection operations' },
  // Algorithms
  { id: 'java-searching', subject: 'Java + DSA', name: 'Searching', parentSkillId: 'java-algorithms', difficulty: 'INTERMEDIATE', description: 'Linear search, binary search, and their complexities' },
  { id: 'java-sorting', subject: 'Java + DSA', name: 'Sorting', parentSkillId: 'java-algorithms', difficulty: 'INTERMEDIATE', description: 'Bubble, merge, quick sort and algorithm analysis' },
  { id: 'java-recursion', subject: 'Java + DSA', name: 'Recursion', parentSkillId: 'java-algorithms', difficulty: 'ADVANCED', description: 'Recursive thinking, base cases, call stack, and backtracking' },
]

// ===== STUDENT SKILLS (Mastery Data) =====
export const STUDENT_SKILLS: StudentSkill[] = [
  { userId: 'student-001', skillId: 'java-vars',        masteryScore: 92, confidenceScore: 90, aiAssistanceIndex: 8,  independentSolvingScore: 94, attempts: 24, lastUpdated: '2024-08-17T10:00:00Z', trend: 'stable' },
  { userId: 'student-001', skillId: 'java-loops',       masteryScore: 87, confidenceScore: 85, aiAssistanceIndex: 12, independentSolvingScore: 88, attempts: 18, lastUpdated: '2024-08-16T10:00:00Z', trend: 'stable' },
  { userId: 'student-001', skillId: 'java-conditions',  masteryScore: 90, confidenceScore: 88, aiAssistanceIndex: 10, independentSolvingScore: 91, attempts: 20, lastUpdated: '2024-08-15T10:00:00Z', trend: 'stable' },
  { userId: 'student-001', skillId: 'java-arrays',      masteryScore: 81, confidenceScore: 78, aiAssistanceIndex: 22, independentSolvingScore: 79, attempts: 15, lastUpdated: '2024-08-14T10:00:00Z', trend: 'improving' },
  { userId: 'student-001', skillId: 'java-strings',     masteryScore: 74, confidenceScore: 70, aiAssistanceIndex: 28, independentSolvingScore: 72, attempts: 12, lastUpdated: '2024-08-13T10:00:00Z', trend: 'improving' },
  { userId: 'student-001', skillId: 'java-collections', masteryScore: 44, confidenceScore: 38, aiAssistanceIndex: 58, independentSolvingScore: 40, attempts: 8,  lastUpdated: '2024-08-12T10:00:00Z', trend: 'stable' },
  { userId: 'student-001', skillId: 'java-searching',   masteryScore: 68, confidenceScore: 65, aiAssistanceIndex: 35, independentSolvingScore: 66, attempts: 10, lastUpdated: '2024-08-11T10:00:00Z', trend: 'improving' },
  { userId: 'student-001', skillId: 'java-sorting',     masteryScore: 61, confidenceScore: 55, aiAssistanceIndex: 42, independentSolvingScore: 58, attempts: 9,  lastUpdated: '2024-08-10T10:00:00Z', trend: 'stable' },
  { userId: 'student-001', skillId: 'java-recursion',   masteryScore: 32, confidenceScore: 25, aiAssistanceIndex: 72, independentSolvingScore: 28, attempts: 6,  lastUpdated: '2024-08-09T10:00:00Z', trend: 'declining' },
]

// ===== ASSESSMENT QUESTIONS =====
export const RECURSION_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1', skillId: 'java-recursion', difficulty: 'easy', topic: 'Base Cases',
    text: 'What is the base case in a recursive function used to compute factorial of n?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'n == 0 or n == 1, return 1' },
      { id: 'b', text: 'n > 0, return n' },
      { id: 'c', text: 'n == 1, return 0' },
      { id: 'd', text: 'No base case needed' },
    ],
    correctAnswerId: 'a',
    hint: 'Think about when does the recursion stop — what is the simplest case that can be answered without another recursive call?',
    explanation: 'The base case for factorial is when n is 0 or 1. factorial(0) = 1 and factorial(1) = 1 by definition. Without this, the recursion would continue infinitely.',
  },
  {
    id: 'q2', skillId: 'java-recursion', difficulty: 'easy', topic: 'Call Stack',
    text: 'What happens when a recursive function has no base case?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'The function returns 0' },
      { id: 'b', text: 'The function runs once and exits' },
      { id: 'c', text: 'A StackOverflowError occurs' },
      { id: 'd', text: 'The compiler prevents compilation' },
    ],
    correctAnswerId: 'c',
    hint: 'What happens when Java keeps adding function calls to the call stack indefinitely?',
    explanation: 'Without a base case, the function calls itself indefinitely. Java eventually runs out of stack space and throws a StackOverflowError.',
  },
  {
    id: 'q3', skillId: 'java-recursion', difficulty: 'medium', topic: 'Recursion Mechanics',
    text: 'What does the following recursive method return for n=4?\n\npublic int mystery(int n) {\n  if (n <= 0) return 0;\n  return n + mystery(n - 1);\n}',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: '4' },
      { id: 'b', text: '10' },
      { id: 'c', text: '6' },
      { id: 'd', text: '24' },
    ],
    correctAnswerId: 'b',
    hint: 'Trace the function: mystery(4) = 4 + mystery(3). Keep expanding until the base case.',
    explanation: 'mystery(4) = 4 + mystery(3) = 4 + 3 + mystery(2) = 4 + 3 + 2 + mystery(1) = 4 + 3 + 2 + 1 + mystery(0) = 4 + 3 + 2 + 1 + 0 = 10. This is the sum of 1 to n.',
  },
  {
    id: 'q4', skillId: 'java-recursion', difficulty: 'medium', topic: 'Tree Recursion',
    text: 'How many times is fibonacci(2) called when computing fibonacci(5) using naive recursion?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: '1' },
      { id: 'b', text: '2' },
      { id: 'c', text: '3' },
      { id: 'd', text: '5' },
    ],
    correctAnswerId: 'c',
    hint: 'Draw the recursion tree for fibonacci(5) and count how many times the node fib(2) appears.',
    explanation: 'In the naive recursive implementation, fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2), and fib(3) calls fib(2) and fib(1). So fib(2) is called 3 times. This exponential redundancy is why memoization is important.',
  },
  {
    id: 'q5', skillId: 'java-recursion', difficulty: 'hard', topic: 'Backtracking',
    text: 'In a recursive maze solver, what is the correct action when a path leads to a dead end?',
    type: 'multiple-choice',
    options: [
      { id: 'a', text: 'Stop the entire recursion' },
      { id: 'b', text: 'Return false and try another direction' },
      { id: 'c', text: 'Mark the cell as visited and continue' },
      { id: 'd', text: 'Jump to the start of the maze' },
    ],
    correctAnswerId: 'b',
    hint: 'Think about what "backtracking" means — when a path fails, what should the algorithm do?',
    explanation: 'Backtracking means returning false when a path fails (dead end or already visited) and letting the caller try a different direction. The algorithm explores all possible paths and backtracks when a dead end is found.',
  },
]

// ===== ASSESSMENTS =====
export const DEMO_ASSESSMENT: Assessment = {
  id: 'assessment-001',
  userId: 'student-001',
  skillId: 'java-recursion',
  questions: RECURSION_QUESTIONS,
  responses: [],
  score: 0,
  masteryBefore: 32,
  masteryAfter: 0,
  createdAt: new Date().toISOString(),
  completed: false,
}

// ===== LEARNING SESSION (Demo Tutor Chat) =====
export const DEMO_TUTOR_MESSAGES: TutorMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: "Welcome to your Recursion learning session! 🎯\n\nBefore we dive in, let me gauge where you are. Can you tell me: **What do you think recursion is, in your own words?** Don't worry about being perfect — just share what comes to mind.",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    type: 'question',
  }
]

// ===== PROJECTS =====
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'project-001',
    userId: 'student-001',
    title: 'Maze Solver Using Recursion',
    description: 'Build a program that finds a path through a 2D maze using recursive backtracking. Visualize the algorithm exploring and backtracking through the maze.',
    skills: ['java-recursion', 'java-arrays', 'java-conditions'],
    progress: 0,
    createdAt: new Date().toISOString(),
    status: 'recommended',
    difficulty: 'Intermediate',
    estimatedHours: 6,
    milestones: [
      { id: 'm1', title: 'Understand the Problem', description: 'Analyze the maze structure, understand cell states (open, wall, visited), and define the recursive approach.', completed: false, aiGuidanceAvailable: true },
      { id: 'm2', title: 'Design the Algorithm', description: 'Write pseudocode for the recursive solver. Define base cases: out of bounds, wall hit, already visited, and goal reached.', completed: false, aiGuidanceAvailable: true },
      { id: 'm3', title: 'Implement Core Recursion', description: 'Code the solveMaze(int row, int col) method with proper base cases and recursive calls for all four directions.', completed: false, aiGuidanceAvailable: true },
      { id: 'm4', title: 'Add Backtracking', description: 'Implement the backtracking logic — mark cells as visited when entering, unmark when backtracking.', completed: false, aiGuidanceAvailable: true },
      { id: 'm5', title: 'Test Edge Cases', description: 'Test with no solution, multiple paths, and corner cases. Verify your base cases handle all scenarios.', completed: false, aiGuidanceAvailable: true },
      { id: 'm6', title: 'Add Visualization', description: 'Print the maze state at each step to visualize the algorithm exploring and backtracking.', completed: false, aiGuidanceAvailable: true },
      { id: 'm7', title: 'Document & Reflect', description: 'Write a README explaining your recursive approach and what you learned about backtracking.', completed: false, aiGuidanceAvailable: false },
    ]
  },
  {
    id: 'project-002',
    userId: 'student-001',
    title: 'Binary Search Tree Operations',
    description: 'Implement a complete BST with recursive insert, search, delete, and traversal methods.',
    skills: ['java-recursion', 'java-sorting', 'java-searching'],
    progress: 35,
    createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    status: 'in-progress',
    difficulty: 'Advanced',
    estimatedHours: 8,
    milestones: [
      { id: 'm1', title: 'Define Node Structure', description: 'Create the TreeNode class with data, left, and right fields.', completed: true, aiGuidanceAvailable: false },
      { id: 'm2', title: 'Implement Insert', description: 'Recursive insert while maintaining BST property.', completed: true, aiGuidanceAvailable: false },
      { id: 'm3', title: 'Implement Search', description: 'Recursive search returning the node or null.', completed: false, aiGuidanceAvailable: true },
      { id: 'm4', title: 'Implement Traversals', description: 'In-order, pre-order, post-order traversal.', completed: false, aiGuidanceAvailable: true },
      { id: 'm5', title: 'Implement Delete', description: 'Handle three deletion cases recursively.', completed: false, aiGuidanceAvailable: true },
    ]
  },
]

// ===== STUDENT ANALYTICS =====
export const STUDENT_ANALYTICS: StudentAnalytics = {
  userId: 'student-001',
  overallMastery: 72,
  learningStreak: 7,
  aiDependencyScore: 31,
  projectsBuilt: 3,
  weeklyProgress: [
    { day: 'Mon', mastery: 65 },
    { day: 'Tue', mastery: 68 },
    { day: 'Wed', mastery: 68 },
    { day: 'Thu', mastery: 71 },
    { day: 'Fri', mastery: 70 },
    { day: 'Sat', mastery: 73 },
    { day: 'Sun', mastery: 72 },
  ],
  skillsBreakdown: [
    { name: 'Variables', mastery: 92, category: 'Fundamentals' },
    { name: 'Conditions', mastery: 90, category: 'Fundamentals' },
    { name: 'Loops', mastery: 87, category: 'Fundamentals' },
    { name: 'Arrays', mastery: 81, category: 'Data Structures' },
    { name: 'Strings', mastery: 74, category: 'Data Structures' },
    { name: 'Searching', mastery: 68, category: 'Algorithms' },
    { name: 'Sorting', mastery: 61, category: 'Algorithms' },
    { name: 'Collections', mastery: 44, category: 'Data Structures' },
    { name: 'Recursion', mastery: 32, category: 'Algorithms' },
  ],
  recentActivity: [
    { date: '2024-08-17', event: 'Completed Arrays assessment', score: 81 },
    { date: '2024-08-16', event: 'AI Tutor session: Sorting', score: 61 },
    { date: '2024-08-15', event: 'Completed Strings practice', score: 74 },
    { date: '2024-08-14', event: 'Started BST project' },
    { date: '2024-08-13', event: 'Completed Searching assessment', score: 68 },
  ]
}

// ===== LEARNING PATH =====
export const DEMO_LEARNING_PATH: LearningPathItem[] = [
  { id: 'lp1', title: 'Review recursion base cases', type: 'review', skillId: 'java-recursion', completed: false, priority: 1 },
  { id: 'lp2', title: 'Solve 2 guided recursion problems', type: 'practice', skillId: 'java-recursion', completed: false, priority: 2 },
  { id: 'lp3', title: 'Complete adaptive assessment', type: 'assessment', skillId: 'java-recursion', completed: false, priority: 3 },
  { id: 'lp4', title: 'Start Maze Solver project', type: 'project', skillId: 'java-recursion', completed: false, priority: 4 },
]

// ===== CLASSROOM =====
export const DEMO_CLASSROOM: Classroom = {
  id: 'class-2a',
  teacherId: 'teacher-001',
  name: 'CSE AI & ML — 2A',
  subject: 'Java + DSA',
  overallMastery: 68,
  topicMastery: {
    'Variables': 85,
    'Loops': 82,
    'Conditions': 83,
    'Arrays': 76,
    'Strings': 70,
    'Collections': 51,
    'Searching': 64,
    'Sorting': 58,
    'Recursion': 39,
  },
  commonMisconceptions: [
    'Incorrect base case definition in recursion',
    'Confusing iteration and recursion',
    'Not understanding stack frame accumulation',
    'HashMap vs TreeMap performance differences',
  ],
  aiInsight: '68% of students are struggling with Recursion, especially base-case reasoning. Students show high AI-assistance dependency (avg. 64%) when solving recursive problems, suggesting they are not developing independent recursive thinking.',
  recommendedIntervention: 'Run a 15-minute guided whiteboard activity on recursion base cases followed by a 5-question adaptive assessment. Pair high-mastery students with low-mastery students for peer problem solving.',
  students: [
    { userId: 's001', name: 'Divakaran K', masteryAvg: 72, aiAssistanceIndex: 31, weakSkills: ['Recursion', 'Collections'], lastActive: '2024-08-17', interventionNeeded: false },
    { userId: 's002', name: 'Arjun M', masteryAvg: 45, aiAssistanceIndex: 78, weakSkills: ['Recursion', 'Sorting', 'Collections'], lastActive: '2024-08-16', interventionNeeded: true },
    { userId: 's003', name: 'Preethi S', masteryAvg: 81, aiAssistanceIndex: 22, weakSkills: ['Recursion'], lastActive: '2024-08-17', interventionNeeded: false },
    { userId: 's004', name: 'Karthik R', masteryAvg: 38, aiAssistanceIndex: 89, weakSkills: ['Recursion', 'Sorting', 'Searching', 'Collections'], lastActive: '2024-08-14', interventionNeeded: true },
    { userId: 's005', name: 'Aishwarya N', masteryAvg: 74, aiAssistanceIndex: 35, weakSkills: ['Recursion', 'Collections'], lastActive: '2024-08-17', interventionNeeded: false },
    { userId: 's006', name: 'Rahul V', masteryAvg: 52, aiAssistanceIndex: 65, weakSkills: ['Recursion', 'Sorting'], lastActive: '2024-08-15', interventionNeeded: true },
    { userId: 's007', name: 'Meena T', masteryAvg: 88, aiAssistanceIndex: 15, weakSkills: [], lastActive: '2024-08-17', interventionNeeded: false },
    { userId: 's008', name: 'Suresh P', masteryAvg: 43, aiAssistanceIndex: 81, weakSkills: ['Recursion', 'Collections', 'Sorting'], lastActive: '2024-08-13', interventionNeeded: true },
    { userId: 's009', name: 'Lakshmi B', masteryAvg: 67, aiAssistanceIndex: 48, weakSkills: ['Recursion', 'Sorting'], lastActive: '2024-08-16', interventionNeeded: false },
    { userId: 's010', name: 'Vijay C', masteryAvg: 59, aiAssistanceIndex: 57, weakSkills: ['Recursion', 'Collections'], lastActive: '2024-08-15', interventionNeeded: true },
  ]
}

// ===== HELPER FUNCTIONS =====
export function getStudentSkill(skillId: string): StudentSkill | undefined {
  return STUDENT_SKILLS.find(s => s.skillId === skillId)
}

export function getSkill(skillId: string): Skill | undefined {
  return SKILLS.find(s => s.id === skillId)
}

export function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return 'text-emerald-600'
  if (mastery >= 60) return 'text-blue-600'
  if (mastery >= 40) return 'text-amber-600'
  return 'text-red-500'
}

export function getMasteryBg(mastery: number): string {
  if (mastery >= 80) return 'bg-emerald-500'
  if (mastery >= 60) return 'bg-blue-500'
  if (mastery >= 40) return 'bg-amber-500'
  return 'bg-red-500'
}

export function getMasteryLabel(mastery: number): string {
  if (mastery >= 80) return 'Proficient'
  if (mastery >= 60) return 'Developing'
  if (mastery >= 40) return 'Emerging'
  return 'Needs Focus'
}

export function getAIAssistanceLabel(index: number): 'Low' | 'Medium' | 'High' {
  if (index <= 30) return 'Low'
  if (index <= 60) return 'Medium'
  return 'High'
}

export function calculateMasteryScore(params: {
  assessmentScore: number
  explanationScore: number
  independentSolvingScore: number
  practicalScore: number
  consistencyScore: number
}): number {
  // SkillLoop Learning Intelligence Score — weighted formula
  // Clearly a product metric, not a clinically validated measurement
  return Math.round(
    params.assessmentScore * 0.30 +
    params.explanationScore * 0.20 +
    params.independentSolvingScore * 0.20 +
    params.practicalScore * 0.15 +
    params.consistencyScore * 0.15
  )
}
