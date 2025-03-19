"use client"

import { useState, useEffect, useCallback } from "react"
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
  // Estado del código que escribe el usuario
  const [code, setCode] = useState("")
  
  // Estado para almacenar resultados de pruebas
  const [testResults, setTestResults] = useState<Array<{
    passed: boolean;
    message: string;
  }>>([])
  
  // Estado para indicar si se están ejecutando pruebas
  const [isRunningTests, setIsRunningTests] = useState(false)
  
  // Solución de ejemplo para mostrar en caso de error
  const [solutionCode, setSolutionCode] = useState<string | null>(null)
  
  // Cuando cambia la pregunta, restablecer el código
  useEffect(() => {
    // Inicializar con el código correspondiente
    if ((isCompleted || isFailed) && userAnswer) {
      // Si ya se respondió, mostrar la respuesta del usuario
      setCode(userAnswer)
    } else {
      // Si es una pregunta nueva, mostrar el código inicial
      setCode(question.initialCode || "")
    }
    
    // Limpiar resultados de pruebas previas
    setTestResults([])
  }, [question.id, question.initialCode, isCompleted, isFailed, userAnswer])
  
  // Generar solución de ejemplo cuando sea necesario
  useEffect(() => {
    if (isFailed && !solutionCode && question.testCases) {
      // Generar una solución específica según la pregunta
      let solution = ""
      
      switch (question.id) {
        case 3: // Factorial
          solution = `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`
          break
          
        case 6: // Filtrar y transformar
          solution = `function filtrarYTransformar(numeros) {
  return numeros
    .filter(num => num % 2 === 0)
    .map(num => num * num);
}`
          break
          
        case 9: // Ejecutar N veces
          solution = `function ejecutarNVeces(fn, n) {
  for (let i = 0; i < n; i++) {
    fn();
  }
}`
          break
          
        case 12: // Promisificar
          solution = `function leerArchivoPromise(ruta) {
  return new Promise((resolve, reject) => {
    leerArchivo(ruta, (error, contenido) => {
      if (error) {
        reject(error);
      } else {
        resolve(contenido);
      }
    });
  });
}`
          break
      }
      
      if (solution) {
        setSolutionCode(solution)
      }
    }
  }, [question.id, isFailed, solutionCode, question.testCases])
  
  // Ejecutar pruebas cuando se muestra el resultado guardado
  useEffect(() => {
    if ((isCompleted || isFailed) && question.testCases && code && testResults.length === 0) {
      executeTests()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompleted, isFailed, question.id, code])
  
  // Función para ejecutar pruebas sobre el código
  const executeTests = useCallback(() => {
    if (!code || !question.testCases || isRunningTests) return

    setIsRunningTests(true)
    setTestResults([])
    
    try {
      const results = question.testCases.map(testCase => {
        try {
          // Preparar el código completo con el caso de prueba
          const fullCode = `
            ${code}
            ${testCase.input}
          `
          
          // Evaluar el código
          const result = eval(fullCode)
          const expected = eval(testCase.expectedOutput)
          
          // Verificar si la salida coincide con la esperada
          const passed = JSON.stringify(result) === JSON.stringify(expected)
          
          return {
            passed,
            message: passed 
              ? `Prueba pasada: ${testCase.input} = ${testCase.expectedOutput}`
              : `Prueba fallida: ${testCase.input} produjo ${JSON.stringify(result)}, se esperaba ${testCase.expectedOutput}`
          }
        } catch (error) {
          return {
            passed: false,
            message: `Error al ejecutar ${testCase.input}: ${error instanceof Error ? error.message : String(error)}`
          }
        }
      })
      
      setTestResults(results)
    } catch (error) {
      setTestResults([{
        passed: false,
        message: `Error al compilar el código: ${error instanceof Error ? error.message : String(error)}`
      }])
    } finally {
      setIsRunningTests(false)
    }
  }, [code, question.testCases, isRunningTests])
  
  // Función para enviar la respuesta
  const handleSubmit = useCallback(() => {
    if (!code || isSubmitting || isRunningTests) return
    
    if (question.testCases) {
      // Si hay pruebas, ejecutarlas primero
      setIsRunningTests(true)
      
      try {
        // Verificar si todas las pruebas pasan
        const allPass = question.testCases.every(testCase => {
          try {
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
        
        if (allPass) {
          // Si todas pasan, enviar la respuesta
          onSubmit(code)
        } else {
          // Si alguna falla, mostrar mensaje
          setTestResults([{
            passed: false,
            message: "No todas las pruebas han pasado. Revisa tu código e intenta de nuevo."
          }])
        }
      } catch (error) {
        setTestResults([{
          passed: false,
          message: `Error al compilar el código: ${error instanceof Error ? error.message : String(error)}`
        }])
      } finally {
        setIsRunningTests(false)
      }
    } else {
      // Si no hay pruebas, enviar directamente
      onSubmit(code)
    }
  }, [code, isSubmitting, isRunningTests, question.testCases, onSubmit])
  
  // Determinar si el formulario está deshabilitado
  const isDisabled = isSubmitting || isCompleted || isFailed
  
  return (
    <div className="space-y-4">
      {/* Instrucciones */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          Escribe el código que resuelva el problema planteado.
          <br />
          <b>Pista:</b> para que tu solución funcione correctamente, asegúrate de utilizar la palabra clave <span className="font-mono p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">return</span> para devolver el resultado esperado.
        </p>
      </div>
      
      {/* Editor de código */}
      <Textarea
        value={code}
        onChange={(e) => !isDisabled && setCode(e.target.value)}
        className="font-mono h-64 code-editor"
        disabled={isDisabled}
        spellCheck={false}
      />
      
      {/* Resultados de pruebas */}
      {testResults.length > 0 && !isCompleted && (
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <Alert key={index} variant={result.passed ? "default" : "destructive"}>
              {result.passed ? 
                <CheckIcon className="h-4 w-4 mr-2" /> : 
                <XIcon className="h-4 w-4 mr-2" />
              }
              <AlertTitle>{result.passed ? "Prueba exitosa" : "Prueba fallida"}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}
      
      {/* Controles */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          onClick={executeTests}
          disabled={!code || isRunningTests || isDisabled}
          className="flex items-center gap-2"
        >
          <PlayIcon className="h-4 w-4" />
          {isRunningTests ? "Ejecutando..." : "Ejecutar pruebas"}
        </Button>
        
        {!isCompleted && !isFailed && (
          <Button 
            onClick={handleSubmit} 
            disabled={!code || isSubmitting || isRunningTests}
          >
            {isSubmitting ? "Verificando..." : "Enviar código"}
          </Button>
        )}
      </div>
      
      {/* Retroalimentación cuando la respuesta es correcta */}
      {isCompleted && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md border-2 border-green-300">
          <p className="text-green-700 dark:text-green-300 flex items-center font-semibold">
            <CheckIcon className="h-5 w-5 mr-2" /> ¡Excelente! Has completado esta pregunta correctamente.
          </p>
          
          {testResults.length > 0 && (
            <div className="mt-2">
              <p className="text-green-700 dark:text-green-300 mb-2 text-sm font-medium">
                Todos los casos de prueba pasaron:
              </p>
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div key={idx} className="text-xs bg-green-100 dark:bg-green-900/30 p-2 rounded-md">
                    <span className="font-mono">{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Retroalimentación cuando la respuesta es incorrecta */}
      {isFailed && !isCompleted && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border-2 border-red-300">
          <p className="text-red-700 dark:text-red-300 flex items-center font-semibold">
            <XIcon className="h-5 w-5 mr-2" /> Respuesta incorrecta
          </p>
          
          {testResults.length > 0 && (
            <div className="mt-2">
              <p className="text-red-700 dark:text-red-300 mb-2 text-sm font-medium">
                Resultados de las pruebas:
              </p>
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-2 rounded-md ${
                      result.passed
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <span className="font-mono">{result.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {solutionCode && (
            <div className="mt-3">
              <p className="text-red-700 dark:text-red-300 mb-2 text-sm font-medium">
                Una posible solución:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto text-sm border border-gray-300 dark:border-gray-700">
                {solutionCode}
              </pre>
            </div>
          )}
          
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Pulsa &quot;Siguiente&quot; para continuar con la siguiente pregunta.
          </p>
        </div>
      )}
    </div>
  )
}
