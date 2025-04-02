"use client"

import type { User } from "./types"

// Datos de usuario dummy para simular autenticación
const dummyUsers: User[] = [
  {
    id: 1,
    name: "Estudiante Demo",
    username: "demo",
    password: "admin123",
    class: "M"
  },
  {
    id: 2,
    name: "Anaclara Acosta",
    username: "328063",
    password: "55585968",
    class: "M"
  },
  {
    id: 3,
    name: "Sofía Brito",
    username: "314948",
    password: "56392922",
    class: "M"
  },
  {
    id: 4,
    name: "Diego Cabot",
    username: "325297",
    password: "53436082",
    class: "M"
  },
  {
    id: 5,
    name: "Augusto Camejo",
    username: "270426",
    password: "52383690",
    class: "M"
  },
  {
    id: 6,
    name: "Rodrigo Ciganda",
    username: "232922",
    password: "51978535",
    class: "M"
  },
  {
    id: 7,
    name: "Josefina Colinet",
    username: "309422",
    password: "54569183",
    class: "M"
  },
  {
    id: 8,
    name: "Martina Correa",
    username: "327600",
    password: "56334665",
    class: "M"
  },
  {
    id: 9,
    name: "Valentina Cutiño",
    username: "262962",
    password: "49556345",
    class: "M"
  },
  {
    id: 10,
    name: "Franco Fernandez",
    username: "282833",
    password: "55536268",
    class: "M"
  },
  {
    id: 11,
    name: "Lucía Fuentes",
    username: "282000",
    password: "53413426",
    class: "M"
  },
  {
    id: 12,
    name: "Joaquina Garcia",
    username: "328874",
    password: "55727542",
    class: "M"
  },
  {
    id: 13,
    name: "Lucía García",
    username: "272988",
    password: "59058012",
    class: "M"
  },
  {
    id: 14,
    name: "Carmen Gomensoro",
    username: "322657",
    password: "54926256",
    class: "M"
  },
  {
    id: 15,
    name: "Rafaela Koci",
    username: "302814",
    password: "55557616",
    class: "M"
  },
  {
    id: 16,
    name: "Dafna Laufer",
    username: "282325",
    password: "54903151",
    class: "M"
  },
  {
    id: 17,
    name: "Micaela Levy",
    username: "281737",
    password: "55000469",
    class: "M"
  },
  {
    id: 18,
    name: "Sofía Martusciello",
    username: "330535",
    password: "55945588",
    class: "M"
  },
  {
    id: 19,
    name: "Facundo Mendoza",
    username: "311505",
    password: "53627667",
    class: "M"
  },
  {
    id: 20,
    name: "Facundo Oton",
    username: "303861",
    password: "53520918",
    class: "M"
  },
  {
    id: 21,
    name: "Geraldine Pintos",
    username: "329866",
    password: "55954684",
    class: "M"
  },
  {
    id: 22,
    name: "Sol Puente",
    username: "282312",
    password: "57384229",
    class: "M"
  },
  {
    id: 23,
    name: "Paula Rasero",
    username: "328389",
    password: "55629300",
    class: "M"
  },
  {
    id: 24,
    name: "Lara Rodriguez",
    username: "335547",
    password: "54859001",
    class: "M"
  },
  {
    id: 25,
    name: "Ezequiel Rodriguez",
    username: "263265",
    password: "53583344",
    class: "M"
  },
  {
    id: 26,
    name: "Valentino Sapone",
    username: "322519",
    password: "53397082",
    class: "M"
  },
  {
    id: 27,
    name: "María Victoria Suárez",
    username: "270965",
    password: "50030413",
    class: "M"
  },
  {
    id: 28,
    name: "María José Valiño",
    username: "302559",
    password: "55662912",
    class: "M"
  },
  {
    id: 29,
    name: "Franco Zaffaroni",
    username: "256866",
    password: "52334887",
    class: "M"
  },
  {
    id: 30,
    name: "Giuliana Bagnasco",
    username: "305584",
    password: "54284387",
    class: "L"
  },
  {
    id: 31,
    name: "Mateo Baico",
    username: "282839",
    password: "55624902",
    class: "L"
  },
  {
    id: 32,
    name: "Magella Roselyn Bassi",
    username: "325878",
    password: "58631906",
    class: "L"
  },
  {
    id: 33,
    name: "Virginia Bevilacqua",
    username: "160353",
    password: "46731287",
    class: "L"
  },
  {
    id: 34,
    name: "Juan Ignacio Bustamante",
    username: "302421",
    password: "56005937",
    class: "L"
  },
  {
    id: 35,
    name: "Maria Pia Cea",
    username: "282539",
    password: "54910356",
    class: "L"
  },
  {
    id: 36,
    name: "Bruno Conde",
    username: "309014",
    password: "55370347",
    class: "L"
  },
  {
    id: 37,
    name: "Avril Estefan",
    username: "309258",
    password: "51618490",
    class: "L"
  },
  {
    id: 38,
    name: "Juan Martin Esteves",
    username: "306302",
    password: "49631749",
    class: "L"
  },
  {
    id: 39,
    name: "Josefina Garcia",
    username: "303028",
    password: "55041697",
    class: "L"
  },
  {
    id: 40,
    name: "Victoria Gilvarg",
    username: "323241",
    password: "56594140",
    class: "L"
  },
  {
    id: 41,
    name: "Ivan Gonzalez",
    username: "329320",
    password: "56378594",
    class: "L"
  },
  {
    id: 42,
    name: "Milena Gonzalez",
    username: "299834",
    password: "55672551",
    class: "L"
  },
  {
    id: 43,
    name: "Francisco Guillen",
    username: "274677",
    password: "52011623",
    class: "L"
  },
  {
    id: 44,
    name: "Camila Guzzo",
    username: "342444",
    password: "55277252",
    class: "L"
  },
  {
    id: 45,
    name: "Ismael Ibarburu",
    username: "323492",
    password: "53300435",
    class: "L"
  },
  {
    id: 46,
    name: "Lola Martínez",
    username: "286772",
    password: "54833415",
    class: "L"
  },
  {
    id: 47,
    name: "Eugenia Núñez",
    username: "303477",
    password: "55517896",
    class: "L"
  },
  {
    id: 48,
    name: "Juan Francisco Otheguy",
    username: "221436",
    password: "54181305",
    class: "M"
  },
  {
    id: 49,
    name: "Serena Pardo",
    username: "302838",
    password: "55862659",
    class: "L"
  },
  {
    id: 50,
    name: "Gerónimo Revetria",
    username: "287959",
    password: "55593797",
    class: "L"
  },
  {
    id: 51,
    name: "Milena Rodriguez",
    username: "330607",
    password: "55344899",
    class: "L"
  },
  {
    id: 52,
    name: "Gloria Sanguinetti",
    username: "256441",
    password: "52131938",
    class: "L"
  },
  {
    id: 53,
    name: "Florencia Scaltritti",
    username: "326522",
    password: "56075223",
    class: "L"
  },
  {
    id: 54,
    name: "Facundo Alejandro Spotti",
    username: "330006",
    password: "56074081",
    class: "L"
  },
  {
    id: 55,
    name: "Agustina Zilli",
    username: "329488",
    password: "56154526",
    class: "L"
  },
  {
    id: 99,
    name: "Pablo Carvalho (Test)",
    username: "269215",
    password: "51449148",
    class: "L",
    isTestUser: true
  }
]

// Clave para almacenar el usuario en localStorage
const USER_STORAGE_KEY = "alumnos_js_user"

// Función para iniciar sesión
export async function loginUser(username: string, password: string): Promise<boolean> {
  const user = dummyUsers.find((u) => u.username === username && u.password === password)

  if (user) {
    try {
      // Verificar si ya existe un progreso para este usuario usando el módulo data
      const { getUserProgress } = await import("./data")
      
      // Esto creará automáticamente el progreso si no existe
      getUserProgress(user.id)

      // Almacenar usuario en localStorage (sin la contraseña)
      const { password: _, ...userWithoutPassword } = user
      console.log(_.length)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword))
      return true
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error)
      
      // Aún así permitimos el inicio de sesión
      const { password: _, ...userWithoutPassword } = user
      console.log(_.length)
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword))
      return true
    }
  }

  return false
}

// Función para cerrar sesión
export function logoutUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
}

// Función para obtener el usuario actual
export function getUser(): User | null {
  if (typeof window === "undefined") {
    return null
  }

  const userJson = localStorage.getItem(USER_STORAGE_KEY)
  if (!userJson) {
    return null
  }

  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error("Error parsing user from localStorage", error)
    return null
  }
}

