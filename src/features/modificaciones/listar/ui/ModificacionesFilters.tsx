import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EstadoModificacion, ModificacionesParams } from '../../model/types'
import { ESTADO_MODIFICACION_LABELS } from '../../model/constants'

const TODOS = '__todos__'

const ESTADOS: { value: EstadoModificacion | typeof TODOS; label: string }[] = [
  { value: TODOS,                 label: 'Todos los estados'                          },
  { value: 'PENDIENTE',           label: ESTADO_MODIFICACION_LABELS.PENDIENTE          },
  { value: 'APROBADA_DECANO',     label: ESTADO_MODIFICACION_LABELS.APROBADA_DECANO    },
  { value: 'APROBADA_PLANEACION', label: ESTADO_MODIFICACION_LABELS.APROBADA_PLANEACION},
  { value: 'RECHAZADA',           label: ESTADO_MODIFICACION_LABELS.RECHAZADA          },
]

interface Props {
  params: ModificacionesParams
  onChange: (next: ModificacionesParams) => void
}

export function ModificacionesFilters({ params, onChange }: Props) {
  function handleVigenciaChange(raw: string) {
    const vigencia = raw ? Number(raw) : undefined
    onChange({
      pagina: 1,
      ...(params.tamanoPagina !== undefined && { tamanoPagina: params.tamanoPagina }),
      ...(params.estado !== undefined       && { estado: params.estado }),
      ...(vigencia !== undefined            && { vigencia }),
    })
  }

  // Fix: base-ui Select pasa (string | null) — no (string)
  function handleEstadoChange(value: string | null) {
    const estado = value === null || value === TODOS
      ? undefined
      : (value as EstadoModificacion)
    onChange({
      pagina: 1,
      ...(params.tamanoPagina !== undefined && { tamanoPagina: params.tamanoPagina }),
      ...(params.vigencia !== undefined     && { vigencia: params.vigencia }),
      ...(estado !== undefined              && { estado }),
    })
  }

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Vigencia</label>
        <Input
          type="number"
          placeholder="Ej: 2026"
          className="w-28"
          value={params.vigencia ?? ''}
          onChange={(e) => handleVigenciaChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">Estado</label>
        <Select
          value={params.estado ?? TODOS}
          onValueChange={handleEstadoChange}
        >
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            {ESTADOS.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
