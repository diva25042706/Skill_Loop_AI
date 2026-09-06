import { classroomService } from '@/lib/services/classroomService'
import { generateTeacherInsight, isGeminiConfigured } from '@/lib/ai/aiService'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const stats = classroomService.getClassroomStats()
    const analytics = classroomService.getClassSkillAnalytics()
    const deterministicInsight = classroomService.getClassroomInsights()

    // If Gemini is configured, optionally enrich natural language insight
    if (isGeminiConfigured()) {
      try {
        const topicMastery: Record<string, number> = {}
        analytics.forEach(a => { topicMastery[a.skill] = a.averageMastery })

        const aiResult = await generateTeacherInsight({
          className: 'CSE AI & ML — Class 2A',
          topicMastery,
          studentCount: stats.totalStudents,
        })

        return NextResponse.json({
          weakestSkill: deterministicInsight.weakestSkill,
          mastery: deterministicInsight.weakestMastery,
          studentsBelowThreshold: deterministicInsight.studentsBelowThreshold,
          commonIssue: 'Base-case reasoning & stack overflow risk',
          summary: aiResult.summary || deterministicInsight.summary,
          recommendation: aiResult.interventionRecommendation || deterministicInsight.recommendation,
          isGeminiGenerated: true,
        })
      } catch {
        // fallback to deterministic
      }
    }

    return NextResponse.json({
      weakestSkill: deterministicInsight.weakestSkill,
      mastery: deterministicInsight.weakestMastery,
      studentsBelowThreshold: deterministicInsight.studentsBelowThreshold,
      commonIssue: 'Base-case reasoning & stack limits',
      summary: deterministicInsight.summary,
      recommendation: deterministicInsight.recommendation,
      isGeminiGenerated: false,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch classroom insights' },
      { status: 500 }
    )
  }
}
