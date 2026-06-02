// features/ejecucion/reportes/por-rubro/ui/EjecucionBarChart.tsx
//
// INVARIANTE 09c-I2:
//   - BarChart HORIZONTAL (layout="vertical").
//   - Barra azul institucional: presupuestoMensual
//   - Barra dorada institucional: ejecutadoMensual
//   - Eje Y: rubroGasto (nombre del rubro)
//   - Tooltip: formatCOP()
//   - No calcular nada — solo visualizar los datos del backend.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';
import { formatCOP } from '@/shared/lib/currency';
import type { EjecucionMensualRow } from '../../model/types';

interface Props {
  data: EjecucionMensualRow[];
  /** Si true, agrupa por rubro (modo resumen). Si false, muestra cada fila. */
  agruparPorRubro?: boolean;
}

interface ChartDatum {
  name: string;
  presupuesto: number;
  ejecutado: number;
  pct: number;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="space-y-1 rounded-[14px] border border-[#d1d5db] bg-white p-3 text-xs text-[#1f2937] shadow-[0_14px_32px_rgba(0,75,130,0.12)]">
      <p className="mb-2 max-w-60 font-semibold text-[#004b82]">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name === 'Presupuesto' ? '◼ ' : '◼ '}
          {entry.name}: <strong>{formatCOP(entry.value ?? 0)}</strong>
        </p>
      ))}
      {payload[0] && payload[1] && (
        <p className="border-t pt-1 text-[#6b7280]">
          Ejecución:{' '}
          <strong>
            {payload[1].value && payload[0].value && payload[0].value > 0
              ? ((payload[1].value / payload[0].value) * 100).toFixed(1)
              : 0}
            %
          </strong>
        </p>
      )}
    </div>
  );
}

/**
 * Agrupa filas por rubroGasto sumando presupuesto y ejecutado.
 * Útil cuando hay múltiples meses y se quiere una vista consolidada.
 */
function agrupar(rows: EjecucionMensualRow[]): ChartDatum[] {
  const map = new Map<string, ChartDatum>();
  for (const row of rows) {
    const existing = map.get(row.rubroNombre);          // era: row.rubroGasto
    if (existing) {
      existing.presupuesto += row.presupuestoDefinitivo; // era: row.presupuestoMensual
      existing.ejecutado   += row.totalEjecutado;        // era: row.ejecutadoMensual
    } else {
      map.set(row.rubroNombre, {                         // era: row.rubroGasto
        name:        row.rubroNombre,                    // era: row.rubroGasto
        presupuesto: row.presupuestoDefinitivo,          // era: row.presupuestoMensual
        ejecutado:   row.totalEjecutado,                 // era: row.ejecutadoMensual
        pct:         row.porcentajeEjecucion,
      });
    }
  }
  return Array.from(map.values());
}

export function EjecucionBarChart({ data, agruparPorRubro = true }: Props) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        Sin datos para mostrar
      </div>
    );
  }

  const chartData: ChartDatum[] = agruparPorRubro
    ? agrupar(data)
    : data.map((r) => ({
    name:        `${r.codigoCcp} · ${r.rubroNombre}`,   // era: nombreMes · rubroGasto
    presupuesto: r.presupuestoDefinitivo,                // era: presupuestoMensual
    ejecutado:   r.totalEjecutado,                       // era: ejecutadoMensual
    pct:         r.porcentajeEjecucion,
  }));

  // Altura dinámica según cantidad de barras (mínimo 300px)
  const barHeight  = 36;
  const chartHeight = Math.max(300, chartData.length * barHeight * 2 + 60);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      {/* INVARIANTE 09c-I2: layout="vertical" → BarChart horizontal */}
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        barCategoryGap="20%"
        barGap={4}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />

        {/* Eje X: valores numéricos (presupuesto / ejecutado) */}
        <XAxis
          type="number"
          tickFormatter={(v: number) =>
            v >= 1_000_000
              ? `$${(v / 1_000_000).toFixed(1)}M`
              : v >= 1_000
              ? `$${(v / 1_000).toFixed(0)}K`
              : `$${v}`
          }
          tick={{ fontSize: 11, fill: '#4b5563' }}
          tickLine={{ stroke: '#d1d5db' }}
        />

        {/* Eje Y: nombre del rubro — INVARIANTE 09c-I2 */}
        <YAxis
          dataKey="name"
          type="category"
          width={180}
          tick={{ fontSize: 11, fill: '#4b5563' }}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8, color: '#374151' }}
          formatter={(value) => (value === 'presupuesto' ? 'Presupuesto' : 'Ejecutado')}
        />

        {/* Barra azul institucional — presupuestoMensual — INVARIANTE 09c-I2 */}
        <Bar
          dataKey="presupuesto"
          name="presupuesto"
          fill="#004b82"
          radius={[0, 3, 3, 0]}
        />

        {/* Barra dorada institucional — ejecutadoMensual — INVARIANTE 09c-I2 */}
        <Bar
          dataKey="ejecutado"
          name="ejecutado"
          fill="#d5bb87"
          radius={[0, 3, 3, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
