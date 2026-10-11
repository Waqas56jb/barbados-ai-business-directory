import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/common/Button'

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
})

type FormValues = z.infer<typeof schema>

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_values: FormValues) => {
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 400))
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row"
      noValidate
    >
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-full border border-ocean/15 bg-white px-5 py-3 text-sm outline-none focus:border-turquoise"
          {...register('email')}
        />
        {errors.email ? <p className="mt-2 text-sm text-coral">{errors.email.message}</p> : null}
        {status === 'success' ? (
          <p className="mt-2 text-sm text-turquoise" role="status">
            Demo success — your email was validated locally. No mailing list signup was sent.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-2 text-sm text-coral" role="alert">
            Something went wrong with the demo form. Please try again.
          </p>
        ) : null}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting}>
        Subscribe
      </Button>
    </form>
  )
}
