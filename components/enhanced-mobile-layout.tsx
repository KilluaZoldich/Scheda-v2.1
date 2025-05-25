"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home, Library, Calendar, Play, Settings, Menu, X, Zap, ArrowUp } from "lucide-react"
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
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { currentSession, stats } = useWorkout()
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    { id: "dashboard", label: "HOME", icon: Home, color: "from-blue-500 to-blue-600" },
    { id: "exercises", label: "ESERCIZI", icon: Library, color: "from-green-500 to-green-600" },
    { id: "plans", label: "SCHEDE", icon: Calendar, color: "from-purple-500 to-purple-600" },
    { id: "workout", label: "WORKOUT", icon: Play, color: "from-red-500 to-red-600" },
    { id: "settings", label: "SETTINGS", icon: Settings, color: "from-gray-500 to-gray-600" },
  ]

  // Enhanced scroll handling for mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Header visibility logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false) // Hide when scrolling down
      } else {
        setIsHeaderVisible(true) // Show when scrolling up or at top
      }

      // Scroll to top button
      setShowScrollTop(currentScrollY > 200)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Enhanced haptic feedback
  const hapticFeedback = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10])
    }
  }

  const scrollToTop = () => {
    hapticFeedback()
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener("touchstart", handleClickOutside)
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("touchstart", handleClickOutside)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-900 flex flex-col relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-3 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-green-500/20 to-yellow-500/20 rounded-full blur-xl animate-pulse delay-1000" />
      </div>

      {/* Enhanced Mobile Header */}
      <header
        className={cn(
          "bg-gradient-to-r from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white text-white dark:text-black border-b-4 border-black dark:border-white sticky top-0 z-50 transition-transform duration-300 backdrop-blur-lg",
          isHeaderVisible ? "translate-y-0" : "-translate-y-full",
        )}
      >
        <div className="px-4 py-3 safe-area-inset-top">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-gray-200 dark:from-black dark:to-gray-800 flex items-center justify-center border-2 border-white dark:border-black shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000] transform hover:rotate-12 transition-transform">
                  <span className="text-black dark:text-white font-black text-sm">B</span>
                </div>
                {currentSession && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border border-white dark:border-black rounded-full animate-bounce">
                    <div className="w-1 h-1 bg-white rounded-full mx-auto mt-0.5" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight">BRUTAL</h1>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-600 tracking-wider">WORKOUT</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick stats indicator */}
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-blue-500 border border-white dark:border-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">{stats.weeklyWorkouts}</span>
                </div>
                <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  hapticFeedback()
                  setIsMenuOpen(!isMenuOpen)
                }}
                className="text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white border border-white dark:border-black shadow-[1px_1px_0px_0px_#fff] dark:shadow-[1px_1px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all p-2"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Enhanced Mobile Menu Dropdown */}
          {isMenuOpen && (
            <div
              className="absolute top-full left-0 right-0 bg-gradient-to-b from-black to-gray-900 dark:from-white dark:to-gray-100 border-b-4 border-black dark:border-white backdrop-blur-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3 space-y-2 max-h-[70vh] overflow-y-auto">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-12 text-left font-bold border-2 transition-all duration-200 relative overflow-hidden group touch-manipulation",
                        isActive
                          ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black shadow-[2px_2px_0px_0px_#fff] dark:shadow-[2px_2px_0px_0px_#000]"
                          : "border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white shadow-[1px_1px_0px_0px_#fff] dark:shadow-[1px_1px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]",
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
                          "absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity",
                          item.color,
                        )}
                      />
                      <Icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
                      <span className="group-hover:translate-x-1 transition-transform relative z-10 text-sm">
                        {item.label}
                      </span>
                      {item.id === "workout" && currentSession && (
                        <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse relative z-10" />
                      )}
                    </Button>
                  )
                })}

                <Button
                  variant="ghost"
                  onClick={() => {
                    hapticFeedback()
                    toggleTheme()
                    setIsMenuOpen(false)
                  }}
                  className="w-full justify-start h-12 text-left font-bold border-2 border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white shadow-[1px_1px_0px_0px_#fff] dark:shadow-[1px_1px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all group touch-manipulation"
                >
                  <span className="text-lg mr-3 group-hover:rotate-12 transition-transform">
                    {theme === "light" ? "🌙" : "☀️"}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform text-sm">
                    {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
                  </span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Enhanced Mobile Content */}
      <main className="flex-1 px-3 py-4 pb-24 overflow-auto relative z-10 safe-area-inset-bottom">{children}</main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-24 right-4 w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-40 animate-bounce touch-manipulation"
        >
          <ArrowUp className="w-5 h-5" />
        </Button>
      )}

      {/* Enhanced Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-black via-gray-900 to-black dark:from-white dark:via-gray-100 dark:to-white border-t-4 border-black dark:border-white backdrop-blur-lg z-50 safe-area-inset-bottom">
        <div className="grid grid-cols-5 h-16 relative">
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

          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "h-full rounded-none flex flex-col items-center justify-center gap-0.5 transition-all duration-200 relative group touch-manipulation",
                  isActive
                    ? "bg-white text-black dark:bg-black dark:text-white scale-105"
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
                    "w-5 h-5 transition-all duration-200 relative z-10",
                    isActive && "scale-110 animate-pulse",
                    "group-hover:scale-110",
                  )}
                />
                <span
                  className={cn("text-xs font-bold transition-all duration-200 relative z-10", isActive && "scale-105")}
                >
                  {item.label}
                </span>

                {/* Workout indicator */}
                {item.id === "workout" && currentSession && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-white dark:border-black rounded-full animate-bounce">
                    <div className="w-0.5 h-0.5 bg-white rounded-full mx-auto mt-0.5" />
                  </div>
                )}

                {/* Touch ripple effect */}
                <div className="absolute inset-0 bg-white dark:bg-black opacity-0 group-active:opacity-20 rounded-full scale-0 group-active:scale-150 transition-all duration-150" />
              </Button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
