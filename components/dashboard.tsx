"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, TrendingUp, Target, Zap, Play, Plus, Library } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

interface DashboardProps {
  setActiveTab: (tab: string) => void
}

export function Dashboard({ setActiveTab }: DashboardProps) {
  const { stats, workoutPlans } = useWorkout()

  const recentWorkouts = workoutPlans.slice(0, 3).map((plan) => ({
    name: plan.name,
    exercises: plan.exercises.length,
    completed: Math.floor(Math.random() * plan.exercises.length),
    time: plan.duration.split("-")[0],
  }))

  return (
    <div className="space-y-8">
      {/* BRUTAL Header */}
      <div className="border-b-8 border-black dark:border-white pb-6">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">DASHBOARD</h1>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-400">OVERVIEW DELLA TUA SETTIMANA</p>
      </div>

      {/* BRUTAL Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Calendar className="w-12 h-12" />
              <div>
                <div className="text-3xl font-bold">{stats.weeklyWorkouts}</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">WORKOUT</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12" />
              <div>
                <div className="text-3xl font-bold">{(stats.weeklyVolume / 1000).toFixed(1)}T</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">VOLUME</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Target className="w-12 h-12" />
              <div>
                <div className="text-3xl font-bold">{stats.completionRate}%</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">OBIETTIVO</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Zap className="w-12 h-12" />
              <div>
                <div className="text-3xl font-bold">{stats.streak}</div>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">STREAK</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BRUTAL Quick Actions */}
      <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">AZIONI RAPIDE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              onClick={() => setActiveTab("workout")}
              className="h-20 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Play className="w-8 h-8 mr-3" />
              INIZIA WORKOUT
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("plans")}
              className="h-20 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Plus className="w-8 h-8 mr-3" />
              CREA SCHEDA
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveTab("exercises")}
              className="h-20 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Library className="w-8 h-8 mr-3" />
              ESERCIZI
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BRUTAL Recent Workouts */}
      <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-2xl">WORKOUT RECENTI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {recentWorkouts.map((workout, index) => (
            <div
              key={index}
              className="border-3 border-black dark:border-white p-6 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-2xl">{workout.name}</h3>
                <span className="text-lg font-bold bg-black dark:bg-white text-white dark:text-black px-4 py-2 border-2 border-black dark:border-white">
                  {workout.time}MIN
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>PROGRESSO:</span>
                  <span>
                    {workout.completed}/{workout.exercises}
                  </span>
                </div>
                <Progress
                  value={(workout.completed / workout.exercises) * 100}
                  className="h-6 border-3 border-black dark:border-white"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
