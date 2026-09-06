// ===== SkillLoop AI Service =====
// Centralized AI interactions via Gemini API
// All AI logic lives here — never scatter API calls in UI components.

import { GoogleGenerativeAI } from '@google/generative-ai'

// ─────────────────────────────────────────────────────────────────────────────
// Initialization
// ─────────────────────────────────────────────────────────────────────────────
let genAI: GoogleGenerativeAI | null = null

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.trim() === '') {
      throw new Error('Gemini API key not configured')
    }
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export function isGeminiConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY
  return !!(key && key !== 'your_gemini_api_key_here' && key.trim() !== '')
}

// ─────────────────────────────────────────────────────────────────────────────
// System Prompts
// ─────────────────────────────────────────────────────────────────────────────

const TUTOR_SYSTEM_PROMPT = `You are SkillLoop's AI Tutor — a patient, Socratic educator specializing in Java and Data Structures.

Your teaching philosophy:
1. NEVER immediately reveal answers when a student hasn't attempted the problem first.
2. Always ask a diagnostic question to gauge the student's current understanding.
3. Give progressive hints (Hint 1 → Hint 2 → Partial answer) if the student is struggling.
4. Identify and gently correct misconceptions.
5. Adapt your explanation difficulty based on student responses.
6. Encourage independent reasoning by asking "what do you think happens if...?"
7. Never shame students — frame every interaction positively.
8. End sessions with a brief summary of what was learned.
9. Keep responses concise (2-4 paragraphs max). Use code blocks only when essential.
10. Use emoji sparingly (1-2 max per message).

You MUST return a valid JSON object (no other text). Structure:
{
  "message": "<your tutoring response in markdown>",
  "responseType": "question" | "hint" | "explanation" | "encouragement" | "summary",
  "hintLevel": 0 | 1 | 2 | 3,
  "misconception": "<identified misconception or null>",
  "suggestedAction": "continue" | "take_assessment" | "try_problem" | "review_concept"
}

Current demo subject: Java + DSA, focusing on Recursion.`

const ASSESSMENT_SYSTEM_PROMPT = `You are SkillLoop's Assessment Agent. Generate adaptive assessment questions based on student skill level.
Return ONLY valid JSON. No explanations outside the JSON structure.`

const PROJECT_MENTOR_PROMPT = `You are SkillLoop's Project Mentor. Your role is to guide students through building real projects.
Rules:
- Recommend projects that directly apply the skills the student has mastered.
- Break projects into clear milestones.
- Guide with questions, not complete solutions.
- When asked for code, provide partial scaffolding with TODO comments.
- Celebrate progress and encourage independent implementation.`

const TEACHER_INSIGHT_PROMPT = `You are SkillLoop's Classroom Intelligence Agent. Analyze class-level learning data and provide actionable insights.
Rules:
- Identify common misconceptions and topic-level weaknesses from the data.
- Recommend specific, actionable interventions (not generic advice).
- Never make unsupported claims about individual students.
- Present insights in clear, professional language suitable for educators.
- Return structured JSON responses.`

// ─────────────────────────────────────────────────────────────────────────────
// Tutor Types
// ─────────────────────────────────────────────────────────────────────────────

export interface TutorResponseStructured {
  message: string
  responseType: 'question' | 'hint' | 'explanation' | 'encouragement' | 'summary'
  hintLevel: 0 | 1 | 2 | 3
  misconception: string | null
  suggestedAction: 'continue' | 'take_assessment' | 'try_problem' | 'review_concept'
  isDemoMode: boolean
}

