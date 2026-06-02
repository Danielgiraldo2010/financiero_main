import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import type { EjecucionMensualResponse } from '../../../model/types'
import { formatCOP } from '@/shared/lib/currency'

interface Props {
  data: EjecucionMensualResponse[]
}

function agruparPorMes(data: EjecucionMensualResponse[]) {
  const mapa = new Map<string, { presupuestado: number; ejecutado: number; orden: number }>()
  for (const row of data) {
    const actual = mapa.get(row.nombreMes) ?? { presupuestado: 0, ejecutado: 0, orden: row.mes }
    mapa.set(row.nombreMes, {
      presupuestado: actual.presupuestado + row.presupuestoMensual,
      ejecutado:     actual.ejecutado + row.ejecutadoMensual,
      orden:         actual.orden,
    })
  }
  return [...mapa.entries()]
    .sort((a, b) => a[1].orden - b[1].orden)
    .map(([mes, { presupuestado, ejecutado }]) => ({ mes, presupuestado, ejecutado }))
}

export function EjecucionMensualChart({ data }: Props) {
  const chartData = agruparPorMes(data)
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#4b5563' }} tickLine={{ stroke: '#d1d5db' }} />
        <YAxis tickFormatter={(v: number) => formatCOP(v)} tick={{ fontSize: 11, fill: '#4b5563' }} tickLine={{ stroke: '#d1d5db' }} />
        <Tooltip
          contentStyle={{
            background: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: 12,
            color: '#1f2937',
          }}
          labelStyle={{ color: '#004b82', fontWeight: 700 }}
          formatter={(value: number, name: string) => [
            formatCOP(value),
            name === 'presupuestado' ? 'Presupuestado' : 'Ejecutado',
          ]}
        />
        <Legend formatter={(v) => v === 'presupuestado' ? 'Presupuestado' : 'Ejecutado'} wrapperStyle={{ color: '#374151' }} />
        <Bar dataKey="presupuestado" fill="#004b82" radius={[4,4,0,0]} />
        <Bar dataKey="ejecutado"     fill="#d5bb87" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
