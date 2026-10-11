import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/Modal'
import { Field, Input, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { GalleryImage } from '@/types'

export function MediaPage() {
  const businesses = useDemoStore((state) => state.businesses)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const activeBusiness = businesses.find((item) => item.id === activeBusinessId) ?? businesses[0]
  const upsertBusiness = useDemoStore((state) => state.upsertBusiness)
  const addActivity = useDemoStore((state) => state.addActivity)
  const pushToast = useToastStore((state) => state.push)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [objectUrls, setObjectUrls] = useState<string[]>([])

  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [objectUrls])

  const gallery = useMemo(() => activeBusiness?.gallery ?? [], [activeBusiness])

  if (!activeBusiness) {
    return <p className="text-muted">Select a business to manage media.</p>
  }

  const updateGallery = (next: GalleryImage[], coverImage?: string) => {
    upsertBusiness({
      ...activeBusiness,
      gallery: next,
      coverImage: coverImage ?? next.find((item) => item.isCover)?.url ?? activeBusiness.coverImage,
    })
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    const file = files[0]
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      pushToast({ title: 'Unsupported file type', description: 'Use JPG, PNG, or WebP.', tone: 'error' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      pushToast({ title: 'File too large', description: 'Demo limit is 5MB.', tone: 'error' })
      return
    }

    setUploading(true)
    setProgress(15)
    const url = URL.createObjectURL(file)
    setObjectUrls((current) => [...current, url])
    for (const value of [40, 70, 100]) {
      await new Promise((resolve) => window.setTimeout(resolve, 200))
      setProgress(value)
    }

    const image: GalleryImage = {
      id: `img-${crypto.randomUUID().slice(0, 8)}`,
      url,
      alt: file.name,
      caption: '',
      isCover: gallery.length === 0,
      order: gallery.length,
    }
    updateGallery([...gallery, image])
    addActivity({
      businessId: activeBusiness.id,
      title: 'Photo added',
      description: `A demo image was added to ${activeBusiness.name}. Local object URL only.`,
      type: 'media',
    })
    setUploading(false)
    setProgress(0)
    pushToast({
      title: 'Image added (demo)',
      description: 'Preview uses a browser object URL. Nothing was uploaded to a server.',
      tone: 'success',
    })
  }

  return (
    <div>
      <PageHeader
        title="Photos & Media"
        description={`Managing media for ${activeBusiness.name}. Uploads are local demo interactions only.`}
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Media' }]}
      />

      <Card className="mb-6 p-6">
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-sand/30 px-6 py-10 text-center">
          <p className="font-medium text-ocean">Drag & drop styling · click to select</p>
          <p className="mt-2 text-sm text-muted">JPG, PNG, or WebP up to 5MB. Demo preview only.</p>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => void handleFiles(event.target.files)}
          />
        </label>
        {uploading ? (
          <div className="mt-4">
            <div className="h-2 overflow-hidden rounded-full bg-sand">
              <div className="h-full bg-turquoise transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted">Simulated upload progress {progress}%</p>
          </div>
        ) : null}
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {gallery
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <img src={image.url} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
                <div className="space-y-2 p-3">
                  {image.isCover ? (
                    <span className="rounded-full bg-turquoise/15 px-2 py-0.5 text-[11px] font-semibold text-turquoise-dark">
                      Cover image
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        updateGallery(
                          gallery.map((item) => ({ ...item, isCover: item.id === image.id })),
                          image.url,
                        )
                      }
                    >
                      Set as cover
                    </Button>
                  )}
                  <Field label="Caption">
                    <Input
                      value={image.caption ?? ''}
                      onChange={(e) =>
                        updateGallery(
                          gallery.map((item) =>
                            item.id === image.id ? { ...item, caption: e.target.value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                  <Field label="Alt text">
                    <Textarea
                      rows={2}
                      value={image.alt}
                      onChange={(e) =>
                        updateGallery(
                          gallery.map((item) =>
                            item.id === image.id ? { ...item, alt: e.target.value } : item,
                          ),
                        )
                      }
                    />
                  </Field>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const ordered = gallery.slice().sort((a, b) => a.order - b.order)
                        const index = ordered.findIndex((item) => item.id === image.id)
                        if (index <= 0) return
                        const swap = ordered[index - 1]
                        ordered[index - 1] = ordered[index]
                        ordered[index] = swap
                        updateGallery(ordered.map((item, order) => ({ ...item, order })))
                      }}
                    >
                      Move up
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setDeleteId(image.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
        </div>

        <Card>
          <CardHeader title="Public gallery preview" description="How images may appear on the visitor listing." />
          <div className="space-y-3 p-5">
            <img
              src={activeBusiness.coverImage}
              alt={`${activeBusiness.name} cover`}
              className="aspect-[16/10] w-full rounded-2xl object-cover"
            />
            <div className="grid grid-cols-3 gap-2">
              {gallery.slice(0, 3).map((image) => (
                <img key={image.id} src={image.url} alt={image.alt} className="aspect-square rounded-xl object-cover" />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete image?"
        message="This removes the image from the local demo gallery."
        confirmLabel="Delete"
        danger
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (!deleteId) return
          const next = gallery.filter((item) => item.id !== deleteId).map((item, order) => ({ ...item, order }))
          if (next[0] && !next.some((item) => item.isCover)) next[0] = { ...next[0], isCover: true }
          updateGallery(next)
          pushToast({ title: 'Image removed', tone: 'info' })
        }}
      />
    </div>
  )
}
