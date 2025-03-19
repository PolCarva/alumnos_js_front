"use client"

import type { Week, Question, UserProgress } from "./types"
import { saveQuestionProgress as apiSaveQuestionProgress } from "./api"

// Datos de semanas
const weeks: Week[] = [
  {
    id: 1,
    title: "Introducción a JavaScript",
    description: "Fundamentos básicos del lenguaje JavaScript",
    topics: ["Variables y tipos de datos", "Operadores", "Estructuras de control", "Funciones básicas"],
  },
  {
    id: 2,
    title: "Estructuras de datos",
    description: "Arrays, objetos y manipulación de datos",
    topics: ["Arrays y métodos", "Objetos y propiedades", "Destructuring", "Spread y rest operators"],
  },
  {
    id: 3,
    title: "Funciones avanzadas",
    description: "Conceptos avanzados de funciones en JavaScript",
    topics: ["Arrow functions", "Closures", "Callbacks", "Funciones de orden superior"],
  },
  {
    id: 4,
    title: "Asincronía",
    description: "Manejo de operaciones asíncronas en JavaScript",
    topics: ["Callbacks asíncronos", "Promesas", "Async/await", "Fetch API"],
  },
]

// Datos de preguntas
const questions: Question[] = [
  // Semana 1: Introducción a JavaScript
  {
    id: 1,
    weekId: 1,
    type: "multiple-choice",
    title: "Variables en JavaScript",
    description:
      "¿Cuál de las siguientes opciones es la forma correcta de declarar una variable constante en JavaScript?",
    points: 1,
    options: ["var miVariable = 10;", "let miVariable = 10;", "const miVariable = 10;", "variable miVariable = 10;"],
    correctAnswer: "const miVariable = 10;",
  },
  {
    id: 2,
    weekId: 1,
    type: "bug-fix",
    title: "Corregir función",
    description: "La siguiente función debería sumar dos números, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode: "function sumar(a, b) {\n  return a - b;\n}",
    correctCode: "function sumar(a, b) {\n  return a + b;\n}",
  },
  {
    id: 3,
    weekId: 1,
    type: "code-writing",
    title: "Función factorial",
    description: "Escribe una función que calcule el factorial de un número.",
    points: 5,
    initialCode: "function factorial(n) {\n  // Tu código aquí\n}",
    keywords: ["return", "factorial", "for", "while", "recursion", "recursiva", "if"],
    testCases: [
      { input: "factorial(0)", expectedOutput: "1" },
      { input: "factorial(1)", expectedOutput: "1" },
      { input: "factorial(5)", expectedOutput: "120" },
      { input: "factorial(10)", expectedOutput: "3628800" },
    ],
  },

  // Semana 2: Estructuras de datos
  {
    id: 4,
    weekId: 2,
    type: "multiple-choice",
    title: "Métodos de arrays",
    description:
      "¿Qué método de array se utiliza para crear un nuevo array con los elementos que cumplan una condición?",
    points: 1,
    options: ["array.map()", "array.filter()", "array.reduce()", "array.forEach()"],
    correctAnswer: "array.filter()",
  },
  {
    id: 5,
    weekId: 2,
    type: "bug-fix",
    title: "Corregir destructuring",
    description:
      "El siguiente código intenta extraer propiedades de un objeto usando destructuring, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode:
      "const persona = { nombre: 'Juan', edad: 25 };\nconst { nombre, apellido } = persona;\nconsole.log(nombre, apellido);",
    correctCode:
      "const persona = { nombre: 'Juan', edad: 25 };\nconst { nombre, edad } = persona;\nconsole.log(nombre, edad);",
  },
  {
    id: 6,
    weekId: 2,
    type: "code-writing",
    title: "Filtrar y transformar array",
    description:
      "Escribe una función que reciba un array de números, filtre los números pares y devuelva un nuevo array con el cuadrado de esos números.",
    points: 5,
    initialCode: "function filtrarYTransformar(numeros) {\n  // Tu código aquí\n}",
    keywords: ["filter", "map", "=>", "return", "numeros", "array", "pares", "cuadrado"],
    testCases: [
      { input: "filtrarYTransformar([1, 2, 3, 4, 5])", expectedOutput: "[4, 16]" },
      { input: "filtrarYTransformar([2, 4, 6])", expectedOutput: "[4, 16, 36]" },
      { input: "filtrarYTransformar([1, 3, 5])", expectedOutput: "[]" },
    ],
  },

  // Semana 3: Funciones avanzadas
  {
    id: 7,
    weekId: 3,
    type: "multiple-choice",
    title: "Arrow functions",
    description: "¿Cuál es la característica principal de las arrow functions en JavaScript?",
    points: 1,
    options: [
      "No tienen su propio this",
      "No pueden tener parámetros",
      "Siempre deben tener llaves {}",
      "No pueden ser anónimas",
    ],
    correctAnswer: "No tienen su propio this",
  },
  {
    id: 8,
    weekId: 3,
    type: "bug-fix",
    title: "Corregir closure",
    description: "El siguiente código intenta crear un contador usando closures, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode:
      "function crearContador() {\n  let contador = 0;\n  return {\n    incrementar: function() { contador++; },\n    obtenerValor: function() { return contador; }\n  };\n}\nconst miContador = crearContador();\nmiContador.incrementar();\nconsole.log(contador);",
    correctCode:
      "function crearContador() {\n  let contador = 0;\n  return {\n    incrementar: function() { contador++; },\n    obtenerValor: function() { return contador; }\n  };\n}\nconst miContador = crearContador();\nmiContador.incrementar();\nconsole.log(miContador.obtenerValor());",
  },
  {
    id: 9,
    weekId: 3,
    type: "code-writing",
    title: "Función de orden superior",
    description:
      "Escribe una función 'ejecutarNVeces' que reciba una función y un número, y ejecute la función ese número de veces.",
    points: 5,
    initialCode: "function ejecutarNVeces(fn, n) {\n  // Tu código aquí\n}",
    keywords: ["for", "while", "loop", "bucle", "fn", "function", "función", "call", "llamar", "ejecutar"],
    testCases: [
      {
        input: "let contador = 0; ejecutarNVeces(() => contador++, 3); contador",
        expectedOutput: "3",
      },
      {
        input: "let resultado = ''; ejecutarNVeces(() => { resultado += 'a' }, 5); resultado",
        expectedOutput: "'aaaaa'",
      },
    ],
  },

  // Semana 4: Asincronía
  {
    id: 10,
    weekId: 4,
    type: "multiple-choice",
    title: "Promesas en JavaScript",
    description: "¿Cuál de los siguientes métodos se utiliza para manejar errores en promesas?",
    points: 1,
    options: [".then()", ".catch()", ".finally()", ".error()"],
    correctAnswer: ".catch()",
  },
  {
    id: 11,
    weekId: 4,
    type: "bug-fix",
    title: "Corregir async/await",
    description: "El siguiente código usa async/await para obtener datos, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode:
      "async function obtenerDatos() {\n  const respuesta = fetch('https://api.ejemplo.com/datos');\n  const datos = await respuesta.json();\n  return datos;\n}",
    correctCode:
      "async function obtenerDatos() {\n  const respuesta = await fetch('https://api.ejemplo.com/datos');\n  const datos = await respuesta.json();\n  return datos;\n}",
  },
  {
    id: 12,
    weekId: 4,
    type: "code-writing",
    title: "Promisificar función",
    description: "Convierte la siguiente función basada en callbacks a una que use promesas.",
    points: 5,
    initialCode:
      "function leerArchivo(ruta, callback) {\n  // Simulación de lectura de archivo\n  setTimeout(() => {\n    if (ruta) {\n      callback(null, 'Contenido del archivo');\n    } else {\n      callback(new Error('Ruta no válida'));\n    }\n  }, 1000);\n}\n\n// Conviértela a una función que devuelva una promesa\nfunction leerArchivoPromise(ruta) {\n  // Tu código aquí\n}",
    keywords: ["Promise", "new Promise", "resolve", "reject", "then", "catch", "return"],
    testCases: [
      {
        input: "typeof leerArchivoPromise('archivo.txt').then",
        expectedOutput: "'function'",
      },
      {
        input: "leerArchivoPromise('').catch(err => 'Error capturado').then(result => typeof result === 'string')",
        expectedOutput: "true",
      },
    ],
  },
]

