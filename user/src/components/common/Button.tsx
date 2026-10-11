import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'coral' | 'white'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-turquoise text-white hover:bg-turquoise-dark',
  secondary: 'bg-ocean text-white hover:bg-ocean/90',
  ghost: 'bg-transparent text-ocean hover:bg-sand',
  coral: 'bg-coral text-white hover:bg-coral/90',
  white: 'bg-white text-ocean hover:bg-ivory',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquoise disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
