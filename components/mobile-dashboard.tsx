"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, Zap, Play, Plus, Library } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

interface MobileDashboardProps {
  setActiveTab: (tab: string) => void
}

export function MobileDashboard({ setActiveTab }: MobileDashboardProps) {
  const { stats, workoutPlans } = useWorkout()

  const recentWorkouts = workoutPlans.slice(0, 2).map((plan) => ({
    name: plan.name,
    exercises: plan.exercises.length,
    completed: Math.floor(Math.random() * plan.exercises.length),
    time: plan.duration.split("-")[0],
  }))

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Mobile Header */}
      <div className="text-center px-2">
        <h1 className="text-2xl font-bold tracking-tight mb-1">DASHBOARD</h1>
        <p className="text-sm font-bold text-gray-600 dark:text-gray-400">LA TUA SETTIMANA</p>
      </div>

      {/* Mobile Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
          <CardContent className="p-3 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{stats.weeklyWorkouts}</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">WORKOUT</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{(stats.weeklyVolume / 1000).toFixed(1)}T</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">VOLUME</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
          <CardContent className="p-3 text-center">
            <Target className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">OBIETTIVO</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
          <CardContent className="p-3 text-center">
            <Zap className="w-6 h-6 mx-auto mb-1" />
            <div className="text-xl font-bold">{stats.streak}</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">STREAK</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Quick Actions */}
      <Card className="border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-lg text-center">AZIONI RAPIDE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => setActiveTab("workout")}
            className="w-full h-12 text-base font-bold border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff] hover:shadow-[1px_1px_0px_0px_#000] dark:hover:shadow-[1px_1px_0px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] transition-all touch-manipulation"
          >
            <Play className="w-5 h-5 mr-2" />
            INIZIA WORKOUT
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => setActiveTab("plans")}
              className="h-10 font-bold border-2 border-black dark:border-white touch-manipulation"
            >
              <Plus className="w-4 h-4 mr-1" />
              SCHEDA
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("exercises")}
              className="h-10 font-bold border-2 border-black dark:border-white touch-manipulation"
            >
              <Library className="w-4 h-4 mr-1" />
              ESERCIZI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Recent Workouts */}
      <Card className="border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]">
        <CardHeader className="pb-2">
          <CardTitle className="font-bold text-lg text-center">WORKOUT RECENTI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="border-2 border-black dark:border-white p-3 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#fff]"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">{workout.name}</h3>
                <span className="text-xs font-bold bg-black dark:bg-white text-white dark:text-black px-2 py-1 border border-black dark:border-white">
                  {workout.time}MIN
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>PROGRESSO:</span>
                  <span>
                    {workout.completed}/{workout.exercises}
                  </span>
                </div>
                <Progress
                  value={(workout.completed / workout.exercises) * 100}
                  className="h-3 border-2 border-black dark:border-white"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