// Datos de progreso de usuarios (inicialmente vacío)
const usersProgress: UserProgress[] = [
  {
    userId: 1,
    userName: "Estudiante Demo",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 2,
    userName: "Juan Pérez",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 3,
    userName: "María García",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 4,
    userName: "Carlos López",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 5,
    userName: "Ana Martínez",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
]

// Funciones para acceder a los datos

// Obtener todas las semanas
export function getWeeks(): Week[] {
  return weeks
}

// Obtener una semana por ID
export function getWeekById(weekId: number): Week | undefined {
  return weeks.find((week) => week.id === weekId)
}

// Obtener preguntas para una semana específica
export function getQuestionsForWeek(weekId: number): Question[] {
  return questions.filter((question) => question.weekId === weekId)
}

// Función para inicializar datos desde localStorage
function initializeFromLocalStorage() {
  if (typeof window === 'undefined') return;
  
  const storedUsersProgress = localStorage.getItem('usersProgress');
  if (storedUsersProgress) {
    try {
      const parsedData = JSON.parse(storedUsersProgress);
      // Actualizar los datos en memoria con los guardados en localStorage
      parsedData.forEach((storedProgress: UserProgress) => {
        const index = usersProgress.findIndex(p => p.userId === storedProgress.userId);
        if (index >= 0) {
          usersProgress[index] = storedProgress;
        } else {
          usersProgress.push(storedProgress);
        }
      });
    } catch (error) {
      console.error('Error parsing usersProgress from localStorage:', error);
    }
  }
}

// Función para guardar datos en localStorage
function saveToLocalStorage() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('usersProgress', JSON.stringify(usersProgress));
}

// Inicializar datos al cargar el módulo
if (typeof window !== 'undefined') {
  initializeFromLocalStorage();
}

