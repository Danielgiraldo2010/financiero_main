import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectOption {
  value: string
  label: string
}

export interface SelectFieldProps {
  options:      SelectOption[]
  value?:       string | undefined
  onChange:     (value: string) => void
  placeholder?: string | undefined
  disabled?:    boolean | undefined
  label?:       string | undefined
  error?:       string | undefined
}

export function SelectField({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  disabled,
  label,
  error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Select
        value={value}
        onValueChange={(v) => { if (v !== null) onChange(v) }}
        disabled={disabled}
      >
        <SelectTrigger className={error ? 'border-destructive' : ''}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}