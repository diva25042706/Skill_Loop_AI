"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { useDemoStore } from "@/lib/store/demo-store"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { 
  BookOpen, 
  LayoutDashboard, 
  Network, 
  Code2, 
  UserCircle,
  GraduationCap,
  Users,
  ClipboardList,
  LogOut,
  Sparkles
} from "lucide-react"

const studentNav = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Skill Graph", href: "/skills", icon: Network },
  { name: "AI Tutor", href: "/tutor", icon: BookOpen },
  { name: "Assessment", href: "/assessment", icon: ClipboardList },
  { name: "Project Builder", href: "/projects", icon: Code2 },
  { name: "Profile", href: "/profile", icon: UserCircle },
]

const teacherNav = [
  { name: "Class Overview", href: "/teacher", icon: LayoutDashboard },
  { name: "Students", href: "/teacher/students", icon: Users },
  { name: "Interventions", href: "/teacher/interventions", icon: GraduationCap },
]

export default function AppLayout({ children, role }: { children: React.ReactNode, role: 'STUDENT' | 'TEACHER' }) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, isAuthenticated, authRole, logout } = useDemoStore()

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, authRole, role, pathname, router])

  const navItems = role === 'STUDENT' ? studentNav : teacherNav

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#050816] text-slate-900 dark:text-[#F8FAFC] relative overflow-hidden bg-grid-pattern transition-colors duration-200">
      {/* Background Radial Glow */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 bg-white/95 dark:bg-[#080B18]/90 border-r border-slate-200 dark:border-slate-800/80 backdrop-blur-xl flex flex-col z-20 shrink-0 transition-colors duration-200 shadow-sm dark:shadow-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800/80 justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_22px_rgba(34,211,238,0.6)] transition-all">
              <span className="text-white font-extrabold text-xl tracking-wider">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                SkillLoop <span className="text-blue-600 dark:text-cyan-400 font-bold text-xs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-cyan-950/80 border border-blue-200 dark:border-cyan-500/30">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-mono">Intelligence Platform</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Items */}
        <div className="p-3 flex-1 flex flex-col gap-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {role === 'STUDENT' ? 'Student Workspace' : 'Classroom Intelligence'}
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/teacher' && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                  isActive 
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-600/15 dark:text-blue-400 border-l-2 border-blue-600 dark:border-blue-500 shadow-sm dark:shadow-[0_0_20px_rgba(59,130,246,0.15)] font-bold" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100"
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5 transition-colors", isActive ? "text-blue-600 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300")} />
                <span className="font-semibold text-xs tracking-wide">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </Link>
            )
          })}
        </div>

        {/* User Profile Snippet & Logout */}
        <div className="p-3.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-[#060914]/80 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              {role === 'STUDENT' ? (currentUser?.name.charAt(0) || 'U') : 'PS'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                {role === 'STUDENT' ? currentUser?.name : 'Dr. Priya Sharma'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">
                {role === 'STUDENT' ? 'B.E. CSE AI & ML' : 'Assistant Professor'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/40 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto z-10">
        <header className="h-16 bg-white/80 dark:bg-[#080B18]/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30 transition-colors duration-200 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-cyan-400 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">
              SkillLoop AI <span className="text-slate-300 dark:text-slate-500">|</span> {role === 'STUDENT' ? 'Adaptive Student Intelligence' : 'Classroom Intelligence Center'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-medium">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            <span className="text-blue-700 bg-blue-50 border-blue-200 dark:text-cyan-400 dark:bg-cyan-950/60 dark:border-cyan-500/30 px-3 py-1 rounded-full border font-mono shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping" />
              Demo Active
            </span>

            {role === 'STUDENT' ? (
              <Link href="/teacher" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">
                Teacher View →
              </Link>
            ) : (
              <Link href="/dashboard" className="text-blue-600 dark:text-blue-400 hover:underline font-bold transition-colors">
                Student View →
              </Link>
            )}
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
