import { HomeClient } from "@/components/home-client"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Alumnos.js - Plataforma de Aprendizaje JavaScript",
  description: "Aprende JavaScript de manera interactiva con ejercicios prácticos y evaluación en tiempo real",
  openGraph: {
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@alumnosjs"
  }
}

export default function Home() {
  return <HomeClient />
}

