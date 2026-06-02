import { useState } from "react"
import { useAlertasActivas } from "../hook"
import { useDesactivarAlerta } from "../../desactivar/hook"
import { useGenerarAlertas } from "../../generar/hook"
import type { AlertaDashboard, NivelAlerta } from "../../../model/types"
import { AlertaDetailDialog } from "../../detalle/ui/AlertaDetailDialog"
import { usePermissions } from "@/shared/hooks/usePermissions"
import { ROLES } from "@/shared/lib/constants"

const NIVEL_CLASES: Record<NivelAlerta, string> = {
  CRITICA: "border-l-4 border-red-600 bg-red-50 text-red-800",
  ALTA: "border-l-4 border-orange-500 bg-orange-50 text-orange-800",
  MEDIA: "border-l-4 border-yellow-400 bg-yellow-50 text-yellow-800",
  BAJA: "border-l-4 border-blue-400 bg-blue-50 text-blue-800",
  INFO: "border-l-4 border-gray-300 bg-gray-50 text-gray-700",
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
    <div className="rounded-lg border bg-background shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            Alertas activas
          </span>

          {alertas.length > 0 && (
            <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-medium text-white">
              {alertas.length}
            </span>
          )}
        </div>

        {puedeGenerar && (
          <button
            type="button"
            disabled={generando}
            onClick={() => generar(undefined)}
            className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted disabled:opacity-50"
          >
            {generando
              ? "Generando..."
              : "Generar alertas"}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="p-4 text-sm text-muted-foreground">
          Cargando...
        </div>
      )}

      {!isLoading && visibles.length === 0 && (
        <div className="p-4 text-sm text-muted-foreground">
          Sin alertas activas.
        </div>
      )}

      <ul className="flex flex-col gap-0">
        {visibles.map((a) => (
          <li
            key={a.id}
            className={`flex items-start justify-between gap-3 px-4 py-3 ${NIVEL_CLASES[a.nivelAlerta]}`}
          >
            <button
              type="button"
              className="flex-1 text-left"
              onClick={() => setDetalle(a)}
            >
              <span className="text-xs font-semibold uppercase">
                {NIVEL_LABEL[a.nivelAlerta]}
              </span>

              <p className="text-sm font-medium">
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
              className="mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs hover:bg-black/5 disabled:opacity-40"
            >
              Cerrar
            </button>
          </li>
        ))}
      </ul>

      {alertas.length > maxItems && (
        <p className="border-t px-4 py-2 text-xs text-muted-foreground">
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