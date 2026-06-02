import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'
import { Label } from '@/components/ui/label'

interface FormFieldProps {
  label: string
  // ✅ exactOptionalPropertyTypes: declarar | undefined explícito.
  // Sin esto, pasar error={errors.x?.message} (string | undefined) falla en
  // ChangePasswordForm, PerfilForm, AsignarClaimDialog, AsignarUEDialog y más.
  error?: string | undefined
  required?: boolean | undefined
  children: ReactNode
  className?: string | undefined
  htmlFor?: string | undefined
}

export function FormField({ label, error, required, children, className, htmlFor }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-destructive")}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
