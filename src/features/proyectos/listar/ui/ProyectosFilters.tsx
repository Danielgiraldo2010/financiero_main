// src/features/proyectos/listar/ui/ProyectosFilters.tsx
import { useVigencia } from '@/shared/hooks/useVigencia'
import { ESTADO_PRESUPUESTO_LABEL } from '../../model/constants'
import type { EstadoPresupuesto, ListarProyectosParams } from '../../model/types'

interface Props {
  value: ListarProyectosParams
  onChange: (p: Partial<ListarProyectosParams>) => void
}

const ESTADOS_PRESUPUESTO = Object.entries(ESTADO_PRESUPUESTO_LABEL) as [
  EstadoPresupuesto,
  string,
][]

export function ProyectosFilters({ value, onChange }: Props) {
  // ✅ useVigencia() retorna { vigenciaActiva, setVigencia } — no un número primitivo
  const { vigenciaActiva: vigenciaActual } = useVigencia()

  return (
    <div className="flex flex-wrap gap-3 items-end">
      {/* Búsqueda */}
      <div className="flex flex-col gap-1 min-w-[220px]">
        <label className="text-xs font-medium text-muted-foreground">Buscar</label>
        <input
          type="search"
          placeholder="Nombre o código..."
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={value.Q ?? ''}
          // ✅ exactOptionalPropertyTypes: spread condicional para Q
          onChange={(e) => onChange({ Q: e.target.value || undefined, Pagina: 1 })}
        />
      </div>

      {/* Vigencia */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Vigencia</label>
        <input
          type="number"
          className="h-9 w-24 rounded-md border border-input bg-background px-3 text-sm"
          min={1900}
          // ✅ vigenciaActual ahora es number (destructurado del objeto)
          max={vigenciaActual}
          value={value.Vigencia ?? vigenciaActual}
          onChange={(e) =>
            // ✅ exactOptionalPropertyTypes: Vigencia con | undefined en ListarProyectosParams
            onChange({ Vigencia: e.target.value ? Number(e.target.value) : undefined, Pagina: 1 })
          }
        />
      </div>

      {/* Estado de presupuesto */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Estado presupuesto</label>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={value.EstadoPresupuesto ?? ''}
          onChange={(e) =>
            onChange({
              EstadoPresupuesto: (e.target.value as EstadoPresupuesto) || undefined,
              Pagina: 1,
            })
          }
        >
          <option value="">Todos</option>
          {ESTADOS_PRESUPUESTO.map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Limpiar */}
      {(value.Q || value.EstadoPresupuesto || value.TipoProyectoId) && (
        <button
          type="button"
          className="h-9 px-3 rounded-md text-sm text-muted-foreground border border-input hover:bg-muted"
          // ✅ exactOptionalPropertyTypes: spread condicional para limpiar
          // No se puede pasar { Q: undefined } directamente — se omite la prop
          onClick={() => onChange({ Q: undefined, EstadoPresupuesto: undefined, TipoProyectoId: undefined, Pagina: 1 })}
        >
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
