import React from 'react'
import { twMerge } from 'tailwind-merge'

const variants = {
  primary: 'bg-orange-600 hover:bg-orange-700 text-white',
  secondary: 'bg-green-600 hover:bg-green-700 text-white',
  outline: 'border-2 border-orange-600 text-orange-600 hover:bg-orange-50',
  ghost: 'hover:bg-orange-50 text-gray-700',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
}

export function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  icon,
  ...props 
}) {
  return (
    <button
      className={twMerge(
        'rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {children}
    </button>
  )
}