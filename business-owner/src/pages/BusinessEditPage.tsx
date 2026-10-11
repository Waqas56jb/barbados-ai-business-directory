import { useEffect, useMemo, useState } from 'react'
import { Link, useBlocker, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { amenityOptions, businessCategories, languageOptions, parishes } from '@/config/site'
import { defaultOpeningHours } from '@/data/helpers'
import { slugify } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { Business, OpeningHoursDay } from '@/types'

const sections = [
  { id: 'identity', label: 'Business Identity' },
  { id: 'location', label: 'Location' },
  { id: 'contact', label: 'Contact Information' },
  { id: 'services', label: 'Services & Experiences' },
  { id: 'hours', label: 'Opening Hours' },
  { id: 'amenities', label: 'Amenities & Features' },
  { id: 'languages', label: 'Languages' },
  { id: 'social', label: 'Social Links' },
]

export function BusinessEditPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const source = useDemoStore((state) => state.businesses.find((item) => item.id === id))
  const upsertBusiness = useDemoStore((state) => state.upsertBusiness)
  const setBusinessStatus = useDemoStore((state) => state.setBusinessStatus)
  const pushToast = useToastStore((state) => state.push)
  const [draft, setDraft] = useState<Business | null>(null)
  const [dirty, setDirty] = useState(false)
  const [activeSection, setActiveSection] = useState('identity')

  useEffect(() => {
    if (source) {
      setDraft(structuredClone(source))
      setDirty(false)
    }
  }, [source])

  const blocker = useBlocker(dirty)
  const days = useMemo(() => draft?.openingHours?.length ? draft.openingHours : defaultOpeningHours(), [draft])

  if (!source || !draft) {
    return (
      <EmptyState
        title="Business not found"
        action={<Link to="/businesses"><Button>Back</Button></Link>}
      />
    )
  }

  const update = (patch: Partial<Business>) => {
    setDraft((current) => (current ? { ...current, ...patch } : current))
    setDirty(true)
  }

  const saveDraft = () => {
    upsertBusiness({ ...draft, status: draft.status === 'published' ? 'published' : 'draft' })
    setDirty(false)
    pushToast({ title: 'Draft saved locally', description: 'Changes are stored in browser demo state only.', tone: 'success' })
  }

  const submitReview = () => {
    upsertBusiness(draft)
    setBusinessStatus(draft.id, 'pending_review')
    setDirty(false)
    pushToast({ title: 'Submitted for review (demo)', tone: 'success' })
    navigate(`/businesses/${draft.id}`)
  }

  return (
    <div>
      <PageHeader
        title={`Edit ${draft.name}`}
        description={dirty ? 'You have unsaved changes.' : 'All sections update the shared demo business record.'}
        breadcrumbs={[
          { label: 'Businesses', href: '/businesses' },
          { label: draft.name, href: `/businesses/${draft.id}` },
          { label: 'Edit' },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
            <Button variant="ghost" onClick={() => navigate(`/businesses/${draft.id}`)}>Preview Listing</Button>
            <Button onClick={submitReview}>Submit for Review</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-white p-3 shadow-card">
          <nav className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`block rounded-xl px-3 py-2 text-sm ${
                  activeSection === section.id ? 'bg-sand text-ocean' : 'text-muted hover:bg-sand/50'
                }`}
              >
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="space-y-6">
          <section id="identity" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Business Identity</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Business name">
                <Input
                  value={draft.name}
                  onChange={(e) => update({ name: e.target.value, slug: slugify(e.target.value) })}
                />
              </Field>
              <Field label="URL slug">
                <Input value={draft.slug} onChange={(e) => update({ slug: slugify(e.target.value) })} />
              </Field>
              <Field label="Business category">
                <Select value={draft.category} onChange={(e) => update({ category: e.target.value })}>
                  {businessCategories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Short description" hint={`${draft.shortDescription.length}/160`}>
                <Input
                  maxLength={160}
                  value={draft.shortDescription}
                  onChange={(e) => update({ shortDescription: e.target.value })}
                />
              </Field>
              <Field label="Full description">
                <Textarea rows={5} value={draft.description} onChange={(e) => update({ description: e.target.value })} />
              </Field>
              <Field label="Established year (optional)">
                <Input
                  type="number"
                  value={draft.establishedYear ?? ''}
                  onChange={(e) =>
                    update({ establishedYear: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </Field>
              <Field label="Logo URL (optional)">
                <Input value={draft.logoUrl ?? ''} onChange={(e) => update({ logoUrl: e.target.value || undefined })} />
              </Field>
              <div className="rounded-xl bg-sand/50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Live preview</p>
                <p className="mt-2 font-display text-xl text-ocean">{draft.name}</p>
                <p className="mt-1 text-sm text-muted">{draft.shortDescription}</p>
              </div>
            </div>
          </section>

          <section id="location" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Location</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Parish">
                <Select value={draft.parish} onChange={(e) => update({ parish: e.target.value })}>
                  {parishes.map((parish) => (
                    <option key={parish}>{parish}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Town or area">
                <Input value={draft.locationLabel} onChange={(e) => update({ locationLabel: e.target.value })} />
              </Field>
              <Field label="Street address (optional)">
                <Input value={draft.address ?? ''} onChange={(e) => update({ address: e.target.value || undefined })} />
              </Field>
              <Field label="General location description">
                <Input
                  value={draft.locationDescription ?? ''}
                  onChange={(e) => update({ locationDescription: e.target.value || undefined })}
                />
              </Field>
            </div>
            <div className="mt-4 rounded-xl border border-dashed border-border bg-sand/40 px-4 py-8 text-center text-sm text-muted">
              Map preview placeholder — GPS pins are not invented in this demo.
            </div>
          </section>

          <section id="contact" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Contact Information</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Public business email">
                <Input type="email" value={draft.email ?? ''} onChange={(e) => update({ email: e.target.value || undefined })} />
              </Field>
              <Field label="Business telephone">
                <Input value={draft.phone ?? ''} onChange={(e) => update({ phone: e.target.value || undefined })} />
              </Field>
              <Field label="Website URL">
                <Input value={draft.website ?? ''} onChange={(e) => update({ website: e.target.value || undefined })} />
              </Field>
              <Field label="WhatsApp (optional)">
                <Input value={draft.whatsapp ?? ''} onChange={(e) => update({ whatsapp: e.target.value || undefined })} />
              </Field>
              <Field label="Preferred contact method">
                <Select
                  value={draft.preferredContactMethod ?? 'email'}
                  onChange={(e) =>
                    update({ preferredContactMethod: e.target.value as Business['preferredContactMethod'] })
                  }
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="website">Website</option>
                </Select>
              </Field>
            </div>
          </section>

          <section id="services" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-ocean">Services & Experiences</h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  update({
                    services: [
                      ...draft.services,
                      {
                        id: `svc-${crypto.randomUUID().slice(0, 8)}`,
                        name: 'New service',
                        description: 'Describe this service',
                        businessIds: [draft.id],
                      },
                    ],
                  })
                }
              >
                Add service
              </Button>
            </div>
            <div className="mt-4 space-y-4">
              {draft.services.map((service, index) => (
                <div key={service.id} className="rounded-xl border border-border p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Service name">
                      <Input
                        value={service.name}
                        onChange={(e) => {
                          const services = [...draft.services]
                          services[index] = { ...service, name: e.target.value }
                          update({ services })
                        }}
                      />
                    </Field>
                    <Field label="Price label (optional)">
                      <Input
                        value={service.priceLabel ?? ''}
                        onChange={(e) => {
                          const services = [...draft.services]
                          services[index] = { ...service, priceLabel: e.target.value || undefined }
                          update({ services })
                        }}
                      />
                    </Field>
                    <Field label="Description">
                      <Textarea
                        rows={3}
                        value={service.description}
                        onChange={(e) => {
                          const services = [...draft.services]
                          services[index] = { ...service, description: e.target.value }
                          update({ services })
                        }}
                      />
                    </Field>
                    <Field label="Duration (optional)">
                      <Input
                        value={service.duration ?? ''}
                        onChange={(e) => {
                          const services = [...draft.services]
                          services[index] = { ...service, duration: e.target.value || undefined }
                          update({ services })
                        }}
                      />
                    </Field>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={Boolean(service.familyFriendly)}
                      onChange={(e) => {
                        const services = [...draft.services]
                        services[index] = { ...service, familyFriendly: e.target.checked }
                        update({ services })
                      }}
                    />
                    Family-friendly
                  </label>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => update({ services: draft.services.filter((item) => item.id !== service.id) })}
                  >
                    Remove service
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <section id="hours" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Opening Hours</h2>
            <div className="mt-4 space-y-3">
              {days.map((day, index) => (
                <div key={day.day} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[120px_140px_1fr]">
                  <p className="text-sm font-medium text-ocean">{day.day}</p>
                  <Select
                    value={day.status}
                    onChange={(e) => {
                      const openingHours = [...days] as OpeningHoursDay[]
                      openingHours[index] = {
                        ...day,
                        status: e.target.value as OpeningHoursDay['status'],
                        intervals:
                          e.target.value === 'open'
                            ? day.intervals.length
                              ? day.intervals
                              : [{ open: '09:00', close: '17:00' }]
                            : [],
                      }
                      update({ openingHours })
                    }}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="unspecified">Hours not specified</option>
                  </Select>
                  {day.status === 'open' ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <Input
                        type="time"
                        value={day.intervals[0]?.open ?? '09:00'}
                        onChange={(e) => {
                          const openingHours = [...days]
                          openingHours[index] = {
                            ...day,
                            intervals: [{ open: e.target.value, close: day.intervals[0]?.close ?? '17:00' }],
                          }
                          update({ openingHours })
                        }}
                      />
                      <span className="text-xs text-muted">to</span>
                      <Input
                        type="time"
                        value={day.intervals[0]?.close ?? '17:00'}
                        onChange={(e) => {
                          const openingHours = [...days]
                          openingHours[index] = {
                            ...day,
                            intervals: [{ open: day.intervals[0]?.open ?? '09:00', close: e.target.value }],
                          }
                          update({ openingHours })
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted">{day.status === 'closed' ? 'Closed' : 'Not specified'}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section id="amenities" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Amenities & Features</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {amenityOptions.map((amenity) => {
                const active = draft.amenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-sm ${active ? 'bg-turquoise text-white' : 'bg-sand text-ocean'}`}
                    onClick={() =>
                      update({
                        amenities: active
                          ? draft.amenities.filter((item) => item !== amenity)
                          : [...draft.amenities, amenity],
                      })
                    }
                  >
                    {amenity}
                  </button>
                )
              })}
            </div>
          </section>

          <section id="languages" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Languages</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {languageOptions.map((language) => {
                const active = draft.languages.includes(language)
                return (
                  <button
                    key={language}
                    type="button"
                    className={`rounded-full px-3 py-1.5 text-sm ${active ? 'bg-ocean text-white' : 'bg-sand text-ocean'}`}
                    onClick={() =>
                      update({
                        languages: active
                          ? draft.languages.filter((item) => item !== language)
                          : [...draft.languages, language],
                      })
                    }
                  >
                    {language}
                  </button>
                )
              })}
            </div>
          </section>

          <section id="social" className="rounded-2xl border border-border bg-white p-5 shadow-card">
            <h2 className="font-display text-2xl text-ocean">Social Links</h2>
            <div className="mt-4 space-y-3">
              {(draft.socialLinks.length ? draft.socialLinks : [{ label: 'Website', url: '' }]).map((link, index) => (
                <div key={`${link.label}-${index}`} className="grid gap-3 sm:grid-cols-2">
                  <Field label="Label">
                    <Input
                      value={link.label}
                      onChange={(e) => {
                        const socialLinks = [...(draft.socialLinks.length ? draft.socialLinks : [{ label: 'Website', url: '' }])]
                        socialLinks[index] = { ...link, label: e.target.value }
                        update({ socialLinks })
                      }}
                    />
                  </Field>
                  <Field label="URL">
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const socialLinks = [...(draft.socialLinks.length ? draft.socialLinks : [{ label: 'Website', url: '' }])]
                        socialLinks[index] = { ...link, url: e.target.value }
                        update({ socialLinks })
                      }}
                    />
                  </Field>
                </div>
              ))}
              {draft.socialLinks.filter((link) => link.url).map((link) => (
                <a key={link.url} href={link.url} className="block text-sm text-turquoise hover:underline" target="_blank" rel="noreferrer">
                  Preview: {link.label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>

      <ConfirmDialog
        open={blocker.state === 'blocked'}
        title="Unsaved changes"
        message="You have unsaved edits. Leave this page and discard local form changes?"
        confirmLabel="Leave page"
        danger
        onClose={() => blocker.reset?.()}
        onConfirm={() => blocker.proceed?.()}
      />
    </div>
  )
}
