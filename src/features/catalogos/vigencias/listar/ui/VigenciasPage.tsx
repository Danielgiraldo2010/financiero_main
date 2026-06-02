import { useState } from "react"
import { useVigencias } from "../hook"
import { useUesVigencia } from "../../habilitar-unidad/hook"
import { CrearVigenciaDialog } from "./CrearVigenciaDialog"
import { ModificarVigenciaDialog } from "../../modificar/ui/ModificarVigenciaDialog"
import { HabilitarUnidadDialog } from "../../habilitar-unidad/ui/HabilitarUnidadDialog"
import { CambiarEstadoUeDialog } from "../../cambiar-estado-ue/ui/CambiarEstadoUeDialog"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal, Pencil, ChevronDown, ChevronRight,
  Plus, ArrowRightLeft,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import type { VigenciaResponse, VigenciaUeResponse } from "../../model/types"

// ── Badges ────────────────────────────────────────────────────────────────────
const ESTADO_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  // Vigencia
  CONFIGURACION:  "secondary",
  EN_EJECUCION:   "default",
  APROBADA:       "default",
  // UE
  PENDIENTE:      "secondary",
  HABILITADA:     "outline",
  EN_ELABORACION: "outline",
  ENVIADA:        "default",
  DEVUELTA:       "destructive",
  LIQUIDADA:      "default",
  CERRADA:        "destructive",
}

const ESTADO_LABEL: Record<string, string> = {
  CONFIGURACION:  "Configuración",
  EN_EJECUCION:   "En ejecución",
  APROBADA:       "Aprobada",
  PENDIENTE:      "Pendiente",
  HABILITADA:     "Habilitada",
  EN_ELABORACION: "En elaboración",
  ENVIADA:        "Enviada",
  DEVUELTA:       "Devuelta",
  LIQUIDADA:      "Liquidada ✓",
  CERRADA:        "Cerrada",
}

function EstadoBadge({ estado }: { estado: string }) {
  return (
    <Badge variant={ESTADO_VARIANT[estado] ?? "secondary"}>
      {ESTADO_LABEL[estado] ?? estado}
    </Badge>
  )
}

