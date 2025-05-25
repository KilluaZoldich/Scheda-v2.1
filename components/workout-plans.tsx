"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Play, Edit, Copy, Trash2, Calendar, X } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

interface WorkoutPlansProps {
  setActiveTab: (tab: string) => void
}

export function WorkoutPlans({ setActiveTab }: WorkoutPlansProps) {
  const { workoutPlans, addWorkoutPlan, startWorkout, deleteWorkoutPlan, removeExerciseFromWorkoutPlan } = useWorkout()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [newPlan, setNewPlan] = useState({
    name: "",
    description: "",
    difficulty: "INTERMEDIO",
    duration: "45-60 min",
  })

  const handleAddPlan = () => {
    if (!newPlan.name.trim()) {
      alert("INSERISCI IL NOME DELLA SCHEDA!")
      return
    }
    if (!newPlan.description.trim()) {
      alert("INSERISCI LA DESCRIZIONE!")
      return
    }

    addWorkoutPlan({
      name: newPlan.name.trim().toUpperCase(),
      description: newPlan.description.trim(),
      difficulty: newPlan.difficulty,
      duration: newPlan.duration,
      exercises: [],
    })
    setNewPlan({ name: "", description: "", difficulty: "INTERMEDIO", duration: "45-60 min" })
    setIsDialogOpen(false)
  }

  const handleStartWorkout = (planId: string) => {
    startWorkout(planId)
    setActiveTab("workout")
  }

  const handleRemoveExercise = (planId: string, exerciseIndex: number) => {
    removeExerciseFromWorkoutPlan(planId, exerciseIndex)
  }

  return (
    <div className="space-y-8">
      {/* BRUTAL Header */}
      <div className="border-b-8 border-black dark:border-white pb-6">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">SCHEDE</h1>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-400">LE TUE SCHEDE DI ALLENAMENTO</p>
      </div>

      {/* BRUTAL Actions */}
      <div className="flex gap-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 px-8 text-lg font-bold border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <Plus className="w-8 h-8 mr-3" />
              NUOVA SCHEDA
            </Button>
          </DialogTrigger>
          <DialogContent className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
            <DialogHeader>
              <DialogTitle className="font-bold text-2xl">NUOVA SCHEDA</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <label className="font-bold text-lg mb-2 block">NOME *</label>
                <Input
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="NOME DELLA SCHEDA"
                />
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">DESCRIZIONE *</label>
                <Textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="Descrizione della scheda..."
                />
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">DURATA</label>
                <Input
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="45-60 min"
                />
              </div>
              <Button
                onClick={handleAddPlan}
                className="w-full h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                CREA SCHEDA
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          className="h-14 px-8 text-lg font-bold border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <Calendar className="w-8 h-8 mr-3" />
          PIANIFICA
        </Button>
      </div>

      {/* BRUTAL Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workoutPlans.map((plan) => (
          <Card
            key={plan.id}
            className={`border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-pointer ${
              selectedPlan === plan.id ? "bg-black text-white dark:bg-white dark:text-black" : ""
            }`}
            onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-bold text-xl mb-1">{plan.name}</CardTitle>
                  <p
                    className={`text-lg font-bold ${selectedPlan === plan.id ? "text-gray-300 dark:text-gray-700" : "text-gray-600 dark:text-gray-400"}`}
                  >
                    {plan.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-2 p-2 ${selectedPlan === plan.id ? "border-white text-white dark:border-black dark:text-black" : "border-black dark:border-white"}`}
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-2 p-2 ${selectedPlan === plan.id ? "border-white text-white dark:border-black dark:text-black" : "border-black dark:border-white"}`}
                  >
                    <Copy className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className={`border-2 p-2 ${selectedPlan === plan.id ? "border-white text-white dark:border-black dark:text-black" : "border-black dark:border-white"}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteWorkoutPlan(plan.id)
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge
                  className={`font-bold text-sm border-2 px-3 py-1 ${
                    selectedPlan === plan.id
                      ? "bg-white text-black border-white dark:bg-black dark:text-white dark:border-black"
                      : "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  }`}
                >
                  {plan.difficulty}
                </Badge>
                <Badge
                  variant="outline"
                  className={`font-bold text-sm border-2 px-3 py-1 ${
                    selectedPlan === plan.id
                      ? "border-white text-white dark:border-black dark:text-black"
                      : "border-black dark:border-white"
                  }`}
                >
                  {plan.exercises.length} ESERCIZI
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>DURATA:</span>
                  <span>{plan.duration}</span>
                </div>
                {plan.lastUsed && (
                  <div className="flex justify-between text-lg font-bold">
                    <span>ULTIMO USO:</span>
                    <span>{plan.lastUsed}</span>
                  </div>
                )}
              </div>

              {selectedPlan === plan.id && plan.exercises.length > 0 && (
                <div
                  className={`space-y-3 pt-4 border-t-4 ${selectedPlan === plan.id ? "border-white dark:border-black" : "border-black dark:border-white"}`}
                >
                  <h4 className="font-bold text-lg">ESERCIZI:</h4>
                  {plan.exercises.map((exercise, index) => (
                    <div
                      key={index}
                      className={`p-3 border-2 ${selectedPlan === plan.id ? "border-white dark:border-black" : "border-black dark:border-white"} flex justify-between items-center`}
                    >
                      <div>
                        <div className="font-bold text-lg">{exercise.name}</div>
                        <div
                          className={`text-sm font-bold ${
                            selectedPlan === plan.id
                              ? "text-gray-300 dark:text-gray-700"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {exercise.sets} serie × {exercise.reps} reps @ {exercise.weight}kg
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 p-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveExercise(plan.id, index)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleStartWorkout(plan.id)
                }}
                className={`w-full h-12 text-lg font-bold border-3 ${
                  selectedPlan === plan.id
                    ? "bg-white text-black border-white hover:bg-gray-200 dark:bg-black dark:text-white dark:border-black dark:hover:bg-gray-800"
                    : "border-black dark:border-white"
                }`}
              >
                <Play className="w-6 h-6 mr-2" />
                INIZIA WORKOUT
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
