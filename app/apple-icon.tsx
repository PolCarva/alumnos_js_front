import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 144,
          background: 'linear-gradient(to bottom right, #3b82f6, #1e40af)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '25%',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        A
      </div>
    ),
    {
      ...size,
    }
  )
} 