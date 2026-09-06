export interface HelpMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface PageContextInfo {
  route: string
  name: string
  summary: string
  tips: string[]
}

export const PAGE_CONTEXT_REGISTRY: Record<string, PageContextInfo> = {
  '/': {
    route: '/',
    name: 'Landing Page',
    summary: 'The main homepage introducing SkillLoop AI — the AI Learning Intelligence Platform.',
    tips: [
      'Click "Start Demo" or "Log in" to test the Student or Teacher portals.',
      'Explore the 4-step learning flow: AI Tutor → Proof-of-Learning → Assessment → Project Builder.',
    ],
  },
  '/login': {
    route: '/login',
    name: 'Role-Based Login',
    summary: 'The authentication portal with pre-configured demo credentials for Students and Teachers.',
    tips: [
      'Student Demo: divakaranperumal27@gmail.com (Divakaran A P → /dashboard).',
      'Teacher Demo: priya.sharma@skillloop.demo (Dr. Priya Sharma → /teacher).',
      'Use the quick-sign-in buttons for instant demo access.',
    ],
  },
  '/dashboard': {
    route: '/dashboard',
    name: 'Student Dashboard',
    summary: 'The AI Learning Command Center tracking mastery, learning streak, AI assistance index, and dynamic next best actions.',
    tips: [
      'Review the "✦ SkillLoop Intelligence" card for your Next Best Action.',
      'Follow "Today\'s Learning Path" steps to progress through Recursion.',
      'Keep your AI Dependency Index low (< 35%) to maintain healthy independent problem solving.',
    ],
  },
  '/tutor': {
    route: '/tutor',
    name: 'Socratic AI Tutor',
    summary: 'An intelligent tutor that guides you step-by-step using diagnostic questions and progressive hints rather than dumping code.',
    tips: [
      'Toggle "⚡ Challenge Mode" to solve independently with minimal AI intervention.',
      'Ask for code to trigger a Proof-of-Learning micro-challenge and earn a verification scorecard.',
      'Use the quick action buttons for hints, concept explanations, or practice problems.',
    ],
  },
  '/assessment': {
    route: '/assessment',
    name: 'Adaptive Skill Assessment',
    summary: 'An adaptive 5-question test that validates understanding and dynamically updates your skill mastery in the classroom registry.',
    tips: [
      'Answer all 5 questions to recalculate your Recursion mastery score (e.g. from 32% up to 76%).',
      'Reaching ≥ 70% mastery automatically unlocks the Maze Solver project.',
      'Use the concept hint button if you need a hint during testing.',
    ],
  },
  '/skills': {
    route: '/skills',
    name: 'AI Knowledge Graph',
    summary: 'An interactive curriculum map displaying your mastery across Java and Data Structures modules.',
    tips: [
      'Inspect the Skill Intelligence Radar chart for algorithm topic distribution.',
      'Click on any skill card to identify priority focus areas.',
      'Track how your scores contribute to the overall class average.',
    ],
  },
  '/projects': {
    route: '/projects',
    name: 'Project Builder',
    summary: 'A developer workspace where theoretical knowledge is applied to build real-world software.',
    tips: [
      'The Maze Solver project requires ≥ 70% Recursion mastery to unlock.',
      'Follow the 4-phase project roadmap: Requirements → Algorithm Design → Recursion Implementation → Edge Cases.',
      'Use the embedded AI Mentor in code scaffolding steps for architectural help.',
    ],
  },
  '/profile': {
    route: '/profile',
    name: 'Student Profile & Skill Passport',
    summary: 'Contains "My Learning Twin" (AI cognitive profile) and the verified "Skill Passport" with PDF export.',
    tips: [
      'Review your AI Learning Twin strengths, growth areas, and learning pattern.',
      'Click "Download Skill Passport (PDF)" to print or export your verified skill record.',
    ],
  },
  '/teacher': {
    route: '/teacher',
    name: 'Teacher Classroom Intelligence',
    summary: 'The educator analytics center tracking 60 students in Class 2A, skill gap comparisons, and automated interventions.',
    tips: [
      'Click "Ask AI About My Class 🤖" to query the 60-student dataset using natural language.',
      'Click "Create Intervention" to launch a 15-minute recovery session for struggling students.',
      'Check the Priority Students list for students flagged with high AI dependency.',
    ],
  },
  '/teacher/students': {
    route: '/teacher/students',
    name: '60-Student Roster Directory',
    summary: 'The complete searchable classroom directory with sorting, filtering, and student risk ratings.',
    tips: [
      'Search students by name or roll number (e.g., "Divakaran", "CSE-2A-001").',
      'Filter by Intervention Priority (Critical, High, Medium, Low).',
      'Click on any student row to view their detailed performance breakdown.',
    ],
  },
  '/teacher/interventions': {
    route: '/teacher/interventions',
    name: 'Interventions Management',
    summary: 'Active and scheduled educational recovery sessions for Class 2A.',
    tips: [
      'View ongoing and completed classroom recovery cohorts.',
      'Track student attendance and mastery improvement after interventions.',
    ],
  },
}

