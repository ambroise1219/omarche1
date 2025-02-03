import React from 'react'
import { twMerge } from 'tailwind-merge'

const variants = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-orange-100 text-orange-800',
  secondary: 'bg-green-100 text-green-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
}

export function Badge({ 
  children, 
  className, 
  variant = 'default',
  ...props 
}) {
  return (
    <span
      className={twMerge(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
