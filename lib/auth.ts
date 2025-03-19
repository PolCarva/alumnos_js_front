"use client"

import type { User } from "./types"

// Datos de usuario dummy para simular autenticación
const dummyUsers: User[] = [
  {
    id: 1,
    name: "Estudiante Demo",
    username: "demo",
    password: "password",
  },
  {
    id: 2,
    name: "Juan Pérez",
    username: "juan",
    password: "password",
  },
  {
    id: 3,
    name: "María García",
    username: "maria",
    password: "password",
  },
  {
    id: 4,
    name: "Carlos López",
    username: "carlos",
    password: "password",
  },
  {
    id: 5,
    name: "Ana Martínez",
    username: "ana",
    password: "password",
  },
]

// Clave para almacenar el usuario en localStorage
const USER_STORAGE_KEY = "alumnos_js_user"

// Función para iniciar sesión
export async function loginUser(username: string, password: string): Promise<boolean> {
  const user = dummyUsers.find((u) => u.username === username && u.password === password)

  if (user) {
    try {
      // Primero verificar si el usuario ya existe en la base de datos
      const checkResponse = await fetch(`http://localhost:5000/api/userProgress/${user.id}`)
      
      // Si el usuario no existe (404), entonces crearlo
      if (checkResponse.status === 404) {
        await fetch("http://localhost:5000/api/userProgress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            userName: user.name,
            totalPoints: 0,
            completedQuestions: 0,
            completedWeeks: 0,
            completedWeekIds: [],
            questionProgress: []
          }),
        }).catch(err => {
          console.error("Error al crear usuario en DB:", err)
          // No interrumpimos el flujo de inicio de sesión si falla
        })
      }

      // Almacenar usuario en localStorage (sin la contraseña)
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword))
      return true
    } catch (error) {
      console.error("Error en el proceso de inicio de sesión:", error)
      
      // Aún así permitimos el inicio de sesión aunque falle la creación en DB
      const { password: _, ...userWithoutPassword } = user
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

