import { useState } from 'react'
import { useVigencia } from '@/shared/hooks/useVigencia'
import { useEjecucionMensual } from '../hook'
import { EjecucionMensualChart } from './EjecucionMensualChart'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { ErrorMessage } from '@/shared/ui/feedback/ErrorMessage'
import { EmptyState } from '@/shared/ui/feedback/EmptyState'
import { DataTable } from '@/shared/ui/data/DataTable'
import { formatCOP } from '@/shared/lib/currency'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/shared/ui/primitives/select'
import type { EjecucionMensualResponse } from '../../../model/types'
import type { ColumnDef } from '@tanstack/react-table'

const MESES = [
  { label: 'Todos los meses', value: '0'  },
  { label: 'Enero',           value: '1'  }, { label: 'Febrero',   value: '2'  },
  { label: 'Marzo',           value: '3'  }, { label: 'Abril',     value: '4'  },
  { label: 'Mayo',            value: '5'  }, { label: 'Junio',     value: '6'  },
  { label: 'Julio',           value: '7'  }, { label: 'Agosto',    value: '8'  },
  { label: 'Septiembre',      value: '9'  }, { label: 'Octubre',   value: '10' },
  { label: 'Noviembre',       value: '11' }, { label: 'Diciembre', value: '12' },
]

const columns: ColumnDef<EjecucionMensualResponse>[] = [
  { accessorKey: 'nombreMes',           header: 'Mes' },
  { accessorKey: 'rubroGasto',          header: 'Rubro' },
  { accessorKey: 'presupuestoMensual',  header: 'Presupuestado',
    cell: ({ row }) => formatCOP(row.original.presupuestoMensual) },
  { accessorKey: 'ejecutadoMensual',    header: 'Ejecutado',
    cell: ({ row }) => formatCOP(row.original.ejecutadoMensual) },
  { accessorKey: 'porcentajeEjecucion', header: '% Ejecución',
    cell: ({ row }) => `${Number(row.original.porcentajeEjecucion).toFixed(1)}%` },
]

export function EjecucionMensualPage() {
  const { vigenciaActiva: vigencia } = useVigencia()
  const [mes, setMes] = useState('0')

  const params = mes !== '0' ? { vigencia, mes: Number(mes) } : { vigencia }
  const { data, isLoading, isError } = useEjecucionMensual(params)
  const lineas: EjecucionMensualResponse[] = data?.items ?? []

  if (isLoading) return <LoadingSpinner />
  if (isError)   return <ErrorMessage message="No se pudo cargar la ejecución mensual." />

  return (
    <div className="space-y-6">
      <PageHeader title="Ejecución Mensual"
        description={`Comparativo presupuestado vs ejecutado — Vigencia ${vigencia}`} />
      <div className="w-48">
        <Select value={mes} onValueChange={(v) => setMes(v ?? '0')}>
          <SelectTrigger><SelectValue placeholder="Seleccionar mes" /></SelectTrigger>
          <SelectContent>
            {MESES.map((m) => (
              <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {lineas.length === 0
        ? <EmptyState title="Sin datos de ejecución"
            description="No hay registros para los filtros seleccionados." />
        : <><EjecucionMensualChart data={lineas} /><DataTable columns={columns} data={lineas} /></>
      }
    </div>
  )
}
