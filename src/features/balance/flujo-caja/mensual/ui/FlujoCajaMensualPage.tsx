import { useState } from 'react'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'
import { useFlujoCajaMensual } from '../hook'
import { MESES } from '../../../model/constants'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const selectClass =
  'h-11 rounded-[12px] border border-[#d1d5db] bg-white px-3.5 text-sm text-[#1f2937] shadow-sm outline-none transition-all hover:border-[#004b82] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12'

export function FlujoCajaMensualPage() {
  const [vigencia, setVigencia] = useState(currentYear)
  const [mes, setMes] = useState(currentMonth)
  const { data, isLoading } = useFlujoCajaMensual(vigencia, mes)
  const { data: vigencias = [] } = useVigencias()
  const opcionesVigencia = vigencias.length > 0 ? vigencias : [{ anio: currentYear }]

  const rows = data ? [
    { label: 'Ingresos presupuestados',  value: data.ingresosPresupuestados },
    { label: 'Ingresos recaudados',      value: data.ingresosRecaudados },
    { label: 'Diferencia ingresos',      value: data.diferenciaIngresos,  highlight: data.diferenciaIngresos < 0 },
    { label: 'Gastos apropiados',        value: data.gastosApropiados },
    { label: 'Gastos comprometidos',     value: data.gastosComprometidos },
    { label: 'Gastos pagados',           value: data.gastosPagados },
    { label: 'Saldo por pagar',          value: data.saldoPorPagar },
    { label: 'Saldo caja calculado',     value: data.saldoCajaCalculado },
    { label: 'Saldo caja real',          value: data.saldoCajaReal },
    { label: 'Diferencia caja',          value: data.diferenciaCaja, highlight: Math.abs(data.diferenciaCaja) > 1_000_000 },
  ] : []

  return (
    <div className="space-y-4">
      <PageHeader
        title="Flujo de Caja Mensual"
        description="Detalle de ingresos, gastos y saldos por periodo"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm font-medium text-[#42556c]">Vigencia</label>
            <select
              value={vigencia}
              onChange={e => setVigencia(Number(e.target.value))}
              className={selectClass}
            >
              {opcionesVigencia.map(v => (
                <option key={v.anio} value={v.anio}>{v.anio}</option>
              ))}
            </select>
            <label className="text-sm font-medium text-[#42556c]">Mes</label>
            <select
              value={mes}
              onChange={e => setMes(Number(e.target.value))}
              className={selectClass + ' w-36'}
            >
              {MESES.map((m: string, i: number) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Cargando flujo de caja...</p>}

      {data && (
        <div className="overflow-hidden rounded-[18px] border border-[#dbe3ed] bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <tbody className="divide-y divide-gray-100">
              {rows.map(row => (
                <tr key={row.label} className={row.highlight ? 'bg-red-50' : 'hover:bg-[#f8fbfe]'}>
                  <td className="px-4 py-3 font-medium text-[#223246]">{row.label}</td>
                  <td className={`px-4 py-3 font-mono text-right ${row.highlight ? 'font-semibold text-red-700' : ''}`}>
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
