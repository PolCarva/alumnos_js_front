export interface User {
  id: number
  name: string
  username: string
  password: string // En una aplicación real, esto sería un hash
  class?: 'M' | 'L' | 'V'
}

export interface Week {
  id: number
  title: string
  description: string
  topics: string[]
}

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface Question {
  id: number
  weekId: number
  type: "multiple-choice" | "bug-fix" | "code-writing"
  title: string
  description: string
  points: 1 | 3 | 5
  // Para preguntas de opción múltiple
  options?: string[]
  correctAnswer?: string
  // Para preguntas de arreglar bugs
  buggyCode?: string
  correctCode?: string
  // Para preguntas de escribir código
  initialCode?: string
  keywords?: string[] // Palabras clave que deben estar en la respuesta
  testCases?: TestCase[] // Casos de prueba para validar el código
}

export interface QuestionProgress {
  userId: number
  weekId: number
  questionId: number
  completed: boolean
  failed: boolean // Nuevo campo para indicar si la pregunta fue fallada
  points: number
  userAnswer?: string // Guardar la respuesta del usuario
}

export interface UserProgress {
  userId: number
  userName: string
  userClass: 'M' | 'L' | 'V'
  totalPoints: number
  completedQuestions: number
  completedWeeks: number
  completedWeekIds: number[]
  questionProgress: QuestionProgress[]
}

