import { useCallback, useState } from "react"
import { useDebounce } from "@/shared/hooks/useDebounce"
import type { UsuariosParams } from "../../model/types"

interface UsuariosFiltersProps {
  onChange: (params: UsuariosParams) => void
}

const ROLES = [
  "SUPERADMIN",
  "ADMIN_CENTRAL",
  "FINANCIERO_CENTRAL",
  "DECANO",
  "COORDINADOR",
  "FINANCIERO",
  "CONSULTOR",
]

export function UsuariosFilters({ onChange }: UsuariosFiltersProps) {
  const [email, setEmail] = useState("")
  const [activo, setActivo] = useState<string>("")
  const [rol, setRol] = useState("")

  const debouncedEmail = useDebounce(email, 300)

  const notify = useCallback(
    (overrides: Partial<UsuariosParams>) => {
      onChange({
        email: debouncedEmail || undefined,
        activo:
          activo === "true" ? true : activo === "false" ? false : undefined,
        rol: rol || undefined,
        page: 1,
        ...overrides,
      })
    },
    [debouncedEmail, activo, rol, onChange]
  )

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar por email..."
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          notify({ email: e.target.value || undefined, page: 1 })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-64"
      />
      <select
        value={activo}
        onChange={(e) => {
          setActivo(e.target.value)
          notify({
            activo:
              e.target.value === "true"
                ? true
                : e.target.value === "false"
                  ? false
                  : undefined,
            page: 1,
          })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Todos los estados</option>
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>
      <select
        value={rol}
        onChange={(e) => {
          setRol(e.target.value)
          notify({ rol: e.target.value || undefined, page: 1 })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Todos los roles</option>
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
    </div>
  )
}
