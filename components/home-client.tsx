"use client"

import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { getUser } from "@/lib/auth"

export function HomeClient() {
  // Si el usuario ya está autenticado, redirigir al dashboard
  const user = getUser()
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-blue-600">Alumnos.js</h1>
          <p className="mt-2 text-lg text-gray-600">Aprende JavaScript de forma interactiva</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

