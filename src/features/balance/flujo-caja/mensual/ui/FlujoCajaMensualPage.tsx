import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useFlujoCajaMensual } from '../hook'
import { MESES } from '../../../model/constants'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

export function FlujoCajaMensualPage() {
  const [vigencia, setVigencia] = useState(currentYear)
  const [mes, setMes] = useState(currentMonth)

  const { data, isLoading } = useFlujoCajaMensual(vigencia, mes)

  const rows = data ? [
    { label: 'Ingresos presupuestados', value: data.ingresosPresupuestados },
    { label: 'Ingresos recaudados',     value: data.ingresosRecaudados },
    { label: 'Diferencia ingresos',     value: data.diferenciaIngresos, highlight: data.diferenciaIngresos < 0 },
    { label: 'Gastos apropiados',       value: data.gastosApropiados },
    { label: 'Gastos comprometidos',    value: data.gastosComprometidos },
    { label: 'Gastos pagados',          value: data.gastosPagados },
    { label: 'Saldo por pagar',         value: data.saldoPorPagar },
    { label: 'Saldo caja calculado',    value: data.saldoCajaCalculado },
    { label: 'Saldo caja real',         value: data.saldoCajaReal },
    { label: 'Diferencia caja',         value: data.diferenciaCaja, highlight: Math.abs(data.diferenciaCaja) > 1_000_000 },
  ] : []

  return (
    <div className="space-y-4">
      <PageHeader title="Flujo de Caja Mensual" description="Detalle de ingresos, gastos y saldos por periodo"
        actions={<div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Vigencia</label>
          <input
            type="number" value={vigencia}
            onChange={e => setVigencia(Number(e.target.value))}
            className="input w-24"
          />
          <label className="text-sm text-gray-600">Mes</label>
          <select
            value={mes}
            onChange={e => setMes(Number(e.target.value))}
            className="input w-36"
          >
            {MESES.map((m: string, i: number) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>}
      />

      {isLoading && <p className="text-sm text-gray-500">Cargando flujo de caja...</p>}

      {data && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {rows.map(row => (
                <tr key={row.label} className={row.highlight ? 'bg-red-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-700">{row.label}</td>
                  <td className={`px-4 py-3 font-mono text-right ${row.highlight ? 'text-red-700 font-semibold' : ''}`}>
                    {formatCOP(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
