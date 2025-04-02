"use client"

import type { Week, Question, UserProgress } from "./types"
import { saveQuestionProgress as apiSaveQuestionProgress } from "./api"

// Datos de semanas
export const weeks: Week[] = [
  {
    id: 1,
    title: "Introducción a JavaScript",
    description: "Conceptos básicos de JavaScript, variables, tipos de datos y operadores.",
    unlockDate: "2025-03-17T03:00:00.000Z",
    topics: [
      {
        id: 1,
        title: "Variables y Tipos de Datos",
        description: "Aprende sobre variables, tipos de datos y cómo declararlos en JavaScript.",
        questions: [1, 2, 3]
      },
      {
        id: 2,
        title: "Operadores",
        description: "Explora los diferentes operadores en JavaScript y cómo usarlos.",
        questions: [4, 5, 6]
      }
    ]
  },
  {
    id: 2,
    title: "Control de Flujo",
    description: "Aprende sobre estructuras de control como if, else, switch y bucles.",
    unlockDate: "2025-03-24T03:00:00.000Z",
    topics: [
      {
        id: 3,
        title: "Condicionales",
        description: "Aprende a usar if, else, else if y switch para controlar el flujo de tu código.",
        questions: [7, 8, 9]
      },
      {
        id: 4,
        title: "Bucles",
        description: "Explora los diferentes tipos de bucles en JavaScript: for, while, do...while.",
        questions: [10, 11, 12]
      }
    ]
  },
  {
    id: 3,
    title: "Funciones",
    description: "Aprende a crear y usar funciones en JavaScript.",
    unlockDate: "2025-03-31T03:00:00.000Z",
    topics: [
      {
        id: 5,
        title: "Declaración de Funciones",
        description: "Aprende diferentes formas de declarar funciones en JavaScript.",
        questions: [13, 14, 15]
      },
      {
        id: 6,
        title: "Parámetros y Retorno",
        description: "Explora cómo pasar parámetros a funciones y obtener valores de retorno.",
        questions: [16, 17, 18]
      }
    ]
  },
  {
    id: 4,
    title: "Arrays",
    description: "Aprende a trabajar con arrays en JavaScript.",
    unlockDate: "2025-04-07T03:00:00.000Z",
    topics: [
      {
        id: 7,
        title: "Creación y Acceso",
        description: "Aprende a crear arrays y acceder a sus elementos.",
        questions: [19, 20, 21]
      },
      {
        id: 8,
        title: "Métodos de Array",
        description: "Explora los métodos más comunes para manipular arrays.",
        questions: [22, 23, 24]
      }
    ]
  },
  {
    id: 5,
    title: "Objetos",
    description: "Aprende a trabajar con objetos en JavaScript.",
    unlockDate: "2025-04-14T03:00:00.000Z",
    topics: [
      {
        id: 9,
        title: "Creación de Objetos",
        description: "Aprende diferentes formas de crear objetos en JavaScript.",
        questions: [25, 26, 27]
      },
      {
        id: 10,
        title: "Propiedades y Métodos",
        description: "Explora cómo trabajar con propiedades y métodos de objetos.",
        questions: [28, 29, 30]
      }
    ]
  },
  {
    id: 6,
    title: "DOM Manipulation",
    description: "Aprende a manipular el DOM con JavaScript.",
    unlockDate: "2025-04-21T03:00:00.000Z",
    topics: [
      {
        id: 11,
        title: "Selección de Elementos",
        description: "Aprende a seleccionar elementos del DOM.",
        questions: [31, 32, 33]
      },
      {
        id: 12,
        title: "Modificación del DOM",
        description: "Explora cómo modificar elementos del DOM.",
        questions: [34, 35, 36]
      }
    ]
  },
  {
    id: 7,
    title: "Eventos",
    description: "Aprende a trabajar con eventos en JavaScript.",
    unlockDate: "2025-04-28T03:00:00.000Z",
    topics: [
      {
        id: 13,
        title: "Tipos de Eventos",
        description: "Explora los diferentes tipos de eventos en JavaScript.",
        questions: [37, 38, 39]
      },
      {
        id: 14,
        title: "Manejo de Eventos",
        description: "Aprende a manejar eventos en JavaScript.",
        questions: [40, 41, 42]
      }
    ]
  },
  {
    id: 8,
    title: "Asincronía",
    description: "Aprende sobre programación asíncrona en JavaScript.",
    unlockDate: "2025-05-05T03:00:00.000Z",
    topics: [
      {
        id: 15,
        title: "Callbacks",
        description: "Aprende a usar callbacks para manejar operaciones asíncronas.",
        questions: [43, 44, 45]
      },
      {
        id: 16,
        title: "Promesas",
        description: "Explora cómo trabajar con promesas en JavaScript.",
        questions: [46, 47, 48]
      }
    ]
  },
  {
    id: 9,
    title: "APIs y Fetch",
    description: "Aprende a consumir APIs usando fetch en JavaScript.",
    unlockDate: "2025-05-12T03:00:00.000Z",
    topics: [
      {
        id: 17,
        title: "Introducción a APIs",
        description: "Aprende los conceptos básicos de las APIs.",
        questions: [49, 50, 51]
      },
      {
        id: 18,
        title: "Fetch API",
        description: "Explora cómo usar la API Fetch para realizar peticiones HTTP.",
        questions: [52, 53, 54]
      }
    ]
  },
  {
    id: 10,
    title: "Proyecto Final",
    description: "Aplica todo lo aprendido en un proyecto práctico.",
    unlockDate: "2025-05-19T03:00:00.000Z",
    topics: [
      {
        id: 19,
        title: "Planificación",
        description: "Aprende a planificar tu proyecto final.",
        questions: [55, 56, 57]
      },
      {
        id: 20,
        title: "Implementación",
        description: "Implementa tu proyecto final aplicando todos los conceptos aprendidos.",
        questions: [58, 59, 60]
      }
    ]
  }
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
      "¿Cuál de las siguientes opciones es la forma correcta de declarar una variable <b>constante</b> en JavaScript?",
    points: 1,
    options: ["var miVariable = 10;", "let miVariable = 10;", "const miVariable = 10;", "variable miVariable = 10;"],
    correctAnswer: "const miVariable = 10;",
  },
  {
    id: 2,
    weekId: 1,
    type: "bug-fix",
    title: "Constantes en JavaScript",
    description: "El siguiente código intenta incrementar el valor de una <b>variable</b>, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode: "const numero = 5;\nnumero = numero + 1;\nconsole.log(numero);",
    correctCode: "let numero = 5;\nnumero = numero + 1;\nconsole.log(numero);",
  },
  {
    id: 3,
    weekId: 1,
    type: "bug-fix",
    title: "Multiplicar por sí mismo",
    description: "Completa el siguiente código para que devuelva el resultado de multiplicar <code>numero</code> por sí mismo.",
    points: 5,
    buggyCode: "let numero = 5;\nnumero = numero * 2;\nconsole.log(numero);",
    correctCode: "let numero = 5;\nnumero = numero * numero;\nconsole.log(numero);",
  },

  // Semana 2: Operadores y condicionales
  {
    id: 4,
    weekId: 2,
    type: "multiple-choice",
    title: "Operadores de comparación",
    description:
      "¿Cuál de los siguientes operadores se utiliza para comprobar si dos valores son <b>iguales</b> en <b>valor y tipo</b>?",
    points: 5,
    options: ["==", "===", "!=", "!=="],
    correctAnswer: "===",
  },
  {
    id: 5,
    weekId: 2,
    type: "bug-fix",
    title: "Corregir condicional if-else",
    description:
      "El siguiente código debería mostrar 'Mayor de edad' si la edad <b>es igual a 18 o mayor</b>, y 'Menor de edad' en caso contrario. Corrige el error.",
    points: 3,
    buggyCode:
      "const edad = 18;\nif (edad < 18) {\n  console.log('Mayor de edad');\n} else {\n  console.log('Menor de edad');\n}",
    correctCode:
      "const edad = 18;\nif (edad >= 18) {\n  console.log('Mayor de edad');\n} else {\n  console.log('Menor de edad');\n}",
  },
  {
    id: 6,
    weekId: 2,
    type: "code-writing",
    title: "Evaluación de calificaciones",
    description:
      "Escribe una función que reciba una calificación numérica y devuelva: <b>'Sobresaliente' si es 90 o más</b>, <b>'No sobresaliente' en caso contrario</b>.",
    points: 1,
    initialCode: "function evaluarCalificacion(nota) {\n  // Tu código aquí\n}",
    keywords: ["if", "else", "return", "nota", "calificación", "condición", ">="],
    testCases: [
      { input: "evaluarCalificacion(95)", expectedOutput: "'Sobresaliente'" },
      { input: "evaluarCalificacion(75)", expectedOutput: "'No sobresaliente'" },
      { input: "evaluarCalificacion(90)", expectedOutput: "'Sobresaliente'" },
      { input: "evaluarCalificacion(89)", expectedOutput: "'No sobresaliente'" },
    ],
  },

  // Semana 3: Repetitivas
  {
    id: 7,
    weekId: 3,
    type: "multiple-choice",
    title: "Condicionales básicos",
    description: "¿Qué estructura se utiliza en JavaScript para tomar decisiones basadas en una condición?",
    points: 1,
    options: [
      "if-else",
      "for",
      "while",
      "switch-case"
    ],
    correctAnswer: "if-else",
  },
  {
    id: 8,
    weekId: 3,
    type: "bug-fix",
    title: "Corregir bucle for",
    description: "El siguiente código debería mostrar los números <b>del 1 al 5</b> usando un bucle <b>for</b>, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode:
      "// Mostrar números del 1 al 5\nfor (let i = 1; i > 5; i++) {\n  console.log(i);\n}",
    correctCode:
      "// Mostrar números del 1 al 5\nfor (let i = 1; i <= 5; i++) {\n  console.log(i);\n}",
  },
  {
    id: 9,
    weekId: 3,
    type: "code-writing",
    title: "Sumar números pares",
    description:
      "Escribe una función que sume todos los números pares desde 1 hasta n (inclusive). Utiliza un bucle para resolver este problema.",
    points: 5,
    initialCode: "function sumarPares(n) {\n  // Tu código aquí\n}",
    keywords: ["for", "while", "loop", "bucle", "suma", "pares", "if", "return"],
    testCases: [
      {
        input: "sumarPares(10)",
        expectedOutput: "30",
      },
      {
        input: "sumarPares(20)",
        expectedOutput: "110",
      },
      {
        input: "sumarPares(1)",
        expectedOutput: "0",
      },
      {
        input: "sumarPares(2)",
        expectedOutput: "2",
      }
    ],
  },

  // Semana 4: Funciones
  {
    id: 10,
    weekId: 4,
    type: "multiple-choice",
    title: "Conceptos básicos de funciones",
    description: "¿Cuál de las siguientes opciones es la <b>forma correcta de declarar una función en JavaScript</b>?",
    points: 1,
    options: [
      "function miFuncion() { return true; }",
      "const miFuncion = function() { return true; }",
      "miFuncion() { return true; }",
      "let function miFuncion() { return true; }"
    ],
    correctAnswer: "function miFuncion() { return true; }",
  },
  {
    id: 11,
    weekId: 4,
    type: "bug-fix",
    title: "Corregir declaración de función",
    description: "La siguiente función sirve para calcular el área de un rectángulo, pero tiene un <b>error en cómo se define</b>. Corrige la definición de la función.",
    points: 3,
    buggyCode:
      "function calcularArea(base; altura) {\n  let area = base * altura;\n  return area;\n}",
    correctCode:
      "function calcularArea(base, altura) {\n  let area = base * altura;\n  return area;\n}",
  },
  {
    id: 12,
    weekId: 4,
    type: "code-writing",
    title: "Función factorial",
    description:
      "Escribe <b>una función que calcule el factorial de un número n</b>. El factorial de n es el producto de todos los enteros positivos desde 1 hasta n. <br><small><i>Nota: El factorial de 0 es 1.</i></small>",
    points: 5,
    initialCode: "function factorial(n) {\n  // Tu código aquí\n}",
    keywords: ["for", "while", "recursion", "recursiva", "multiplicación", "return"],
    testCases: [
      {
        input: "factorial(5)",
        expectedOutput: "120",
      },
      {
        input: "factorial(0)",
        expectedOutput: "1",
      },
      {
        input: "factorial(1)",
        expectedOutput: "1",
      },
      {
        input: "factorial(10)",
        expectedOutput: "3628800",
      }
    ],
  },
  // Semana 5: Objetos nativos
  {
    id: 13,
    weekId: 5,
    type: "multiple-choice",
    title: "Método Math.random()",
    description: "¿Qué rango de valores puede devolver el <b>método Math.random()</b>?",
    points: 1,
    options: [
      "Entre 0 y 1, incluyendo el 0 pero no el 1",
      "Entre 0 y 1, incluyendo ambos valores",
      "Entre -1 y 1, incluyendo ambos valores",
      "Entre 0 y 100, incluyendo ambos valores"
    ],
    correctAnswer: "Entre 0 y 1, incluyendo el 0 pero no el 1",
  },
  {
    id: 14,
    weekId: 5,
    type: "bug-fix",
    title: "Número aleatorio entero",
    description: "El siguiente código intenta generar un número <b>aleatorio entero entre 1 y 10</b>, pero tiene un error. Corrígelo.<br><b style='color: red;'>IMPORTANTE:</b> La respuesta deberá utilizar el método <b>Math.floor()</b> para obtener un número entero.",
    points: 3,
    buggyCode: "function numeroAleatorio() {\n  return Math.random() * 10;\n}",
    correctCode: "function numeroAleatorio() {\n  return Math.floor(Math.random() * 10) + 1;\n}",
  },
  {
    id: 15,
    weekId: 5,
    type: "code-writing",
    title: "Redondeo a decena superior",
    description: "Escribe una función que redondee un número a la decena superior más cercana.",
    points: 5,
    initialCode: "function redondearDecena(numero) {\n  // Tu código aquí\n}",
    keywords: ["Math.ceil", "Math.round", "Math.floor", "decena", "return"],
    testCases: [
      
      {
        input: "redondearDecena(-5)",
        expectedOutput: "0",
      },
      {
        input: "redondearDecena(0)",
        expectedOutput: "0",
      },
      {
        input: "redondearDecena(12)",
        expectedOutput: "20",
      },
      {
        input: "redondearDecena(10)",
        expectedOutput: "10",
      },
      {
        input: "redondearDecena(99)",
        expectedOutput: "100",
      },
      {
        input: "redondearDecena(112)",
        expectedOutput: "120",
      }
    ],
  },
  // Semana 6: Arrays
  {
    id: 16,
    weekId: 6,
    type: "multiple-choice",
    title: "Método push en Arrays",
    description: "¿Qué hace el <b>método push()</b> en un array de JavaScript?",
    points: 1,
    options: [
      "Elimina el último elemento del array",
      "Añade un elemento al final del array",
      "Añade un elemento al principio del array",
      "Elimina el primer elemento del array"
    ],
    correctAnswer: "Añade un elemento al final del array",
  },
  {
    id: 17,
    weekId: 6,
    type: "bug-fix",
    title: "Eliminar el último elemento",
    description: "El siguiente código intenta <b>eliminar el último elemento de un array y devolverlo</b>, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode: "function eliminarUltimo(array) {\n  return array.push();\n}",
    correctCode: "function eliminarUltimo(array) {\n  return array.pop();\n}",
  },
  {
    id: 18,
    weekId: 6,
    type: "code-writing",
    title: "Acceso por índice",
    description: "Escribe una función que devuelva el <b>elemento central de un array</b>. Si el array tiene un número par de elementos, devuelve el elemento en la posición <b>(longitud/2)-1</b>.",
    points: 5,
    initialCode: "function elementoCentral(array) {\n  // Tu código aquí\n}",
    keywords: ["length", "index", "array", "return", "Math.ceil"],
    testCases: [
      {
        input: "elementoCentral([1, 2, 3])",
        expectedOutput: "2",
      },
      {
        input: "elementoCentral([1, 2, 3, 4])",
        expectedOutput: "2",
      },
      {
        input: "elementoCentral(['a', 'b', 'c', 'd', 'e'])",
        expectedOutput: "'c'",
      }
    ],
  },
  // Semana 7: Objetos
  {
    id: 19,
    weekId: 7,
    type: "multiple-choice",
    title: "Método Object.keys()",
    description: "¿Qué hace el método <b>Object.keys()</b> en un objeto de JavaScript?",
    points: 1,
    options: [
      "Devuelve un array con las propiedades enumerables del objeto",
      "Devuelve un array con las propiedades no enumerables del objeto",
      "Devuelve un array con las propiedades del objeto",
      "Devuelve un objeto con las propiedades del objeto"
    ],
    correctAnswer: "Devuelve un array con las propiedades enumerables del objeto",
  },
  {
    id: 20,
    weekId: 7,
    type: "bug-fix",
    title: "Acceso a propiedades de un auto",
    description: "El siguiente código intenta acceder a las <b>propiedades de un objeto auto</b>, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode: "const auto = {marca: 'Toyota', modelo: 'Corolla', año: 2022};\nconsole.log(marca);",
    correctCode: "const auto = {marca: 'Toyota', modelo: 'Corolla', año: 2022};\nconsole.log(auto.marca);",
  },
  {
    id: 21,
    weekId: 7,
    type: "code-writing",
    title: "Método Object.values()",
    description: "Escribe una función que devuelva un array con los <b>valores de las propiedades enumerables de un objeto</b>.",
    points: 5,
    initialCode: "function obtenerValores(objeto) {\n  // Tu código aquí\n}",
    keywords: ["Object.values", "values", "for", "in"],
    testCases: [
      {
        input: "obtenerValores({a: 1, b: 2, c: 3})",
        expectedOutput: "[1, 2, 3]",
      },
      {
        input: "obtenerValores({nombre: 'Juan', edad: 25})",
        expectedOutput: "['Juan', 25]",
      },
      {
        input: "obtenerValores({})",
        expectedOutput: "[]",
      }
    ],
  },
  // Semana 8: Elementos del DOM
  {
    id: 22,
    weekId: 8,
    type: "multiple-choice",
    title: "Método querySelector()",
    description: "¿Qué hace el método <b>querySelector()</b> en el DOM de JavaScript?",
    points: 1,
    options: [
      "Devuelve todos los elementos que coinciden con el selector",
      "Devuelve el último elemento que coincide con el selector",
      "Devuelve un array con todos los elementos que coinciden con el selector",
      "Devuelve el primer elemento que coincide con el selector"
    ],
    correctAnswer: "Devuelve el primer elemento que coincide con el selector",
  },
  {
    id: 23,
    weekId: 8,
    type: "bug-fix",
    title: "Acceso a elementos del DOM",
    description: "El siguiente código intenta acceder a un elemento del DOM con <b>id 'miElemento'</b>, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode: "const elemento = document.querySelector('miElemento');\nconsole.log(elemento);",
    correctCode: "const elemento = document.querySelector('#miElemento');\nconsole.log(elemento);",
  },
  {
    id: 24,
    weekId: 8,
    type: "bug-fix",
    title: "Uso de querySelectorAll()",
    description: "El siguiente código intenta cambiar el color de <b>todos los elementos con la clase 'items'</b>, pero tiene un error. Corrígelo.",
    points: 5,
    buggyCode: "const elementos = document.querySelector('.items');\nfor (let i = 0; i < elementos.length; i++) {\n  elementos[i].style.color = 'red';\n}",
    correctCode: "const elementos = document.querySelectorAll('.items');\nfor (let i = 0; i < elementos.length; i++) {\n  elementos[i].style.color = 'red';\n}",
  },
  // Semana 9: Eventos
  {
    id: 25,
    weekId: 9,
    type: "multiple-choice",
    title: "Eventos de click",
    description: "¿Cuál es la forma correcta de agregar un evento de <b>click</b> a un botón con id 'miBoton'?",
    points: 1,
    options: [
      "document.querySelector('#miBoton').onClick = miFuncion",
      "document.querySelector('#miBoton').addEventListener('click', miFuncion)",
      "document.querySelector('#miBoton').click(miFuncion)",
      "document.querySelector('#miBoton').attachEvent('click', miFuncion)"
    ],
    correctAnswer: "document.querySelector('#miBoton').addEventListener('click', miFuncion)",
  },
  {
    id: 26,
    weekId: 9,
    type: "bug-fix",
    title: "Evento keyup",
    description: "El siguiente código intenta detectar cuando el usuario <b>suelta una tecla</b> en un campo de texto, pero tiene un error. Corrígelo.",
    points: 3,
    buggyCode: "const input = document.querySelector('#miInput');\ninput.addEventListener('click', function(event) {\n  console.log('Tecla soltada:', event.key);\n});",
    correctCode: "const input = document.querySelector('#miInput');\ninput.addEventListener('keyup', function(event) {\n  console.log('Tecla soltada:', event.key);\n});",
  },
  {
    id: 27,
    weekId: 9,
    type: "multiple-choice",
    title: "Detectar código de tecla en eventos keydown",
    description: "¿Cuál es la forma correcta de obtener el <b>código de la tecla presionada</b> en un evento <b>keydown</b>? <br> <br> <b>Ejemplo:</b><br><pre>const input = document.querySelector('#miInput');<br>input.addEventListener('keydown', function(event) {\n  console.log('Tecla presionada:', <span>tu respuesta</span>);\n});</pre>",
    points: 5,
    options: [
      "event.keyCode",
      "event.key",
      "event.code",
      "event.keyPress"
    ],
    correctAnswer: "event.key",
  },
  // Semana 10: Asincronía
  {
    id: 28,
    weekId: 10,
    type: "multiple-choice",
    title: "Asincronía en fetch",
    description: "Indica si la siguiente afirmación es verdadera o falsa: <br><b>La función fetch en JavaScript devuelve valores de forma instantánea (síncrona) sin necesidad de esperar a que se complete la petición.</b>",
    points: 1,
    options: [
      "Verdadero",
      "Falso"
    ],
    correctAnswer: "Falso",
  },
  {
    id: 29,
    weekId: 10,
    type: "multiple-choice",
    title: "Formato de respuesta de APIs",
    description: "¿Qué ocurre con los <b>datos devueltos por una API cuando usamos fetch</b>?<br><br><b>Ejemplo:</b><br><pre>fetch('https://api.ejemplo.com/datos')\n  .then(response => response.json())\n  .then(data => console.log(data))</pre>",
    points: 3,
    options: [
      "Las APIs siempre devuelven datos en formato JSON listos para usar",
      "El método fetch convierte automáticamente la respuesta a JSON",
      "Es necesario convertir la respuesta con el método .json() para obtener los datos en formato utilizable",
      "La respuesta de fetch siempre debe ser parseada con JSON.parse()"
    ],
    correctAnswer: "Es necesario convertir la respuesta con el método .json() para obtener los datos en formato utilizable",
  },
  {
    id: 30,
    weekId: 10,
    type: "bug-fix",
    title: "Consumo de API con fetch",
    description: "El siguiente código intenta obtener datos de usuarios desde la API de JSONPlaceholder, pero tiene un error. Corrígelo para que funcione correctamente.",
    points: 5,
    buggyCode: "function obtenerUsuarios() {\n  return fetch('https://jsonplaceholder.typicode.com/users')\n  .then(response => response)\n  .then(data => {\n    return data;\n  });\n}",
    correctCode: "function obtenerUsuarios() {\n  return fetch('https://jsonplaceholder.typicode.com/users')\n  .then(response => response.json())\n  .then(data => {\n    return data;\n  });\n}"
  }
]

