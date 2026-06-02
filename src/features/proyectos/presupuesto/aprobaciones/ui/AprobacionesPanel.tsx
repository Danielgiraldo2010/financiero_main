// aprobaciones/ui/AprobacionesPanel.tsx
// Panel de aprobaciones: estado actual + siguiente acción disponible según rol.
//
// 03b-I3: botones filtrados por useCanAprobarDecano / useCanAprobarPlaneacion.
// FE3-I5: Consolidar siempre pasa por ConsolidarDialog.

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  useCanAprobarDecano,
  useCanAprobarPlaneacion,
  useCanConsolidar,
} from "@/features/proyectos/shared/permissions"
import {
  useRevisar,
  useSolicitarAprobacion,
  useAprobarDecano,
  useAprobarPlaneacion,
  useConsolidar,
} from "../../aprobaciones/hook"
import { ConsolidarDialog } from "./ConsolidarDialog"
import type { EstadoPresupuesto } from "../../model/types"

const ESTADO_CONFIG: Record<
  EstadoPresupuesto,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  SIN_PRESUPUESTO:     { label: "Sin presupuesto",      variant: "destructive" },
  BORRADOR:            { label: "Borrador",              variant: "secondary" },
  REVISADO:            { label: "Revisado",              variant: "secondary" },
  APROBADO_DECANO:     { label: "Aprobado (Decano)",     variant: "default" },
  APROBADO_PLANEACION: { label: "Aprobado (Planeación)", variant: "default" },
  CONSOLIDADO:         { label: "Consolidado",           variant: "outline" },
  EN_EJECUCION:        { label: "En ejecución",          variant: "outline" },
}

interface AprobacionesPanelProps {
  proyectoId: number
  vigencia: number
  estadoPresupuesto: EstadoPresupuesto
  siguientePaso?: string   // opcional — exactOptionalPropertyTypes safe
}

export function AprobacionesPanel({
  proyectoId,
  vigencia,
  estadoPresupuesto,
  siguientePaso,
}: AprobacionesPanelProps) {
  const [consolidarOpen, setConsolidarOpen] = useState(false)

  const canAprobarDecano    = useCanAprobarDecano()
  const canAprobarPlaneacion = useCanAprobarPlaneacion()
  const canConsolidar       = useCanConsolidar()

  const revisar        = useRevisar(proyectoId)
  const solicitarAprob = useSolicitarAprobacion(proyectoId)
  const aprobarDec     = useAprobarDecano(proyectoId)
  const aprobarPlan    = useAprobarPlaneacion(proyectoId)
  const consolidar     = useConsolidar(proyectoId)

  const payload = { vigencia }

  const estadoCfg = ESTADO_CONFIG[estadoPresupuesto] ?? {
    label: estadoPresupuesto,
    variant: "secondary" as const,
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Estado del presupuesto
        </CardTitle>
        <div className="flex items-center gap-3">
          <Badge variant={estadoCfg.variant}>{estadoCfg.label}</Badge>
          {siguientePaso !== undefined && (
            <span className="text-xs text-muted-foreground">{siguientePaso}</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-wrap gap-2">
        {estadoPresupuesto === "BORRADOR" && (
          <Button
            size="sm"
            onClick={() => revisar.mutate(payload)}
            disabled={revisar.isPending}
          >
            {revisar.isPending ? "Marcando..." : "Marcar como Revisado"}
          </Button>
        )}

        {estadoPresupuesto === "REVISADO" && (
          <Button
            size="sm"
            onClick={() => solicitarAprob.mutate(payload)}
            disabled={solicitarAprob.isPending}
          >
            {solicitarAprob.isPending ? "Solicitando..." : "Solicitar Aprobación"}
          </Button>
        )}

        {estadoPresupuesto === "APROBADO_DECANO" && canAprobarDecano && (
          <Button
            size="sm"
            onClick={() => aprobarDec.mutate(payload)}
            disabled={aprobarDec.isPending}
          >
            {aprobarDec.isPending ? "Aprobando..." : "Aprobar (Decano)"}
          </Button>
        )}

        {estadoPresupuesto === "APROBADO_PLANEACION" && canAprobarPlaneacion && (
          <Button
            size="sm"
            onClick={() => aprobarPlan.mutate(payload)}
            disabled={aprobarPlan.isPending}
          >
            {aprobarPlan.isPending ? "Aprobando..." : "Aprobar (Planeación)"}
          </Button>
        )}

        {estadoPresupuesto === "APROBADO_PLANEACION" && canConsolidar && (
          <>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setConsolidarOpen(true)}
              disabled={consolidar.isPending}
            >
              Consolidar al presupuesto UE
            </Button>
            <ConsolidarDialog
              open={consolidarOpen}
              onOpenChange={setConsolidarOpen}
              onConfirm={() => {
                consolidar.mutate({ vigencia })
                setConsolidarOpen(false)
              }}
              isPending={consolidar.isPending}
            />
          </>
        )}

        {estadoPresupuesto === "EN_EJECUCION" && (
          <p className="text-sm text-muted-foreground">
            El presupuesto está en ejecución. No hay acciones disponibles.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
