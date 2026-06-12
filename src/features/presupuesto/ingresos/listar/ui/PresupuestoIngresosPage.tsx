import { useState } from 'react'
import { useVigencia } from '@/shared/hooks/useVigencia'
import { usePresupuestoIngresos } from '../hook'
import { useProyectarIngresos } from '../../proyectar/hook'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { DataTable } from '@/shared/ui/data/DataTable'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { EmptyState } from '@/shared/ui/feedback/EmptyState'
import { ConfirmDialog } from '@/shared/ui/overlays/ConfirmDialog'
import { Button } from '@/shared/ui/primitives/button'
import { formatCOP } from '@/shared/lib/currency'
import type { LineaIngresoResponse } from '../../../model/types'
import type { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<LineaIngresoResponse>[] = [
  { accessorKey: 'rubroIngreso',     header: 'Rubro' },
  { accessorKey: 'fuenteRecurso',    header: 'Fuente' },
  { accessorKey: 'valorInicial',     header: 'Inicial',
    cell: ({ row }) => formatCOP(row.original.valorInicial) },
  { accessorKey: 'valorDefinitivo',  header: 'Definitivo',
    cell: ({ row }) => formatCOP(row.original.valorDefinitivo) },
  { accessorKey: 'valorEjecutado',   header: 'Ejecutado',
    cell: ({ row }) => formatCOP(row.original.valorEjecutado) },
  { accessorKey: 'saldoPorRecaudar', header: 'Saldo',
    cell: ({ row }) => formatCOP(row.original.saldoPorRecaudar) },
]

export function PresupuestoIngresosPage() {
  const { vigenciaActiva: vigencia } = useVigencia()
  const { data, isLoading, isError } = usePresupuestoIngresos({ vigencia })
  const proyectar = useProyectarIngresos()
  const [confirmProyectar, setConfirmProyectar] = useState(false)

  const lineas: LineaIngresoResponse[] = data?.items ?? []
  const totalDefinitivo = lineas.reduce((s, l) => s + l.valorDefinitivo, 0)
  const totalEjecutado  = lineas.reduce((s, l) => s + l.valorEjecutado, 0)
  const totalSaldo      = lineas.reduce((s, l) => s + l.saldoPorRecaudar, 0)

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="No se pudieron cargar los ingresos." />

  return (
    <div className="space-y-6">
      <PageHeader title="Ingresos Presupuestales"
        description={`Vigencia ${vigencia} — solo lectura`}
        actions={
          <Button size="sm" onClick={() => setConfirmProyectar(true)} disabled={proyectar.isPending}>
            Proyectar desde matrícula
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total Definitivo',   value: totalDefinitivo },
          { label: 'Total Ejecutado',    value: totalEjecutado  },
          { label: 'Saldo por Recaudar', value: totalSaldo      },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{formatCOP(value)}</p>
          </div>
        ))}
      </div>
      {lineas.length > 0
        ? <DataTable columns={columns} data={lineas} />
        : <EmptyState title="Sin líneas de ingreso"
            description="Consolide proyectos para generar el presupuesto de ingresos." />
      }
      <ConfirmDialog
        open={confirmProyectar} onOpenChange={setConfirmProyectar}
        title="Proyectar ingresos"
        description={`Se proyectarán los ingresos de la vigencia ${vigencia}.`}
        confirmLabel="Proyectar"
        onConfirm={() => proyectar.mutate({ vigencia: vigencia! },
          { onSettled: () => setConfirmProyectar(false) })}
        isLoading={proyectar.isPending}
      />
    </div>
  )
}
