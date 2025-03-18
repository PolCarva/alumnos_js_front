"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
}

export function QuestionsList({ questions, weekId, userId, userProgress }: QuestionsListProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const currentQuestion = questions[currentQuestionIndex]

  // Verificar si la pregunta ya fue completada o fallada
  const questionProgress = userProgress.questionProgress.find((q) => q.questionId === currentQuestion.id)

  const isQuestionCompleted = questionProgress?.completed || false
  const isQuestionFailed = questionProgress?.failed || false
  const userAnswer = questionProgress?.userAnswer

  const handleSubmitAnswer = async (answer: any) => {
    setIsSubmitting(true)

    try {
      // Simular petición al backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const isCorrect = checkAnswer(currentQuestion, answer)
      const points = isCorrect ? currentQuestion.points : 0

      // Guardar progreso
      saveQuestionProgress(
        userId,
        weekId,
        currentQuestion.id,
        isCorrect,
        points,
        !isCorrect, // Si no es correcta, marcarla como fallada
        answer.toString(), // Guardar la respuesta del usuario
      )

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
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
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
          return question.keywords.every((keyword) => answer.toLowerCase().includes(keyword.toLowerCase()))
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

