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
  ejecutado: "#004b82",
  pendiente: "#d5bb87",
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
      <div className="rounded-[18px] border border-[#d1d5db] bg-white p-4 shadow-[0_12px_30px_rgba(0,75,130,0.06)]">
        <p className="mb-2 text-sm font-semibold text-[#004b82]">Ejecucion de Ingresos</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={dataIngresos} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
              {dataIngresos.map((_: unknown, i: number) => (
                <Cell key={i} fill={i === 0 ? COLORS.ejecutado : COLORS.pendiente} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: 12, color: "#1f2937" }}
              labelStyle={{ color: "#004b82", fontWeight: 700 }}
              formatter={(v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)}
            />
            <Legend wrapperStyle={{ color: "#374151" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="rounded-[18px] border border-[#d1d5db] bg-white p-4 shadow-[0_12px_30px_rgba(0,75,130,0.06)]">
        <p className="mb-2 text-sm font-semibold text-[#004b82]">Ejecucion de Gastos</p>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={dataGastos} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value">
              {dataGastos.map((_: unknown, i: number) => (
                <Cell key={i} fill={i === 0 ? COLORS.ejecutado : COLORS.pendiente} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#ffffff", border: "1px solid #d1d5db", borderRadius: 12, color: "#1f2937" }}
              labelStyle={{ color: "#004b82", fontWeight: 700 }}
              formatter={(v: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(v)}
            />
            <Legend wrapperStyle={{ color: "#374151" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