// Datos de progreso de usuarios (inicialmente vacío)
const usersProgress: UserProgress[] = [
  {
    userId: 1,
    userName: "Estudiante Demo",
    userClass: "M",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 2,
    userName: "Juan Pérez",
    userClass: "M",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 3,
    userName: "María García",
    userClass: "M",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 4,
    userName: "Carlos López",
    userClass: "M",
    totalPoints: 0,
    completedQuestions: 0,
    completedWeeks: 0,
    completedWeekIds: [],
    questionProgress: [],
  },
  {
    userId: 5,
    userName: "Ana Martínez",
    userClass: "M",
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
      userClass: "M", // Clase por defecto
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
    
    // El usuario demo no intenta guardar en el servidor
    if (userId === 1) {
      console.log("Usuario demo: no se guarda progreso en servidor");
      return;
    }
    
    // Intentar guardar en el backend para usuarios normales
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
  // Para el usuario demo (ID = 1), no guardamos realmente su progreso
  // Solo simulamos la respuesta para esta sesión
  if (userId === 1) {
    console.log("Usuario demo detectado. Se simula guardar progreso pero no se almacena permanentemente.");
    
    const userProgress = usersProgress.find((u) => u.userId === userId)
    if (!userProgress) return;
    
    // Si es el usuario demo, temporalmente actualizamos sin guardar en localStorage
    const existingProgressIndex = userProgress.questionProgress.findIndex(
      (qp) => qp.questionId === questionId && qp.weekId === weekId
    )
    
    if (existingProgressIndex >= 0) {
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
    
    // Actualizamos el estado en memoria para la sesión actual
    // pero no lo guardamos en localStorage
    updateUserStats(userId, false);
    
    return;
  }
  
  // Para usuarios normales, guardamos su progreso como siempre
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
function updateUserStats(userId: number, saveToStorage = true): void {
  const userProgress = getUserProgress(userId)

  // Para el usuario demo, desbloqueamos todas las semanas automáticamente
  if (userId === 1) {
    console.log("Usuario demo: Desbloqueando todas las semanas automáticamente");
    
    // Obtener todos los IDs de semanas
    const allWeekIds = weeks.map(week => week.id);
    
    // Actualizar completedWeekIds con todas las semanas
    userProgress.completedWeekIds = allWeekIds;
    
    // Calcular puntos totales
    userProgress.totalPoints = userProgress.questionProgress.reduce((total, q) => total + q.points, 0);
    
    // Calcular preguntas completadas
    userProgress.completedQuestions = userProgress.questionProgress.filter(q => q.completed).length;
    
    if (saveToStorage) {
      saveToLocalStorage();
    }
    return;
  }

  // Para usuarios normales, calcular las semanas completadas
  const now = new Date();
  const completedWeeks: number[] = [];
  
  weeks.forEach(week => {
    // Verificar si la fecha actual es posterior a la fecha de desbloqueo
    const unlockDate = new Date(week.unlockDate);
    if (now < unlockDate) return; // Si la semana aún no está desbloqueada, no la marcamos como completada
    
    // Obtener todas las preguntas para esta semana
    const weekQuestions = getQuestionsForWeek(week.id);
    
    // Verificar si todas las preguntas han sido intentadas (completadas o fallidas)
    const allQuestionsAttempted = weekQuestions.every(question => {
      return userProgress.questionProgress.some(
        progress => progress.questionId === question.id && 
                   progress.weekId === week.id && 
                   (progress.completed || progress.failed)
      );
    });
    
    if (allQuestionsAttempted) {
      completedWeeks.push(week.id);
    }
  });
  
  // Actualizar completedWeekIds
  userProgress.completedWeekIds = completedWeeks;
  
  // Calcular puntos totales
  userProgress.totalPoints = userProgress.questionProgress.reduce((total, q) => total + q.points, 0);
  
  // Calcular preguntas completadas
  userProgress.completedQuestions = userProgress.questionProgress.filter(q => q.completed).length;
  
  if (saveToStorage) {
    saveToLocalStorage();
  }
}

