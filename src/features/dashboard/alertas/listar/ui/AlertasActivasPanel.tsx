import { useState } from "react"
import { useAlertasActivas } from "../hook"
import { useDesactivarAlerta } from "../../desactivar/hook"
import { useGenerarAlertas } from "../../generar/hook"
import type { AlertaDashboard, NivelAlerta } from "../../../model/types"
import { AlertaDetailDialog } from "../../detalle/ui/AlertaDetailDialog"
import { usePermissions } from "@/shared/hooks/usePermissions"
import { ROLES } from "@/shared/lib/constants"
import { AlertTriangle, RotateCw, ShieldCheck, X } from "lucide-react"

const NIVEL_CLASES: Record<NivelAlerta, string> = {
  CRITICA: "border-red-200 bg-red-50 text-red-800 before:bg-red-600",
  ALTA: "border-orange-200 bg-orange-50 text-orange-800 before:bg-orange-500",
  MEDIA: "border-yellow-200 bg-yellow-50 text-yellow-800 before:bg-yellow-400",
  BAJA: "border-blue-200 bg-blue-50 text-blue-800 before:bg-blue-500",
  INFO: "border-gray-200 bg-gray-50 text-gray-700 before:bg-gray-400",
}

const NIVEL_LABEL: Record<NivelAlerta, string> = {
  CRITICA: "CRITICA",
  ALTA: "ALTA",
  MEDIA: "MEDIA",
  BAJA: "BAJA",
  INFO: "INFO",
}

interface Props {
  maxItems?: number
}

export function AlertasActivasPanel({ maxItems = 5 }: Props) {
  const { data, isLoading } = useAlertasActivas()

  const { mutate: desactivar, isPending: desactivando } =
    useDesactivarAlerta()

  const { mutate: generar, isPending: generando } =
    useGenerarAlertas()

  const { hasRole } = usePermissions()

  const [detalle, setDetalle] = useState<AlertaDashboard | null>(null)

  const puedeGenerar = hasRole([
    ROLES.FINANCIERO,
    ROLES.FINANCIERO_CENTRAL,
    ROLES.ADMIN_CENTRAL,
    ROLES.SUPERADMIN,
  ])

  // El endpoint retorna PagedResult<AlertaDashboard>
  const alertas = Array.isArray(data?.items)
    ? data.items
    : []

  const visibles = alertas.slice(0, maxItems)

  return (
    <div className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#dbe8f4] bg-[linear-gradient(90deg,rgba(237,244,251,0.92),rgba(255,255,255,1))] px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-[15px] border border-[#004b82]/18 bg-[#edf4fb] text-[#004b82] shadow-[0_10px_22px_rgba(0,75,130,0.10)]">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-base font-bold tracking-[-0.02em] text-[#004b82]">
            Alertas activas
          </span>

          {alertas.length > 0 && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-[0_8px_18px_rgba(239,68,68,0.20)]">
              {alertas.length}
            </span>
          )}
        </div>

        {puedeGenerar && (
          <button
            type="button"
            disabled={generando}
            onClick={() => generar(undefined)}
            className="inline-flex h-9 items-center gap-1.5 rounded-[12px] border border-[#004b82] bg-white px-3 text-xs font-bold text-[#004b82] shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:bg-[#edf4fb] hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)] disabled:opacity-50"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            {generando
              ? "Generando..."
              : "Generar alertas"}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="p-5 text-sm font-medium text-muted-foreground">
          Cargando...
        </div>
      )}

      {!isLoading && visibles.length === 0 && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf4fb] text-[#004b82]">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-[#1f2937]">Sin alertas activas</p>
            <p className="mt-1 text-xs text-muted-foreground">El tablero no registra riesgos pendientes.</p>
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-2 p-4">
        {visibles.map((a) => (
          <li
            key={a.id}
            className={`relative flex items-start justify-between gap-3 overflow-hidden rounded-[16px] border p-3 pl-4 shadow-[0_4px_12px_rgba(15,23,42,0.08)] transition-all duration-200 ease-out hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)] before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r-full ${NIVEL_CLASES[a.nivelAlerta]}`}
          >
            <button
              type="button"
              className="flex-1 text-left"
              onClick={() => setDetalle(a)}
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.14em]">
                {NIVEL_LABEL[a.nivelAlerta]}
              </span>

              <p className="mt-1 text-sm font-bold leading-5">
                {a.titulo}
              </p>

              {a.proyectoNombre && (
                <p className="text-xs opacity-70">
                  {a.proyectoNombre}
                </p>
              )}
            </button>

            <button
              type="button"
              disabled={desactivando}
              onClick={() => desactivar(a.id)}
              className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/80 text-current shadow-sm transition-colors hover:bg-white disabled:opacity-40"
              aria-label="Cerrar alerta"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      {alertas.length > maxItems && (
        <p className="border-t border-[#dbe8f4] px-5 py-3 text-xs font-semibold text-muted-foreground">
          +{alertas.length - maxItems} alertas mas
        </p>
      )}

      {detalle && (
        <AlertaDetailDialog
          alerta={detalle}
          onClose={() => setDetalle(null)}
        />
      )}
    </div>
  )
}
