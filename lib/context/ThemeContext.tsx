"use client"
import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Read stored theme from localStorage or default to 'dark'
    const stored = localStorage.getItem("skillloop-theme") as Theme | null
    if (stored === "light" || stored === "dark") {
      setThemeState(stored)
      applyTheme(stored)
    } else {
      setThemeState("dark")
      applyTheme("dark")
    }
    setMounted(true)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    if (newTheme === "dark") {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.remove("dark")
      root.classList.add("light")
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("skillloop-theme", newTheme)
    applyTheme(newTheme)
  }

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  // Prevent flash before hydration while maintaining default dark
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
