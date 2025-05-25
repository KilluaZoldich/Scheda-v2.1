"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, Library, Calendar, Play, Settings, Menu, X } from "lucide-react"
import { useWorkout } from "@/components/workout-context"
import { useTheme } from "@/components/theme-provider"

interface MobileLayoutProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  children: React.ReactNode
}

export function MobileLayout({ activeTab, setActiveTab, children }: MobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { currentSession } = useWorkout()
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    { id: "dashboard", label: "HOME", icon: Home },
    { id: "exercises", label: "ESERCIZI", icon: Library },
    { id: "plans", label: "SCHEDE", icon: Calendar },
    { id: "workout", label: "WORKOUT", icon: Play },
    { id: "settings", label: "SETTINGS", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col">
      {/* Mobile Header */}
      <header className="bg-black dark:bg-white text-white dark:text-black p-4 border-b-4 border-black dark:border-white sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white dark:bg-black flex items-center justify-center border-2 border-white dark:border-black">
              <span className="text-black dark:text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">BRUTAL</h1>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-600">WORKOUT</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentSession && <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black dark:bg-white border-b-4 border-black dark:border-white">
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start h-12 text-left font-bold border-2 ${
                      activeTab === item.id
                        ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black"
                        : "border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsMenuOpen(false)
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                )
              })}

              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="w-full justify-start h-12 text-left font-bold border-2 border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white"
              >
                {theme === "light" ? "🌙" : "☀️"} {theme === "light" ? "DARK" : "LIGHT"}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Content */}
      <main className="flex-1 p-4 pb-20 overflow-auto">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black dark:bg-white border-t-4 border-black dark:border-white">
        <div className="grid grid-cols-5 h-16">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={`h-full rounded-none flex flex-col items-center justify-center gap-1 ${
                  activeTab === item.id
                    ? "bg-white text-black dark:bg-black dark:text-white"
                    : "text-white hover:bg-white hover:text-black dark:text-black dark:hover:bg-black dark:hover:text-white"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold">{item.label}</span>
                {item.id === "workout" && currentSession && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
