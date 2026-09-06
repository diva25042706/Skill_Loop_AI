'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, MessageSquare, Network, ClipboardCheck,
  Zap, Rocket, User, Users, RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: MessageSquare, label: 'AI Tutor', href: '/tutor' },
  { icon: Network, label: 'Skill Graph', href: '/skills' },
  { icon: ClipboardCheck, label: 'Assessment', href: '/assessment' },
  { icon: Zap, label: 'Practice', href: '/practice' },
  { icon: Rocket, label: 'Projects', href: '/projects' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <RefreshCw className="w-4.5 h-4.5 text-white" size={18} />
        </div>
        <span className="font-bold text-gray-900 text-lg tracking-tight">SkillLoop AI</span>
      </div>

      {/* User Card */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            DK
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">Divakaran</p>
            <p className="text-xs text-indigo-600 truncate">B.E. CSE AI & ML</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon size={18} className={cn(isActive ? 'text-white' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Teacher Switch */}
      <div className="px-3 py-4 border-t border-gray-100">
        <Link
          href="/teacher"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <Users size={18} className="text-gray-400" />
          Switch to Teacher View
        </Link>
      </div>
    </aside>
  )
}
