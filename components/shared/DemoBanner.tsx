'use client'

import Link from 'next/link'

export default function DemoBanner() {
  return (
    <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between flex-wrap gap-2 z-50">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold">🎓 Demo Mode</span>
        <span className="text-indigo-200 hidden sm:inline">—</span>
        <span className="text-indigo-100 text-xs sm:text-sm hidden sm:inline">
          Explore SkillLoop AI · No login required · Seeded demo data
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard"
          className="text-xs bg-white text-indigo-700 font-semibold px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors"
        >
          Student Demo
        </Link>
        <Link
          href="/teacher"
          className="text-xs border border-indigo-300 text-indigo-100 font-semibold px-3 py-1 rounded-full hover:bg-indigo-700 transition-colors"
        >
          Teacher Demo
        </Link>
      </div>
    </div>
  )
}
