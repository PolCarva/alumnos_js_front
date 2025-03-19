"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckIcon, XIcon, AlertCircleIcon } from "lucide-react"
import type { Question, UserProgress, QuestionProgress } from "@/lib/types"
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
  const [questionStatuses, setQuestionStatuses] = useState<Array<{
    id: number;
    title: string;
    points: number;
    completed: boolean;
    failed: boolean;
  }>>([])
  const [questionProgress, setQuestionProgress] = useState<QuestionProgress | null>(null)
  const currentIndexRef = useRef(currentQuestionIndex)
  const router = useRouter()
  const { toast } = useToast()

  // Mantener la referencia actualizada
  useEffect(() => {
    currentIndexRef.current = currentQuestionIndex
  }, [currentQuestionIndex])

  // Efecto para actualizar el progreso local cuando cambia el progreso del usuario
  useEffect(() => {
    setLocalUserProgress(userProgress)
    
    // Calcular el estado de cada pregunta
    const statuses = questions.map(question => {
      const progress = userProgress.questionProgress.find(p => p.questionId === question.id)
      return {
        id: question.id,
        title: question.title,
        points: question.points,
        completed: progress?.completed || false,
        failed: progress?.failed || false
      }
    })
    
    setQuestionStatuses(statuses)
  }, [userProgress, questions])
  
  const currentQuestion = questions[currentQuestionIndex]

  // Verificar si la pregunta ya fue completada o fallada
  useEffect(() => {
    const progress = localUserProgress.questionProgress.find(
      (q) => q.questionId === currentQuestion?.id
    )
    setQuestionProgress(progress || null)
  }, [localUserProgress, currentQuestion])

  // Asegurar que los componentes de preguntas se reinicien cuando cambia el índice de pregunta
  // para evitar que la respuesta anterior se mantenga en la nueva pregunta
  useEffect(() => {
    // Limpiar la retroalimentación solo cuando el usuario cambie de pregunta explícitamente
    setShowingAnswerFeedback(false);
    
    // Buscar el progreso de la nueva pregunta seleccionada
    const progress = localUserProgress.questionProgress.find(
      (q) => q.questionId === questions[currentQuestionIndex]?.id
    );
    
    // Actualizar el progreso actual
    setQuestionProgress(progress || null);
    
    console.log(`Cambiando a pregunta #${currentQuestionIndex + 1}, progreso:`, progress);
  }, [currentQuestionIndex, localUserProgress.questionProgress, questions]);

  const isQuestionCompleted = questionProgress?.completed || false
  const isQuestionFailed = questionProgress?.failed || false
  const userAnswer = questionProgress?.userAnswer

  const handleSubmitAnswer = async (answer: string | string[], questionType: string) => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    setShowingAnswerFeedback(true)
    
    try {
      const result = await checkAnswer(currentQuestion.id, answer, questionType)
      
      // Crear objeto de progreso
      const userProgressData: QuestionProgress = {
        userId,
        weekId,
        questionId: currentQuestion.id,
        completed: result.correct,
        failed: !result.correct,
        points: result.correct ? currentQuestion.points : 0,
        userAnswer: typeof answer === 'string' ? answer : answer.join(',')
      }
      
      // Guardar progreso en el servidor y esperar a que se complete
      try {
        await saveQuestionProgress(
          userId,
          weekId,
          currentQuestion.id,
          result.correct,
          userProgressData.points,
          !result.correct,
          typeof answer === 'string' ? answer : answer.join(',')
        )
        
        console.log("Progreso guardado correctamente en servidor");
        
        // Sólo después de guardar exitosamente, actualizar el estado local
        const updatedProgress = {...localUserProgress}
        const existingIndex = updatedProgress.questionProgress.findIndex(
          q => q.questionId === currentQuestion.id && q.weekId === weekId
        )
        
        if (existingIndex >= 0) {
          updatedProgress.questionProgress[existingIndex] = userProgressData
        } else {
          updatedProgress.questionProgress.push(userProgressData)
        }
        
        // Actualizar contadores
        const completedQuestions = updatedProgress.questionProgress.filter(q => q.completed).length
        const totalPoints = updatedProgress.questionProgress.reduce((sum, q) => sum + q.points, 0)
        
        updatedProgress.completedQuestions = completedQuestions
        updatedProgress.totalPoints = totalPoints
        
        // Actualizar el estado local
        setLocalUserProgress(updatedProgress)
        setQuestionProgress(userProgressData)
        
        // Actualizar el estado local de la pregunta en la lista
        const newStatuses = [...questionStatuses]
        const statusIndex = newStatuses.findIndex(s => s.id === currentQuestion.id)
        if (statusIndex >= 0) {
          newStatuses[statusIndex] = {
            ...newStatuses[statusIndex],
            completed: result.correct,
            failed: !result.correct,
            points: result.correct ? currentQuestion.points : 0
          }
          setQuestionStatuses(newStatuses)
        }
        
        // Si se proporcionó la función onQuestionComplete, llamarla
        if (onQuestionComplete && result.correct) {
          await onQuestionComplete()
        }
      } catch (error) {
        console.error("Error al guardar progreso en servidor:", error)
        // En caso de error, mostrar mensaje pero aún actualizar la UI local
        toast({
          title: "Error al guardar progreso",
          description: "No se pudo guardar en el servidor, pero se ha actualizado localmente.",
          variant: "destructive",
        })
      }
      
      // Sólo desactivar el estado de envío pero mantener el feedback visible
      setIsSubmitting(false)
      
      // Mostrar toast con el resultado
      toast({
        title: result.correct ? "¡Respuesta correcta!" : "Respuesta incorrecta",
        description: result.correct 
          ? `Has ganado ${userProgressData.points} puntos. Pulsa "Siguiente" para continuar.` 
          : "Puedes ver la solución y pulsar 'Siguiente' cuando quieras pasar a la siguiente pregunta.",
        variant: result.correct ? "default" : "destructive",
        duration: 4000, // 4 segundos
      })
    } catch (error) {
      console.error("Error al verificar la respuesta:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al verificar tu respuesta. Inténtalo de nuevo.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      // No resetear el feedback en caso de error
    }
  }

  const checkAnswer = (questionId: number, answer: string | string[], questionType: string): Promise<{ correct: boolean; points?: number }> => {
    console.log(`Verificando respuesta para pregunta #${questionId}, tipo: ${questionType}`);
    
    return new Promise((resolve, reject) => {
      try {
        // Implementa la lógica para verificar la respuesta según el tipo de pregunta
        switch (questionType) {
          case "multiple-choice":
            console.log(`Comparando respuesta: "${answer}" con correcta: "${currentQuestion.correctAnswer}"`);
            const isCorrect = answer === currentQuestion.correctAnswer;
            resolve({ 
              correct: isCorrect,
              points: isCorrect ? currentQuestion.points : 0
            });
            break;
            
          case "bug-fix":
            console.log(`Comparando código arreglado con solución correcta`);
            const isFixed = answer === currentQuestion.correctCode;
            resolve({ 
              correct: isFixed,
              points: isFixed ? currentQuestion.points : 0
            });
            break;
            
          case "code-writing":
            if (currentQuestion.testCases && currentQuestion.testCases.length > 0) {
              console.log(`Ejecutando ${currentQuestion.testCases.length} casos de prueba`);
              try {
                // Verificar si todas las pruebas pasan
                const answerStr = typeof answer === 'string' ? answer : answer.join('\n');
                const testCases = currentQuestion.testCases;
                const results = testCases.map(testCase => {
                  try {
                    // Combinar el código del usuario con el caso de prueba
                    const fullCode = `
                      ${answerStr}
                      ${testCase.input}
                    `;

                    const result = eval(fullCode);
                    const expected = eval(testCase.expectedOutput);
                    const passed = JSON.stringify(result) === JSON.stringify(expected);
                    console.log(`Test: ${testCase.input} - ${passed ? 'PASÓ' : 'FALLÓ'}`);
                    return passed;
                  } catch (error) {
                    console.error(`Error en test: ${testCase.input}`, error);
                    return false;
                  }
                });
                
                const correct = results.every(Boolean);
                console.log(`Resultado final: ${correct ? 'CORRECTO' : 'INCORRECTO'}`);
                
                resolve({ 
                  correct,
                  points: correct ? currentQuestion.points : 0
                });
              } catch (error) {
                console.error("Error al verificar las pruebas:", error);
                resolve({ correct: false, points: 0 });
              }
            } else if (currentQuestion.keywords && currentQuestion.keywords.length > 0) {
              // Si no hay pruebas pero hay palabras clave, verificar con ellas
              console.log(`Verificando palabras clave: ${currentQuestion.keywords.join(', ')}`);
              const answerStr = typeof answer === 'string' ? answer.toLowerCase() : answer.join(' ').toLowerCase();
              const correct = currentQuestion.keywords.some(keyword => 
                answerStr.includes(keyword.toLowerCase())
              );
              
              console.log(`Resultado palabras clave: ${correct ? 'CORRECTO' : 'INCORRECTO'}`);
              resolve({ 
                correct,
                points: correct ? currentQuestion.points : 0
              });
            } else {
              // Si no hay forma de verificar, rechazar
              console.warn("No hay forma de verificar esta pregunta (sin pruebas ni palabras clave)");
              reject(new Error("No hay forma de verificar esta pregunta"));
            }
            break;
            
          default:
            console.error(`Tipo de pregunta no soportado: ${questionType}`);
            reject(new Error(`Tipo de pregunta no soportado: ${questionType}`));
        }
      } catch (error) {
        console.error("Error inesperado al verificar respuesta:", error);
        reject(error);
      }
    });
  }

  const renderQuestionComponent = () => {
    // Usamos una clave única para cada pregunta para forzar recreación del componente
    const questionKey = `question-${currentQuestion.id}-${currentQuestionIndex}`;
    
    switch (currentQuestion.type) {
      case "multiple-choice":
        return (
          <>
            <MultipleChoiceQuestion
              key={questionKey}
              question={currentQuestion}
              onSubmit={(answer) => handleSubmitAnswer(answer, "multiple-choice")}
              isSubmitting={isSubmitting}
              isCompleted={isQuestionCompleted}
              isFailed={isQuestionFailed}
              userAnswer={userAnswer}
            />
            {isSubmitting && showingAnswerFeedback && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-blue-700 dark:text-blue-300 flex items-center">
                  <AlertCircleIcon className="h-5 w-5 mr-2" /> Verificando respuesta...
                </p>
              </div>
            )}
          </>
        )
      case "bug-fix":
        return (
          <>
            <BugFixQuestion
              key={questionKey}
              question={currentQuestion}
              onSubmit={(answer) => handleSubmitAnswer(answer, "bug-fix")}
              isSubmitting={isSubmitting}
              isCompleted={isQuestionCompleted}
              isFailed={isQuestionFailed}
              userAnswer={userAnswer}
            />
            {isSubmitting && showingAnswerFeedback && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-blue-700 dark:text-blue-300 flex items-center">
                  <AlertCircleIcon className="h-5 w-5 mr-2" /> Verificando respuesta...
                </p>
              </div>
            )}
          </>
        )
      case "code-writing":
        return (
          <>
            <CodeWritingQuestion
              key={questionKey}
              question={currentQuestion}
              onSubmit={(answer) => handleSubmitAnswer(answer, "code-writing")}
              isSubmitting={isSubmitting}
              isCompleted={isQuestionCompleted}
              isFailed={isQuestionFailed}
              userAnswer={userAnswer}
            />
            {isSubmitting && showingAnswerFeedback && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <p className="text-blue-700 dark:text-blue-300 flex items-center">
                  <AlertCircleIcon className="h-5 w-5 mr-2" /> Verificando respuesta...
                </p>
              </div>
            )}
          </>
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
              // Solo cambiar de pregunta si no estamos en medio de un envío
              if (!isSubmitting) {
                setCurrentQuestionIndex(index)
              } else {
                toast({
                  title: "Espera un momento",
                  description: "Estamos procesando tu respuesta. Por favor espera.",
                  variant: "default",
                })
              }
            }}
          >
            {index + 1}
          </Button>
        ))}
      </div>

      {/* Pregunta actual */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{currentQuestion.title}</CardTitle>
              <CardDescription className="mt-1">Pregunta {currentQuestionIndex + 1} de {questions.length}</CardDescription>
            </div>
            <div>{getPointsBadge(currentQuestion.points)}</div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4">
            <p className="mb-4">{currentQuestion.description}</p>
          </div>
          
          {renderQuestionComponent()}
          
          {/* Mostrar feedback con resultado de verificación */}
          {showingAnswerFeedback && questionProgress && (
            <div className={`mt-6 p-4 ${questionProgress.completed ? 
              "bg-green-50 dark:bg-green-900/20 border-2 border-green-300" : 
              "bg-red-50 dark:bg-red-900/20 border-2 border-red-300"} rounded-md shadow-sm`}>
              <p className={`flex items-center font-semibold text-lg ${questionProgress.completed ? 
                "text-green-700 dark:text-green-300" : 
                "text-red-700 dark:text-red-300"}`}>
                {questionProgress.completed ? 
                  <><CheckIcon className="h-6 w-6 mr-2" /> ¡Respuesta correcta!</> : 
                  <><XIcon className="h-6 w-6 mr-2" /> Respuesta incorrecta</>}
              </p>
              <p className={`mt-2 ${questionProgress.completed ? 
                "text-green-600 dark:text-green-400" : 
                "text-red-600 dark:text-red-400"}`}>
                {questionProgress.completed ? 
                  `Has ganado ${questionProgress.points} puntos. Pulsa "Siguiente" para continuar.` : 
                  "La respuesta es incorrecta. Puedes consultar la solución correcta arriba y pulsar 'Siguiente' cuando estés listo."}
              </p>
              <div className="mt-3 text-right">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${questionProgress.completed ? 
                    "border-green-300 text-green-700 hover:bg-green-50" : 
                    "border-red-300 text-red-700 hover:bg-red-50"}`}
                  onClick={() => {
                    // Avanzar a la siguiente pregunta (mismo comportamiento que el botón Siguiente)
                    setShowingAnswerFeedback(false)
                    if (currentQuestionIndex < questions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    } else {
                      router.push("/dashboard")
                    }
                  }}
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente pregunta →"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              // Solo permitir navegar si no estamos en medio de un envío
              if (!isSubmitting) {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1)
                }
              } else {
                toast({
                  title: "Espera un momento",
                  description: "Estamos procesando tu respuesta. Por favor espera.",
                  variant: "default",
                })
              }
            }}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            Anterior
          </Button>
          
          <Button
            onClick={() => {
              // Solo permitir navegar si no estamos en medio de un envío
              if (!isSubmitting) {
                if (currentQuestionIndex < questions.length - 1) {
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                } else {
                  router.push("/dashboard")
                }
              } else {
                toast({
                  title: "Espera un momento",
                  description: "Estamos procesando tu respuesta. Por favor espera.",
                  variant: "default",
                })
              }
            }}
            disabled={(currentQuestionIndex === questions.length - 1 && !isQuestionCompleted && !isQuestionFailed && !showingAnswerFeedback) || isSubmitting}
            className={showingAnswerFeedback && (isQuestionCompleted || isQuestionFailed) ? "animate-pulse bg-blue-600 hover:bg-blue-700" : ""}
          >
            {currentQuestionIndex === questions.length - 1 ? "Finalizar" : "Siguiente"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}