export function getWebsiteAssistantResponse(question: string, currentPath: string = '/dashboard'): string {
  const q = question.toLowerCase().trim()

  // 1. Out-of-Scope / General Knowledge Filter
  if (
    (q.includes('what is') || q.includes('how to code') || q.includes('write code') || q.includes('explain')) &&
    (q.includes('python') || q.includes('java') || q.includes('binary search') || q.includes('linked list') || q.includes('dynamic programming') || q.includes('bubble sort'))
  ) {
    return `I am your **SkillLoop AI Website Assistant**, designed to help you navigate this platform. 

For learning programming topics like Python, Java, or Algorithms, please open the **AI Tutor** from the sidebar! The AI Tutor is our Socratic subject mentor.`
  }

  if (q.includes('weather') || q.includes('news') || q.includes('president') || q.includes('movie') || q.includes('stock')) {
    return `I am the **SkillLoop AI Website Assistant**. I can help you navigate, understand features, and demo the SkillLoop AI platform. Feel free to ask about the Dashboard, AI Tutor, Assessment, Projects, Teacher View, or Theme settings!`
  }

  // 2. Theme Questions
  if (q.includes('theme') || q.includes('dark mode') || q.includes('light mode') || q.includes('color') || q.includes('toggle')) {
    return `**How to Switch Themes:**
You can switch between **☀ Light Mode** and **◐ Dark AI Mode** at any time by clicking the **Sun/Moon icon** in the top navigation bar.

Your selected theme is automatically saved to your browser and persists across page reloads!`
  }

  // 3. Login / Authentication Questions
  if (q.includes('login') || q.includes('sign in') || q.includes('account') || q.includes('email') || q.includes('credentials')) {
    return `**SkillLoop AI Demo Accounts:**
• **Student Portal:** \`divakaranperumal27@gmail.com\`
  → Authenticates as **Divakaran A P** (Role: Student) and opens \`/dashboard\`.
• **Teacher Portal:** \`priya.sharma@skillloop.demo\`
  → Authenticates as **Dr. Priya Sharma** (Assistant Professor) and opens \`/teacher\`.

You can also use the one-click **Student Demo** and **Teacher Demo** buttons on the \`/login\` page.`
  }

  // 4. AI Tutor Questions
  if (q.includes('tutor') || q.includes('socratic') || q.includes('challenge mode') || q.includes('proof of learning') || q.includes('hint')) {
    return `**How the AI Tutor Works:**
1. Open **AI Tutor** from the sidebar navigation.
2. Ask questions about the current topic (**Recursion**).
3. **Socratic Method:** Instead of giving answers directly, the AI responds with guiding questions and progressive hints.
4. **⚡ Challenge Mode:** Click the "Challenge Mode" toggle in the top-right to solve independently with minimal AI assistance.
5. **Proof-of-Learning:** If you ask for full code solutions, the AI asks you to verify the base case first and displays a **Learning Verification Scorecard**.`
  }

  // 5. Assessment & Mastery Questions
  if (q.includes('assessment') || q.includes('test') || q.includes('quiz') || q.includes('mastery') || q.includes('update score')) {
    return `**How the Adaptive Assessment Works:**
1. Go to **Assessment** from the sidebar or click "Take Assessment" inside the AI Tutor.
2. Complete the 5 adaptive questions on Recursion.
3. Upon completion, SkillLoop recalculates your mastery score (e.g. from **32% to 76%**).
4. Reaching **≥ 70% mastery** automatically unlocks the **Maze Solver Project**!`
  }

  // 6. Project Builder Questions
  if (q.includes('project') || q.includes('locked') || q.includes('unlock') || q.includes('maze solver') || q.includes('workspace')) {
    return `**Project Builder & Unlock Conditions:**
• Projects in SkillLoop AI are tied directly to verified skill prerequisites.
• The **Maze Solver Project** requires **Recursion mastery ≥ 70%**.
• If locked, complete the **AI Tutor** session and pass the **Adaptive Assessment** (32% → 76%) to unlock it.
• Once unlocked, follow the 4-phase developer roadmap with integrated AI Mentorship!`
  }

  // 7. Skills & Knowledge Graph Questions
  if (q.includes('skill') || q.includes('graph') || q.includes('radar') || q.includes('knowledge')) {
    return `**Skill Knowledge Graph:**
• Visit **Skill Graph** in the sidebar to see your complete competency tree across Java and DSA.
• Displays your mastery percentage, confidence ratings, and priority growth areas.
• Includes a **Skill Intelligence Radar** chart comparing your competencies across all core algorithm domains.`
  }

  // 8. Profile & Skill Passport Questions
  if (q.includes('profile') || q.includes('passport') || q.includes('twin') || q.includes('pdf') || q.includes('download')) {
    return `**Profile & Skill Passport:**
• **My Learning Twin:** An AI cognitive persona summarizing your core strengths, active growth areas, and personalized learning pattern.
• **Skill Passport:** A verified learning record. Click **Download Skill Passport (PDF)** to print or save your verifiable credentials.`
  }

  // 9. Teacher Dashboard & Classroom Intelligence
  if (q.includes('teacher') || q.includes('classroom') || q.includes('copilot') || q.includes('intervention') || q.includes('60 student') || q.includes('students')) {
    return `**Teacher Intelligence Portal:**
• **Classroom Overview (\`/teacher\`):** Real-time analytics for 60 students in Class 2A (B.E. CSE AI & ML), showing class mastery (68%), at-risk students, and AI dependency distribution.
• **Ask AI About My Class 🤖:** Click the button in the header to ask natural language questions about student performance.
• **Create Intervention:** Generates a targeted 15-minute recovery session for students scoring below 50% in Recursion.
• **Students Roster (\`/teacher/students\`):** Searchable, filterable table of all 60 students with individual risk details.`
  }

  // 10. Context-Aware Fallbacks based on current path
  const normalizedPath = currentPath.split('?')[0]
  const context = PAGE_CONTEXT_REGISTRY[normalizedPath]

  if (q.includes('what do i do') || q.includes('how to use') || q.includes('where am i') || q.includes('help') || q.includes('explain this page')) {
    if (context) {
      return `**You are currently on: ${context.name}**

${context.summary}

**Quick Tips for this page:**
${context.tips.map(t => `• ${t}`).join('\n')}`
    }
  }

  // 11. General Website Overview Fallback
  return `**Welcome to SkillLoop AI!**

SkillLoop AI connects student learning with measurable understanding and real-world project builds:

1. **Dashboard:** Track mastery, streaks, and your Next Best Action.
2. **AI Tutor:** Socratic guided reasoning with Proof-of-Learning verification.
3. **Assessment:** 5 adaptive questions to prove understanding & boost mastery.
4. **Project Builder:** Unlock practical coding projects when skills reach ≥ 70%.
5. **Teacher Portal:** 60-student classroom intelligence & automated interventions.
6. **Themes:** Switch between Light and Dark AI modes using the Sun/Moon icon in the top header.

What would you like help with?`
}
