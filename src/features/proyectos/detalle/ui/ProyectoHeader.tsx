// src/features/proyectos/detalle/ui/ProyectoHeader.tsx
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
  onModificar: () => void
  onAnular: () => void
}

const formatCOP = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(v)

export function ProyectoHeader({ proyecto, onModificar, onAnular }: Props) {
  const color = SEMAFORO_MAP[proyecto.estadoPresupuesto]
  const hex   = SEMAFORO_HEX[color]

  return (
    <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
      {/* Franja de color superior */}
      <div className="h-1 w-full" style={{ backgroundColor: hex }} />

      <div className="p-5">
        {/* Breadcrumb */}
        <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:underline">Inicio</Link>
          <span>/</span>
          <Link to="/proyectos" className="hover:underline">Proyectos especiales</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{proyecto.nombre}</span>
        </nav>

        {/* Fila principal: nombre + valor total + acciones */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          {/* Izquierda: semáforo + nombre + badges */}
          <div className="flex gap-3 min-w-0">
            <div
              className="mt-1.5 h-10 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: hex }}
            />
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight leading-tight truncate">
                {proyecto.nombre}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {proyecto.codigo} · {proyecto.unidadEjecutoraNombre}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${hex}22`, color: hex }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: hex }} />
                  {ESTADO_PRESUPUESTO_LABEL[proyecto.estadoPresupuesto]}
                </span>

                {proyecto.estado !== 'ACTIVO' && (
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {ESTADO_PROYECTO_LABEL[proyecto.estado]}
                  </span>
                )}

                {proyecto.tipoProyectoNombre && (
                  <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {proyecto.tipoProyectoNombre}
                  </span>
                )}

                <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                  Vigencia {proyecto.vigenciaActiva}
                </span>

                {proyecto.programaAcademicoNombre && (
                  <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {proyecto.programaAcademicoNombre}
                  </span>
                )}
              </div>

              {proyecto.fechaInicio && proyecto.fechaFin && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {proyecto.fechaInicio} — {proyecto.fechaFin}
                </p>
              )}
            </div>
          </div>

          {/* Derecha: valor total + acciones */}
          <div className="flex shrink-0 flex-col items-end gap-3">
            {/* Valor total del proyecto (monto aprobado/contractual) */}
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Valor total del proyecto</p>
              <p className="text-2xl font-bold tracking-tight tabular-nums">
                {formatCOP(proyecto.valorTotal)}
              </p>
            </div>

            {/* Acciones */}
            {proyecto.estado === 'ACTIVO' && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onModificar}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  Editar
                </button>
                <button
                  type="button"
                  onClick={onAnular}
                  className="rounded-md border border-destructive/40 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Anular
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
