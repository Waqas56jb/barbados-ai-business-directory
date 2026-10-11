import { FlaskConical, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { useBusinessStore } from '@/store/businessStore'

const DEMO_BUSINESS_ID = 'biz-001'

export function DemoControls() {
  const [open, setOpen] = useState(false)
  const [locationLabel, setLocationLabel] = useState('Holetown')
  const [parish, setParish] = useState('St. James')
  const [parishSlug, setParishSlug] = useState('st-james')
  const updateDemoBusiness = useBusinessStore((state) => state.updateDemoBusiness)
  const resetDemoBusinesses = useBusinessStore((state) => state.resetDemoBusinesses)
  const business = useBusinessStore((state) =>
    state.getBusinesses().find((item) => item.id === DEMO_BUSINESS_ID),
  )

  return (
    <div className="fixed left-5 bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+4.5rem))] z-40 sm:bottom-8 sm:left-8">
      {open ? (
        <div className="mb-2 w-[min(360px,calc(100vw-2.5rem))] rounded-3xl border border-coral/40 bg-white p-4 shadow-soft">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-coral">
                <FlaskConical className="h-4 w-4" />
                Demo only
              </p>
              <p className="mt-2 text-sm text-muted">
                Update Coral Breeze Catamaran Tours in the shared mock dataset. Directory pages and the chatbot read the same source. Changes persist in browser storage only.
              </p>
            </div>
            <button type="button" className="text-sm text-muted hover:text-ocean" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>

          <p className="rounded-2xl bg-sand px-3 py-2 text-xs text-ink">
            Current location: <strong>{business?.locationLabel}</strong>, {business?.parish}
          </p>

          <div className="mt-3 space-y-3">
            <label className="block text-xs font-medium text-ocean">
              New location label
              <input
                value={locationLabel}
                onChange={(event) => setLocationLabel(event.target.value)}
                className="mt-1 w-full rounded-xl border border-ocean/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-medium text-ocean">
              Parish
              <input
                value={parish}
                onChange={(event) => setParish(event.target.value)}
                className="mt-1 w-full rounded-xl border border-ocean/15 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-medium text-ocean">
              Parish slug
              <input
                value={parishSlug}
                onChange={(event) => setParishSlug(event.target.value)}
                className="mt-1 w-full rounded-xl border border-ocean/15 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-coral px-4 py-2 text-sm font-medium text-white hover:bg-coral/90"
              onClick={() =>
                updateDemoBusiness(DEMO_BUSINESS_ID, {
                  locationLabel,
                  parish,
                  parishSlug,
                  address: `${locationLabel} Demo Pier`,
                })
              }
            >
              Apply listing update
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-ocean/15 px-4 py-2 text-sm text-ocean hover:bg-sand"
              onClick={() => resetDemoBusinesses()}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset demo data
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-coral/50 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-coral shadow-card hover:bg-sand"
        >
          <FlaskConical className="h-4 w-4" />
          Demo tools
        </button>
      )}
    </div>
  )
}
