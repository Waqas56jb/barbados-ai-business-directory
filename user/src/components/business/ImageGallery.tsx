import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SafeImage } from '@/components/common/SafeImage'

interface ImageGalleryProps {
  images: string[]
  altBase: string
}

export function ImageGallery({ images, altBase }: ImageGalleryProps) {
  const gallery = images.length > 0 ? images : ['']
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
      if (event.key === 'ArrowRight') setActive((value) => (value + 1) % gallery.length)
      if (event.key === 'ArrowLeft') setActive((value) => (value - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, gallery.length])

  return (
    <div>
      <button
        type="button"
        className="block w-full overflow-hidden rounded-[2rem]"
        onClick={() => setLightboxOpen(true)}
        aria-label={`Open image gallery for ${altBase}`}
      >
        <SafeImage
          src={gallery[active]}
          alt={`${altBase} primary image`}
          className="aspect-[16/10] w-full object-cover"
          loading="eager"
        />
      </button>
      {gallery.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {gallery.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`overflow-hidden rounded-2xl border-2 ${
                active === index ? 'border-turquoise' : 'border-transparent'
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <SafeImage src={image} alt={`${altBase} thumbnail ${index + 1}`} className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ocean/80 p-4" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0" aria-label="Close lightbox" onClick={() => setLightboxOpen(false)} />
          <div className="relative z-10 w-full max-w-5xl">
            <button
              type="button"
              className="absolute top-3 right-3 z-20 rounded-full bg-ocean/80 p-2 text-white hover:bg-ocean sm:top-4 sm:right-4"
              aria-label="Close lightbox"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SafeImage
              src={gallery[active]}
              alt={`${altBase} enlarged image`}
              className="max-h-[85dvh] w-full rounded-3xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
