import { useState } from 'react'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/shared/lib/cn'

interface SearchableSelectOption {
  value: string | number
  label: string
}

export interface SearchableSelectProps {
  options:            SearchableSelectOption[]
  value?:             string | number
  onChange:           (value: string | number | undefined) => void
  placeholder?:       string
  searchPlaceholder?: string
  isLoading?:         boolean
  disabled?:          boolean
  label?:             string | undefined    // ← agregar | undefined
  error?:             string | undefined    // ← agregar | undefined
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Seleccionar...',
  searchPlaceholder = 'Buscar...',
  isLoading = false,
  disabled = false,
  label,
  error,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find((o) => o.value === value)

  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          disabled={disabled || isLoading}
          aria-expanded={open}
          render={
            <button
              type="button"
              className={cn(
                "inline-flex h-8 w-full items-center justify-between rounded-lg border border-border bg-background px-2.5 text-sm font-normal",
                "hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
                error && "border-destructive",
              )}
            />
          }
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando...
            </span>
          ) : (
            <span className={cn(!selectedOption && "text-muted-foreground")}>
              {selectedOption?.label ?? placeholder}
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>

        <PopoverContent className="w-(--anchor-width) p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>Sin resultados</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={String(option.value)}
                    value={String(option.value)}
                    onSelect={() => {
                      onChange(option.value === value ? undefined : option.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        option.value === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}