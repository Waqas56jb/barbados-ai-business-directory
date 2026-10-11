import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Input'

const schema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div>
      <h2 className="font-display text-3xl text-ocean">Reset password</h2>
      <p className="mt-2 text-sm text-muted">Demo password reset UI only. No credentials are stored securely.</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 300))
          setDone(true)
        })}
        noValidate
      >
        <Field label="New password" error={errors.password?.message}>
          <Input type="password" {...register('password')} />
        </Field>
        <Field label="Confirm new password" error={errors.confirmPassword?.message}>
          <Input type="password" {...register('confirmPassword')} />
        </Field>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Update password
        </Button>
      </form>
      {done ? (
        <p className="mt-4 rounded-xl bg-sand px-3 py-2 text-sm text-ocean" role="status">
          Demo success: password update simulated. You can return to sign in.
        </p>
      ) : null}
      <p className="mt-6 text-sm">
        <Link to="/login" className="text-turquoise hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  )
}
