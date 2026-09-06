"use client"
import { useTheme } from "@/lib/context/ThemeContext"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark AI Mode"}
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark AI Mode"}
      className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center border ${
        theme === "dark"
          ? "bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700 hover:text-amber-300 hover:border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-blue-600 shadow-sm"
      } ${className}`}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 transition-transform duration-300 rotate-0 scale-100" />
      )}
    </button>
  )
}
