import { useState } from 'react'

const FALLBACK =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#103B46"/>
      <rect y="520" width="1200" height="280" fill="#18A7A1"/>
      <circle cx="980" cy="160" r="70" fill="#F5EBDD"/>
      <text x="60" y="120" fill="#FFFCF7" font-family="Georgia, serif" font-size="48">Barbados Explorer</text>
      <text x="60" y="180" fill="#F5EBDD" font-family="Arial, sans-serif" font-size="24">Image unavailable</text>
    </svg>`,
  )

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
}

export function SafeImage({ src, alt, className = '', loading = 'lazy' }: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => {
        if (currentSrc !== FALLBACK) setCurrentSrc(FALLBACK)
      }}
    />
  )
}
