import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div>
      <h2 className="font-display text-3xl text-ocean">Forgot password</h2>
      <p className="mt-2 text-sm text-muted">
        Request a demo reset link. No email is delivered in this frontend prototype.
      </p>
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 300))
          setSent(true)
        })}
        noValidate
      >
        <Field label="Account email" error={errors.email?.message}>
          <Input type="email" {...register('email')} />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Send reset link
        </Button>
      </form>
      {sent ? (
        <p className="mt-4 rounded-xl bg-sand px-3 py-2 text-sm text-ocean" role="status">
          Demo confirmation: a reset flow was simulated. Continue to the reset password screen to preview the next step.
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link to="/reset-password" className="text-turquoise hover:underline">
          Go to reset password
        </Link>
        <Link to="/login" className="text-muted hover:text-ocean">
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
