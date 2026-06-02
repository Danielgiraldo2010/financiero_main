import { useState } from 'react'
import { useVigencia } from '@/shared/hooks/useVigencia'
import { useEtapasAprobacion } from '../hook'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { EmptyState } from '@/shared/ui/feedback/EmptyState'
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { Button } from '@/shared/ui/primitives/button'
import { CompletarEtapaDialog } from '../../completar/ui/CompletarEtapaDialog'
import { cn } from '@/shared/lib/cn'
import { CheckCircle2, Circle, Clock } from 'lucide-react'
import type { EtapaAprobacionResponse } from '../../../model/types'

function estadoBadge(estado: string): { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' } {
  const map: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
    COMPLETADA: { label: 'Completada', variant: 'success' },
    EN_CURSO:   { label: 'En Curso',   variant: 'warning' },
    PENDIENTE:  { label: 'Pendiente',  variant: 'default' },
  }
  return map[estado] ?? { label: estado, variant: 'default' }
}

function EtapaIcon({ estado }: { estado: string }) {
  if (estado === 'COMPLETADA') return <CheckCircle2 className="h-5 w-5 text-green-600" />
  if (estado === 'EN_CURSO')   return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
  return <Circle className="h-5 w-5 text-muted-foreground" />
}

interface EtapaItemProps {
  etapa: EtapaAprobacionResponse
  isLast: boolean
  onCompletar: (etapa: EtapaAprobacionResponse) => void
}

function EtapaItem({ etapa, isLast, onCompletar }: EtapaItemProps) {
  const activa = etapa.estado === 'EN_CURSO'
  const badge = estadoBadge(etapa.estado)
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <EtapaIcon estado={etapa.estado} />
        {!isLast && (
          <div className={cn('w-px flex-1 mt-1',
            etapa.estado === 'COMPLETADA' ? 'bg-green-300' : 'bg-border')} />
        )}
      </div>
      <div className={cn('flex-1 pb-6 rounded-lg border p-4',
        activa && 'border-primary bg-primary/5')}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium">O{etapa.orden} — {etapa.etapa}</p>
            {etapa.responsable && (
              <p className="text-sm text-muted-foreground">Responsable: {etapa.responsable}</p>
            )}
            {etapa.observaciones && (
              <p className="text-sm mt-1 text-muted-foreground">{etapa.observaciones}</p>
            )}
            {etapa.urlActa && (
              <a href={etapa.urlActa} target="_blank" rel="noreferrer"
                className="text-xs text-primary underline mt-1 inline-block">
                Ver acta
              </a>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge label={badge.label} variant={badge.variant} />
            {activa && (
              <Button size="sm" onClick={() => onCompletar(etapa)}>Completar</Button>
            )}
          </div>
        </div>
        {etapa.siguienteAccion && activa && (
          <p className="text-xs text-muted-foreground mt-2 border-t pt-2">
            Siguiente: {etapa.siguienteAccion}
          </p>
        )}
      </div>
    </div>
  )
}

export function EtapasPresupuestoPage() {
  const { vigenciaActiva: vigencia } = useVigencia()
  const { data, isLoading, isError } = useEtapasAprobacion(vigencia)
  const [etapaActiva, setEtapaActiva] = useState<EtapaAprobacionResponse | null>(null)

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="No se pudieron cargar las etapas." />

  const etapas = [...(data ?? [])].sort((a, b) => a.orden - b.orden)

  return (
    <div className="space-y-6">
      <PageHeader title="Etapas de Aprobación"
        description={`Proceso institucional de aprobación presupuestal — Vigencia ${vigencia}`} />
      {etapas.length === 0
        ? <EmptyState title="Sin etapas configuradas"
            description="El administrador debe inicializar las etapas del proceso presupuestal." />
        : <div className="space-y-0">
            {etapas.map((etapa, i) => (
              <EtapaItem key={etapa.id} etapa={etapa} isLast={i === etapas.length - 1}
                onCompletar={setEtapaActiva} />
            ))}
          </div>
      }
      {etapaActiva && (
        <CompletarEtapaDialog
          open={true}
          onOpenChange={(open) => { if (!open) setEtapaActiva(null) }}
          etapaId={etapaActiva.id}
          etapaNombre={etapaActiva.etapa}
        />
      )}
    </div>
  )
}
