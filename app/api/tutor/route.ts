import { generateTutorResponse, isGeminiConfigured } from '@/lib/ai/aiService'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message, history, skillName, masteryScore, hintsUsed } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      )
    }

    const response = await generateTutorResponse(message, {
      skillName: skillName || 'Recursion',
      masteryScore: masteryScore ?? 32,
      hintsUsed: hintsUsed ?? 0,
      conversationHistory: history || [],
    })

    return NextResponse.json({
      ...response,
      isDemoMode: !isGeminiConfigured() || response.isDemoMode,
    })
  } catch (error) {
    console.error('Tutor API error:', error)
    // Never expose raw error to client
    return NextResponse.json({
      message: "I'm here to help! Let me ask you first — what do you already know about recursion? Any attempt counts! 🤔",
      responseType: 'question',
      hintLevel: 0,
      misconception: null,
      suggestedAction: 'continue',
      isDemoMode: true,
    })
  }
}
