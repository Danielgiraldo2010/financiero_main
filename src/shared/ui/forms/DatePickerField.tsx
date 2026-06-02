import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { formatDateISO } from '@/shared/lib/date'

export interface DatePickerFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value:    Date | string | undefined
  onChange: (value: string) => void
  label?:   string | undefined
  error?:   string | undefined
}

export function DatePickerField({ value, onChange, label, error, ...props }: DatePickerFieldProps) {
  const isoValue =
    value instanceof Date
      ? formatDateISO(value)
      : typeof value === 'string'
        ? value
        : ''

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Input
        type="date"
        value={isoValue}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'border-destructive' : ''}
        {...props}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}