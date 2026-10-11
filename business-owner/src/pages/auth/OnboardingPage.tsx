import { useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { amenityOptions, businessCategories, languageOptions, parishes } from '@/config/site'
import { defaultOpeningHours } from '@/data/helpers'
import { slugify } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { Business } from '@/types'

const steps = [
  'Owner information',
  'Business identity',
  'Category & location',
  'Services & amenities',
  'Contact & website',
  'Photographs',
  'Preview listing',
  'Submit for review',
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const authenticated = useDemoStore((state) => state.authenticated)
  const onboardingComplete = useDemoStore((state) => state.onboardingComplete)
  const owner = useDemoStore((state) => state.owner)
  const updateOwner = useDemoStore((state) => state.updateOwner)
  const completeOnboarding = useDemoStore((state) => state.completeOnboarding)
  const pushToast = useToastStore((state) => state.push)
  const bootstrap = (location.state as { businessName?: string; category?: string; parish?: string } | null) ?? {}

  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    ownerName: owner.name,
    ownerPhone: owner.phone ?? '',
    businessName: bootstrap.businessName ?? 'New Barbados Experience',
    shortDescription: '',
    description: '',
    category: bootstrap.category ?? businessCategories[0],
    parish: bootstrap.parish ?? parishes[0],
    locationLabel: '',
    serviceName: '',
    serviceDescription: '',
    amenities: ['Family-friendly'] as string[],
    email: owner.email,
    phone: '',
    website: '',
    coverImage:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
  })

  const draftBusiness = useMemo<Business>(() => {
    const id = 'biz-onboarding-draft'
    const now = new Date().toISOString()
    return {
      id,
      ownerId: owner.id,
      name: form.businessName,
      slug: slugify(form.businessName),
      category: form.category,
      secondaryCategories: [],
      shortDescription: form.shortDescription || 'Short description pending.',
      description: form.description || 'Full description pending.',
      parish: form.parish,
      locationLabel: form.locationLabel || form.parish,
      email: form.email || undefined,
      phone: form.phone || undefined,
      website: form.website || undefined,
      services: form.serviceName
        ? [
            {
              id: 'svc-onboarding',
              name: form.serviceName,
              description: form.serviceDescription || 'Service details pending.',
              businessIds: [id],
              familyFriendly: form.amenities.includes('Family-friendly'),
            },
          ]
        : [],
      openingHours: defaultOpeningHours(),
      amenities: form.amenities,
      languages: ['English'],
      socialLinks: form.website ? [{ label: 'Website', url: form.website }] : [],
      gallery: [
        {
          id: 'img-onboarding',
          url: form.coverImage,
          alt: `${form.businessName} cover image`,
          isCover: true,
          order: 0,
        },
      ],
      coverImage: form.coverImage,
      status: 'pending_review',
      completionPercentage: 0,
      createdAt: now,
      updatedAt: now,
    }
  }, [form, owner.id])

  if (!authenticated) return <Navigate to="/register" replace />
  if (onboardingComplete) return <Navigate to="/dashboard" replace />

  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }))

  const canNext = () => {
    if (step === 0) return form.ownerName.trim().length > 1
    if (step === 1) return form.businessName.trim().length > 1 && form.shortDescription.trim().length > 5
    if (step === 2) return Boolean(form.category && form.parish)
    if (step === 3) return form.serviceName.trim().length > 1
    if (step === 4) return Boolean(form.email || form.phone || form.website)
    if (step === 5) return Boolean(form.coverImage)
    return true
  }

  const submit = () => {
    updateOwner({ name: form.ownerName, phone: form.ownerPhone || undefined })
    completeOnboarding(draftBusiness)
    pushToast({
      title: 'Submitted for review (demo)',
      description: 'Your listing was saved locally as Pending Review. No server submission occurred.',
      tone: 'success',
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-ivory">
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-turquoise">Onboarding</p>
        <h1 className="mt-2 font-display text-4xl text-ocean">Set up your Barbados listing</h1>
        <p className="mt-2 text-sm text-muted">Step {step + 1} of {steps.length}: {steps[step]}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-sand">
          <div className="h-full rounded-full bg-turquoise transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-white p-6 shadow-card">
        {step === 0 && (
          <div className="space-y-4">
            <Field label="Owner name">
              <Input value={form.ownerName} onChange={(e) => update({ ownerName: e.target.value })} />
            </Field>
            <Field label="Phone (optional)">
              <Input value={form.ownerPhone} onChange={(e) => update({ ownerPhone: e.target.value })} />
            </Field>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <Field label="Business name">
              <Input value={form.businessName} onChange={(e) => update({ businessName: e.target.value })} />
            </Field>
            <Field label="Short description" hint={`${form.shortDescription.length}/160`}>
              <Input
                maxLength={160}
                value={form.shortDescription}
                onChange={(e) => update({ shortDescription: e.target.value })}
              />
            </Field>
            <Field label="Full description">
              <Textarea rows={5} value={form.description} onChange={(e) => update({ description: e.target.value })} />
            </Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select value={form.category} onChange={(e) => update({ category: e.target.value })}>
                {businessCategories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </Select>
            </Field>
            <Field label="Parish">
              <Select value={form.parish} onChange={(e) => update({ parish: e.target.value })}>
                {parishes.map((parish) => (
                  <option key={parish}>{parish}</option>
                ))}
              </Select>
            </Field>
            <Field label="Town or area">
              <Input value={form.locationLabel} onChange={(e) => update({ locationLabel: e.target.value })} />
            </Field>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <Field label="Primary service name">
              <Input value={form.serviceName} onChange={(e) => update({ serviceName: e.target.value })} />
            </Field>
            <Field label="Service description">
              <Textarea rows={4} value={form.serviceDescription} onChange={(e) => update({ serviceDescription: e.target.value })} />
            </Field>
            <div>
              <p className="mb-2 text-sm font-medium text-ocean">Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenityOptions.map((amenity) => {
                  const active = form.amenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      type="button"
                      className={`rounded-full px-3 py-1.5 text-xs ${active ? 'bg-turquoise text-white' : 'bg-sand text-ocean'}`}
                      onClick={() =>
                        update({
                          amenities: active
                            ? form.amenities.filter((item) => item !== amenity)
                            : [...form.amenities, amenity],
                        })
                      }
                    >
                      {amenity}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-muted">Languages default to {languageOptions[0]} and can be edited later.</p>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <Field label="Public business email">
              <Input type="email" value={form.email} onChange={(e) => update({ email: e.target.value })} />
            </Field>
            <Field label="Business telephone">
              <Input value={form.phone} onChange={(e) => update({ phone: e.target.value })} />
            </Field>
            <Field label="Website URL">
              <Input value={form.website} onChange={(e) => update({ website: e.target.value })} />
            </Field>
          </div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            <Field label="Cover image URL" hint="Demo uses a remote image URL. Real uploads come later via the server.">
              <Input value={form.coverImage} onChange={(e) => update({ coverImage: e.target.value })} />
            </Field>
            <img src={form.coverImage} alt="Cover preview" className="aspect-[16/9] w-full rounded-2xl object-cover" />
          </div>
        )}
        {step === 6 && (
          <div className="space-y-3">
            <img src={draftBusiness.coverImage} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" />
            <h2 className="font-display text-2xl text-ocean">{draftBusiness.name}</h2>
            <p className="text-sm text-muted">
              {draftBusiness.locationLabel}, {draftBusiness.parish} · {draftBusiness.category}
            </p>
            <p className="text-sm text-ink">{draftBusiness.shortDescription}</p>
            <p className="text-sm text-ink">{draftBusiness.description}</p>
            <p className="text-sm text-muted">
              Services: {draftBusiness.services.map((service) => service.name).join(', ') || 'None yet'}
            </p>
          </div>
        )}
        {step === 7 && (
          <div className="space-y-3 text-sm text-ink">
            <p>
              You are ready to submit <strong>{draftBusiness.name}</strong> for review in this demo.
            </p>
            <p className="text-muted">
              Submission updates local demo state to Pending Review only. No moderation ticket is created on a server.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap justify-between gap-3">
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button disabled={!canNext()} onClick={() => setStep((value) => value + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={submit}>Submit for review</Button>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}
