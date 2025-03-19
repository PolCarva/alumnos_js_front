"use client"

import { useState, useEffect } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"
import { CheckIcon, XIcon } from "lucide-react"

interface MultipleChoiceQuestionProps {
  question: Question
  onSubmit: (answer: string) => void
  isSubmitting: boolean
  isCompleted: boolean
  isFailed: boolean
  userAnswer?: string
}

export function MultipleChoiceQuestion({
  question,
  onSubmit,
  isSubmitting,
  isCompleted,
  isFailed,
  userAnswer,
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  
  // Efecto único para cuando cambia la pregunta o su estado
  useEffect(() => {
    // Si hay respuesta guardada del usuario, mostrarla
    if (userAnswer) {
      setSelectedOption(userAnswer)
    } else {
      // Si no hay respuesta y es una pregunta nueva, reiniciar selección
      setSelectedOption("")
    }
  }, [question.id, userAnswer])

  // Manejar el envío de la respuesta
  const handleSubmit = () => {
    if (!selectedOption || isSubmitting) return
    onSubmit(selectedOption)
  }

  // Determinar si debe mostrar retroalimentación
  const showFeedback = isCompleted || isFailed
  
  // Determinar si el formulario debe estar deshabilitado
  const isDisabled = isSubmitting || showFeedback

  return (
    <div className="space-y-4">
      {/* Opciones de respuesta */}
      <RadioGroup
        value={selectedOption}
        onValueChange={(value) => {
          if (!isDisabled) {
            setSelectedOption(value)
          }
        }}
        className="space-y-2"
        disabled={isDisabled}
      >
        {question.options?.map((option) => (
          <div
            key={option}
            className={`flex items-center space-x-2 rounded-md border p-4 ${
              showFeedback && option === question.correctAnswer
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : showFeedback && option === selectedOption && option !== question.correctAnswer
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-700"
            }`}
          >
            <RadioGroupItem value={option} id={`${question.id}-${option}`} />
            <Label htmlFor={`${question.id}-${option}`} className="flex-grow cursor-pointer">
              {option}
            </Label>
            {showFeedback && option === question.correctAnswer && 
              <CheckIcon className="h-5 w-5 text-green-500" />
            }
            {showFeedback && option === selectedOption && option !== question.correctAnswer && 
              <XIcon className="h-5 w-5 text-red-500" />
            }
          </div>
        ))}
      </RadioGroup>

      {/* Botón para enviar respuesta */}
      {!showFeedback && (
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedOption || isSubmitting} 
          className="mt-4 w-full sm:w-auto"
        >
          {isSubmitting ? "Verificando..." : "Enviar respuesta"}
        </Button>
      )}

      {/* Retroalimentación de respuesta correcta */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border-2 border-green-300">
          <p className="text-green-700 dark:text-green-300 flex items-center font-semibold">
            <CheckIcon className="h-5 w-5 mr-2" /> ¡Respuesta correcta!
          </p>
          <p className="text-green-700 dark:text-green-300 mt-2">
            Has seleccionado la opción correcta: <strong>{question.correctAnswer}</strong>
          </p>
        </div>
      )}

      {/* Retroalimentación de respuesta incorrecta */}
      {isFailed && !isCompleted && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border-2 border-red-300">
          <p className="text-red-700 dark:text-red-300 flex items-center font-semibold">
            <XIcon className="h-5 w-5 mr-2" /> Respuesta incorrecta
          </p>
          <p className="text-red-700 dark:text-red-300 mt-2">
            La respuesta correcta es: <strong>{question.correctAnswer}</strong>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Pulsa "Siguiente" para continuar con la siguiente pregunta.
          </p>
        </div>
      )}
    </div>
  )
}

