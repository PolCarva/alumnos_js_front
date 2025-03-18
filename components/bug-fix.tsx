"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/types"
import { CheckIcon, XIcon } from "lucide-react"

interface BugFixQuestionProps {
  question: Question
  onSubmit: (answer: string) => void
  isSubmitting: boolean
  isCompleted: boolean
  isFailed: boolean
  userAnswer?: string
}

export function BugFixQuestion({
  question,
  onSubmit,
  isSubmitting,
  isCompleted,
  isFailed,
  userAnswer,
}: BugFixQuestionProps) {
  const [code, setCode] = useState(question.buggyCode || "")

  // Si la pregunta está completada, mostrar el código correcto
  // Si está fallada, mostrar la respuesta del usuario y el código correcto
  useEffect(() => {
    if (isCompleted && question.correctCode) {
      setCode(question.correctCode)
    } else if (isFailed) {
      if (userAnswer) {
        setCode(userAnswer)
      }
    }
  }, [isCompleted, isFailed, question.correctCode, userAnswer])

  const handleSubmit = () => {
    if (!code) return
    onSubmit(code)
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          El siguiente código contiene un error. Identifica y corrige el bug.
        </p>
      </div>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="font-mono h-48 code-editor"
        disabled={isSubmitting || isCompleted || isFailed}
      />

      {!isCompleted && !isFailed && (
        <Button onClick={handleSubmit} disabled={!code || isSubmitting} className="mt-4">
          {isSubmitting ? "Enviando..." : "Enviar solución"}
        </Button>
      )}

      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-green-700 dark:text-green-300 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" /> Ya has completado esta pregunta correctamente.
          </p>
          <p className="text-green-700 dark:text-green-300 mt-1 text-sm">
            La solución correcta se muestra en el editor.
          </p>
        </div>
      )}

      {isFailed && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-red-700 dark:text-red-300 flex items-center">
            <XIcon className="h-5 w-5 mr-2" /> Has fallado esta pregunta.
          </p>
          <p className="text-red-700 dark:text-red-300 mt-1 text-sm">
            Tu respuesta se muestra en el editor. La solución correcta es:
          </p>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto text-sm">
            {question.correctCode}
          </pre>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Puedes continuar con la siguiente pregunta usando el botón "Siguiente".
          </p>
        </div>
      )}
    </div>
  )
}

