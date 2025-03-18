"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Question } from "@/lib/types"
import { CheckIcon, XIcon, PlayIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CodeWritingQuestionProps {
  question: Question
  onSubmit: (answer: string) => void
  isSubmitting: boolean
  isCompleted: boolean
  isFailed: boolean
  userAnswer?: string
}

export function CodeWritingQuestion({
  question,
  onSubmit,
  isSubmitting,
  isCompleted,
  isFailed,
  userAnswer,
}: CodeWritingQuestionProps) {
  const [code, setCode] = useState(question.initialCode || "")
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [solutionCode, setSolutionCode] = useState<string | null>(null)

  // Si la pregunta está completada o fallada, cargar la respuesta del usuario
  useEffect(() => {
    if ((isCompleted || isFailed) && userAnswer) {
      setCode(userAnswer)
    }

    // Si la pregunta está completada o fallada, ejecutar las pruebas automáticamente
    if ((isCompleted || isFailed) && question.testCases && testResults.length === 0) {
      runTests()
    }

    // Si la pregunta está fallada, generar una solución de ejemplo
    if (isFailed && !solutionCode && question.testCases) {
      // Aquí podríamos generar una solución de ejemplo basada en los casos de prueba
      // Por simplicidad, usaremos una solución predefinida para cada pregunta
      if (question.id === 3) {
        // Factorial
        setSolutionCode(`function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`)
      } else if (question.id === 6) {
        // Filtrar y transformar
        setSolutionCode(`function filtrarYTransformar(numeros) {
  return numeros
    .filter(num => num % 2 === 0)
    .map(num => num * num);
}`)
      } else if (question.id === 9) {
        // Ejecutar N veces
        setSolutionCode(`function ejecutarNVeces(fn, n) {
  for (let i = 0; i < n; i++) {
    fn();
  }
}`)
      } else if (question.id === 12) {
        // Promisificar
        setSolutionCode(`function leerArchivoPromise(ruta) {
  return new Promise((resolve, reject) => {
    leerArchivo(ruta, (error, contenido) => {
      if (error) {
        reject(error);
      } else {
        resolve(contenido);
      }
    });
  });
}`)
      }
    }
  }, [isCompleted, isFailed, question.testCases, testResults.length, userAnswer, question.id, solutionCode])

  const runTests = () => {
    if (!code || !question.testCases) return

    setIsRunning(true)
    setTestResults([])

    try {
      // Ejecutar cada caso de prueba
      const results = question.testCases.map((testCase) => {
        try {
          // Combinar el código del usuario con el caso de prueba
          const fullCode = `
            ${code}
            ${testCase.input}
          `

          // Evaluar el código completo
          const result = eval(fullCode)
          const expected = eval(testCase.expectedOutput)

          // Comparar resultado con esperado
          const passed = JSON.stringify(result) === JSON.stringify(expected)

          return {
            passed,
            message: passed
              ? `Prueba pasada: ${testCase.input} = ${testCase.expectedOutput}`
              : `Prueba fallida: ${testCase.input} produjo ${JSON.stringify(result)}, se esperaba ${testCase.expectedOutput}`,
          }
        } catch (error) {
          return {
            passed: false,
            message: `Error al ejecutar ${testCase.input}: ${error instanceof Error ? error.message : String(error)}`,
          }
        }
      })

      setTestResults(results)
    } catch (error) {
      setTestResults([
        {
          passed: false,
          message: `Error al compilar el código: ${error instanceof Error ? error.message : String(error)}`,
        },
      ])
    } finally {
      setIsRunning(false)
    }
  }

  const handleSubmit = () => {
    if (!code) return

    // Ejecutar pruebas antes de enviar
    try {
      // Verificar si todas las pruebas pasan
      if (question.testCases) {
        const allTestsPassed = question.testCases.every((testCase) => {
          try {
            // Combinar el código del usuario con el caso de prueba
            const fullCode = `
              ${code}
              ${testCase.input}
            `

            const result = eval(fullCode)
            const expected = eval(testCase.expectedOutput)
            return JSON.stringify(result) === JSON.stringify(expected)
          } catch {
            return false
          }
        })

        // Solo enviar si todas las pruebas pasan
        if (allTestsPassed) {
          onSubmit(code)
        } else {
          setTestResults([
            {
              passed: false,
              message: "No todas las pruebas han pasado. Revisa tu código e intenta de nuevo.",
            },
          ])
        }
      } else {
        // Si no hay pruebas, verificar palabras clave
        onSubmit(code)
      }
    } catch (error) {
      setTestResults([
        {
          passed: false,
          message: `Error al compilar el código: ${error instanceof Error ? error.message : String(error)}`,
        },
      ])
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Escribe el código que resuelva el problema planteado.
        </p>
      </div>

      <Textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="font-mono h-64 code-editor"
        disabled={isSubmitting || isCompleted || isFailed}
      />

      {testResults.length > 0 && !isCompleted && (
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <Alert key={index} variant={result.passed ? "default" : "destructive"}>
              {result.passed ? <CheckIcon className="h-4 w-4 mr-2" /> : <XIcon className="h-4 w-4 mr-2" />}
              <AlertTitle>{result.passed ? "Prueba exitosa" : "Prueba fallida"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={runTests}
          disabled={!code || isRunning || isSubmitting || (isFailed && !userAnswer) || isCompleted}
          className="flex items-center gap-2"
        >
          <PlayIcon className="h-4 w-4" />
          {isRunning ? "Ejecutando..." : "Ejecutar pruebas"}
        </Button>

        {!isCompleted && !isFailed && (
          <Button onClick={handleSubmit} disabled={!code || isSubmitting || isRunning}>
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </Button>
        )}
      </div>

      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
          <p className="text-green-700 dark:text-green-300 flex items-center">
            <CheckIcon className="h-5 w-5 mr-2" /> Ya has completado esta pregunta correctamente.
          </p>
          <p className="text-green-700 dark:text-green-300 mt-1 text-sm">
            Tu solución se muestra en el editor. Puedes ejecutar las pruebas para ver los resultados.
          </p>
        </div>
      )}

      {isFailed && solutionCode && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
          <p className="text-red-700 dark:text-red-300 flex items-center">
            <XIcon className="h-5 w-5 mr-2" /> Has fallado esta pregunta.
          </p>
          <p className="text-red-700 dark:text-red-300 mt-1 text-sm">
            Tu respuesta se muestra en el editor. Una posible solución correcta es:
          </p>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto text-sm">{solutionCode}</pre>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            Puedes continuar con la siguiente pregunta usando el botón "Siguiente".
          </p>
        </div>
      )}
    </div>
  )
}

