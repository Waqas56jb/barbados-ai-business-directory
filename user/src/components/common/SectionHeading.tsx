interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  tone = 'light',
}: SectionHeadingProps) {
  const titleClass = tone === 'dark' ? 'text-white' : 'text-ocean'
  const descriptionClass = tone === 'dark' ? 'text-sand/85' : 'text-muted'

  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-turquoise">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={`font-display text-3xl font-semibold tracking-tight sm:text-4xl text-balance ${titleClass}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${descriptionClass}`}>{description}</p>
      ) : null}
    </div>
  )
}