export interface TutorContext {
  skillName: string
  masteryScore: number
  hintsUsed: number
  conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Fallbacks — Socratic responses that demonstrate the product experience
// ─────────────────────────────────────────────────────────────────────────────

const DEMO_FALLBACKS: Record<string, TutorResponseStructured> = {
  default: {
    message: "That's a great starting point! 🤔 Before I explain, let me ask: **What do you think a function needs to guarantee it eventually stops calling itself?**\n\nIn recursion, there's always a point where the problem becomes so small it can be answered directly — without another call. Can you identify what that might be?",
    responseType: 'question',
    hintLevel: 0,
    misconception: null,
    suggestedAction: 'continue',
    isDemoMode: true,
  },
  recursion: {
    message: "Great — let's explore recursion together! 🎯\n\nBefore I explain, here's a question: **Imagine you're looking for a key in a nested set of boxes. You open a box and either find the key or find more boxes. What would guarantee you always stop searching?**\n\nThat's the essence of recursion. Every recursive function needs:\n1. A **base case** — the simplest situation you can answer directly\n2. A **recursive case** — breaking the problem into a smaller version of itself\n\nWhat do you think the base case would be for computing `factorial(n)`?",
    responseType: 'question',
    hintLevel: 0,
    misconception: null,
    suggestedAction: 'continue',
    isDemoMode: true,
  },
  hint: {
    message: "Here's a hint 💡\n\nThink about what value makes the problem trivially solvable. For factorial: what is `factorial(0)`?\n\nThat's your base case — when `n` is 0 or 1, return 1. No more recursion needed.\n\nNow, what should the recursive case return in terms of `n` and `factorial(n-1)`?",
    responseType: 'hint',
    hintLevel: 1,
    misconception: null,
    suggestedAction: 'try_problem',
    isDemoMode: true,
  },
  explain: {
    message: "Let me break down recursion step by step:\n\n**Recursion** is when a function calls itself to solve a smaller version of the same problem.\n\n```java\npublic int factorial(int n) {\n    if (n <= 1) return 1;  // Base case\n    return n * factorial(n - 1);  // Recursive case\n}\n```\n\n**Key insight**: `factorial(5)` = 5 × `factorial(4)` = 5 × 4 × `factorial(3)` = ... = 120\n\nThe call stack *unwinds* from the base case upward. Does this make sense? Can you trace `factorial(3)` yourself?",
    responseType: 'explanation',
    hintLevel: 0,
    misconception: null,
    suggestedAction: 'try_problem',
    isDemoMode: true,
  },
  example: {
    message: "Let me show you recursion with a concrete example 🔍\n\n**Problem**: Count down from `n` to 1\n\n```java\npublic void countDown(int n) {\n    if (n <= 0) return;          // Base case: stop\n    System.out.println(n);      // Do something\n    countDown(n - 1);           // Recurse with smaller n\n}\n```\n\nFor `countDown(3)`: prints 3 → calls `countDown(2)` → prints 2 → calls `countDown(1)` → prints 1 → calls `countDown(0)` → returns.\n\nNow try this: **How would you modify this to count UP from 1 to n using recursion?**",
    responseType: 'explanation',
    hintLevel: 0,
    misconception: null,
    suggestedAction: 'try_problem',
    isDemoMode: true,
  },
  assessment: {
    message: "Excellent work today! 🎉 You've shown a solid understanding of:\n1. Why recursive functions need a base case\n2. How the call stack accumulates and unwinds\n3. The difference between iterative and recursive thinking\n\nI think you're ready to test your understanding more formally. **Take the adaptive assessment** to get a precise mastery score and unlock your first project.",
    responseType: 'summary',
    hintLevel: 0,
    misconception: null,
    suggestedAction: 'take_assessment',
    isDemoMode: true,
  },
  base_case: {
    message: "Exactly right! A **base case** stops the recursion. 🎯\n\nWithout one, the function would call itself forever until Java throws a `StackOverflowError` — because each call adds a new frame to the call stack, and memory is finite.\n\nHere's the key mental model: think of recursion as a problem that **shrinks** with each call. The base case handles the smallest, simplest form.\n\n**Follow-up question**: What do you think happens to all those function calls waiting in the stack while the recursion goes deeper?",
    responseType: 'question',
    hintLevel: 0,
    misconception: null,
    suggestedAction: 'continue',
    isDemoMode: true,
  },
  confused: {
    message: "That's completely okay — recursion is one of the trickier concepts! 😊\n\nLet me try a different angle. Think of **Russian nesting dolls** (Matryoshka). You have a big doll, and inside is a slightly smaller doll, and inside that is an even smaller one... until you reach the tiniest doll that doesn't open.\n\nThat tiniest doll is your **base case**. Every other doll is a **recursive case**.\n\nDoes that analogy help? What part is still fuzzy for you?",
    responseType: 'encouragement',
    hintLevel: 0,
    misconception: 'Conceptual confusion about recursion',
    suggestedAction: 'review_concept',
    isDemoMode: true,
  },
}

function selectDemoFallback(userMessage: string): TutorResponseStructured {
  const msg = userMessage.toLowerCase()
  if (msg.includes('assessment') || msg.includes('ready') || msg.includes('test')) return DEMO_FALLBACKS.assessment
  if (msg.includes('base case') || msg.includes('stop')) return DEMO_FALLBACKS.base_case
  if (msg.includes('hint') || msg.includes('help') || msg.includes('stuck')) return DEMO_FALLBACKS.hint
  if (msg.includes('explain') || msg.includes('what is') || msg.includes('how does')) return DEMO_FALLBACKS.explain
  if (msg.includes('example') || msg.includes('show me') || msg.includes('demonstrate')) return DEMO_FALLBACKS.example
  if (msg.includes('recursion') || msg.includes('recursive')) return DEMO_FALLBACKS.recursion
  if (msg.includes("don't know") || msg.includes('not sure') || msg.includes('confused') || msg.includes('lost')) return DEMO_FALLBACKS.confused
  return DEMO_FALLBACKS.default
}

// ─────────────────────────────────────────────────────────────────────────────
// Core AI Functions
// ─────────────────────────────────────────────────────────────────────────────

export async function generateTutorResponse(
  userMessage: string,
  context: TutorContext
): Promise<TutorResponseStructured> {
  if (!isGeminiConfigured()) {
    await new Promise(r => setTimeout(r, 600 + Math.random() * 800))
    return selectDemoFallback(userMessage)
  }

  try {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: TUTOR_SYSTEM_PROMPT,
    })

