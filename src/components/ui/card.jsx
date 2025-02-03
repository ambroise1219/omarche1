import * as React from "react"
import { twMerge } from 'tailwind-merge'

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge(
      'bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200',
      className
    )}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('p-6 border-b border-gray-100', className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('p-6', className)}
    {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge('p-6 border-t border-gray-100', className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={twMerge("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
