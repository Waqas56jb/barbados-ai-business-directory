import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'
import { siteConfig } from '@/config/site'
import { useDemoStore } from '@/store/demoStore'
import { useToastStore } from '@/store/toastStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const authenticated = useDemoStore((state) => state.authenticated)
  const loginDemo = useDemoStore((state) => state.loginDemo)
  const pushToast = useToastStore((state) => state.push)
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: siteConfig.demoEmail, password: 'demo1234', remember: true },
  })

  if (authenticated) return <Navigate to="/dashboard" replace />

  const onSubmit = async (_values: FormValues) => {
    await new Promise((resolve) => window.setTimeout(resolve, 350))
    loginDemo()
    pushToast({
      title: 'Demo login successful',
      description: 'Loaded fictional Barbados tourism business data.',
      tone: 'success',
    })
    navigate('/dashboard')
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-ocean">Sign in</h2>
      <p className="mt-2 text-sm text-muted">Use the demo account or any validated credentials to explore the dashboard.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" autoComplete="email" {...register('email')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-muted hover:bg-sand"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-ink">
            <input type="checkbox" {...register('remember')} />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-turquoise hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Sign in
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            loginDemo()
            pushToast({ title: 'Entered with demo access', tone: 'success' })
            navigate('/dashboard')
          }}
        >
          Continue with demo account
        </Button>
      </form>

      <p className="mt-6 text-sm text-muted">
        New operator?{' '}
        <Link to="/register" className="font-medium text-turquoise hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
