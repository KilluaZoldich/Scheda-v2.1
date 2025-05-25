"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("brutal-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("brutal-theme", theme)
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.style.setProperty("--brutal-bg", "#000000")
      document.documentElement.style.setProperty("--brutal-text", "#ffffff")
      document.documentElement.style.setProperty("--brutal-border", "#ffffff")
      document.documentElement.style.setProperty("--brutal-shadow", "#ffffff")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.setProperty("--brutal-bg", "#ffffff")
      document.documentElement.style.setProperty("--brutal-text", "#000000")
      document.documentElement.style.setProperty("--brutal-border", "#000000")
      document.documentElement.style.setProperty("--brutal-shadow", "#000000")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
