import { Link } from '@tanstack/react-router'
import {
  SEMAFORO_MAP,
  SEMAFORO_HEX,
  ESTADO_PRESUPUESTO_LABEL,
  ESTADO_PROYECTO_LABEL,
} from '../../model/constants'
import type { Proyecto } from '../../model/types'

interface Props {
  proyecto: Proyecto
  onAnular: (p: Proyecto) => void
}

export function ProyectoSemaforoCard({ proyecto, onAnular }: Props) {
  const color = SEMAFORO_MAP[proyecto.estadoPresupuesto]
  const hex   = SEMAFORO_HEX[color]

  return (
    <div className="relative rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Semáforo lateral */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-lg"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />

      <div className="pl-3">
        {/* Encabezado */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              to="/proyectos/$id"
              params={{ id: String(proyecto.id) }}
              className="text-sm font-semibold text-foreground hover:underline line-clamp-2"
            >
              {proyecto.nombre}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">{proyecto.codigo}</p>
          </div>

          {/* Acciones inline */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/proyectos/$id"
              params={{ id: String(proyecto.id) }}
              className="rounded p-1.5 text-muted-foreground hover:bg-muted"
              title="Ver detalle"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
            </Link>
            {proyecto.estado === 'ACTIVO' && (
              <button
                type="button"
                className="rounded p-1.5 text-destructive hover:bg-destructive/10"
                title="Anular proyecto"
                onClick={(e) => { e.stopPropagation(); onAnular(proyecto) }}
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>{proyecto.unidadEjecutoraNombre}</span>
          <span>Vigencia {proyecto.vigenciaActiva}</span>
          {proyecto.tipoProyectoNombre && <span>{proyecto.tipoProyectoNombre}</span>}
        </div>

        {/* Badges de estado */}
        <div className="mt-2 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${hex}18`, color: hex }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: hex }}
            />
            {ESTADO_PRESUPUESTO_LABEL[proyecto.estadoPresupuesto]}
          </span>

          {proyecto.estado !== 'ACTIVO' && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {ESTADO_PROYECTO_LABEL[proyecto.estado]}
            </span>
          )}
        </div>

        {/* Valor total */}
        <p className="mt-2 text-right text-sm font-semibold">
          {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(proyecto.valorTotal)}
        </p>
      </div>
    </div>
  )
}
