// Tabs: Líneas | Aprobaciones | Timeline | Documentos
// FE5-I1: botón Agregar línea solo visible en BORRADOR
// FE5-I5: DocumentosPanel con entidadTipo="MODIFICACION"
import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button }   from '@/components/ui/button'
import { Badge }    from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DocumentosPanel } from '@/features/documentos/entity/ui/DocumentosPanel'
import { useModificacion, useTimeline } from '../hook'
import { useLineasModificacion } from '../../lineas/hook'
import { LineasModificacionTable } from './LineasModificacionTable'
import { AprobacionesModificacionPanel } from './AprobacionesModificacionPanel'
import { AgregarLineaModificacionDialog } from '../../lineas/ui/AgregarLineaModificacionDialog'
import {
  ESTADO_MODIFICACION_LABELS,
  ESTADO_MODIFICACION_VARIANTS,
  ESTADO_MODIFICACION_DOT,   // ← agregar
} from '../../model/constants'

export function ModificacionDetailPage() {
  const { id }   = useParams({ from: '/_authenticated/modificaciones/$id' })
  const modId    = Number(id)
  const navigate = useNavigate()
  const [agregarOpen, setAgregarOpen] = useState(false)

  const { data: mod,      isLoading } = useModificacion(modId)
  const { data: lineas = []         } = useLineasModificacion(modId)
  const { data: timeline = []       } = useTimeline(modId)

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }
  if (!mod) return null

  // FE5-I1: agregar líneas solo en PENDIENTE
  const puedeAgregarLinea = mod.estado === 'PENDIENTE'

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Cabecera */}
      <div className="flex items-start gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void navigate({ to: '/modificaciones' })}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Volver
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold truncate">{mod.numeroSolicitud}</h1>
            <Badge variant={ESTADO_MODIFICACION_VARIANTS[mod.estado]}>
              {ESTADO_MODIFICACION_LABELS[mod.estado]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {mod.tipoModificacion.replace(/_/g, ' ')} · Vigencia {mod.vigencia} · {mod.unidadSolicitante}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lineas">
        <TabsList>
          <TabsTrigger value="lineas">Líneas ({lineas.length})</TabsTrigger>
          <TabsTrigger value="aprobaciones">Aprobaciones</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* ── Líneas ────────────────────────────────────── */}
        <TabsContent value="lineas" className="space-y-3 pt-4">
          {puedeAgregarLinea && (
            <div className="flex justify-end">
              <Button size="sm" onClick={() => setAgregarOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar traslado
              </Button>
            </div>
          )}
          <LineasModificacionTable lineas={lineas} />
          <AgregarLineaModificacionDialog
            modId={modId}
            open={agregarOpen}
            onClose={() => setAgregarOpen(false)}
          />
        </TabsContent>

        {/* ── Aprobaciones ──────────────────────────────── */}
        <TabsContent value="aprobaciones" className="pt-4">
          <AprobacionesModificacionPanel modificacion={mod} />
        </TabsContent>

        {/* ── Timeline ──────────────────────────────────── */}
        <TabsContent value="timeline" className="pt-4">
          <div className="relative pl-6 border-l-2 border-muted space-y-6">
            {timeline.length === 0 && (
              <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
            )}
            {timeline.map((ev) => (
              <div key={ev.id} className="relative">
                <div className={`absolute -left-5.5 top-1 h-3 w-3 rounded-full border-2 border-background ${ESTADO_MODIFICACION_DOT[ev.estado]}`} />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={ESTADO_MODIFICACION_VARIANTS[ev.estado]} className="text-xs">
                      {ESTADO_MODIFICACION_LABELS[ev.estado]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{ev.fecha}</span>
                  </div>
                  <p className="text-sm font-medium">{ev.actor}</p>
                  {ev.observaciones && (
                    <p className="text-sm text-muted-foreground">{ev.observaciones}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Documentos (FE5-I5) ───────────────────────── */}
        <TabsContent value="documentos" className="pt-4">
          <DocumentosPanel entidadTipo="MODIFICACION" entidadId={modId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
