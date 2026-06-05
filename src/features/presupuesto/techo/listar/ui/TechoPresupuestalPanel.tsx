import { useState } from 'react'
import { useVigencia } from '@/shared/hooks/useVigencia'
import { useTechoPresupuestal } from '../hook'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { EmptyState } from '@/shared/ui/feedback/EmptyState'
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge'
import { Button } from '@/shared/ui/primitives/button'
import { formatCOP } from '@/shared/lib/currency'
import { RegistrarTechoDialog } from '../../registrar/ui/RegistrarTechoDialog'

function estadoBadge(estado: string): { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' } {
  const map: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default' }> = {
    VIGENTE:   { label: 'Vigente',   variant: 'success' },
    PENDIENTE: { label: 'Pendiente', variant: 'warning' },
    VENCIDO:   { label: 'Vencido',   variant: 'error'   },
  }
  return map[estado] ?? { label: estado, variant: 'default' }
}

export function TechoPresupuestalPanel() {
  const { vigenciaActiva: vigencia } = useVigencia()
  const { data, isLoading, isError } = useTechoPresupuestal(vigencia)
  const { hasRole } = usePermissions()
  const puedeRegistrar = hasRole('SUPERADMIN') || hasRole('ADMIN_CENTRAL')
  const [dialogOpen, setDialogOpen] = useState(false)

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="No se pudo cargar el techo presupuestal." />

  const techo = data?.[0]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Techo Presupuestal</h2>
        {puedeRegistrar && (
          <Button size="sm" onClick={() => setDialogOpen(true)}>
            {techo ? 'Ver detalle' : 'Registrar techo'}
          </Button>
        )}
      </div>
      {!techo ? (
        <EmptyState title="Sin techo registrado"
          description="El ADMIN_CENTRAL debe comunicar el techo presupuestal para la vigencia." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            { label: 'Techo Asignado',       value: techo.valorTecho         },
            { label: 'Apropiado Inicial',     value: techo.valorApropiado     },
            { label: 'Faltante por Gestionar', value: techo.faltanteGestionar },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-2xl font-semibold tabular-nums">{formatCOP(value)}</p>
            </div>
          ))}
        </div>
      )}
      {techo && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Estado:</span>
          <StatusBadge {...estadoBadge(techo.estado)} />
        </div>
      )}
      {puedeRegistrar && (
        <RegistrarTechoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      )}
    </div>
  )
}
