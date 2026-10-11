import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/Input'
import { businessCategories, parishes } from '@/config/site'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

const schema = z
  .object({
    name: z.string().min(2, 'Enter your full name'),
    email: z.string().email('Enter a valid business email'),
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string(),
    businessName: z.string().min(2, 'Enter a business name'),
    category: z.string().min(1, 'Select a category'),
    parish: z.string().min(1, 'Select a parish'),
    terms: z.boolean().refine((value) => value, { message: 'Accept the terms to continue' }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const authenticated = useDemoStore((state) => state.authenticated)
  const registerDemo = useDemoStore((state) => state.registerDemo)
  const pushToast = useToastStore((state) => state.push)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      category: businessCategories[0],
      parish: parishes[7],
    },
  })

  if (authenticated) return <Navigate to="/onboarding" replace />

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    registerDemo({
      name: values.name,
      email: values.email,
      businessName: values.businessName,
    })
    pushToast({
      title: 'Demo account created',
      description: 'Continue onboarding to set up your first listing. Nothing was sent to a server.',
      tone: 'success',
    })
    navigate('/onboarding', {
      state: {
        businessName: values.businessName,
        category: values.category,
        parish: values.parish,
      },
    })
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ocean">Create account</h2>
      <p className="mt-2 text-sm text-muted">Frontend-only registration for the business owner demo.</p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Full name" error={errors.name?.message}>
          <Input {...register('name')} />
        </Field>
        <Field label="Business email" error={errors.email?.message}>
          <Input type="email" {...register('email')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" {...register('password')} />
          </Field>
          <Field label="Confirm password" error={errors.confirmPassword?.message}>
            <Input type="password" {...register('confirmPassword')} />
          </Field>
        </div>
        <Field label="Business name" error={errors.businessName?.message}>
          <Input {...register('businessName')} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business category" error={errors.category?.message}>
            <Select {...register('category')}>
              {businessCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Parish" error={errors.parish?.message}>
            <Select {...register('parish')}>
              {parishes.map((parish) => (
                <option key={parish} value={parish}>
                  {parish}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <label className="flex items-start gap-2 text-sm text-ink">
          <input type="checkbox" className="mt-1" {...register('terms')} />
          <span>I accept the demo terms and understand this is not a production account.</span>
        </label>
        {errors.terms ? <p className="text-xs text-coral">{errors.terms.message}</p> : null}
        <Button type="submit" disabled={isSubmitting}>
          Continue to onboarding
        </Button>
      </form>
      <p className="mt-6 text-sm text-muted">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-turquoise hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
