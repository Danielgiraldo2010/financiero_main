// CurrencyInput devuelve el número crudo al onChange — nunca el string formateado (FE0-I9).
// Usar siempre con React Hook Form via <Controller>.
import { useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Input } from '@/components/ui/input'
import { formatCOP, parseCOP } from '@/shared/lib/currency'
import { cn } from '@/shared/lib/cn'

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | undefined
  onChange: (value: number | undefined) => void
  currency?: string
}

export function CurrencyInput({
  value,
  onChange,
  currency = 'COP',
  className,
  ...props
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  // Sincronizar valor externo cuando no está en foco
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value !== undefined ? formatCOP(value) : '')
    }
  }, [value, isFocused])

  const handleFocus = () => {
    setIsFocused(true)
    // Al enfocar, mostrar solo el número para facilitar edición
    setDisplayValue(value !== undefined ? String(value) : '')
  }

  const handleBlur = () => {
    setIsFocused(false)
    const parsed = displayValue ? parseCOP(displayValue) : undefined
    onChange(isNaN(parsed as number) ? undefined : parsed)
    setDisplayValue(parsed !== undefined ? formatCOP(parsed) : '')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    // Solo permite dígitos, punto, coma y signo negativo
    if (/^-?[\d.,]*$/.test(raw)) {
      setDisplayValue(raw)
    }
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        {currency === 'COP' ? '$' : currency}
      </span>
      <Input
        {...props}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={cn('pl-8', className)}
      />
    </div>
  )
}
