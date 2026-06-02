import { useState } from "react"
import { useDebounce } from "@/shared/hooks/useDebounce"
import type { AuditoriaParams } from "../../model/types"

interface AuditoriaFiltersProps {
  onChange: (params: AuditoriaParams) => void
}

export function AuditoriaFilters({ onChange }: AuditoriaFiltersProps) {
  const [usuario, setUsuario] = useState("")
  const [resultado, setResultado] = useState("")
  const [desde, setDesde] = useState("")
  const [hasta, setHasta] = useState("")

  const debouncedUsuario = useDebounce(usuario, 300)

  const notify = (overrides: Partial<AuditoriaParams> = {}) => {
    onChange({
      usuarioNombre: debouncedUsuario || undefined,
      resultado: resultado || undefined,
      desde: desde || undefined,
      hasta: hasta || undefined,
      page: 1,
      ...overrides,
    })
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <input
        type="text"
        placeholder="Buscar por usuario..."
        value={usuario}
        onChange={(e) => {
          setUsuario(e.target.value)
          notify({ usuarioNombre: e.target.value || undefined, page: 1 })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring w-52"
      />
      <select
        value={resultado}
        onChange={(e) => {
          setResultado(e.target.value)
          notify({ resultado: e.target.value || undefined, page: 1 })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <option value="">Todos los resultados</option>
        <option value="Exito">Exito</option>
        <option value="Error">Error</option>
      </select>
      <input
        type="date"
        value={desde}
        onChange={(e) => {
          setDesde(e.target.value)
          notify({ desde: e.target.value || undefined, page: 1 })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      <input
        type="date"
        value={hasta}
        onChange={(e) => {
          setHasta(e.target.value)
          notify({ hasta: e.target.value || undefined, page: 1 })
        }}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  )
}
