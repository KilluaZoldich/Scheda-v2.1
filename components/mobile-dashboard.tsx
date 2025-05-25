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
    <div className="space-y-6">
      {/* Mobile Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">DASHBOARD</h1>
        <p className="text-lg font-bold text-gray-600 dark:text-gray-400">LA TUA SETTIMANA</p>
      </div>

      {/* Mobile Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.weeklyWorkouts}</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">WORKOUT</p>
          </CardContent>
        </Card>

        <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{(stats.weeklyVolume / 1000).toFixed(1)}T</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">VOLUME</p>
          </CardContent>
        </Card>

        <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">OBIETTIVO</p>
          </CardContent>
        </Card>

        <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.streak}</div>
            <p className="text-xs font-bold text-gray-600 dark:text-gray-400">STREAK</p>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Quick Actions */}
      <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-xl text-center">AZIONI RAPIDE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => setActiveTab("workout")}
            className="w-full h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
          >
            <Play className="w-6 h-6 mr-3" />
            INIZIA WORKOUT
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveTab("plans")}
              className="h-12 font-bold border-3 border-black dark:border-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              SCHEDA
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("exercises")}
              className="h-12 font-bold border-3 border-black dark:border-white"
            >
              <Library className="w-5 h-5 mr-2" />
              ESERCIZI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Recent Workouts */}
      <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-xl text-center">WORKOUT RECENTI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="border-3 border-black dark:border-white p-4 shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff]"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-lg">{workout.name}</h3>
                <span className="text-sm font-bold bg-black dark:bg-white text-white dark:text-black px-3 py-1 border-2 border-black dark:border-white">
                  {workout.time}MIN
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>PROGRESSO:</span>
                  <span>
                    {workout.completed}/{workout.exercises}
                  </span>
                </div>
                <Progress
                  value={(workout.completed / workout.exercises) * 100}
                  className="h-4 border-3 border-black dark:border-white"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
