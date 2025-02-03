import React from 'react'
import { twMerge } from 'tailwind-merge'

export function Input({ className, ...props }) {
  return (
    <input
      className={twMerge(
        'w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow duration-200',
        'placeholder:text-gray-400',
        className
      )}
      {...props}
    />
  )
}
