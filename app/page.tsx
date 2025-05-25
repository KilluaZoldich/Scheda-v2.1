"use client"

import { useState } from "react"
import { WorkoutProvider } from "@/components/workout-context"
import { ThemeProvider } from "@/components/theme-provider"
import { EnhancedSidebar } from "@/components/enhanced-sidebar"
import { EnhancedDashboard } from "@/components/enhanced-dashboard"
import { ExerciseLibrary } from "@/components/exercise-library"
import { WorkoutPlans } from "@/components/workout-plans"
import { ActiveWorkout } from "@/components/active-workout"
import { Settings } from "@/components/settings"
import { EnhancedMobileLayout } from "@/components/enhanced-mobile-layout"
import { MobileDashboard } from "@/components/mobile-dashboard"
import { MobileExerciseLibrary } from "@/components/mobile-exercise-library"
import { MobileActiveWorkout } from "@/components/mobile-active-workout"
import { useMobile } from "@/hooks/use-mobile"

function WorkoutApp() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const isMobile = useMobile()

  const renderDesktopContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <EnhancedDashboard setActiveTab={setActiveTab} />
      case "exercises":
        return <ExerciseLibrary />
      case "plans":
        return <WorkoutPlans setActiveTab={setActiveTab} />
      case "workout":
        return <ActiveWorkout setActiveTab={setActiveTab} />
      case "settings":
        return <Settings />
      default:
        return <EnhancedDashboard setActiveTab={setActiveTab} />
    }
  }

  const renderMobileContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <MobileDashboard setActiveTab={setActiveTab} />
      case "exercises":
        return <MobileExerciseLibrary />
      case "plans":
        return <WorkoutPlans setActiveTab={setActiveTab} />
      case "workout":
        return <MobileActiveWorkout setActiveTab={setActiveTab} />
      case "settings":
        return <Settings />
      default:
        return <MobileDashboard setActiveTab={setActiveTab} />
    }
  }

  if (isMobile) {
    return (
      <EnhancedMobileLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderMobileContent()}
      </EnhancedMobileLayout>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-black dark:to-gray-900 flex relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto relative z-10">{renderDesktopContent()}</main>
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <WorkoutProvider>
        <WorkoutApp />
      </WorkoutProvider>
    </ThemeProvider>
  )
}
