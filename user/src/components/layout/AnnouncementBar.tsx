import { X } from 'lucide-react'
import { useState } from 'react'
import { siteConfig } from '@/config/site'
import { readStorage, storageKeys, writeStorage } from '@/lib/storage'

export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() =>
    readStorage(storageKeys.announcementDismissed, false),
  )

  if (dismissed) return null

  return (
    <div className="bg-ocean text-sand">
      <div className="container-shell section-padding flex items-center justify-between gap-4 py-2 text-sm">
        <p className="text-center sm:text-left">{siteConfig.announcement}</p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          className="rounded-full p-1 hover:bg-white/10"
          onClick={() => {
            writeStorage(storageKeys.announcementDismissed, true)
            setDismissed(true)
          }}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
