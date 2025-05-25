"use client"

import { useState, useEffect } from "react"
import { Dumbbell, Home, Library, Calendar, Play, Settings, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useWorkout } from "@/components/workout-context"
import { cn } from "@/lib/utils"

interface EnhancedSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function EnhancedSidebar({ activeTab, setActiveTab }: EnhancedSidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const { stats, currentSession } = useWorkout()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const menuItems = [
    { id: "dashboard", label: "HOME", icon: Home, color: "from-blue-500 to-blue-600" },
    { id: "exercises", label: "ESERCIZI", icon: Library, color: "from-green-500 to-green-600" },
    { id: "plans", label: "SCHEDE", icon: Calendar, color: "from-purple-500 to-purple-600" },
    { id: "workout", label: "WORKOUT", icon: Play, color: "from-red-500 to-red-600" },
    { id: "settings", label: "SETTINGS", icon: Settings, color: "from-gray-500 to-gray-600" },
  ]

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            setActiveTab("dashboard")
            break
          case "2":
            e.preventDefault()
            setActiveTab("exercises")
            break
          case "3":
            e.preventDefault()
            setActiveTab("plans")
            break
          case "4":
            e.preventDefault()
            setActiveTab("workout")
            break
          case "5":
            e.preventDefault()
            setActiveTab("settings")
            break
          case "b":
            e.preventDefault()
            setIsCollapsed(!isCollapsed)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [setActiveTab, isCollapsed])

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-black to-gray-900 dark:from-white dark:to-gray-100 text-white dark:text-black border-r-8 border-black dark:border-white transition-all duration-500 ease-in-out relative group",
        isCollapsed ? "w-20" : "w-80",
      )}
    >
      {/* Collapse Toggle */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all z-10"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </Button>

      <div className="p-6 h-full flex flex-col">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-white to-gray-200 dark:from-black dark:to-gray-800 flex items-center justify-center border-4 border-white dark:border-black shadow-[6px_6px_0px_0px_#fff] dark:shadow-[6px_6px_0px_0px_#000] transform hover:rotate-12 transition-transform duration-300">
                <Dumbbell className="w-10 h-10 text-black dark:text-white" />
              </div>
              {currentSession && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 border-3 border-white dark:border-black rounded-full animate-pulse flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-300 dark:from-black dark:to-gray-700 bg-clip-text text-transparent animate-pulse">
                  BRUTAL
                </h1>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-600 tracking-widest">WORKOUT</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <Button
              onClick={toggleTheme}
              className="w-full h-14 border-3 border-white dark:border-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white font-bold text-sm shadow-[4px_4px_0px_0px_#fff] dark:shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#fff] dark:hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-full">
                {theme === "light" ? (
                  <Moon className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                ) : (
                  <Sun className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                )}
                <span className="group-hover:scale-105 transition-transform">
                  {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
                </span>
              </div>
            </Button>
          )}
        </div>

        {/* Enhanced Navigation */}
        <nav className="space-y-3 mb-10 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isHovered = hoveredItem === item.id

            return (
              <div key={item.id} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-16 text-left font-bold text-lg tracking-wide border-3 transition-all duration-300 relative overflow-hidden",
                    isActive
                      ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black shadow-[4px_4px_0px_0px_#fff] dark:shadow-[4px_4px_0px_0px_#000] scale-105"
                      : "border-white hover:bg-white hover:text-black dark:border-black dark:hover:bg-black dark:hover:text-white shadow-[3px_3px_0px_0px_#fff] dark:shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#fff] dark:hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:scale-105",
                  )}
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
                      item.color,
                      (isHovered || isActive) && "opacity-10",
                    )}
                  />

                  <div className="flex items-center relative z-10">
                    <Icon
                      className={cn(
                        "w-7 h-7 transition-all duration-300",
                        isCollapsed ? "mr-0" : "mr-4",
                        (isHovered || isActive) && "scale-110 rotate-12",
                      )}
                    />
                    {!isCollapsed && (
                      <span className={cn("transition-all duration-300", isHovered && "translate-x-2")}>
                        {item.label}
                      </span>
                    )}
                    {item.id === "workout" && currentSession && (
                      <div className="ml-auto w-4 h-4 bg-red-500 border-2 border-current rounded-full animate-bounce" />
                    )}
                  </div>

                  {/* Keyboard shortcut indicator */}
                  {!isCollapsed && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-mono bg-black dark:bg-white text-white dark:text-black px-2 py-1 rounded border">
                        ⌘{index + 1}
                      </span>
                    </div>
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && isHovered && (
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded border-2 border-white dark:border-black shadow-lg z-50 whitespace-nowrap">
                    <div className="font-bold">{item.label}</div>
                    <div className="text-xs opacity-75">⌘{index + 1}</div>
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-8 border-transparent border-r-black dark:border-r-white" />
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Enhanced Stats */}
        {!isCollapsed && (
          <div className="p-6 border-4 border-white dark:border-black shadow-[6px_6px_0px_0px_#fff] dark:shadow-[6px_6px_0px_0px_#000] bg-gradient-to-br from-gray-900 to-black dark:from-gray-100 dark:to-white relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent dark:via-black animate-pulse" />
            </div>

            <h3 className="font-black text-xl mb-6 tracking-tight relative z-10 text-center">STATS OGGI</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center group hover:scale-105 transition-transform">
                <span className="font-bold text-sm tracking-wide">WORKOUT:</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 border-2 border-white dark:border-black flex items-center justify-center font-black text-white text-sm">
                    {stats.weeklyWorkouts}
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between items-center group hover:scale-105 transition-transform">
                <span className="font-bold text-sm tracking-wide">STREAK:</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500 border-2 border-white dark:border-black flex items-center justify-center font-black text-white text-sm">
                    {stats.streak}
                  </div>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="flex justify-between items-center group hover:scale-105 transition-transform">
                <span className="font-bold text-sm tracking-wide">VOLUME:</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 border-2 border-white dark:border-black flex items-center justify-center font-black text-white text-xs">
                    {(stats.weeklyVolume / 1000).toFixed(1)}T
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed stats */}
        {isCollapsed && (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-blue-500 border-3 border-white dark:border-black flex items-center justify-center font-black text-white mx-auto hover:scale-110 transition-transform cursor-pointer">
              {stats.weeklyWorkouts}
            </div>
            <div className="w-12 h-12 bg-orange-500 border-3 border-white dark:border-black flex items-center justify-center font-black text-white mx-auto hover:scale-110 transition-transform cursor-pointer">
              {stats.streak}
            </div>
            <div className="w-12 h-12 bg-green-500 border-3 border-white dark:border-black flex items-center justify-center font-black text-white text-xs mx-auto hover:scale-110 transition-transform cursor-pointer">
              {(stats.weeklyVolume / 1000).toFixed(1)}T
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
