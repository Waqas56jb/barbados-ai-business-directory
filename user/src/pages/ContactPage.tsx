import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Breadcrumbs } from '@/components/common/Breadcrumbs'
import { Button } from '@/components/common/Button'
import { SectionHeading } from '@/components/common/SectionHeading'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Please enter a message of at least 10 characters'),
})

type FormValues = z.infer<typeof schema>

const fieldClass =
  'w-full rounded-2xl border border-ocean/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-turquoise'

export function ContactPage() {
  useDocumentMeta({
    title: 'Contact',
    description: 'Contact form demo for Barbados Explorer. Messages are validated locally only.',
    canonicalPath: '/contact',
  })

  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (_values: FormValues) => {
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    setSubmitted(true)
    reset()
  }

  return (
    <div className="container-shell section-padding py-10 sm:py-14">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} />
      <SectionHeading
        title="Contact"
        description="This is a client-side demo form. Successful submissions are validated locally and are not delivered to an inbox."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 max-w-2xl space-y-5 rounded-[2rem] border border-ocean/10 bg-white p-6 shadow-card sm:p-8"
        noValidate
      >
        <Field label="Name" error={errors.name?.message}>
          <input className={fieldClass} {...register('name')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className={fieldClass} {...register('email')} />
        </Field>
        <Field label="Subject" error={errors.subject?.message}>
          <input className={fieldClass} {...register('subject')} />
        </Field>
        <Field label="Message" error={errors.message?.message}>
          <textarea rows={5} className={fieldClass} {...register('message')} />
        </Field>
        <Button type="submit" disabled={isSubmitting}>
          Send message
        </Button>
        {submitted ? (
          <p className="text-sm text-turquoise" role="status">
            Demo confirmation: your message passed local validation. No email was delivered.
          </p>
        ) : null}
      </form>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-ocean">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-coral">{error}</span> : null}
    </label>
  )
}
