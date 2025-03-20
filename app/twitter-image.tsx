import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Alumnos.js - Plataforma de Aprendizaje JavaScript'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom, #0f172a, #020617)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '48px',
        }}
      >
        <div 
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: '#3b82f6',
            textShadow: '0 0 25px rgba(59, 130, 246, 0.5)',
          }}
        >
          Alumnos.js
        </div>
        <div style={{ fontSize: '36px', fontWeight: 'normal', textAlign: 'center' }}>
          Plataforma de Aprendizaje JavaScript
        </div>
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '48px', 
            fontSize: '24px',
            background: 'rgba(59, 130, 246, 0.2)',
            padding: '12px 24px',
            borderRadius: '12px'
          }}
        >
          Pablo Carvalho
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 