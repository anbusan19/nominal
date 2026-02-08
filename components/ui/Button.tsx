import { clsx } from 'clsx'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'danger'
  children: ReactNode
}

export function Button({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-primary-600 text-white hover:bg-primary-700': variant === 'primary',
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-50': variant === 'outline',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
