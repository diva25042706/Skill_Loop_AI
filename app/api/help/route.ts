import { NextRequest, NextResponse } from "next/server"
import { getWebsiteAssistantResponse, PAGE_CONTEXT_REGISTRY } from "@/lib/services/websiteHelpService"
import { isGeminiConfigured } from "@/lib/ai/aiService"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: NextRequest) {
  try {
    const { message, currentPath } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const path = currentPath || '/dashboard'
    const pageInfo = PAGE_CONTEXT_REGISTRY[path]

    // If Gemini is available, run prompt with strict website-help guidelines
    if (isGeminiConfigured()) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

        const systemPrompt = `You are the SkillLoop AI Website Assistant. 
Your ONLY purpose is to help users navigate and understand how to use the SkillLoop AI application.

Current user location:
Page: ${pageInfo?.name || path}
Summary: ${pageInfo?.summary || ''}

SkillLoop AI Knowledge Base:
- Student Portal: Email 'divakaranperumal27@gmail.com' (Student: Divakaran A P) -> /dashboard
- Teacher Portal: Email 'priya.sharma@skillloop.demo' (Teacher: Dr. Priya Sharma) -> /teacher
- Student Dashboard (/dashboard): Shows overall mastery (72%), streak (7 days), AI assistance (22%), projects built, learning path, and 'Next Best Action'.
- AI Tutor (/tutor): Socratic teaching, Challenge Mode ⚡, Proof-of-Learning verification when code is requested.
- Assessment (/assessment): 5 adaptive Recursion questions; recalculates mastery from 32% to 76% and unlocks Maze Solver.
- Skill Graph (/skills): Displays curriculum competency tree and multi-axis radar chart.
- Project Builder (/projects): Maze Solver using recursive backtracking unlocks at 70% mastery threshold.
- Profile (/profile): 'My Learning Twin' cognitive profile and verified 'Skill Passport' with PDF export.
- Teacher Dashboard (/teacher): Real-time analytics for 60 students in Class 2A, automated risk flags, AI Copilot, and 15-minute intervention generator.
- Theme Toggle: Sun/Moon button in top navigation switches between Clean Light Mode and Dark AI Mode.

Rules:
1. If the user asks a general education/tutoring question (e.g. "What is Python?", "How to write recursion?"), politely tell them that you are the Website Assistant and advise them to use the **AI Tutor** in the sidebar.
2. If the user asks an unrelated question (weather, news, etc.), politely clarify that you only assist with the SkillLoop AI website.
3. Keep responses friendly, concise, and structured with bold highlights.`

        const result = await model.generateContent([
          { text: systemPrompt },
          { text: `User Question: "${message}"` }
        ])

        const reply = result.response.text()
        if (reply && reply.trim().length > 0) {
          return NextResponse.json({ answer: reply, source: 'gemini' })
        }
      } catch (err) {
        // Fallback to local knowledge base
      }
    }

    // Instant local knowledge base engine
    const localAnswer = getWebsiteAssistantResponse(message, path)
    return NextResponse.json({ answer: localAnswer, source: 'local' })
  } catch (error) {
    return NextResponse.json({ 
      answer: getWebsiteAssistantResponse("help", "/dashboard"),
      source: 'fallback' 
    })
  }
}
