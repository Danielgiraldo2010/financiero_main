import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useVigencias } from '@/features/catalogos/vigencias/listar/hook'
import { useResumenAnual } from '../hook'
import { MESES } from '../../../model/constants'

const currentYear = new Date().getFullYear()

export function FlujoCajaAnualPage() {
  const [vigencia, setVigencia] = useState(currentYear)
  const { data, isLoading } = useResumenAnual(vigencia)
  const { data: vigencias = [] } = useVigencias()
  const opcionesVigencia = vigencias.length > 0 ? vigencias : [{ anio: currentYear }]

  const chartData = (data?.meses ?? []).map((m, i) => ({
    mes: MESES[i],
    ingresos: m.ingresosRecaudados,
    egresos: m.gastosPagados,
    saldoCaja: m.saldoCajaReal,
  }))

  const KpiCard = ({ label, value, sub }: { label: string; value: number; sub?: string }) => (
    <div className="rounded-[16px] border border-[#dbe3ed] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-[#5c6d83]">{label}</p>
      <p className="mt-1 text-lg font-semibold font-mono">{formatCOP(value)}</p>
      {sub && <p className="mt-0.5 text-xs text-[#66768a]">{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumen Anual de Flujo de Caja"
        description={`Ejecución presupuestal vigencia ${vigencia}`}
        actions={
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#42556c]">Vigencia</label>
            <select
              value={vigencia}
              onChange={e => setVigencia(Number(e.target.value))}
              className="h-9 rounded-[10px] border border-[rgba(15,23,42,0.08)] bg-white px-3 text-sm text-[#1f2937] shadow-[0_4px_12px_rgba(15,23,42,0.08)] outline-none transition-all hover:border-[#004b82] hover:bg-[#edf4fb] focus:border-[#d5bb87]"
            >
              {opcionesVigencia.map(v => (
                <option key={v.anio} value={v.anio}>{v.anio}</option>
              ))}
            </select>
          </div>
        }
      />

      {isLoading && <p className="text-sm text-muted-foreground">Cargando resumen anual...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard label="Total ingresos recaudados" value={data.totalIngresosRecaudados} sub={`${data.porcentajeRecaudo.toFixed(1)}% del presupuesto`} />
            <KpiCard label="Total gastos pagados" value={data.totalGastosPagados} sub={`${data.porcentajeEjecucion.toFixed(1)}% de ejecución`} />
            <KpiCard label="Saldo de caja" value={data.saldoCaja} />
            <KpiCard label="Gastos comprometidos" value={data.totalGastosComprometidos} />
          </div>

          {chartData.length > 0 ? (
            <div className="rounded-[18px] border border-[#dbe3ed] bg-white p-4 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-[#223246]">Ingresos vs Egresos &mdash; {vigencia}</h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#4b5563' }} tickLine={{ stroke: '#d1d5db' }} tickFormatter={v => v.slice(0, 3)} />
                  <YAxis tick={{ fontSize: 11, fill: '#4b5563' }} tickLine={{ stroke: '#d1d5db' }} tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`} width={60} />
                  <Tooltip formatter={(value: number) => [formatCOP(value), '']} contentStyle={{ background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 12, color: '#1f2937' }} labelStyle={{ color: '#004b82', fontWeight: 700 }} />
                  <Legend wrapperStyle={{ color: '#374151' }} />
                  <Line type="monotone" dataKey="ingresos" name="Ingresos recaudados" stroke="#004b82" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="egresos" name="Gastos pagados" stroke="#b91c1c" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="saldoCaja" name="Saldo caja real" stroke="#d5bb87" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-[#dbe3ed] bg-[#fbfdff] p-8 text-center text-sm text-[#66768a]">
              No hay datos mensuales disponibles para graficar.
            </div>
          )}
        </>
      )}
    </div>
  )
}