// Actualizar la función updateUserProgress para guardar en localStorage
export function updateUserProgress(updatedUserProgress: UserProgress): void {
  const index = usersProgress.findIndex(up => up.userId === updatedUserProgress.userId);
  
  if (index !== -1) {
    usersProgress[index] = { ...updatedUserProgress };
  } else {
    usersProgress.push({ ...updatedUserProgress });
  }
  
  // Guardar en localStorage
  saveToLocalStorage();
}

// Obtener progreso de un usuario
export function getUserProgress(userId: number): UserProgress {
  const userProgress = usersProgress.find(up => up.userId === userId);
  
  if (!userProgress) {
    // Si no existe, creamos un progreso inicial para el usuario
    const newUserProgress: UserProgress = {
      userId,
      userName: `Usuario ${userId}`, // Nombre temporal
      totalPoints: 0,
      completedQuestions: 0,
      completedWeeks: 0,
      completedWeekIds: [],
      questionProgress: []
    };
    
    // Buscar el nombre real del usuario si existe
    import('./auth').then(auth => {
      const user = auth.getUser();
      if (user && user.id === userId) {
        newUserProgress.userName = user.name;
        updateUserProgress(newUserProgress);
      }
    }).catch(err => console.error("Error obteniendo usuario:", err));
    
    // Agregar al array de usuarios
    usersProgress.push(newUserProgress);
    return newUserProgress;
  }
  
  return userProgress;
}

// Obtener progreso de todos los usuarios (para el leaderboard)
export function getAllUsersProgress(): UserProgress[] {
  return usersProgress
}

// Guardar progreso de una pregunta
export async function saveQuestionProgress(
  userId: number,
  weekId: number,
  questionId: number,
  completed: boolean,
  points: number,
  failed = false,
  userAnswer?: string,
): Promise<void> {
  console.log(`Guardando progreso - Usuario: ${userId}, Semana: ${weekId}, Pregunta: ${questionId}, Completada: ${completed}`);
  
  try {
    // Guardar localmente primero para tener respuesta inmediata en la UI
    saveQuestionProgressLocally(userId, weekId, questionId, completed, points, failed, userAnswer);
    
    // Intentar guardar en el backend
    await apiSaveQuestionProgress(userId, weekId, questionId, completed, points, failed, userAnswer);
    console.log("✓ Progreso guardado en el servidor correctamente");
  } catch (error) {
    console.error("Error guardando en el backend:", error);
    // Ya se guardó localmente, así que no hace falta volver a hacerlo
    console.log("✓ Progreso guardado localmente como fallback");
  }
}

// Versión local de saveQuestionProgress para usar como fallback
function saveQuestionProgressLocally(
  userId: number,
  weekId: number,
  questionId: number,
  completed: boolean,
  points: number,
  failed = false,
  userAnswer?: string,
): void {
  const userProgress = usersProgress.find((u) => u.userId === userId)

  if (!userProgress) {
    console.error(`Usuario con ID ${userId} no encontrado`)
    return
  }

  // Verificar si ya existe un registro para esta pregunta
  const existingProgressIndex = userProgress.questionProgress.findIndex(
    (qp) => qp.questionId === questionId && qp.weekId === weekId
  )

  if (existingProgressIndex >= 0) {
    // Actualizar registro existente
    userProgress.questionProgress[existingProgressIndex] = {
      userId,
      weekId,
      questionId,
      completed,
      points,
      failed,
      userAnswer,
    }
  } else {
    // Crear nuevo registro
    userProgress.questionProgress.push({
      userId,
      weekId,
      questionId,
      completed,
      points,
      failed,
      userAnswer,
    })
  }

  // Actualizar estadísticas del usuario
  updateUserStats(userId)
  
  // Guardar en localStorage
  saveToLocalStorage()
}

// Actualizar estadísticas del usuario
function updateUserStats(userId: number): void {
  const userProgress = getUserProgress(userId)

  // Calcular puntos totales
  userProgress.totalPoints = userProgress.questionProgress.reduce((total, progress) => total + progress.points, 0)

  // Calcular preguntas completadas
  userProgress.completedQuestions = userProgress.questionProgress.filter((progress) => progress.completed).length

  // Calcular semanas completadas
  const weekIds = weeks.map((week) => week.id)
  const completedWeekIds: number[] = []

  for (const weekId of weekIds) {
    const weekQuestions = questions.filter((q) => q.weekId === weekId)

    // Considerar una pregunta como intentada si está completada O fallada
    const attemptedQuestions = userProgress.questionProgress.filter(
      (p) => p.weekId === weekId && (p.completed || p.failed),
    )

    // Una semana está completada si todas sus preguntas han sido intentadas
    if (weekQuestions.length > 0 && attemptedQuestions.length === weekQuestions.length) {
      completedWeekIds.push(weekId)
    }
  }

  userProgress.completedWeekIds = completedWeekIds
  userProgress.completedWeeks = completedWeekIds.length

  // Actualizar en la lista de usuarios
  const userIndex = usersProgress.findIndex((p) => p.userId === userId)
  if (userIndex !== -1) {
    usersProgress[userIndex] = userProgress
  }
  
  // Guardar en localStorage
  saveToLocalStorage()
}

