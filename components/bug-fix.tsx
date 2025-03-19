"use client"

import { useState, useEffect, useCallback } from "react"
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
  // Estado para el código que edita el usuario
  const [code, setCode] = useState("")
  
  // Inicializar el estado cuando cambia la pregunta
  useEffect(() => {
    if ((isCompleted || isFailed) && userAnswer) {
      // Si ya está respondida, mostrar la respuesta del usuario
      setCode(userAnswer)
    } else if (isCompleted && question.correctCode) {
      // Si está correcta, mostrar el código correcto
      setCode(question.correctCode)
    } else {
      // En cualquier otro caso, mostrar el código con bugs
      setCode(question.buggyCode || "")
    }
  }, [question.id, question.buggyCode, question.correctCode, isCompleted, isFailed, userAnswer])
  
  // Manejar el envío de la respuesta
  const handleSubmit = useCallback(() => {
    if (!code || isSubmitting) return
    onSubmit(code)
  }, [code, isSubmitting, onSubmit])
  
  // Determinar si el formulario está deshabilitado
  const isDisabled = isSubmitting || isCompleted || isFailed
  
  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
        <p className="text-yellow-700 dark:text-yellow-300 text-sm">
          El siguiente código contiene un error. Identifica y corrige el bug.
        </p>
      </div>

      {/* Editor de código */}
      <Textarea
        value={code}
        onChange={(e) => !isDisabled && setCode(e.target.value)}
        className="font-mono h-48 code-editor"
        disabled={isDisabled}
        spellCheck={false}
      />

      {/* Botón de envío */}
      {!isCompleted && !isFailed && (
        <Button 
          onClick={handleSubmit} 
          disabled={!code || isSubmitting} 
          className="mt-4 w-full sm:w-auto"
        >
          {isSubmitting ? "Verificando..." : "Enviar solución"}
        </Button>
      )}

      {/* Retroalimentación cuando la respuesta es correcta */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border-2 border-green-300">
          <p className="text-green-700 dark:text-green-300 flex items-center font-semibold">
            <CheckIcon className="h-5 w-5 mr-2" /> ¡Respuesta correcta!
          </p>
          <p className="text-green-700 dark:text-green-300 mt-2">
            Has identificado y corregido el bug correctamente.
          </p>
        </div>
      )}

      {/* Retroalimentación cuando la respuesta es incorrecta */}
      {isFailed && !isCompleted && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border-2 border-red-300">
          <p className="text-red-700 dark:text-red-300 flex items-center font-semibold">
            <XIcon className="h-5 w-5 mr-2" /> Respuesta incorrecta
          </p>
          <p className="text-red-700 dark:text-red-300 mt-2">
            Tu respuesta se muestra en el editor. La solución correcta es:
          </p>
          <pre>
            {question.correctCode}
          </pre>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Pulsa "Siguiente" para continuar con la siguiente pregunta.
          </p>
        </div>
      )}
    </div>
  )
}

