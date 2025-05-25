"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Check, Plus, Minus, X, Trophy } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

interface MobileActiveWorkoutProps {
  setActiveTab: (tab: string) => void
}

export function MobileActiveWorkout({ setActiveTab }: MobileActiveWorkoutProps) {
  const { currentSession, updateSession, completeWorkout, workoutPlans, startWorkout } = useWorkout()
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [currentReps, setCurrentReps] = useState("")

  const safeCurrentSession = currentSession || null
  const hasValidSession =
    safeCurrentSession &&
    safeCurrentSession.exercises &&
    safeCurrentSession.exercises.length > 0 &&
    safeCurrentSession.currentExercise >= 0 &&
    safeCurrentSession.currentExercise < safeCurrentSession.exercises.length

  const currentExercise = hasValidSession ? safeCurrentSession.exercises[safeCurrentSession.currentExercise] : null

  useEffect(() => {
    if (hasValidSession && currentExercise) {
      setCurrentWeight(currentExercise.weight || 0)
      setCurrentReps(currentExercise.reps || "")
      setTimeLeft(currentExercise.restTime || 90)
    }
  }, [safeCurrentSession?.currentExercise, hasValidSession, currentExercise])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsTimerRunning(false)
      if (hasValidSession && currentExercise) {
        setTimeLeft(currentExercise.restTime || 90)
      }
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, timeLeft, hasValidSession, currentExercise])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const completeSet = () => {
    if (!hasValidSession || !safeCurrentSession) return

    const newCompletedSets = [...safeCurrentSession.completedSets]
    if (newCompletedSets[safeCurrentSession.currentExercise]) {
      newCompletedSets[safeCurrentSession.currentExercise][safeCurrentSession.currentSet] = true
    }

    let newCurrentExercise = safeCurrentSession.currentExercise
    let newCurrentSet = safeCurrentSession.currentSet

    const currentExerciseData = safeCurrentSession.exercises[safeCurrentSession.currentExercise]
    if (currentExerciseData && safeCurrentSession.currentSet < currentExerciseData.sets - 1) {
      newCurrentSet = safeCurrentSession.currentSet + 1
      setIsTimerRunning(true)
    } else if (safeCurrentSession.currentExercise < safeCurrentSession.exercises.length - 1) {
      newCurrentExercise = safeCurrentSession.currentExercise + 1
      newCurrentSet = 0
    }

    updateSession({
      completedSets: newCompletedSets,
      currentExercise: newCurrentExercise,
      currentSet: newCurrentSet,
    })
  }

  const handleCompleteWorkout = () => {
    completeWorkout()
    setActiveTab("dashboard")
  }

  // Se non c'è una sessione valida, mostra la selezione delle schede
  if (!hasValidSession) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">WORKOUT</h1>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">SELEZIONA UNA SCHEDA</p>
        </div>

        <div className="space-y-4">
          {workoutPlans.map((plan) => (
            <Card
              key={plan.id}
              className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
            >
              <CardHeader>
                <CardTitle className="font-bold text-lg">{plan.name}</CardTitle>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => startWorkout(plan.id)}
                  className="w-full h-12 font-bold border-3 border-black dark:border-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  INIZIA WORKOUT
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!currentExercise) {
    return (
      <div className="space-y-6 text-center">
        <h1 className="text-3xl font-bold">ERRORE</h1>
        <p className="text-lg font-bold text-gray-600 dark:text-gray-400">ESERCIZIO NON TROVATO</p>
        <Button onClick={() => setActiveTab("plans")} className="font-bold border-3 border-black dark:border-white">
          TORNA ALLE SCHEDE
        </Button>
      </div>
    )
  }

  const totalSets = safeCurrentSession.exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0)
  const completedSetsCount = safeCurrentSession.completedSets.flat().filter(Boolean).length
  const progress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0
  const isWorkoutComplete = completedSetsCount === totalSets && totalSets > 0

  return (
    <div className="space-y-6">
      {/* Mobile Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{safeCurrentSession.planName}</h1>
          <p className="text-sm font-bold text-gray-600 dark:text-gray-400">IN CORSO</p>
        </div>
        <Button
          variant="outline"
          onClick={handleCompleteWorkout}
          className="h-10 px-4 font-bold border-3 border-black dark:border-white"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Workout Complete */}
      {isWorkoutComplete && (
        <Card className="border-3 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] bg-green-50 dark:bg-green-950">
          <CardContent className="p-6 text-center">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <h2 className="text-2xl font-bold mb-2">COMPLETATO!</h2>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-4">Ottimo lavoro!</p>
            <Button
              onClick={handleCompleteWorkout}
              className="h-12 px-6 font-bold bg-green-500 hover:bg-green-600 border-3 border-green-500"
            >
              <Trophy className="w-5 h-5 mr-2" />
              COMPLETA
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress */}
      <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-bold text-lg">PROGRESSO</CardTitle>
            <span className="font-bold">
              {completedSetsCount}/{totalSets}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-4 border-3 border-black dark:border-white" />
        </CardContent>
      </Card>

      {/* Current Exercise */}
      <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-xl">{currentExercise.name}</CardTitle>
          <p className="font-bold text-lg text-gray-600 dark:text-gray-400">
            SERIE {safeCurrentSession.currentSet + 1} DI {currentExercise.sets}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-sm mb-2 block">RIPETIZIONI</label>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="border-3 border-black dark:border-white p-2">
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  value={currentReps}
                  onChange={(e) => setCurrentReps(e.target.value)}
                  className="text-center font-bold border-3 border-black dark:border-white"
                />
                <Button size="sm" variant="outline" className="border-3 border-black dark:border-white p-2">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="font-bold text-sm mb-2 block">PESO (KG)</label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-3 border-black dark:border-white p-2"
                  onClick={() => setCurrentWeight(Math.max(0, currentWeight - 2.5))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(Number(e.target.value) || 0)}
                  className="text-center font-bold border-3 border-black dark:border-white"
                  type="number"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="border-3 border-black dark:border-white p-2"
                  onClick={() => setCurrentWeight(currentWeight + 2.5)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button
            onClick={completeSet}
            disabled={isWorkoutComplete}
            className="w-full h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] disabled:opacity-50"
          >
            <Check className="w-6 h-6 mr-2" />
            COMPLETA SERIE
          </Button>
        </CardContent>
      </Card>

      {/* Timer */}
      <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-lg text-center">TIMER RIPOSO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-3">{formatTime(timeLeft)}</div>
            <Progress
              value={currentExercise.restTime > 0 ? (timeLeft / currentExercise.restTime) * 100 : 0}
              className="h-3 border-3 border-black dark:border-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="h-12 font-bold border-3 border-black dark:border-white"
            >
              {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            <Button
              onClick={() => {
                setTimeLeft(currentExercise.restTime || 90)
                setIsTimerRunning(false)
              }}
              variant="outline"
              className="h-12 font-bold border-3 border-black dark:border-white"
            >
              RESET
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <Card className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]">
        <CardHeader>
          <CardTitle className="font-bold text-lg text-center">ESERCIZI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {safeCurrentSession.exercises.map((exercise, index) => (
            <div
              key={index}
              className={`p-3 border-2 border-black dark:border-white ${
                index === safeCurrentSession.currentExercise ? "bg-black text-white dark:bg-white dark:text-black" : ""
              }`}
            >
              <div className="font-bold text-sm mb-2">{exercise.name}</div>
              <div className="flex gap-1">
                {Array.from({ length: exercise.sets || 0 }).map((_, setIndex) => (
                  <div
                    key={setIndex}
                    className={`w-8 h-8 border-2 border-current flex items-center justify-center text-xs font-bold ${
                      safeCurrentSession.completedSets[index] && safeCurrentSession.completedSets[index][setIndex]
                        ? "bg-current text-white dark:text-black"
                        : ""
                    }`}
                  >
                    {setIndex + 1}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
