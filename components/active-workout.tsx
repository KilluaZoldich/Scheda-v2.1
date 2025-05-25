"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Play, Pause, Check, Plus, Minus, X, Trophy } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

interface ActiveWorkoutProps {
  setActiveTab: (tab: string) => void
}

export function ActiveWorkout({ setActiveTab }: ActiveWorkoutProps) {
  const { currentSession, updateSession, completeWorkout, workoutPlans, startWorkout } = useWorkout()
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(90)
  const [currentWeight, setCurrentWeight] = useState(0)
  const [currentReps, setCurrentReps] = useState("")

  // Controlli di sicurezza per evitare errori
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

  const handleStartNewWorkout = (planId: string) => {
    startWorkout(planId)
  }

  // Se non c'è una sessione valida, mostra la selezione delle schede
  if (!hasValidSession) {
    return (
      <div className="space-y-8">
        <div className="border-b-8 border-black dark:border-white pb-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-2">WORKOUT</h1>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">SELEZIONA UNA SCHEDA PER INIZIARE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutPlans.map((plan) => (
            <Card
              key={plan.id}
              className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              <CardHeader>
                <CardTitle className="font-bold text-xl">{plan.name}</CardTitle>
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{plan.description}</p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleStartNewWorkout(plan.id)}
                  className="w-full font-bold border-3 border-black dark:border-white"
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

  // Calcoli sicuri per il progresso
  const totalSets = safeCurrentSession.exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0)
  const completedSetsCount = safeCurrentSession.completedSets.flat().filter(Boolean).length
  const progress = totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0
  const isWorkoutComplete = completedSetsCount === totalSets && totalSets > 0

  // Controlli aggiuntivi per l'esercizio corrente
  if (!currentExercise) {
    return (
      <div className="space-y-8">
        <div className="border-b-8 border-black dark:border-white pb-6">
          <h1 className="text-4xl font-bold tracking-tighter mb-2">ERRORE</h1>
          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">ESERCIZIO NON TROVATO</p>
        </div>
        <Button onClick={() => setActiveTab("plans")} className="font-bold border-3 border-black dark:border-white">
          TORNA ALLE SCHEDE
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="border-b-8 border-black dark:border-white pb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter mb-2">WORKOUT</h1>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
              {safeCurrentSession.planName} - IN CORSO
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleCompleteWorkout}
            className="h-12 px-6 font-bold border-3 border-black dark:border-white"
          >
            <X className="w-6 h-6 mr-2" />
            TERMINA
          </Button>
        </div>
      </div>

      {isWorkoutComplete && (
        <Card className="border-3 border-green-500 shadow-[6px_6px_0px_0px_#22c55e] bg-green-50 dark:bg-green-950">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-4xl font-bold mb-2">WORKOUT COMPLETATO!</h2>
            <p className="text-lg font-bold text-green-600 dark:text-green-400 mb-6">
              Hai completato tutti gli esercizi. Ottimo lavoro!
            </p>
            <Button
              onClick={handleCompleteWorkout}
              className="h-14 px-8 text-xl font-bold bg-green-500 hover:bg-green-600 border-3 border-green-500"
            >
              <Trophy className="w-6 h-6 mr-2" />
              COMPLETA WORKOUT
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="font-bold text-2xl">PROGRESSO WORKOUT</CardTitle>
                <span className="font-bold text-lg">
                  {completedSetsCount}/{totalSets}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-4 border-3 border-black dark:border-white" />
            </CardContent>
          </Card>

          <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">{currentExercise.name}</CardTitle>
              <p className="font-bold text-lg text-gray-600 dark:text-gray-400">
                SERIE {safeCurrentSession.currentSet + 1} DI {currentExercise.sets}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-bold text-sm">RIPETIZIONI</label>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-3 border-black dark:border-white">
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      value={currentReps}
                      onChange={(e) => setCurrentReps(e.target.value)}
                      className="text-center font-bold border-3 border-black dark:border-white"
                    />
                    <Button size="sm" variant="outline" className="border-3 border-black dark:border-white">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-bold text-sm">PESO (KG)</label>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-3 border-black dark:border-white"
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
                      className="border-3 border-black dark:border-white"
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
                className="w-full h-14 text-xl font-bold border-3 border-black dark:border-white shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
              >
                <Check className="w-6 h-6 mr-2" />
                COMPLETA SERIE
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <CardHeader>
              <CardTitle className="font-bold text-xl">TIMER RIPOSO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{formatTime(timeLeft)}</div>
                <Progress
                  value={currentExercise.restTime > 0 ? (timeLeft / currentExercise.restTime) * 100 : 0}
                  className="h-3 border-3 border-black dark:border-white"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="flex-1 font-bold border-3 border-black dark:border-white"
                >
                  {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={() => {
                    setTimeLeft(currentExercise.restTime || 90)
                    setIsTimerRunning(false)
                  }}
                  variant="outline"
                  className="font-bold border-3 border-black dark:border-white"
                >
                  RESET
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <CardHeader>
              <CardTitle className="font-bold text-xl">ESERCIZI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {safeCurrentSession.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className={`p-3 border-2 border-black dark:border-white ${
                    index === safeCurrentSession.currentExercise
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : ""
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{exercise.name}</div>
                  <div className="flex gap-1">
                    {Array.from({ length: exercise.sets || 0 }).map((_, setIndex) => (
                      <div
                        key={setIndex}
                        className={`w-6 h-6 border-2 border-current flex items-center justify-center text-xs font-bold ${
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
      </div>
    </div>
  )
}