    const chat = model.startChat({ history: context.conversationHistory })

    const contextPrefix = `[Student context: Learning ${context.skillName}, Mastery: ${context.masteryScore}%, Hints used this session: ${context.hintsUsed}]\n\nStudent message: `
    const result = await chat.sendMessage(contextPrefix + userMessage)
    const rawText = result.response.text().replace(/```json\n?|\n?```/g, '').trim()

    const parsed = JSON.parse(rawText) as TutorResponseStructured
    return { ...parsed, isDemoMode: false }
  } catch (error) {
    console.error('Tutor AI error — falling back to demo mode:', error)
    const fallback = selectDemoFallback(userMessage)
    // Small delay so it still feels like AI is processing
    await new Promise(r => setTimeout(r, 400))
    return { ...fallback, isDemoMode: true }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Evaluation
// ─────────────────────────────────────────────────────────────────────────────

export interface EvaluationResult {
  understanding: number
  accuracy: number
  misconceptions: string[]
  feedback: string
  masteryDelta: number
}

export async function evaluateExplanation(
  studentExplanation: string,
  concept: string,
  skillMastery: number
): Promise<EvaluationResult> {
  if (!isGeminiConfigured()) {
    await new Promise(r => setTimeout(r, 1000))
    return {
      understanding: 68,
      accuracy: 72,
      misconceptions: ['Base case confusion — confusing n==0 with n==1 termination'],
      feedback: "You have a solid grasp of the recursive structure! Your explanation correctly identifies that the function calls itself with a smaller argument. The key area to strengthen is **base case reasoning** — make sure you understand *why* the recursion stops at n=0 or n=1, not just *that* it stops.",
      masteryDelta: 12,
    }
  }

  try {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `Evaluate this student's explanation of ${concept} (current mastery: ${skillMastery}%):

"${studentExplanation}"

Return JSON only:
{
  "understanding": <0-100>,
  "accuracy": <0-100>,
  "misconceptions": ["<misconception1>", ...],
  "feedback": "<2-3 sentence constructive feedback>",
  "masteryDelta": <-10 to +20>
}`
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?|\n?```/g, '')
    return JSON.parse(text)
  } catch (error) {
    console.error('Evaluation error:', error)
    return {
      understanding: 65,
      accuracy: 70,
      misconceptions: [],
      feedback: "Your explanation shows good effort. Focus on clearly defining the base case and how the problem reduces in size at each recursive step.",
      masteryDelta: 8,
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Assessment
// ─────────────────────────────────────────────────────────────────────────────

export interface GeneratedQuestion {
  id: string
  text: string
  options: { id: string; text: string }[]
  correctAnswerId: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  hint: string
  explanation: string
}

export async function generateAssessmentQuestion(
  skillName: string,
  difficulty: 'easy' | 'medium' | 'hard',
  previousTopics: string[]
): Promise<GeneratedQuestion | null> {
  if (!isGeminiConfigured()) return null

  try {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: ASSESSMENT_SYSTEM_PROMPT,
    })
    const prompt = `Generate a ${difficulty} multiple-choice question about ${skillName} in Java.
Avoid these already-covered topics: ${previousTopics.join(', ')}.
Return JSON only:
{
  "id": "gen-<random>",
  "text": "<question>",
  "options": [{"id":"a","text":"..."},{"id":"b","text":"..."},{"id":"c","text":"..."},{"id":"d","text":"..."}],
  "correctAnswerId": "<a|b|c|d>",
  "difficulty": "${difficulty}",
  "topic": "<specific topic>",
  "hint": "<helpful hint>",
  "explanation": "<detailed explanation>"
}`
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?|\n?```/g, '')
    return JSON.parse(text)
  } catch (error) {
    console.error('Question generation error:', error)
    return null
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Skill Gap
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillGapAnalysis {
  gapAreas: string[]
  strongAreas: string[]
  recommendedPath: string[]
  estimatedTimeToMastery: string
}

export async function calculateSkillGap(
  skillName: string,
  masteryScore: number,
  recentMistakes: string[]
): Promise<SkillGapAnalysis> {
  if (!isGeminiConfigured()) {
    return {
      gapAreas: ['Base case identification', 'Understanding call stack unwinding', 'Recursive vs iterative tradeoffs'],
      strongAreas: ['Understanding the recursive pattern', 'Simple recursive code reading'],
      recommendedPath: ['Practice base case identification exercises', 'Trace recursive calls manually', 'Implement factorial and fibonacci from scratch', 'Solve maze solver problem'],
      estimatedTimeToMastery: '2-3 focused sessions',
    }
  }

  try {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const prompt = `Analyze skill gaps for ${skillName} (mastery: ${masteryScore}%, recent mistakes: ${recentMistakes.join(', ')}).
Return JSON: {"gapAreas":[],"strongAreas":[],"recommendedPath":[],"estimatedTimeToMastery":""}`
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?|\n?```/g, '')
    return JSON.parse(text)
  } catch {
    return {
      gapAreas: ['Base case reasoning', 'Stack trace understanding'],
      strongAreas: ['Pattern recognition'],
      recommendedPath: ['Practice with simple recursion', 'Move to tree recursion'],
      estimatedTimeToMastery: '2-3 sessions',
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Project
// ─────────────────────────────────────────────────────────────────────────────

export interface ProjectRecommendation {
  title: string
  description: string
  rationale: string
  difficulty: string
  skills: string[]
  estimatedHours: number
}

export async function generateProjectRecommendation(
  masteredSkills: { name: string; mastery: number }[]
): Promise<ProjectRecommendation> {
  // Always return demo project for hackathon reliability
  return {
    title: 'Maze Solver Using Recursion',
    description: 'Build a recursive backtracking algorithm that finds a path through a 2D maze. Visualize the algorithm exploring paths and backtracking from dead ends.',
    rationale: 'You have demonstrated sufficient mastery in Arrays (81%), Conditions (90%), and Recursion. This project directly applies recursive backtracking — one of the most important algorithmic patterns in computer science.',
    difficulty: 'Intermediate',
    skills: ['Recursion', 'Arrays', 'Conditions', 'Algorithm Design'],
    estimatedHours: 6,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Teacher Insight
// ─────────────────────────────────────────────────────────────────────────────

export interface TeacherInsight {
  summary: string
  topWeakAreas: string[]
  interventionRecommendation: string
  studentsNeedingHelp: string[]
}

export async function generateTeacherInsight(classData: {
  className: string
  topicMastery: Record<string, number>
  studentCount: number
}): Promise<TeacherInsight> {
  if (!isGeminiConfigured()) {
    return {
      summary: `68% of students in ${classData.className} are struggling with Recursion, especially base-case reasoning. Students show high AI-assistance dependency when solving recursive problems.`,
      topWeakAreas: ['Recursion', 'Collections', 'Sorting'],
      interventionRecommendation: 'Run a 15-minute guided whiteboard activity on recursion base cases followed by a 5-question adaptive assessment. Consider pair programming sessions where high-mastery students mentor low-mastery peers.',
      studentsNeedingHelp: ['Arjun M', 'Karthik R', 'Suresh P', 'Vijay C'],
    }
  }

  try {
    const ai = getGenAI()
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: TEACHER_INSIGHT_PROMPT,
    })
    const prompt = `Analyze this class data and return JSON insights:
Class: ${classData.className}
Students: ${classData.studentCount}
Topic Mastery: ${JSON.stringify(classData.topicMastery)}

Return: {"summary":"","topWeakAreas":[],"interventionRecommendation":"","studentsNeedingHelp":[]}`
    const result = await model.generateContent(prompt)
    const text = result.response.text().replace(/```json\n?|\n?```/g, '')
    return JSON.parse(text)
  } catch {
    return {
      summary: 'Based on available data, Recursion appears to be the primary area needing intervention across the class.',
      topWeakAreas: ['Recursion', 'Collections'],
      interventionRecommendation: 'Run targeted recursion exercises with the class.',
      studentsNeedingHelp: [],
    }
  }
}