// ── Acciones de UE por fila ───────────────────────────────────────────────────
function AccionesUe({
  ue,
  onCambiarEstado,
}: {
  ue: VigenciaUeResponse
  onCambiarEstado: (ue: VigenciaUeResponse) => void
}) {
  const sinTransiciones = ue.estado === 'CERRADA'
  if (sinTransiciones) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted outline-none">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Acciones</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={() => onCambiarEstado(ue)}>
          <ArrowRightLeft className="h-4 w-4" />
          Cambiar estado
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Panel de UEs habilitadas ──────────────────────────────────────────────────
function UesPanel({ vigencia }: { vigencia: VigenciaResponse }) {
  const [showHabilitar, setShowHabilitar] = useState(false)
  const [cambiandoEstado, setCambiandoEstado] = useState<VigenciaUeResponse | null>(null)
  const { data: ues = [], isLoading } = useUesVigencia(vigencia.id)

  return (
    <div className="bg-muted/30 border-t px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">
          Unidades Ejecutoras
          <span className="ml-2 text-muted-foreground font-normal">({ues.length})</span>
        </h3>
        {vigencia.estado !== 'CERRADA' && (
          <Button size="sm" variant="outline" onClick={() => setShowHabilitar(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Habilitar UE
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : ues.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No hay unidades ejecutoras habilitadas en esta vigencia.
        </p>
      ) : (
        <div className="rounded-md border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidad ejecutora</TableHead>
                <TableHead>Techo comunicado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Resolución liquidación</TableHead>
                <TableHead>Fecha liquidación</TableHead>
                <TableHead>Observaciones devolución</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {ues.map((ue) => (
                <TableRow key={ue.id}>
                  <TableCell className="font-medium">
                    {ue.unidadEjecutoraNombre}
                    {ue.permiteEjecucion && (
                      <span className="ml-2 text-xs text-green-600 font-normal">
                        ● Ejecución activa
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {ue.techoComunicado != null
                      ? new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        }).format(ue.techoComunicado)
                      : '—'}
                  </TableCell>
                  <TableCell><EstadoBadge estado={ue.estado} /></TableCell>
                  <TableCell>{ue.resolucionLiquidacion ?? '—'}</TableCell>
                  <TableCell>{ue.fechaLiquidacion ?? '—'}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                    {ue.observacionesDevolucion ?? '—'}
                  </TableCell>
                  <TableCell>
                    <AccionesUe ue={ue} onCambiarEstado={setCambiandoEstado} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showHabilitar && (
        <HabilitarUnidadDialog
          open={showHabilitar}
          vigencia={vigencia}
          uesYaHabilitadas={ues}
          onClose={() => setShowHabilitar(false)}
        />
      )}

      {cambiandoEstado && (
        <CambiarEstadoUeDialog
          open={cambiandoEstado !== null}
          vigenciaId={vigencia.id}
          ue={cambiandoEstado}
          onClose={() => setCambiandoEstado(null)}
        />
      )}
    </div>
  )
}

// ── Acciones por fila de vigencia ─────────────────────────────────────────────
function AccionesVigencia({
  vigencia,
  onEditar,
}: {
  vigencia: VigenciaResponse
  onEditar: (v: VigenciaResponse) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted outline-none">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Acciones</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onEditar(vigencia)}>
          <Pencil className="h-4 w-4" />
          Editar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export function VigenciasPage() {
  const [showCrear, setShowCrear] = useState(false)
  const [editando, setEditando]   = useState<VigenciaResponse | null>(null)
  const [expandida, setExpandida] = useState<number | null>(null)

  const { data: vigencias = [], isLoading, isError } = useVigencias()

  function toggleExpandir(id: number) {
    setExpandida((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <PageHeader
        title="Vigencias"
        description="Gestiona las vigencias fiscales y habilita las unidades ejecutoras para operar en cada una."
        actions={
          <Button onClick={() => setShowCrear(true)}>+ Nueva vigencia</Button>
        }
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>Año</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha inicio</TableHead>
              <TableHead>Fecha fin</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>N° Acuerdo</TableHead>
              <TableHead>Fecha aprobación</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  Cargando vigencias...
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-destructive">
                  Error al cargar las vigencias.
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && vigencias.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="py-8 text-center text-muted-foreground">
                  No hay vigencias registradas. Crea la primera usando el botón superior.
                </TableCell>
              </TableRow>
            )}
            {vigencias.map((v) => (
              <>
                <TableRow
                  key={v.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpandir(v.id)}
                >
                  <TableCell>
                    {expandida === v.id
                      ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="font-semibold">{v.anio}</TableCell>
                  <TableCell>{v.descripcion ?? "—"}</TableCell>
                  <TableCell>{v.fechaInicio}</TableCell>
                  <TableCell>{v.fechaFin}</TableCell>
                  <TableCell><EstadoBadge estado={v.estado} /></TableCell>
                  <TableCell>{v.numeroAcuerdoAprobacion ?? "—"}</TableCell>
                  <TableCell>{v.fechaAprobacion ?? "—"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <AccionesVigencia vigencia={v} onEditar={setEditando} />
                  </TableCell>
                </TableRow>

                {expandida === v.id && (
                  <TableRow key={`${v.id}-ues`}>
                    <TableCell colSpan={9} className="p-0">
                      <UesPanel vigencia={v} />
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <CrearVigenciaDialog
        open={showCrear}
        onClose={() => setShowCrear(false)}
      />

      {editando && (
        <ModificarVigenciaDialog
          open={editando !== null}
          vigencia={editando}
          onClose={() => setEditando(null)}
        />
      )}
    </div>
  )
}
