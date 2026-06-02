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
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(v: number) => formatCOP(v)} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatCOP(value),
            name === 'presupuestado' ? 'Presupuestado' : 'Ejecutado',
          ]}
        />
        <Legend formatter={(v) => v === 'presupuestado' ? 'Presupuestado' : 'Ejecutado'} />
        <Bar dataKey="presupuestado" fill="hsl(var(--primary))" radius={[2,2,0,0]} />
        <Bar dataKey="ejecutado"     fill="hsl(var(--accent))"  radius={[2,2,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
