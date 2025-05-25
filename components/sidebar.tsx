"use client"

import { Dumbbell, Home, Library, Calendar, Play, Settings, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useWorkout } from "@/components/workout-context"

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const { stats, currentSession } = useWorkout()

  const menuItems = [
    { id: "dashboard", label: "HOME", icon: Home },
    { id: "exercises", label: "ESERCIZI", icon: Library },
    { id: "plans", label: "SCHEDE", icon: Calendar },
    { id: "workout", label: "WORKOUT", icon: Play },
    { id: "settings", label: "SETTINGS", icon: Settings },
  ]

  return (
    <div className="w-80 bg-black dark:bg-white text-white dark:text-black p-6 border-r-8 border-black dark:border-white">
      {/* BRUTAL Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white dark:bg-black flex items-center justify-center border-4 border-white dark:border-black shadow-[4px_4px_0px_0px_#fff] dark:shadow-[4px_4px_0px_0px_#000]">
            <Dumbbell className="w-10 h-10 text-black dark:text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tighter">BRUTAL</h1>
            <p className="text-sm font-bold text-gray-400 dark:text-gray-600">WORKOUT</p>
          </div>
        </div>

        <Button
          onClick={toggleTheme}
          variant="ghost"
          className="w-full h-12 border-3 border-white dark:border-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white font-bold text-sm shadow-[3px_3px_0px_0px_#fff] dark:shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#fff] dark:hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {theme === "light" ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
          {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
        </Button>
      </div>

      {/* BRUTAL Navigation */}
      <nav className="space-y-3 mb-10">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start h-16 text-left font-bold text-lg tracking-wide border-3 shadow-[3px_3px_0px_0px_#fff] dark:shadow-[3px_3px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#fff] dark:hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all ${
                activeTab === item.id
                  ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black"
                  : "border-white hover:bg-white hover:text-black dark:border-black dark:hover:bg-black dark:hover:text-white"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-6 h-6 mr-4" />
              {item.label}
              {item.id === "workout" && currentSession && (
                <div className="ml-auto w-4 h-4 bg-red-500 border-2 border-current animate-pulse" />
              )}
            </Button>
          )
        })}
      </nav>

      {/* BRUTAL Stats */}
      <div className="p-6 border-4 border-white dark:border-black shadow-[4px_4px_0px_0px_#fff] dark:shadow-[4px_4px_0px_0px_#000]">
        <h3 className="font-bold text-lg mb-4 tracking-tight">STATS OGGI</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">WORKOUT:</span>
            <span className="font-bold text-xl">{stats.weeklyWorkouts}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">STREAK:</span>
            <span className="font-bold text-xl">{stats.streak}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">VOLUME:</span>
            <span className="font-bold text-xl">{(stats.weeklyVolume / 1000).toFixed(1)}T</span>
          </div>
        </div>
      </div>
    </div>
  )
}
