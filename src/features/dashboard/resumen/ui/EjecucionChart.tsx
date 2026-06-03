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

function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: "compact",
    compactDisplay: "short",
  }).format(n)
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
    <div className="overflow-hidden rounded-[16px] border border-[rgba(15,23,42,0.08)] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.08)]">
      <div className="border-b border-[#dbe8f4] bg-[linear-gradient(90deg,rgba(237,244,251,0.92),rgba(255,255,255,1))] px-5 py-4">
        <p className="text-lg font-bold tracking-[-0.03em] text-[#004b82]">Panorama de ejecución</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">Relación entre presupuesto, ejecución y saldo pendiente.</p>
      </div>
      <div className="grid gap-0 lg:grid-cols-2">
      <div className="border-b border-[#dbe8f4] p-5 lg:border-b-0 lg:border-r">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#004b82]">Ejecucion de Ingresos</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{formatCOP(resumen.totalEjecutadoIngresos)} ejecutado</p>
          </div>
          <span className="rounded-full bg-[#edf4fb] px-3 py-1 text-xs font-bold text-[#004b82]">
            {resumen.porcentajeEjecucionIngresos.toFixed(1)}%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={dataIngresos} cx="50%" cy="50%" innerRadius={66} outerRadius={92} dataKey="value">
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
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-[#004b82]">Ejecucion de Gastos</p>
            <p className="mt-1 text-xs font-medium text-muted-foreground">{formatCOP(resumen.totalEjecutadoGastos)} ejecutado</p>
          </div>
          <span className="rounded-full bg-[#fff8e6] px-3 py-1 text-xs font-bold text-[#9a6a1f]">
            {resumen.porcentajeEjecucionGastos.toFixed(1)}%
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={dataGastos} cx="50%" cy="50%" innerRadius={66} outerRadius={92} dataKey="value">
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
    </div>
  )
}
