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
  const [showFeedback, setShowFeedback] = useState(false)

  // Cuando la pregunta está completada o fallada, mostrar feedback automáticamente
  useEffect(() => {
    if (isCompleted || isFailed) {
      setShowFeedback(true)
      if (userAnswer) {
        setSelectedOption(userAnswer)
      }
    }
  }, [isCompleted, isFailed, userAnswer])

  const handleSubmit = () => {
    if (!selectedOption) return
    setShowFeedback(true)
    onSubmit(selectedOption)
  }

  return (
    <div className="space-y-4">
      <RadioGroup
        value={selectedOption}
        onValueChange={setSelectedOption}
        className="space-y-2"
        disabled={isSubmitting || isCompleted || isFailed || showFeedback}
      >
        {question.options.map((option) => (
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
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option} className="flex-grow cursor-pointer">
              {option}
            </Label>
            {showFeedback && option === question.correctAnswer && <CheckIcon className="h-5 w-5 text-green-500" />}
            {showFeedback && option === selectedOption && option !== question.correctAnswer && (
              <XIcon className="h-5 w-5 text-red-500" />
            )}
          </div>
        ))}
      </RadioGroup>

      {!isCompleted && !isFailed && !showFeedback && (
        <Button onClick={handleSubmit} disabled={!selectedOption || isSubmitting} className="mt-4">
          {isSubmitting ? "Enviando..." : "Enviar respuesta"}
        </Button>
      )}

      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-green-700 dark:text-green-300 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" /> Ya has completado esta pregunta correctamente.
          </p>
          <p className="text-green-700 dark:text-green-300 mt-1 text-sm">
            La respuesta correcta es: <strong>{question.correctAnswer}</strong>
          </p>
        </div>
      )}

      {isFailed && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-red-700 dark:text-red-300 flex items-center">
            <XIcon className="h-5 w-5 mr-2" /> Has fallado esta pregunta.
          </p>
          <p className="text-red-700 dark:text-red-300 mt-1 text-sm">
            La respuesta correcta es: <strong>{question.correctAnswer}</strong>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Puedes continuar con la siguiente pregunta usando el botón "Siguiente".
          </p>
        </div>
      )}
    </div>
  )
}

