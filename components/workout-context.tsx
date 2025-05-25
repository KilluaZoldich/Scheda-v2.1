"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

interface WorkoutExercise {
  name: string
  sets: number
  reps: string
  weight: number
  restTime: number
}

interface WorkoutPlan {
  id: string
  name: string
  description: string
  exercises: WorkoutExercise[]
  difficulty: string
  duration: string
  lastUsed?: string
}

interface WorkoutSession {
  planId: string
  planName: string
  startTime: Date
  exercises: WorkoutExercise[]
  completedSets: boolean[][]
  currentExercise: number
  currentSet: number
  isActive: boolean
}

interface WorkoutStats {
  totalWorkouts: number
  weeklyWorkouts: number
  totalVolume: number
  weeklyVolume: number
  streak: number
  completionRate: number
}

interface WorkoutContextType {
  exercises: Exercise[]
  workoutPlans: WorkoutPlan[]
  currentSession: WorkoutSession | null
  stats: WorkoutStats
  addExercise: (exercise: Omit<Exercise, "id">) => void
  updateExercise: (id: string, exercise: Partial<Exercise>) => void
  addWorkoutPlan: (plan: Omit<WorkoutPlan, "id">) => void
  addExerciseToWorkoutPlan: (planId: string, exercise: WorkoutExercise) => void
  removeExerciseFromWorkoutPlan: (planId: string, exerciseIndex: number) => void
  startWorkout: (planId: string) => void
  completeWorkout: () => void
  updateSession: (session: Partial<WorkoutSession>) => void
  deleteWorkoutPlan: (planId: string) => void
  deleteExercise: (exerciseId: string) => void
  updateWorkoutPlan: (planId: string, updates: Partial<WorkoutPlan>) => void
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

// Default data with enhanced exercises
const defaultExercises: Exercise[] = [
  {
    id: "1",
    name: "PANCA PIANA",
    category: "PETTO",
    muscle: "Pettorale",
    equipment: "Bilanciere",
    difficulty: "INTERMEDIO",
    description: "Esercizio fondamentale per lo sviluppo del petto",
    instructions:
      "1. Sdraiati sulla panca con i piedi ben piantati a terra\n2. Afferra il bilanciere con presa leggermente più ampia delle spalle\n3. Abbassa il bilanciere al petto controllando il movimento\n4. Spingi verso l'alto contraendo i pettorali",
  },
  {
    id: "2",
    name: "SQUAT",
    category: "GAMBE",
    muscle: "Quadricipiti",
    equipment: "Bilanciere",
    difficulty: "AVANZATO",
    description: "Il re degli esercizi per le gambe",
    instructions:
      "1. Posiziona il bilanciere sui trapezi\n2. Piedi larghezza spalle, punte leggermente verso l'esterno\n3. Scendi mantenendo il petto alto e le ginocchia in linea\n4. Risali spingendo sui talloni",
  },
  {
    id: "3",
    name: "STACCO",
    category: "SCHIENA",
    muscle: "Dorsali",
    equipment: "Bilanciere",
    difficulty: "ESPERTO",
    description: "Esercizio completo per tutta la catena posteriore",
    instructions:
      "1. Bilanciere a terra, piedi sotto la sbarra\n2. Afferra con presa mista o doppia\n3. Mantieni la schiena dritta e solleva\n4. Estendi completamente anche e ginocchia",
  },
  {
    id: "4",
    name: "MILITARY PRESS",
    category: "SPALLE",
    muscle: "Deltoidi",
    equipment: "Bilanciere",
    difficulty: "INTERMEDIO",
    description: "Sviluppo della forza delle spalle",
    instructions:
      "1. In piedi, bilanciere all'altezza delle spalle\n2. Core contratto, piedi larghezza anche\n3. Spingi verso l'alto mantenendo il controllo\n4. Abbassa lentamente alla posizione iniziale",
  },
  {
    id: "5",
    name: "CURL BICIPITI",
    category: "BRACCIA",
    muscle: "Bicipiti",
    equipment: "Manubri",
    difficulty: "PRINCIPIANTE",
    description: "Isolamento per i bicipiti",
    instructions:
      "1. In piedi, manubri ai lati\n2. Gomiti fermi lungo il corpo\n3. Fletti l'avambraccio contraendo il bicipite\n4. Abbassa controllando il movimento",
  },
  {
    id: "6",
    name: "FRENCH PRESS",
    category: "BRACCIA",
    muscle: "Tricipiti",
    equipment: "Bilanciere",
    difficulty: "INTERMEDIO",
    description: "Isolamento per i tricipiti",
    instructions:
      "1. Sdraiato, bilanciere sopra il petto\n2. Gomiti fissi, abbassa verso la fronte\n3. Estendi solo l'avambraccio\n4. Contrai i tricipiti nella fase concentrica",
  },
  {
    id: "7",
    name: "PLANK",
    category: "CORE",
    muscle: "Addominali",
    equipment: "Corpo libero",
    difficulty: "PRINCIPIANTE",
    description: "Stabilizzazione del core",
    instructions:
      "1. Posizione di flessione sui gomiti\n2. Corpo in linea retta\n3. Contrai addominali e glutei\n4. Mantieni la posizione respirando normalmente",
  },
  {
    id: "8",
    name: "TRAZIONI",
    category: "SCHIENA",
    muscle: "Dorsali",
    equipment: "Sbarra",
    difficulty: "AVANZATO",
    description: "Esercizio a corpo libero per la schiena",
    instructions:
      "1. Appendi alla sbarra con presa prona\n2. Tira il corpo verso l'alto\n3. Porta il mento sopra la sbarra\n4. Abbassa controllando il movimento",
  },
]

const defaultWorkoutPlans: WorkoutPlan[] = [
  {
    id: "1",
    name: "PUSH DAY",
    description: "Petto, spalle e tricipiti",
    exercises: [
      { name: "PANCA PIANA", sets: 4, reps: "8-10", weight: 80, restTime: 120 },
      { name: "PANCA INCLINATA", sets: 3, reps: "10-12", weight: 70, restTime: 90 },
      { name: "MILITARY PRESS", sets: 4, reps: "8-10", weight: 50, restTime: 120 },
      { name: "ALZATE LATERALI", sets: 3, reps: "12-15", weight: 15, restTime: 60 },
    ],
    difficulty: "INTERMEDIO",
    duration: "45-60 min",
    lastUsed: "2 giorni fa",
  },
  {
    id: "2",
    name: "PULL DAY",
    description: "Schiena e bicipiti",
    exercises: [
      { name: "STACCO", sets: 4, reps: "6-8", weight: 120, restTime: 180 },
      { name: "TRAZIONI", sets: 4, reps: "8-10", weight: 0, restTime: 120 },
      { name: "REMATORE", sets: 3, reps: "10-12", weight: 80, restTime: 90 },
      { name: "CURL BICIPITI", sets: 3, reps: "12-15", weight: 20, restTime: 60 },
    ],
    difficulty: "AVANZATO",
    duration: "50-65 min",
    lastUsed: "1 giorno fa",
  },
  {
    id: "3",
    name: "LEG DAY",
    description: "Gambe complete",
    exercises: [
      { name: "SQUAT", sets: 4, reps: "8-10", weight: 100, restTime: 180 },
      { name: "LEG PRESS", sets: 3, reps: "12-15", weight: 200, restTime: 120 },
      { name: "AFFONDI", sets: 3, reps: "10/gamba", weight: 20, restTime: 90 },
      { name: "CALF RAISES", sets: 4, reps: "15-20", weight: 80, restTime: 60 },
    ],
    difficulty: "INTERMEDIO",
    duration: "60-75 min",
    lastUsed: "3 giorni fa",
  },
]

const defaultStats: WorkoutStats = {
  totalWorkouts: 47,
  weeklyWorkouts: 12,
  totalVolume: 8200,
  weeklyVolume: 8200,
  streak: 7,
  completionRate: 85,
}

export function WorkoutProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null)
  const [stats, setStats] = useState<WorkoutStats>(defaultStats)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedExercises = localStorage.getItem("brutal-workout-exercises")
      const savedPlans = localStorage.getItem("brutal-workout-plans")
      const savedStats = localStorage.getItem("brutal-workout-stats")

      setExercises(savedExercises ? JSON.parse(savedExercises) : defaultExercises)
      setWorkoutPlans(savedPlans ? JSON.parse(savedPlans) : defaultWorkoutPlans)
      setStats(savedStats ? JSON.parse(savedStats) : defaultStats)
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
      setExercises(defaultExercises)
      setWorkoutPlans(defaultWorkoutPlans)
      setStats(defaultStats)
    }
  }, [])

  // Save exercises to localStorage
  useEffect(() => {
    if (exercises.length > 0) {
      localStorage.setItem("brutal-workout-exercises", JSON.stringify(exercises))
    }
  }, [exercises])

  // Save workout plans to localStorage
  useEffect(() => {
    if (workoutPlans.length > 0) {
      localStorage.setItem("brutal-workout-plans", JSON.stringify(workoutPlans))
    }
  }, [workoutPlans])

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem("brutal-workout-stats", JSON.stringify(stats))
  }, [stats])

  const addExercise = (exercise: Omit<Exercise, "id">) => {
    const newExercise = {
      ...exercise,
      id: Date.now().toString(),
    }
    setExercises((prev) => [...prev, newExercise])
  }

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...updates } : ex)))
  }

  const addWorkoutPlan = (plan: Omit<WorkoutPlan, "id">) => {
    const newPlan = {
      ...plan,
      id: Date.now().toString(),
    }
    setWorkoutPlans((prev) => [...prev, newPlan])
  }

  const addExerciseToWorkoutPlan = (planId: string, exercise: WorkoutExercise) => {
    setWorkoutPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, exercises: [...plan.exercises, exercise] } : plan)),
    )
  }

  const removeExerciseFromWorkoutPlan = (planId: string, exerciseIndex: number) => {
    setWorkoutPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, exercises: plan.exercises.filter((_, index) => index !== exerciseIndex) }
          : plan,
      ),
    )
  }

  const updateWorkoutPlan = (planId: string, updates: Partial<WorkoutPlan>) => {
    setWorkoutPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan)))
  }

  const startWorkout = (planId: string) => {
    const plan = workoutPlans.find((p) => p.id === planId)
    if (!plan || plan.exercises.length === 0) {
      alert("QUESTA SCHEDA NON HA ESERCIZI!")
      return
    }

    const session: WorkoutSession = {
      planId,
      planName: plan.name,
      startTime: new Date(),
      exercises: plan.exercises,
      completedSets: plan.exercises.map((ex) => Array(ex.sets).fill(false)),
      currentExercise: 0,
      currentSet: 0,
      isActive: true,
    }
    setCurrentSession(session)
  }

  const completeWorkout = () => {
    if (!currentSession) return

    // Update stats
    setStats((prev) => ({
      ...prev,
      totalWorkouts: prev.totalWorkouts + 1,
      weeklyWorkouts: prev.weeklyWorkouts + 1,
      streak: prev.streak + 1,
    }))

    // Update last used for the plan
    setWorkoutPlans((prev) =>
      prev.map((plan) => (plan.id === currentSession.planId ? { ...plan, lastUsed: "Oggi" } : plan)),
    )

    setCurrentSession(null)
  }

  const updateSession = (updates: Partial<WorkoutSession>) => {
    if (!currentSession) return
    setCurrentSession({ ...currentSession, ...updates })
  }

  const deleteWorkoutPlan = (planId: string) => {
    setWorkoutPlans((prev) => prev.filter((plan) => plan.id !== planId))
  }

  const deleteExercise = (exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId))
  }

  return (
    <WorkoutContext.Provider
      value={{
        exercises,
        workoutPlans,
        currentSession,
        stats,
        addExercise,
        updateExercise,
        addWorkoutPlan,
        addExerciseToWorkoutPlan,
        removeExerciseFromWorkoutPlan,
        startWorkout,
        completeWorkout,
        updateSession,
        deleteWorkoutPlan,
        deleteExercise,
        updateWorkoutPlan,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (!context) {
    throw new Error("useWorkout must be used within WorkoutProvider")
  }
  return context
}
