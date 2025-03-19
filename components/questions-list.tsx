"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckIcon, XIcon, AlertCircleIcon } from "lucide-react"
import type { Question, UserProgress } from "@/lib/types"
import { MultipleChoiceQuestion } from "./multiple-choice"
import { BugFixQuestion } from "./bug-fix"
import { CodeWritingQuestion } from "./code-writing"
import { saveQuestionProgress } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

interface QuestionsListProps {
  questions: Question[]
  weekId: number
  userId: number
  userProgress: UserProgress
  onQuestionComplete?: () => Promise<void>
}

export function QuestionsList({ questions, weekId, userId, userProgress, onQuestionComplete }: QuestionsListProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localUserProgress, setLocalUserProgress] = useState<UserProgress>(userProgress)
  const [showingAnswerFeedback, setShowingAnswerFeedback] = useState(false)
  const currentIndexRef = useRef(currentQuestionIndex)
  const router = useRouter()
  const { toast } = useToast()

  // Mantener la referencia actualizada
  useEffect(() => {
    currentIndexRef.current = currentQuestionIndex
  }, [currentQuestionIndex])

  // Efecto para actualizar el progreso local cuando cambia el progreso del usuario
  // pero manteniendo el índice de pregunta actual
  useEffect(() => {
    setLocalUserProgress(userProgress)
  }, [userProgress])

  const currentQuestion = questions[currentQuestionIndex]

  // Verificar si la pregunta ya fue completada o fallada
  const questionProgress = localUserProgress.questionProgress.find((q) => q.questionId === currentQuestion.id)

  const isQuestionCompleted = questionProgress?.completed || false
  const isQuestionFailed = questionProgress?.failed || false
  const userAnswer = questionProgress?.userAnswer

  // Calcular el estado de cada pregunta
  const questionStatuses = questions.map(question => {
    const progress = localUserProgress.questionProgress.find(p => p.questionId === question.id)
    return {
      id: question.id,
      title: question.title,
      points: question.points,
      completed: progress?.completed || false,
      failed: progress?.failed || false
    }
  })

  const handleSubmitAnswer = async (answer: any) => {
    // Si la pregunta ya está completada, no permitir enviar respuesta
    if (isQuestionCompleted) {
      toast({
        title: "Pregunta ya completada",
        description: "Esta pregunta ya ha sido completada correctamente.",
        variant: "default",
      })
      return
    }

    setIsSubmitting(true)
    setShowingAnswerFeedback(true)

    try {
      const isCorrect = checkAnswer(currentQuestion, answer)
      const points = isCorrect ? currentQuestion.points : 0

      // Guardar progreso en la base de datos
      try {
        await saveQuestionProgress(
          userId,
          weekId,
          currentQuestion.id,
          isCorrect,
          points,
          !isCorrect, // Si no es correcta, marcarla como fallada
          answer.toString(), // Guardar la respuesta del usuario
        )

        // Actualizar el progreso local después de guardar en DB
        const updatedProgress = {...localUserProgress}
        
        // Buscar si ya existe un registro para esta pregunta
        const existingIndex = updatedProgress.questionProgress.findIndex(
          q => q.questionId === currentQuestion.id && q.weekId === weekId
        )
        
        // Actualizar o crear el registro de progreso
        const newProgressItem = {
          userId,
          weekId,
          questionId: currentQuestion.id,
          completed: isCorrect,
          points,
          failed: !isCorrect,
          userAnswer: answer.toString()
        }
        
        if (existingIndex >= 0) {
          updatedProgress.questionProgress[existingIndex] = newProgressItem
        } else {
          updatedProgress.questionProgress.push(newProgressItem)
        }
        
        // Actualizar contadores
        const completedQuestions = updatedProgress.questionProgress.filter(q => q.completed).length
        const totalPoints = updatedProgress.questionProgress.reduce((sum, q) => sum + q.points, 0)
        
        updatedProgress.completedQuestions = completedQuestions
        updatedProgress.totalPoints = totalPoints
        
        setLocalUserProgress(updatedProgress)

        // Si se proporcionó la función onQuestionComplete, llamarla
        // pero guardando el índice actual para restaurarlo después
        if (onQuestionComplete) {
          await onQuestionComplete()
        }
      } catch (error) {
        console.error("Error al guardar progreso:", error)
        toast({
          title: "Error al guardar progreso",
          description: "Se ha guardado localmente, pero no se pudo guardar en el servidor.",
          variant: "destructive",
        })
      }

      // Mostrar toast con resultado
      toast({
        title: isCorrect ? "¡Respuesta correcta!" : "Respuesta incorrecta",
        description: isCorrect
          ? `Has ganado ${points} puntos.`
          : "La respuesta es incorrecta. Se mostrará la solución correcta.",
        variant: isCorrect ? "default" : "destructive",
      })

      // Si es correcta, avanzar a la siguiente pregunta automáticamente después de un breve retraso
      if (isCorrect) {
        setTimeout(() => {
          setShowingAnswerFeedback(false)
          if (currentIndexRef.current < questions.length - 1) {
            setCurrentQuestionIndex(currentIndexRef.current + 1)
          } else {
            // Si es la última pregunta, redirigir al dashboard
            router.push("/dashboard")
          }
        }, 2000)
      } else {
        // Si es incorrecta, permitir que el usuario avance manualmente
        // pero mostrar un mensaje indicando que puede continuar
        toast({
          title: "Puedes continuar",
          description: "Aunque la respuesta es incorrecta, puedes avanzar a la siguiente pregunta.",
          variant: "default",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu respuesta",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const checkAnswer = (question: Question, answer: any): boolean => {
    switch (question.type) {
      case "multiple-choice":
        return answer === question.correctAnswer
      case "bug-fix":
        return answer === question.correctCode
      case "code-writing":
        if (question.testCases) {
          try {
            // Verificar si todas las pruebas pasan
            return question.testCases.every((testCase) => {
              try {
                // Combinar el código del usuario con el caso de prueba
                const fullCode = `
                  ${answer}
                  ${testCase.input}
                `

                const result = eval(fullCode)
                const expected = eval(testCase.expectedOutput)
                return JSON.stringify(result) === JSON.stringify(expected)
              } catch {
                return false
              }
            })
          } catch {
            return false
          }
        } else {
          // Si no hay pruebas, verificar palabras clave (método antiguo)
          return question.keywords?.every((keyword) => answer.toLowerCase().includes(keyword.toLowerCase())) || false
        }
      default:
        return false
    }
  }

  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            isSubmitting={isSubmitting}
            isCompleted={isQuestionCompleted}
            isFailed={isQuestionFailed}
            userAnswer={userAnswer}
          />
        )
      case "bug-fix":
        return (
          <BugFixQuestion
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            isSubmitting={isSubmitting}
            isCompleted={isQuestionCompleted}
            isFailed={isQuestionFailed}
            userAnswer={userAnswer}
          />
        )
      case "code-writing":
        return (
          <CodeWritingQuestion
            question={currentQuestion}
            onSubmit={handleSubmitAnswer}
            isSubmitting={isSubmitting}
            isCompleted={isQuestionCompleted}
            isFailed={isQuestionFailed}
            userAnswer={userAnswer}
          />
        )
      default:
        return <p>Tipo de pregunta no soportado</p>
    }
  }

  const getPointsBadge = (points: number) => {
    let color = ""
    switch (points) {
      case 1:
        color = "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
        break
      case 3:
        color = "bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        break
      case 5:
        color = "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
        break
      default:
        color = "bg-gray-50 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }

    return (
      <Badge variant="outline" className={color}>
        {points} {points === 1 ? "punto" : "puntos"}
      </Badge>
    )
  }

  return (
    <div>
      {/* Navegación de preguntas */}
      <div className="mb-6 flex flex-wrap gap-2">
        {questionStatuses.map((q, index) => (
          <Button
            key={q.id}
            variant={currentQuestionIndex === index ? "default" : "outline"}
            size="sm"
            className={`
              ${q.completed ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-300" : ""}
              ${q.failed && !q.completed ? "bg-red-100 text-red-800 hover:bg-red-200 border-red-300" : ""}
              ${!q.completed && !q.failed ? "bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300" : ""}
              ${currentQuestionIndex === index ? "ring-2 ring-offset-2" : ""}
            `}
            onClick={() => {
              setShowingAnswerFeedback(false)
              setCurrentQuestionIndex(index)
            }}
          >
            {index + 1}
            {q.completed && <CheckIcon className="ml-1 h-3 w-3" />}
            {q.failed && !q.completed && <XIcon className="ml-1 h-3 w-3" />}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Dificultad:</span>
          {getPointsBadge(currentQuestion.points)}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.title}</CardTitle>
          <CardDescription>{currentQuestion.description}</CardDescription>
        </CardHeader>

        <CardContent>{renderQuestionComponent()}</CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setShowingAnswerFeedback(false)
                setCurrentQuestionIndex(currentQuestionIndex - 1)
              }
            }}
            disabled={currentQuestionIndex === 0}
          >
            Anterior
          </Button>

          <Button
            onClick={() => {
              if (currentQuestionIndex < questions.length - 1) {
                setShowingAnswerFeedback(false)
                setCurrentQuestionIndex(currentQuestionIndex + 1)
              } else {
                router.push("/dashboard")
              }
            }}
            disabled={isSubmitting}
          >
            {currentQuestionIndex < questions.length - 1 ? "Siguiente" : "Finalizar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

