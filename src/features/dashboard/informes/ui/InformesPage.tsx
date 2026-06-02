import { useState } from "react"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { useQueryClient, useQuery } from "@tanstack/react-query"
import { dashboardKeys } from "../../model/queryKeys"
import { useSolicitarInforme } from "../solicitar/hook"
import { useEstadoInforme } from "../consultar/hook"
import { SolicitarInformeDialog } from "../solicitar/ui/SolicitarInformeDialog"
import type { EstadoInforme, InformeSolicitado } from "../../model/types"

const ESTADO_BADGE: Record<EstadoInforme, string> = {
  PENDIENTE:   "bg-gray-100 text-gray-600",
  PROCESANDO:  "bg-blue-100 text-blue-700 animate-pulse",
  LISTO:       "bg-green-100 text-green-700",
  ERROR:       "bg-red-100 text-red-700",
}

const TIPO_LABELS: Record<string, string> = {
  EJECUCION_PRESUPUESTAL: "Ejecucion Presupuestal",
  FLUJO_CAJA:             "Flujo de Caja",
  NOMINA:                 "Nomina",
  CONCILIACION_NOMINA:    "Conciliacion Nomina",
  SAR:                    "SAR / Viaticos",
  CARTERA:                "Cartera",
  CHIP:                   "CHIP",
  AUDITORIA:              "Auditoria",
}

function InformeRow({ informe }: { informe: InformeSolicitado }) {
  // Polling individual mientras no sea estado final
  useEstadoInforme(
    ["LISTO", "ERROR"].includes(informe.estado) ? "" : informe.id,
  )

  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-3 text-sm">{TIPO_LABELS[informe.tipo] ?? informe.tipo}</td>
      <td className="px-4 py-3 text-sm">{informe.vigencia}</td>
      <td className="px-4 py-3 text-sm">{informe.fechaSolicitud}</td>
      <td className="px-4 py-3">
        <span className={`rounded px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[informe.estado]}`}>
          {informe.estado}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        {informe.estado === "LISTO" && informe.urlDescarga ? (
          <a
            href={informe.urlDescarga}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Descargar
          </a>
        ) : informe.estado === "ERROR" ? (
          <span className="text-xs text-red-600">{informe.mensajeError ?? "Error"}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  )
}

export function InformesPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  // Los informes se almacenan en estado local de la sesión
  const [informes, setInformes] = useState<InformeSolicitado[]>([])

  function handleSolicitado(id: string) {
    // Se agregará con polling hasta resolución
    setInformes((prev) => [
      {
        id,
        tipo: "EJECUCION_PRESUPUESTAL",
        tipoNombre: "",
        estado: "PENDIENTE",
        vigencia: new Date().getFullYear(),
        solicitadoPor: "",
        fechaSolicitud: new Date().toISOString().slice(0, 10),
        fechaCompletado: null,
        urlDescarga: null,
        mensajeError: null,
        parametros: {},
      },
      ...prev,
    ])
  }

  return (
    <div className="space-y-5">
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-foreground font-medium">Informes</span>
      </nav>

      <PageHeader
        title="Informes"
        description="Genera y descarga informes del sistema financiero"
        actions={
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Solicitar informe
          </button>
        }
      />

      {informes.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed p-12 text-center text-sm text-muted-foreground">
          No hay informes solicitados en esta sesion. Haga clic en "Solicitar informe" para comenzar.
        </div>
      ) : (
        <div className="rounded-lg border bg-background shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Vigencia</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Solicitado</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Estado</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase">Descarga</th>
              </tr>
            </thead>
            <tbody>
              {informes.map((inf) => (
                <InformeRow key={inf.id} informe={inf} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SolicitarInformeDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSolicitado={handleSolicitado}
      />
    </div>
  )
}
