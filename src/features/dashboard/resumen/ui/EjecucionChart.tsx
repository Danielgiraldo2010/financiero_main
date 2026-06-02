import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { ResumenEjecutivo } from "../../model/types"

interface Props {
  resumen: ResumenEjecutivo
}

const COLORS = {
  ejecutado: "#22c55e",
  pendiente: "#e5e7eb",
}

export function EjecucionChart({ resumen }: Props) {
  const dataIngresos = [
    { name: "Ejecutado", value: resumen.totalEjecutadoIngresos },
    { name: "Pendiente", value: Math.max(0, resumen.totalPresupuestoIngresos - resumen.totalEjecutadoIngresos) },
  ]
  const dataGastos = [
    { name: "Ejecutado", value: resumen.totalEjecutadoGastos },
    { name: "Pendiente", value: Math.max(0, resumen.totalPresupuestoGastos - resumen.totalEjecutadoGastos) },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <p className="mb-2 text-sm font-medium">Ejecucion de Ingresos</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={dataIngresos} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
              {dataIngresos.map((_: unknown, i: number) => (
                <Cell key={i} fill={i === 0 ? COLORS.ejecutado : COLORS.pendiente} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-lg border bg-background p-4 shadow-sm">
        <p className="mb-2 text-sm font-medium">Ejecucion de Gastos</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={dataGastos} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
              {dataGastos.map((_: unknown, i: number) => (
                <Cell key={i} fill={i === 0 ? COLORS.ejecutado : COLORS.pendiente} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
