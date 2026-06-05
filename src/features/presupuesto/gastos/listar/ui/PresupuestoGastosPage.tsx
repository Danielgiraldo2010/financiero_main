import { useState } from 'react'
import { useVigencia } from '@/shared/hooks/useVigencia'
import { usePresupuestoGastos } from '../hook'
import { useProyectarGastos } from '../../proyectar/hook'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { DataTable } from '@/shared/ui/data/DataTable'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { EmptyState } from '@/shared/ui/feedback/EmptyState'
import { ConfirmDialog } from '@/shared/ui/overlays/ConfirmDialog'
import { Button } from '@/shared/ui/primitives/button'
import { formatCOP } from '@/shared/lib/currency'
import type { LineaGastoResponse } from '../../../model/types'
import type { ColumnDef } from '@tanstack/react-table'

const columns: ColumnDef<LineaGastoResponse>[] = [
  { accessorKey: 'rubroGasto',      header: 'Rubro' },
  { accessorKey: 'fuenteRecurso',   header: 'Fuente' },
  { accessorKey: 'valorInicial',    header: 'Inicial',
    cell: ({ row }) => formatCOP(row.original.valorInicial) },
  { accessorKey: 'valorDefinitivo', header: 'Definitivo',
    cell: ({ row }) => formatCOP(row.original.valorDefinitivo) },
  { accessorKey: 'valorEjecutado',  header: 'Ejecutado',
    cell: ({ row }) => formatCOP(row.original.valorEjecutado) },
  { accessorKey: 'saldoDisponible', header: 'Saldo',
    cell: ({ row }) => formatCOP(row.original.saldoDisponible) },
]

export function PresupuestoGastosPage() {
  const { vigenciaActiva: vigencia } = useVigencia()
  const { data, isLoading, isError } = usePresupuestoGastos({ vigencia })
  const proyectar = useProyectarGastos()
  const [confirmProyectar, setConfirmProyectar] = useState(false)

  const lineas: LineaGastoResponse[] = data?.items ?? []
  const totalDefinitivo = lineas.reduce((s, l) => s + l.valorDefinitivo, 0)
  const totalEjecutado  = lineas.reduce((s, l) => s + l.valorEjecutado, 0)
  const totalSaldo      = lineas.reduce((s, l) => s + l.saldoDisponible, 0)

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="No se pudieron cargar los gastos." />

  return (
    <div className="space-y-6">
      <PageHeader title="Gastos Presupuestales"
        description={`Vigencia ${vigencia} — solo lectura`}
        actions={
          <Button variant="outline" onClick={() => setConfirmProyectar(true)}
            disabled={proyectar.isPending}>
            Proyectar desde vigencia anterior
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { label: 'Total Definitivo',  value: totalDefinitivo },
          { label: 'Total Ejecutado',   value: totalEjecutado  },
          { label: 'Saldo Disponible',  value: totalSaldo      },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold tabular-nums">{formatCOP(value)}</p>
          </div>
        ))}
      </div>
      {lineas.length > 0
        ? <DataTable columns={columns} data={lineas} />
        : <EmptyState title="Sin líneas de gasto"
            description="Consolide proyectos para generar el presupuesto de gastos." />
      }
      <ConfirmDialog
        open={confirmProyectar} onOpenChange={setConfirmProyectar}
        title="Proyectar gastos"
        description={`Se proyectarán los gastos de la vigencia ${vigencia}.`}
        confirmLabel="Proyectar"
        onConfirm={() => proyectar.mutate({ vigencia: vigencia! },
          { onSettled: () => setConfirmProyectar(false) })}
        isLoading={proyectar.isPending}
      />
    </div>
  )
}
