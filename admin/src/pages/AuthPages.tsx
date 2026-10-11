import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button, Card, Field, Input } from '@/components/ui/primitives'
import { siteConfig } from '@/config/site'
import { useAdminStore } from '@/store/adminStore'
import { useToastStore } from '@/store/toastStore'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const authenticated = useAdminStore((s) => s.authenticated)
  const loginDemo = useAdminStore((s) => s.loginDemo)
  const push = useToastStore((s) => s.push)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: siteConfig.demoEmail, password: 'demo-admin', remember: true },
  })

  if (authenticated) return <Navigate to="/dashboard" replace />

  return (
    <Card className="p-6">
      <h2 className="font-display text-2xl text-ocean">Administrator sign in</h2>
      <p className="mt-1 text-sm text-muted">Frontend-only demo authentication. No real sessions are created.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={form.handleSubmit(() => {
          loginDemo()
          push({ title: 'Signed in to demo admin', tone: 'success' })
          navigate('/dashboard')
        })}
      >
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input type="email" autoComplete="username" {...form.register('email')} />
        </Field>
        <Field label="Password" error={form.formState.errors.password?.message}>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...form.register('password')}
            />
            <button
              type="button"
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-2 text-muted hover:bg-sand"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" className="rounded border-border" {...form.register('remember')} />
          Remember me (local demo only)
        </label>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            loginDemo()
            push({ title: 'Demo administrator access granted', tone: 'success' })
            navigate('/dashboard')
          }}
        >
          Use demo administrator access
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/forgot-password" className="text-turquoise hover:underline">
          Forgot password?
        </Link>
      </p>
    </Card>
  )
}

export function ForgotPasswordPage() {
  const push = useToastStore((s) => s.push)
  return (
    <Card className="p-6">
      <h2 className="font-display text-2xl text-ocean">Forgot password</h2>
      <p className="mt-1 text-sm text-muted">
        This screen is a UI placeholder. Password resets will be handled by the future server.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          push({
            title: 'Demo notice',
            description: 'No email was sent. Real password reset requires backend auth.',
            tone: 'info',
          })
        }}
      >
        <Field label="Email">
          <Input type="email" defaultValue={siteConfig.demoEmail} />
        </Field>
        <Button type="submit" className="w-full">
          Simulate reset link
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-turquoise hover:underline">
          Back to login
        </Link>
      </p>
    </Card>
  )
}

export function ResetPasswordPage() {
  const push = useToastStore((s) => s.push)
  return (
    <Card className="p-6">
      <h2 className="font-display text-2xl text-ocean">Reset password</h2>
      <p className="mt-1 text-sm text-muted">Demo UI only — credentials are not stored or updated.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(event) => {
          event.preventDefault()
          push({ title: 'Demo password form submitted', description: 'No password was changed.', tone: 'info' })
        }}
      >
        <Field label="New password">
          <Input type="password" />
        </Field>
        <Field label="Confirm password">
          <Input type="password" />
        </Field>
        <Button type="submit" className="w-full">
          Save (demo)
        </Button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-turquoise hover:underline">
          Back to login
        </Link>
      </p>
    </Card>
  )
}

export function AccessDeniedPage() {
  return (
    <Card className="p-6 text-center">
      <h2 className="font-display text-2xl text-ocean">Access denied</h2>
      <p className="mt-2 text-sm text-muted">
        Your selected demo role cannot open this area. Switch roles from the profile menu or return to the dashboard.
      </p>
      <div className="mt-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-xl bg-turquoise px-4 py-2 text-sm font-medium text-white hover:bg-turquoise-dark"
        >
          Go to dashboard
        </Link>
      </div>
    </Card>
  )
}
