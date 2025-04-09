"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { loginUser } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validaciones básicas
    if (!username.trim()) {
      setError("Por favor, ingresa tu número de alumno")
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa tu número de alumno",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!password.trim()) {
      setError("Por favor, ingresa tu cédula")
      toast({
        title: "Campo requerido",
        description: "Por favor, ingresa tu cédula",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Excepción para credenciales de administrador
    if (username === "demo" && password === "admin123") {
      try {
        const success = await loginUser(username, password)
        if (success) {
          toast({
            title: "¡Bienvenido Administrador!",
            description: "Has iniciado sesión correctamente",
            className: "bg-green-50 border-green-200",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error al iniciar sesión:", error)
        setError("No se pudo conectar al servidor")
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar al servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
      return
    }

    // Validaciones para usuarios normales
    if (password.length < 8) {
      setError("La cédula debe tener al menos 8 dígitos")
      toast({
        title: "Cédula inválida",
        description: "La cédula debe tener al menos 8 dígitos",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!/^\d+$/.test(password)) {
      setError("La cédula solo debe contener números")
      toast({
        title: "Cédula inválida",
        description: "La cédula solo debe contener números",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const success = await loginUser(username, password)

      if (success) {
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
          className: "bg-green-50 border-green-200",
        })
        router.push("/dashboard")
      } else {
        setError("El número de alumno o la cédula no son correctos")
        toast({
          title: "Credenciales incorrectas",
          description: "El número de alumno o la cédula no son correctos. Por favor, verifica e intenta nuevamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      setError("No se pudo conectar al servidor")
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar al servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciar sesión</CardTitle>
        <CardDescription className="space-y-2">
          <p>Ingresa tus credenciales para acceder a la plataforma</p>
          <div className="text-sm space-y-1">
            <p><b>Usuario:</b> Nro de alumno</p>
            <p><b>Contraseña:</b> Cédula (sin puntos ni guiones)</p>
          </div>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Número de alumno</Label>
            <Input
              id="username"
              placeholder="Ej: 269215"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(null)
              }}
              required
              className={`focus:ring-blue-500 ${error ? 'border-red-500' : ''}`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Cédula</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Ej: 55551234"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError(null)
                }}
                required
                className={`focus:ring-blue-500 ${error ? 'border-red-500' : ''} pr-10`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </CardFooter>
        <div className="text-sm text-gray-500 text-center pb-5 space-y-1">
          <p><b>Usuario de prueba:</b> demo</p>
          <p><b>Contraseña de prueba:</b> password</p>
        </div>
      </form>
    </Card>
  )
}

