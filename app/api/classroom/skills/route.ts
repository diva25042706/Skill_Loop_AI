import { classroomService } from '@/lib/services/classroomService'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const skillAnalytics = classroomService.getClassSkillAnalytics()
    return NextResponse.json(skillAnalytics)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch class skill analytics' },
      { status: 500 }
    )
  }
}
