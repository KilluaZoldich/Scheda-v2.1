"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, Zap, Play, Plus, Library, Award, Clock, FlameIcon as Fire } from "lucide-react"
import { useWorkout } from "@/components/workout-context"
import { cn } from "@/lib/utils"

interface EnhancedDashboardProps {
  setActiveTab: (tab: string) => void
}

export function EnhancedDashboard({ setActiveTab }: EnhancedDashboardProps) {
  const { stats, workoutPlans } = useWorkout()
  const [animatedStats, setAnimatedStats] = useState({
    weeklyWorkouts: 0,
    weeklyVolume: 0,
    completionRate: 0,
    streak: 0,
  })

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        const current = start + (end - start) * easeOutQuart
        callback(Math.round(current))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    setTimeout(() => {
      animateValue(0, stats.weeklyWorkouts, 1000, (value) =>
        setAnimatedStats((prev) => ({ ...prev, weeklyWorkouts: value })),
      )
    }, 200)

    setTimeout(() => {
      animateValue(0, stats.weeklyVolume, 1200, (value) =>
        setAnimatedStats((prev) => ({ ...prev, weeklyVolume: value })),
      )
    }, 400)

    setTimeout(() => {
      animateValue(0, stats.completionRate, 1400, (value) =>
        setAnimatedStats((prev) => ({ ...prev, completionRate: value })),
      )
    }, 600)

    setTimeout(() => {
      animateValue(0, stats.streak, 1600, (value) => setAnimatedStats((prev) => ({ ...prev, streak: value })))
    }, 800)
  }, [stats])

  const recentWorkouts = workoutPlans.slice(0, 3).map((plan) => ({
    name: plan.name,
    exercises: plan.exercises.length,
    completed: Math.floor(Math.random() * plan.exercises.length),
    time: plan.duration.split("-")[0],
  }))

  const statCards = [
    {
      icon: Calendar,
      value: animatedStats.weeklyWorkouts,
      label: "WORKOUT",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingUp,
      value: `${(animatedStats.weeklyVolume / 1000).toFixed(1)}T`,
      label: "VOLUME",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Target,
      value: `${animatedStats.completionRate}%`,
      label: "OBIETTIVO",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Zap,
      value: animatedStats.streak,
      label: "STREAK",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      textColor: "text-orange-600 dark:text-orange-400",
    },
  ]

  return (
    <div className="space-y-8 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full animate-pulse" />
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-gradient-to-br from-green-500/10 to-yellow-500/10 rounded-full animate-pulse delay-1000" />
      </div>

      {/* Enhanced Header */}
      <div className="border-b-8 border-black dark:border-white pb-6 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 flex items-center justify-center border-4 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] transform hover:rotate-12 transition-transform">
            <Award className="w-10 h-10 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              DASHBOARD
            </h1>
            <p className="text-xl font-bold text-gray-600 dark:text-gray-400 tracking-wide">
              OVERVIEW DELLA TUA SETTIMANA
            </p>
          </div>
        </div>

        {/* Time indicator */}
        <div className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Ultimo aggiornamento: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className={cn(
                "border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 group cursor-pointer relative overflow-hidden",
                stat.bgColor,
              )}
            >
              {/* Gradient overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity",
                  stat.color,
                )}
              />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-full border-3 border-black dark:border-white bg-gradient-to-br",
                      stat.color,
                    )}
                  >
                    <Icon className="w-8 h-8 text-white group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <div
                      className={cn("text-4xl font-black group-hover:scale-110 transition-transform", stat.textColor)}
                    >
                      {stat.value}
                    </div>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400 tracking-wide">{stat.label}</p>
                  </div>
                </div>

                {/* Animated indicator */}
                <div className="absolute top-2 right-2">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      stat.color.replace("from-", "bg-").split(" ")[0],
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Enhanced Quick Actions */}
      <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black to-transparent dark:via-white animate-pulse" />
        </div>

        <CardHeader className="relative z-10">
          <CardTitle className="font-black text-3xl text-center flex items-center justify-center gap-3">
            <Fire className="w-8 h-8 text-red-500 animate-pulse" />
            AZIONI RAPIDE
            <Fire className="w-8 h-8 text-red-500 animate-pulse" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              onClick={() => setActiveTab("workout")}
              className="h-24 text-xl font-black border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 animate-pulse" />
              <Play className="w-10 h-10 mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform relative z-10" />
              <span className="relative z-10">INIZIA WORKOUT</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab("plans")}
              className="h-24 text-xl font-black border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 group hover:bg-purple-50 dark:hover:bg-purple-950"
            >
              <Plus className="w-10 h-10 mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              CREA SCHEDA
            </Button>

            <Button
              variant="outline"
              onClick={() => setActiveTab("exercises")}
              className="h-24 text-xl font-black border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 group hover:bg-green-50 dark:hover:bg-green-950"
            >
              <Library className="w-10 h-10 mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
              ESERCIZI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Recent Workouts */}
      <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] relative overflow-hidden">
        <CardHeader className="relative z-10">
          <CardTitle className="font-black text-3xl text-center">WORKOUT RECENTI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 relative z-10">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="border-3 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 group cursor-pointer relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="font-black text-2xl group-hover:scale-105 transition-transform">{workout.name}</h3>
                <span className="text-lg font-black bg-black dark:bg-white text-white dark:text-black px-4 py-2 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] group-hover:scale-105 transition-transform">
                  {workout.time}MIN
                </span>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-lg font-bold">
                  <span>PROGRESSO:</span>
                  <span className="group-hover:scale-105 transition-transform">
                    {workout.completed}/{workout.exercises}
                  </span>
                </div>
                <Progress
                  value={(workout.completed / workout.exercises) * 100}
                  className="h-6 border-3 border-black dark:border-white group-hover:scale-105 transition-transform"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
