"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Trash2, Filter, Eye, Target } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

export function MobileExerciseLibrary() {
  const { exercises, addExercise, deleteExercise, workoutPlans, addExerciseToWorkoutPlan } = useWorkout()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAddToWorkoutOpen, setIsAddToWorkoutOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [viewingExercise, setViewingExercise] = useState<any>(null)
  const [showFilters, setShowFilters] = useState(false)

  const [newExercise, setNewExercise] = useState({
    name: "",
    category: "",
    muscle: "",
    equipment: "",
    description: "",
    difficulty: "INTERMEDIO",
  })

  const [exerciseToAdd, setExerciseToAdd] = useState({
    sets: 3,
    reps: "8-12",
    weight: 20,
    restTime: 90,
    planId: "",
  })

  const categories = ["ALL", "PETTO", "SCHIENA", "SPALLE", "BRACCIA", "GAMBE", "CORE"]
  const equipments = ["Bilanciere", "Manubri", "Macchina", "Cavi", "Corpo libero"]

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "ALL" || exercise.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddExercise = () => {
    if (
      !newExercise.name.trim() ||
      !newExercise.category ||
      !newExercise.muscle.trim() ||
      !newExercise.equipment.trim()
    ) {
      alert("COMPILA TUTTI I CAMPI OBBLIGATORI!")
      return
    }

    addExercise({
      name: newExercise.name.trim().toUpperCase(),
      category: newExercise.category,
      muscle: newExercise.muscle.trim(),
      equipment: newExercise.equipment.trim(),
      description: newExercise.description.trim(),
      difficulty: newExercise.difficulty,
    })
    setNewExercise({ name: "", category: "", muscle: "", equipment: "", description: "", difficulty: "INTERMEDIO" })
    setIsDialogOpen(false)
  }

  const handleAddToWorkout = () => {
    if (!exerciseToAdd.planId) {
      alert("SELEZIONA UNA SCHEDA!")
      return
    }

    const exercise = exercises.find((ex) => ex.id === selectedExercise)
    if (!exercise) return

    const workoutExercise = {
      name: exercise.name,
      sets: exerciseToAdd.sets,
      reps: exerciseToAdd.reps,
      weight: exerciseToAdd.weight,
      restTime: exerciseToAdd.restTime,
    }

    addExerciseToWorkoutPlan(exerciseToAdd.planId, workoutExercise)
    setIsAddToWorkoutOpen(false)
    setExerciseToAdd({ sets: 3, reps: "8-12", weight: 20, restTime: 90, planId: "" })
    alert("ESERCIZIO AGGIUNTO!")
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "PRINCIPIANTE":
        return "bg-green-500 text-white"
      case "INTERMEDIO":
        return "bg-yellow-500 text-black"
      case "AVANZATO":
        return "bg-orange-500 text-white"
      case "ESPERTO":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Mobile Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">ESERCIZI</h1>
        <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
          {filteredExercises.length} di {exercises.length}
        </p>
      </div>

      {/* Mobile Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          <Input
            placeholder="CERCA ESERCIZIO..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 font-bold border-3 border-black dark:border-white"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 h-12 font-bold border-3 border-black dark:border-white"
          >
            <Filter className="w-5 h-5 mr-2" />
            FILTRI
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 px-6 font-bold border-3 border-black dark:border-white">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <Card className="border-3 border-black dark:border-white">
            <CardContent className="p-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-3 border-black dark:border-white font-bold">
                  <SelectValue placeholder="CATEGORIA" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="font-bold">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile Exercise List */}
      <div className="space-y-4">
        {filteredExercises.map((exercise) => (
          <Card
            key={exercise.id}
            className="border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="font-bold text-lg leading-tight">{exercise.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-black dark:border-white p-1"
                    onClick={() => {
                      setViewingExercise(exercise)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-black dark:border-white p-1"
                    onClick={() => deleteExercise(exercise.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-black text-white dark:bg-white dark:text-black font-bold text-xs px-2 py-1">
                  {exercise.category}
                </Badge>
                <Badge variant="outline" className="font-bold text-xs border-2 px-2 py-1">
                  {exercise.muscle}
                </Badge>
                {exercise.difficulty && (
                  <Badge className={`font-bold text-xs px-2 py-1 ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </Badge>
                )}
              </div>

              <p className="text-sm font-bold text-gray-600 dark:text-gray-400">{exercise.equipment}</p>

              <Button
                onClick={() => {
                  setSelectedExercise(exercise.id)
                  setIsAddToWorkoutOpen(true)
                }}
                className="w-full h-12 font-bold border-2 border-black dark:border-white"
              >
                <Target className="w-5 h-5 mr-2" />
                AGGIUNGI A SCHEDA
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Exercise Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-3 border-black dark:border-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">NUOVO ESERCIZIO</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="NOME ESERCIZIO *"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              className="font-bold border-3 border-black dark:border-white"
            />

            <Select
              value={newExercise.category}
              onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
            >
              <SelectTrigger className="border-3 border-black dark:border-white font-bold">
                <SelectValue placeholder="CATEGORIA *" />
              </SelectTrigger>
              <SelectContent>
                {categories.slice(1).map((cat) => (
                  <SelectItem key={cat} value={cat} className="font-bold">
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="MUSCOLO *"
              value={newExercise.muscle}
              onChange={(e) => setNewExercise({ ...newExercise, muscle: e.target.value })}
              className="font-bold border-3 border-black dark:border-white"
            />

            <Select
              value={newExercise.equipment}
              onValueChange={(value) => setNewExercise({ ...newExercise, equipment: value })}
            >
              <SelectTrigger className="border-3 border-black dark:border-white font-bold">
                <SelectValue placeholder="ATTREZZATURA *" />
              </SelectTrigger>
              <SelectContent>
                {equipments.map((eq) => (
                  <SelectItem key={eq} value={eq} className="font-bold">
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddExercise}
              className="w-full h-12 font-bold border-3 border-black dark:border-white"
            >
              AGGIUNGI ESERCIZIO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Exercise Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-3 border-black dark:border-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">{viewingExercise?.name}</DialogTitle>
          </DialogHeader>
          {viewingExercise && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-black text-white dark:bg-white dark:text-black font-bold text-sm px-3 py-1">
                  {viewingExercise.category}
                </Badge>
                <Badge variant="outline" className="font-bold text-sm border-2 px-3 py-1">
                  {viewingExercise.muscle}
                </Badge>
                <Badge variant="outline" className="font-bold text-sm border-2 px-3 py-1">
                  {viewingExercise.equipment}
                </Badge>
              </div>

              {viewingExercise.description && (
                <div>
                  <h3 className="font-bold text-lg mb-2">DESCRIZIONE</h3>
                  <p className="p-3 border-3 border-black dark:border-white bg-gray-50 dark:bg-gray-900">
                    {viewingExercise.description}
                  </p>
                </div>
              )}

              <Button
                onClick={() => {
                  setSelectedExercise(viewingExercise.id)
                  setIsViewDialogOpen(false)
                  setIsAddToWorkoutOpen(true)
                }}
                className="w-full h-12 font-bold border-3 border-black dark:border-white"
              >
                <Target className="w-5 h-5 mr-2" />
                AGGIUNGI A SCHEDA
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add to Workout Dialog */}
      <Dialog open={isAddToWorkoutOpen} onOpenChange={setIsAddToWorkoutOpen}>
        <DialogContent className="border-3 border-black dark:border-white">
          <DialogHeader>
            <DialogTitle className="font-bold text-xl">AGGIUNGI A SCHEDA</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              value={exerciseToAdd.planId}
              onValueChange={(value) => setExerciseToAdd({ ...exerciseToAdd, planId: value })}
            >
              <SelectTrigger className="border-3 border-black dark:border-white font-bold">
                <SelectValue placeholder="SELEZIONA SCHEDA" />
              </SelectTrigger>
              <SelectContent>
                {workoutPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id} className="font-bold">
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-sm mb-1 block">SERIE</label>
                <Input
                  type="number"
                  value={exerciseToAdd.sets}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, sets: Number(e.target.value) })}
                  className="font-bold border-3 border-black dark:border-white"
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block">REPS</label>
                <Input
                  value={exerciseToAdd.reps}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, reps: e.target.value })}
                  className="font-bold border-3 border-black dark:border-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-sm mb-1 block">PESO (KG)</label>
                <Input
                  type="number"
                  value={exerciseToAdd.weight}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, weight: Number(e.target.value) })}
                  className="font-bold border-3 border-black dark:border-white"
                />
              </div>
              <div>
                <label className="font-bold text-sm mb-1 block">RIPOSO (SEC)</label>
                <Input
                  type="number"
                  value={exerciseToAdd.restTime}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, restTime: Number(e.target.value) })}
                  className="font-bold border-3 border-black dark:border-white"
                />
              </div>
            </div>

            <Button
              onClick={handleAddToWorkout}
              className="w-full h-12 font-bold border-3 border-black dark:border-white"
            >
              AGGIUNGI A SCHEDA
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
