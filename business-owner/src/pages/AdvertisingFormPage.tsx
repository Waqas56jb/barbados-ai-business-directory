import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatusBadge } from '@/components/ui/Badge'
import { businessCategories, parishes, placementTypes } from '@/config/site'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'
import type { Promotion } from '@/types'

const schema = z
  .object({
    name: z.string().min(3, 'Enter a campaign name'),
    businessId: z.string().min(1),
    placement: z.string().min(1),
    description: z.string().min(10, 'Add a short campaign description'),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    budget: z.string().optional(),
    targetCategory: z.string().optional(),
    targetParish: z.string().optional(),
    imageUrl: z.string().optional(),
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: 'End date must be on or after the start date',
    path: ['endDate'],
  })

type FormValues = z.infer<typeof schema>

export function AdvertisingNewPage() {
  const navigate = useNavigate()
  const businesses = useDemoStore((state) => state.businesses)
  const activeBusinessId = useDemoStore((state) => state.activeBusinessId)
  const upsertPromotion = useDemoStore((state) => state.upsertPromotion)
  const pushToast = useToastStore((state) => state.push)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      businessId: activeBusinessId,
      placement: placementTypes[0].id,
      startDate: '2026-10-15',
      endDate: '2026-10-30',
      targetCategory: businessCategories[0],
      imageUrl:
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    },
  })

  const values = watch()
  const business = businesses.find((item) => item.id === values.businessId)

  return (
    <div>
      <PageHeader
        title="Create promotion"
        description="Build a demo advertising request. No payment is collected."
        breadcrumbs={[
          { label: 'Advertising', href: '/advertising' },
          { label: 'New' },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
        <form
          className="space-y-4 rounded-2xl border border-border bg-white p-5 shadow-card"
          onSubmit={handleSubmit((form) => {
            const promotion: Promotion = {
              id: `promo-${crypto.randomUUID().slice(0, 8)}`,
              businessId: form.businessId,
              name: form.name,
              placement: form.placement,
              description: form.description,
              startDate: form.startDate,
              endDate: form.endDate,
              budget: form.budget ? Number(form.budget) : undefined,
              targetCategory: form.targetCategory,
              targetParish: form.targetParish || undefined,
              imageUrl: form.imageUrl,
              status: 'pending_review',
              createdAt: new Date().toISOString(),
            }
            upsertPromotion(promotion)
            pushToast({ title: 'Promotion request created (demo)', tone: 'success' })
            navigate(`/advertising/${promotion.id}`)
          })}
          noValidate
        >
          <Field label="Campaign name" error={errors.name?.message}>
            <Input {...register('name')} />
          </Field>
          <Field label="Associated business" error={errors.businessId?.message}>
            <Select {...register('businessId')}>
              {businesses.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Placement type" error={errors.placement?.message}>
            <Select {...register('placement')}>
              {placementTypes.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Campaign description" error={errors.description?.message}>
            <Textarea rows={4} {...register('description')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Start date" error={errors.startDate?.message}>
              <Input type="date" {...register('startDate')} />
            </Field>
            <Field label="End date" error={errors.endDate?.message}>
              <Input type="date" {...register('endDate')} />
            </Field>
          </div>
          <Field label="Optional budget (USD)">
            <Input type="number" {...register('budget')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target category">
              <Select {...register('targetCategory')}>
                {businessCategories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
            <Field label="Optional target parish">
              <Select {...register('targetParish')}>
                <option value="">Any parish</option>
                {parishes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Banner / image URL">
            <Input {...register('imageUrl')} />
          </Field>
          <Button type="submit" disabled={isSubmitting}>Submit request</Button>
        </form>

        <Card className="overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-coral">Sponsored preview</p>
            <h2 className="mt-1 font-display text-xl text-ocean">Directory card preview</h2>
          </div>
          <img src={values.imageUrl} alt="" className="aspect-[16/10] w-full object-cover" />
          <div className="space-y-2 p-5">
            <span className="rounded-full bg-coral/15 px-2.5 py-1 text-xs font-semibold text-coral">Sponsored</span>
            <p className="font-display text-2xl text-ocean">{business?.name ?? 'Business'}</p>
            <p className="text-sm text-muted">{values.description || 'Campaign description preview'}</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function AdvertisingDetailPage() {
  const { id = '' } = useParams()
  const promotion = useDemoStore((state) => state.promotions.find((item) => item.id === id))
  const business = useDemoStore((state) =>
    state.businesses.find((item) => item.id === promotion?.businessId),
  )

  if (!promotion) {
    return (
      <EmptyState
        title="Promotion not found"
        action={<Link to="/advertising"><Button>Back to advertising</Button></Link>}
      />
    )
  }

  return (
    <div>
      <PageHeader
        title={promotion.name}
        description="Demo promotion request details."
        breadcrumbs={[
          { label: 'Advertising', href: '/advertising' },
          { label: promotion.name },
        ]}
      />
      <Card className="space-y-3 p-6 text-sm">
        <StatusBadge status={promotion.status} />
        <p><span className="text-muted">Business:</span> {business?.name}</p>
        <p><span className="text-muted">Placement:</span> {placementTypes.find((item) => item.id === promotion.placement)?.name}</p>
        <p><span className="text-muted">Dates:</span> {promotion.startDate} – {promotion.endDate}</p>
        <p><span className="text-muted">Description:</span> {promotion.description}</p>
        {promotion.imageUrl ? (
          <img src={promotion.imageUrl} alt="" className="mt-3 aspect-[16/9] max-w-xl rounded-2xl object-cover" />
        ) : null}
      </Card>
    </div>
  )
}
