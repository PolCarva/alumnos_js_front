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
export function loginUser(username: string, password: string): boolean {
  const user = dummyUsers.find((u) => u.username === username && u.password === password)

  if (user) {
    // Almacenar usuario en localStorage (sin la contraseña)
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userWithoutPassword))
    return true
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

