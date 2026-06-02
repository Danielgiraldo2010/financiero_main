import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { PageHeader } from '@/shared/ui/layout/PageHeader'
import { formatCOP } from '@/shared/lib/currency'
import { useResumenAnual } from '../hook'
import { MESES } from '../../../model/constants'

const currentYear = new Date().getFullYear()

// FE10-I4: Ingresos (azul) vs Egresos (rojo) — Recharts LineChart con 12 meses
export function FlujoCajaAnualPage() {
  const [vigencia, setVigencia] = useState(currentYear)
  const { data, isLoading } = useResumenAnual(vigencia)

  const chartData = (data?.meses ?? []).map((m, i) => ({
    mes: MESES[i],
    ingresos: m.ingresosRecaudados,
    egresos: m.gastosPagados,
    saldoCaja: m.saldoCajaReal,
  }))

  const KpiCard = ({ label, value, sub }: { label: string; value: number; sub?: string }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold font-mono">{formatCOP(value)}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Resumen Anual de Flujo de Caja" description={`Ejecucion presupuestal vigencia ${vigencia}`}
        actions={<div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Vigencia</label>
          <input
            type="number" value={vigencia}
            onChange={e => setVigencia(Number(e.target.value))}
            className="input w-24"
          />
        </div>}
      />

      {isLoading && <p className="text-sm text-gray-500">Cargando resumen anual...</p>}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <KpiCard
              label="Total ingresos recaudados"
              value={data.totalIngresosRecaudados}
              sub={`${data.porcentajeRecaudo.toFixed(1)}% del presupuesto`}
            />
            <KpiCard
              label="Total gastos pagados"
              value={data.totalGastosPagados}
              sub={`${data.porcentajeEjecucion.toFixed(1)}% de ejecucion`}
            />
            <KpiCard label="Saldo de caja" value={data.saldoCaja} />
            <KpiCard label="Gastos comprometidos" value={data.totalGastosComprometidos} />
          </div>

          {chartData.length > 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <h3 className="mb-4 text-sm font-medium text-gray-700">
                Ingresos vs Egresos &mdash; {vigencia}
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="mes"
                    tick={{ fontSize: 11 }}
                    tickFormatter={v => v.slice(0, 3)}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={v => `$${(v / 1_000_000).toFixed(0)}M`}
                    width={60}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCOP(value), '']}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    name="Ingresos recaudados"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="egresos"
                    name="Gastos pagados"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldoCaja"
                    name="Saldo caja real"
                    stroke="#16a34a"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-400">
              No hay datos mensuales disponibles para graficar.
              <br />
              El backend retorna <code>meses[]</code> solo si estan conciliados.
            </div>
          )}
        </>
      )}
    </div>
  )
}
