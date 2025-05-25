"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, Library, Calendar, Play, Settings, Menu, X, Zap } from "lucide-react"
import { useWorkout } from "@/components/workout-context"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface EnhancedMobileLayoutProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  children: React.ReactNode
}

export function EnhancedMobileLayout({ activeTab, setActiveTab, children }: EnhancedMobileLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const { currentSession, stats } = useWorkout()
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    { id: "dashboard", label: "HOME", icon: Home, color: "from-blue-500 to-blue-600" },
    { id: "exercises", label: "ESERCIZI", icon: Library, color: "from-green-500 to-green-600" },
    { id: "plans", label: "SCHEDE", icon: Calendar, color: "from-purple-500 to-purple-600" },
    { id: "workout", label: "WORKOUT", icon: Play, color: "from-red-500 to-red-600" },
    { id: "settings", label: "SETTINGS", icon: Settings, color: "from-gray-500 to-gray-600" },
  ]

  // Auto-hide header on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 10)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Haptic feedback simulation
  const hapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent dark:via-white animate-pulse" />
      </div>

      {/* Enhanced Mobile Header */}
      <header
        className={cn(
          "bg-gradient-to-r from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white text-white dark:text-black p-4 border-b-4 border-black dark:border-white sticky top-0 z-50 transition-transform duration-300 backdrop-blur-lg",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 dark:from-black dark:to-gray-800 flex items-center justify-center border-3 border-white dark:border-black shadow-[3px_3px_0px_0px_#fff] dark:shadow-[3px_3px_0px_0px_#000] transform hover:rotate-12 transition-transform">
                <span className="text-black dark:text-white font-black text-lg">B</span>
              </div>
              {currentSession && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-black rounded-full animate-bounce">
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-gray-300 dark:from-black dark:to-gray-700 bg-clip-text text-transparent">
                BRUTAL
              </h1>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-600 tracking-widest">WORKOUT</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick stats indicator */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 border-2 border-white dark:border-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">{stats.weeklyWorkouts}</span>
              </div>
              <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                hapticFeedback()
                setIsMenuOpen(!isMenuOpen)
              }}
              className="text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white border-2 border-white dark:border-black shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#fff] dark:hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-gradient-to-b from-black to-gray-900 dark:from-white dark:to-gray-100 border-b-4 border-black dark:border-white backdrop-blur-lg">
            <div className="p-4 space-y-3">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start h-14 text-left font-bold border-3 transition-all duration-300 relative overflow-hidden group",
                      isActive
                        ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black shadow-[3px_3px_0px_0px_#fff] dark:shadow-[3px_3px_0px_0px_#000]"
                        : "border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#fff] dark:hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px]",
                    )}
                    onClick={() => {
                      hapticFeedback()
                      setActiveTab(item.id)
                      setIsMenuOpen(false)
                    }}
                  >
                    {/* Background gradient */}
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity",
                        item.color,
                      )}
                    />
                    <Icon className="w-6 h-6 mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform relative z-10" />
                    <span className="group-hover:translate-x-2 transition-transform relative z-10">{item.label}</span>
                    {item.id === "workout" && currentSession && (
                      <div className="ml-auto w-3 h-3 bg-red-500 rounded-full animate-pulse relative z-10" />
                    )}
                  </Button>
                )
              })}

              <Button
                variant="ghost"
                onClick={() => {
                  hapticFeedback()
                  toggleTheme()
                }}
                className="w-full justify-start h-14 text-left font-bold border-3 border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000] hover:shadow-[1px_1px_0px_0px_#fff] dark:hover:shadow-[1px_1px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all group"
              >
                <span className="text-2xl mr-4 group-hover:rotate-12 transition-transform">
                  {theme === "light" ? "🌙" : "☀️"}
                </span>
                <span className="group-hover:translate-x-2 transition-transform">
                  {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
                </span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Mobile Content */}
      <main className="flex-1 p-4 pb-24 overflow-auto relative z-10">{children}</main>

      {/* Enhanced Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white border-t-4 border-black dark:border-white backdrop-blur-lg z-50">
        <div className="grid grid-cols-5 h-20 relative">
          {/* Active indicator */}
          <div
            className={cn(
              "absolute top-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out",
              activeTab === "dashboard" && "left-0 w-1/5",
              activeTab === "exercises" && "left-1/5 w-1/5",
              activeTab === "plans" && "left-2/5 w-1/5",
              activeTab === "workout" && "left-3/5 w-1/5",
              activeTab === "settings" && "left-4/5 w-1/5",
            )}
          />

          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "h-full rounded-none flex flex-col items-center justify-center gap-1 transition-all duration-300 relative group",
                  isActive
                    ? "bg-white text-black dark:bg-black dark:text-white scale-110"
                    : "text-white hover:bg-white hover:text-black dark:text-black dark:hover:bg-black dark:hover:text-white hover:scale-105",
                )}
                onClick={() => {
                  hapticFeedback()
                  setActiveTab(item.id)
                }}
              >
                {/* Background gradient on active */}
                {isActive && <div className={cn("absolute inset-0 bg-gradient-to-t opacity-20", item.color)} />}

                <Icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300 relative z-10",
                    isActive && "scale-110 animate-pulse",
                    "group-hover:scale-110 group-hover:rotate-12",
                  )}
                />
                <span
                  className={cn("text-xs font-bold transition-all duration-300 relative z-10", isActive && "scale-105")}
                >
                  {item.label}
                </span>

                {/* Workout indicator */}
                {item.id === "workout" && currentSession && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 border border-white dark:border-black rounded-full animate-bounce">
                    <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5" />
                  </div>
                )}

                {/* Ripple effect */}
                <div className="absolute inset-0 bg-white dark:bg-black opacity-0 group-active:opacity-20 rounded-full scale-0 group-active:scale-150 transition-all duration-200" />
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
