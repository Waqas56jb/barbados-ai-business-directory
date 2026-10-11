import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Textarea } from '@/components/ui/Input'
import { PageHeader } from '@/components/ui/PageHeader'
import { businessCategories, parishes } from '@/config/site'
import { slugify } from '@/lib/formatters'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

const schema = z.object({
  name: z.string().min(2, 'Enter a business name'),
  category: z.string().min(1),
  parish: z.string().min(1),
  locationLabel: z.string().min(1, 'Enter a town or area'),
  shortDescription: z.string().min(10, 'Add a short description'),
  description: z.string().min(20, 'Add a fuller description'),
})

type FormValues = z.infer<typeof schema>

export function BusinessNewPage() {
  const navigate = useNavigate()
  const createBusiness = useDemoStore((state) => state.createBusiness)
  const pushToast = useToastStore((state) => state.push)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: businessCategories[0],
      parish: parishes[0],
    },
  })

  const name = watch('name')

  return (
    <div>
      <PageHeader
        title="Add a Listing"
        description="Create a new draft business profile in local demo state."
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Businesses', href: '/businesses' },
          { label: 'New' },
        ]}
      />
      <form
        className="max-w-3xl space-y-4 rounded-2xl border border-border bg-white p-6 shadow-card"
        onSubmit={handleSubmit((values) => {
          const business = createBusiness({
            ...values,
            slug: slugify(values.name),
          })
          pushToast({ title: 'Draft listing created', tone: 'success' })
          navigate(`/businesses/${business.id}/edit`)
        })}
        noValidate
      >
        <Field label="Business name" error={errors.name?.message}>
          <Input {...register('name')} />
        </Field>
        <p className="text-xs text-muted">Suggested slug: {slugify(name || 'new-business')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" error={errors.category?.message}>
            <Select {...register('category')}>
              {businessCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </Select>
          </Field>
          <Field label="Parish" error={errors.parish?.message}>
            <Select {...register('parish')}>
              {parishes.map((parish) => (
                <option key={parish}>{parish}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Town or area" error={errors.locationLabel?.message}>
          <Input {...register('locationLabel')} />
        </Field>
        <Field label="Short description" error={errors.shortDescription?.message}>
          <Input maxLength={160} {...register('shortDescription')} />
        </Field>
        <Field label="Full description" error={errors.description?.message}>
          <Textarea rows={5} {...register('description')} />
        </Field>
        <Button type="submit" disabled={isSubmitting}>
          Create draft & continue editing
        </Button>
      </form>
    </div>
  )
}
