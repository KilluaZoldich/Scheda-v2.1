"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Search, Plus, Edit, Trash2, Filter, SortAsc, SortDesc, Copy, Eye, Target } from "lucide-react"
import { useWorkout } from "@/components/workout-context"

interface Exercise {
  id: string
  name: string
  category: string
  muscle: string
  equipment: string
  description?: string
  instructions?: string
  difficulty?: string
  videoUrl?: string
}

export function ExerciseLibrary() {
  const { exercises, addExercise, deleteExercise, workoutPlans, addExerciseToWorkoutPlan, updateExercise } =
    useWorkout()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [selectedEquipment, setSelectedEquipment] = useState("ALL")
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddToWorkoutOpen, setIsAddToWorkoutOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedExercise, setSelectedExercise] = useState<string>("")
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)
  const [viewingExercise, setViewingExercise] = useState<Exercise | null>(null)

  const [newExercise, setNewExercise] = useState({
    name: "",
    category: "",
    muscle: "",
    equipment: "",
    description: "",
    instructions: "",
    difficulty: "INTERMEDIO",
    videoUrl: "",
  })

  const [exerciseToAdd, setExerciseToAdd] = useState({
    sets: 3,
    reps: "8-12",
    weight: 20,
    restTime: 90,
    planId: "",
  })

  const categories = ["ALL", "PETTO", "SCHIENA", "SPALLE", "BRACCIA", "GAMBE", "CORE", "CARDIO", "FUNZIONALE"]
  const equipments = [
    "ALL",
    "Bilanciere",
    "Manubri",
    "Macchina",
    "Cavi",
    "Corpo libero",
    "Kettlebell",
    "Elastici",
    "TRX",
  ]
  const difficulties = ["ALL", "PRINCIPIANTE", "INTERMEDIO", "AVANZATO", "ESPERTO"]
  const sortOptions = [
    { value: "name", label: "NOME" },
    { value: "category", label: "CATEGORIA" },
    { value: "muscle", label: "MUSCOLO" },
    { value: "difficulty", label: "DIFFICOLTÀ" },
  ]

  // Filtri e ordinamento
  const filteredAndSortedExercises = exercises
    .filter((exercise) => {
      const matchesSearch =
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.muscle.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "ALL" || exercise.category === selectedCategory
      const matchesEquipment = selectedEquipment === "ALL" || exercise.equipment === selectedEquipment
      const matchesDifficulty = selectedDifficulty === "ALL" || exercise.difficulty === selectedDifficulty
      return matchesSearch && matchesCategory && matchesEquipment && matchesDifficulty
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Exercise] || ""
      const bValue = b[sortBy as keyof Exercise] || ""
      const comparison = aValue.toString().localeCompare(bValue.toString())
      return sortOrder === "asc" ? comparison : -comparison
    })

  const resetNewExercise = () => {
    setNewExercise({
      name: "",
      category: "",
      muscle: "",
      equipment: "",
      description: "",
      instructions: "",
      difficulty: "INTERMEDIO",
      videoUrl: "",
    })
  }

  const handleAddExercise = () => {
    if (!newExercise.name.trim()) {
      alert("INSERISCI IL NOME DELL'ESERCIZIO!")
      return
    }
    if (!newExercise.category) {
      alert("SELEZIONA UNA CATEGORIA!")
      return
    }
    if (!newExercise.muscle.trim()) {
      alert("INSERISCI IL MUSCOLO!")
      return
    }
    if (!newExercise.equipment.trim()) {
      alert("INSERISCI L'ATTREZZATURA!")
      return
    }

    addExercise({
      name: newExercise.name.trim().toUpperCase(),
      category: newExercise.category,
      muscle: newExercise.muscle.trim(),
      equipment: newExercise.equipment.trim(),
      description: newExercise.description.trim(),
      instructions: newExercise.instructions.trim(),
      difficulty: newExercise.difficulty,
      videoUrl: newExercise.videoUrl.trim(),
    })
    resetNewExercise()
    setIsDialogOpen(false)
  }

  const handleEditExercise = () => {
    if (!editingExercise) return

    if (!editingExercise.name.trim()) {
      alert("INSERISCI IL NOME DELL'ESERCIZIO!")
      return
    }
    if (!editingExercise.category) {
      alert("SELEZIONA UNA CATEGORIA!")
      return
    }
    if (!editingExercise.muscle.trim()) {
      alert("INSERISCI IL MUSCOLO!")
      return
    }
    if (!editingExercise.equipment.trim()) {
      alert("INSERISCI L'ATTREZZATURA!")
      return
    }

    updateExercise(editingExercise.id, {
      ...editingExercise,
      name: editingExercise.name.trim().toUpperCase(),
      muscle: editingExercise.muscle.trim(),
      equipment: editingExercise.equipment.trim(),
      description: editingExercise.description?.trim() || "",
      instructions: editingExercise.instructions?.trim() || "",
      videoUrl: editingExercise.videoUrl?.trim() || "",
    })
    setEditingExercise(null)
    setIsEditDialogOpen(false)
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
    alert("ESERCIZIO AGGIUNTO ALLA SCHEDA!")
  }

  const openAddToWorkout = (exerciseId: string) => {
    setSelectedExercise(exerciseId)
    setIsAddToWorkoutOpen(true)
  }

  const openEditDialog = (exercise: Exercise) => {
    setEditingExercise({ ...exercise })
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (exercise: Exercise) => {
    setViewingExercise(exercise)
    setIsViewDialogOpen(true)
  }

  const duplicateExercise = (exercise: Exercise) => {
    const duplicated = {
      ...exercise,
      name: `${exercise.name} - COPIA`,
    }
    delete (duplicated as any).id
    addExercise(duplicated)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedCategory("ALL")
    setSelectedEquipment("ALL")
    setSelectedDifficulty("ALL")
    setSortBy("name")
    setSortOrder("asc")
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
    <div className="space-y-8">
      {/* BRUTAL Header */}
      <div className="border-b-8 border-black dark:border-white pb-6">
        <h1 className="text-5xl font-bold tracking-tighter mb-2">ESERCIZI</h1>
        <p className="text-xl font-bold text-gray-600 dark:text-gray-400">
          LIBRERIA COMPLETA DEGLI ESERCIZI ({filteredAndSortedExercises.length} di {exercises.length})
        </p>
      </div>

      {/* BRUTAL Search and Controls */}
      <div className="space-y-6">
        {/* Search Bar */}
        <div className="flex gap-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-8 h-8" />
            <Input
              placeholder="CERCA ESERCIZIO O MUSCOLO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-16 h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff]"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                <Plus className="w-8 h-8 mr-3" />
                NUOVO ESERCIZIO
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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

          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="border-3 border-black dark:border-white font-bold">
              <SelectValue placeholder="ATTREZZATURA" />
            </SelectTrigger>
            <SelectContent>
              {equipments.map((eq) => (
                <SelectItem key={eq} value={eq} className="font-bold">
                  {eq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="border-3 border-black dark:border-white font-bold">
              <SelectValue placeholder="DIFFICOLTÀ" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff} className="font-bold">
                  {diff}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="border-3 border-black dark:border-white font-bold">
              <SelectValue placeholder="ORDINA PER" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-bold">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border-3 border-black dark:border-white font-bold"
          >
            {sortOrder === "asc" ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
          </Button>

          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="border-3 border-black dark:border-white font-bold"
          >
            <Filter className="w-5 h-5 mr-2" />
            RESET
          </Button>
        </div>
      </div>

      {/* BRUTAL Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedExercises.map((exercise) => (
          <Card
            key={exercise.id}
            className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="font-bold text-lg leading-tight">{exercise.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-black dark:border-white p-1"
                    onClick={() => openViewDialog(exercise)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-black dark:border-white p-1"
                    onClick={() => openEditDialog(exercise)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-black dark:border-white p-1"
                    onClick={() => duplicateExercise(exercise)}
                  >
                    <Copy className="w-4 h-4" />
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
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-black text-white dark:bg-white dark:text-black font-bold text-xs border-2 border-black dark:border-white px-2 py-1">
                  {exercise.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="font-bold text-xs border-2 border-black dark:border-white px-2 py-1"
                >
                  {exercise.muscle}
                </Badge>
                {exercise.difficulty && (
                  <Badge className={`font-bold text-xs border-2 px-2 py-1 ${getDifficultyColor(exercise.difficulty)}`}>
                    {exercise.difficulty}
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  <span className="font-bold">ATTREZZATURA:</span> {exercise.equipment}
                </p>
                {exercise.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{exercise.description}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => openAddToWorkout(exercise.id)}
                  className="flex-1 h-10 font-bold border-2 border-black dark:border-white text-sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  AGGIUNGI
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openViewDialog(exercise)}
                  className="h-10 px-3 font-bold border-2 border-black dark:border-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedExercises.length === 0 && (
        <Card className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
          <CardContent className="p-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold mb-2">NESSUN ESERCIZIO TROVATO</h3>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-6">
              Prova a modificare i filtri o aggiungi un nuovo esercizio
            </p>
            <Button onClick={clearAllFilters} className="font-bold border-3 border-black dark:border-white">
              RESET FILTRI
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Exercise Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">NUOVO ESERCIZIO</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-lg mb-2 block">NOME *</label>
                <Input
                  value={newExercise.name}
                  onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="NOME ESERCIZIO"
                />
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">MUSCOLO *</label>
                <Input
                  value={newExercise.muscle}
                  onChange={(e) => setNewExercise({ ...newExercise, muscle: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="MUSCOLO PRINCIPALE"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-lg mb-2 block">CATEGORIA *</label>
                <Select
                  value={newExercise.category}
                  onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
                >
                  <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                    <SelectValue placeholder="CATEGORIA" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-bold text-lg">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">ATTREZZATURA *</label>
                <Select
                  value={newExercise.equipment}
                  onValueChange={(value) => setNewExercise({ ...newExercise, equipment: value })}
                >
                  <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                    <SelectValue placeholder="ATTREZZATURA" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipments.slice(1).map((eq) => (
                      <SelectItem key={eq} value={eq} className="font-bold text-lg">
                        {eq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">DIFFICOLTÀ</label>
                <Select
                  value={newExercise.difficulty}
                  onValueChange={(value) => setNewExercise({ ...newExercise, difficulty: value })}
                >
                  <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                    <SelectValue placeholder="DIFFICOLTÀ" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.slice(1).map((diff) => (
                      <SelectItem key={diff} value={diff} className="font-bold text-lg">
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="font-bold text-lg mb-2 block">DESCRIZIONE</label>
              <Textarea
                value={newExercise.description}
                onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
                className="font-bold text-lg border-3 border-black dark:border-white"
                placeholder="Breve descrizione dell'esercizio..."
                rows={3}
              />
            </div>

            <div>
              <label className="font-bold text-lg mb-2 block">ISTRUZIONI</label>
              <Textarea
                value={newExercise.instructions}
                onChange={(e) => setNewExercise({ ...newExercise, instructions: e.target.value })}
                className="font-bold text-lg border-3 border-black dark:border-white"
                placeholder="Istruzioni dettagliate per l'esecuzione..."
                rows={4}
              />
            </div>

            <div>
              <label className="font-bold text-lg mb-2 block">VIDEO URL (OPZIONALE)</label>
              <Input
                value={newExercise.videoUrl}
                onChange={(e) => setNewExercise({ ...newExercise, videoUrl: e.target.value })}
                className="font-bold text-lg border-3 border-black dark:border-white"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddExercise}
                className="flex-1 h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                AGGIUNGI ESERCIZIO
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetNewExercise()
                  setIsDialogOpen(false)
                }}
                className="h-14 px-8 text-lg font-bold border-3 border-black dark:border-white"
              >
                ANNULLA
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Exercise Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">MODIFICA ESERCIZIO</DialogTitle>
          </DialogHeader>
          {editingExercise && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-lg mb-2 block">NOME *</label>
                  <Input
                    value={editingExercise.name}
                    onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                    className="font-bold text-lg border-3 border-black dark:border-white"
                    placeholder="NOME ESERCIZIO"
                  />
                </div>
                <div>
                  <label className="font-bold text-lg mb-2 block">MUSCOLO *</label>
                  <Input
                    value={editingExercise.muscle}
                    onChange={(e) => setEditingExercise({ ...editingExercise, muscle: e.target.value })}
                    className="font-bold text-lg border-3 border-black dark:border-white"
                    placeholder="MUSCOLO PRINCIPALE"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-lg mb-2 block">CATEGORIA *</label>
                  <Select
                    value={editingExercise.category}
                    onValueChange={(value) => setEditingExercise({ ...editingExercise, category: value })}
                  >
                    <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                      <SelectValue placeholder="CATEGORIA" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((cat) => (
                        <SelectItem key={cat} value={cat} className="font-bold text-lg">
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-bold text-lg mb-2 block">ATTREZZATURA *</label>
                  <Select
                    value={editingExercise.equipment}
                    onValueChange={(value) => setEditingExercise({ ...editingExercise, equipment: value })}
                  >
                    <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                      <SelectValue placeholder="ATTREZZATURA" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipments.slice(1).map((eq) => (
                        <SelectItem key={eq} value={eq} className="font-bold text-lg">
                          {eq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="font-bold text-lg mb-2 block">DIFFICOLTÀ</label>
                  <Select
                    value={editingExercise.difficulty || "INTERMEDIO"}
                    onValueChange={(value) => setEditingExercise({ ...editingExercise, difficulty: value })}
                  >
                    <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                      <SelectValue placeholder="DIFFICOLTÀ" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.slice(1).map((diff) => (
                        <SelectItem key={diff} value={diff} className="font-bold text-lg">
                          {diff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="font-bold text-lg mb-2 block">DESCRIZIONE</label>
                <Textarea
                  value={editingExercise.description || ""}
                  onChange={(e) => setEditingExercise({ ...editingExercise, description: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="Breve descrizione dell'esercizio..."
                  rows={3}
                />
              </div>

              <div>
                <label className="font-bold text-lg mb-2 block">ISTRUZIONI</label>
                <Textarea
                  value={editingExercise.instructions || ""}
                  onChange={(e) => setEditingExercise({ ...editingExercise, instructions: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="Istruzioni dettagliate per l'esecuzione..."
                  rows={4}
                />
              </div>

              <div>
                <label className="font-bold text-lg mb-2 block">VIDEO URL (OPZIONALE)</label>
                <Input
                  value={editingExercise.videoUrl || ""}
                  onChange={(e) => setEditingExercise({ ...editingExercise, videoUrl: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleEditExercise}
                  className="flex-1 h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  SALVA MODIFICHE
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingExercise(null)
                    setIsEditDialogOpen(false)
                  }}
                  className="h-14 px-8 text-lg font-bold border-3 border-black dark:border-white"
                >
                  ANNULLA
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View Exercise Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">{viewingExercise?.name}</DialogTitle>
          </DialogHeader>
          {viewingExercise && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-black text-white dark:bg-white dark:text-black font-bold text-sm border-2 border-black dark:border-white px-3 py-1">
                  {viewingExercise.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="font-bold text-sm border-2 border-black dark:border-white px-3 py-1"
                >
                  {viewingExercise.muscle}
                </Badge>
                <Badge
                  variant="outline"
                  className="font-bold text-sm border-2 border-black dark:border-white px-3 py-1"
                >
                  {viewingExercise.equipment}
                </Badge>
                {viewingExercise.difficulty && (
                  <Badge
                    className={`font-bold text-sm border-2 px-3 py-1 ${getDifficultyColor(viewingExercise.difficulty)}`}
                  >
                    {viewingExercise.difficulty}
                  </Badge>
                )}
              </div>

              {viewingExercise.description && (
                <div>
                  <h3 className="font-bold text-lg mb-2">DESCRIZIONE</h3>
                  <p className="text-lg p-4 border-3 border-black dark:border-white bg-gray-50 dark:bg-gray-900">
                    {viewingExercise.description}
                  </p>
                </div>
              )}

              {viewingExercise.instructions && (
                <div>
                  <h3 className="font-bold text-lg mb-2">ISTRUZIONI</h3>
                  <div className="text-lg p-4 border-3 border-black dark:border-white bg-gray-50 dark:bg-gray-900 whitespace-pre-wrap">
                    {viewingExercise.instructions}
                  </div>
                </div>
              )}

              {viewingExercise.videoUrl && (
                <div>
                  <h3 className="font-bold text-lg mb-2">VIDEO</h3>
                  <a
                    href={viewingExercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block p-4 border-3 border-black dark:border-white bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                  >
                    GUARDA VIDEO →
                  </a>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => openAddToWorkout(viewingExercise.id)}
                  className="flex-1 h-14 text-lg font-bold border-3 border-black dark:border-white"
                >
                  <Target className="w-6 h-6 mr-2" />
                  AGGIUNGI A SCHEDA
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openEditDialog(viewingExercise)}
                  className="h-14 px-8 text-lg font-bold border-3 border-black dark:border-white"
                >
                  <Edit className="w-6 h-6 mr-2" />
                  MODIFICA
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add to Workout Dialog */}
      <Dialog open={isAddToWorkoutOpen} onOpenChange={setIsAddToWorkoutOpen}>
        <DialogContent className="border-3 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">AGGIUNGI A SCHEDA</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <label className="font-bold text-lg mb-2 block">SCHEDA *</label>
              <Select
                value={exerciseToAdd.planId}
                onValueChange={(value) => setExerciseToAdd({ ...exerciseToAdd, planId: value })}
              >
                <SelectTrigger className="border-3 border-black dark:border-white font-bold text-lg h-14">
                  <SelectValue placeholder="SELEZIONA SCHEDA" />
                </SelectTrigger>
                <SelectContent>
                  {workoutPlans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id} className="font-bold text-lg">
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-lg mb-2 block">SERIE</label>
                <Input
                  type="number"
                  value={exerciseToAdd.sets}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, sets: Number(e.target.value) })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                />
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">RIPETIZIONI</label>
                <Input
                  value={exerciseToAdd.reps}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, reps: e.target.value })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                  placeholder="8-12"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-lg mb-2 block">PESO (KG)</label>
                <Input
                  type="number"
                  value={exerciseToAdd.weight}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, weight: Number(e.target.value) })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                />
              </div>
              <div>
                <label className="font-bold text-lg mb-2 block">RIPOSO (SEC)</label>
                <Input
                  type="number"
                  value={exerciseToAdd.restTime}
                  onChange={(e) => setExerciseToAdd({ ...exerciseToAdd, restTime: Number(e.target.value) })}
                  className="font-bold text-lg border-3 border-black dark:border-white"
                />
              </div>
            </div>
            <Button
              onClick={handleAddToWorkout}
              className="w-full h-14 text-lg font-bold border-3 border-black dark:border-white shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#fff] hover:shadow-[2px_2px_0px_0px_#000] dark:hover:shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              AGGIUNGI A SCHEDA
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
