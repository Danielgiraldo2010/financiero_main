// features/ejecucion/reportes/por-rubro/ui/EjecucionPorRubroPage.tsx
//
// INVARIANTE 09c-I1: solo lectura.
// INVARIANTE 09c-I2: EjecucionBarChart con datos reales del backend.
// INVARIANTE 09c-I3 (implícito): no calcular totales aquí.
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useEjecucionPorRubro } from '../hook';
import { EjecucionBarChart } from './EjecucionBarChart';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

const MESES = [
  { label: 'Todos los meses', value: '' },
  { label: 'Enero',      value: '1'  },
  { label: 'Febrero',    value: '2'  },
  { label: 'Marzo',      value: '3'  },
  { label: 'Abril',      value: '4'  },
  { label: 'Mayo',       value: '5'  },
  { label: 'Junio',      value: '6'  },
  { label: 'Julio',      value: '7'  },
  { label: 'Agosto',     value: '8'  },
  { label: 'Septiembre', value: '9'  },
  { label: 'Octubre',    value: '10' },
  { label: 'Noviembre',  value: '11' },
  { label: 'Diciembre',  value: '12' },
];

export function EjecucionPorRubroPage() {
  const [vigencia, setVigencia] = useState(new Date().getFullYear());
  const [mes, setMes]          = useState('');
  const [pagina, setPagina]    = useState(1);
  const [vista, setVista]      = useState<'tabla' | 'grafico'>('grafico');

  const { data, isLoading, isError } = useEjecucionPorRubro({
    vigencia,
    ...(mes ? { mes: Number(mes) } : {}),
    pagina,
    tamanoPagina: 50,
  });

  return (
    <div className="space-y-4">
      <PageHeader title="Ejecución por Rubro de Gasto" />

      {/* Filtros + selector de vista */}
      <div className="flex gap-3 flex-wrap items-end">
        <SelectField
          label="Vigencia"
          value={String(vigencia)}
          onChange={(v) => { setVigencia(Number(v)); setPagina(1); }}
          options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
        />
        <SelectField
          label="Mes"
          value={mes}
          onChange={(v) => { setMes(v); setPagina(1); }}
          options={MESES}
        />
        {/* Toggle vista */}
        <div className="flex rounded-md border overflow-hidden text-sm ml-auto">
          <button
            onClick={() => setVista('grafico')}
            className={`px-3 py-1.5 ${vista === 'grafico' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
          >
            Gráfico
          </button>
          <button
            onClick={() => setVista('tabla')}
            className={`px-3 py-1.5 ${vista === 'tabla' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
          >
            Tabla
          </button>
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando reporte…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar el reporte por rubro.</p>}

      {data && data.items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Sin datos de ejecución para los filtros seleccionados.
        </p>
      )}

      {data && data.items.length > 0 && (
        <>
          {/* Vista gráfico — INVARIANTE 09c-I2 */}
          {vista === 'grafico' && (
            <div className="rounded-lg border p-4 bg-background">
              <p className="text-xs text-muted-foreground mb-4">
                Vigencia {vigencia}{mes ? ` · ${MESES.find((m) => m.value === mes)?.label}` : ' · Todos los meses'}
                {' · '}{data.total} registros
              </p>
              <EjecucionBarChart data={data.items} agruparPorRubro={!mes} />
            </div>
          )}

          {/* Vista tabla */}
          {vista === 'tabla' && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left">Rubro de Gasto</th>
                    <th className="px-3 py-2 text-left">Código CCP</th>
                    <th className="px-3 py-2 text-left">Tipo Gasto</th>
                    <th className="px-3 py-2 text-right">Presupuesto</th>
                    <th className="px-3 py-2 text-right">Comprometido</th>
                    <th className="px-3 py-2 text-right">Ejecutado</th>
                    <th className="px-3 py-2 text-right">Saldo</th>
                    <th className="px-3 py-2 text-right">% Ejecución</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((row) => {
                    const pctColor =
                      row.porcentajeEjecucion >= 90
                        ? 'text-destructive'
                        : row.porcentajeEjecucion >= 70
                        ? 'text-orange-600'
                        : 'text-green-700';

                    return (
                      <tr key={row.id} className="border-t hover:bg-muted/30">
                        <td
                          className="px-3 py-2 text-xs max-w-60 truncate"
                          title={row.rubroNombre}
                        >
                          {row.rubroNombre}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground font-mono">
                          {row.codigoCcp}
                        </td>
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          {row.tipoGasto}
                        </td>
                        <td className="px-3 py-2 text-right text-xs">
                          {formatCOP(row.presupuestoDefinitivo)}
                        </td>
                        <td className="px-3 py-2 text-right text-xs">
                          {formatCOP(row.totalComprometido)}
                        </td>
                        <td className="px-3 py-2 text-right text-xs">
                          {formatCOP(row.totalEjecutado)}
                        </td>
                        <td className="px-3 py-2 text-right text-xs">
                          {formatCOP(row.saldoDisponible)}
                        </td>
                        <td className={`px-3 py-2 text-right text-xs font-medium ${pctColor}`}>
                          {row.porcentajeEjecucion.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginación */}
          {data.totalPaginas > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Pág. {data.pagina} / {data.totalPaginas} · {data.total} registros</span>
              <div className="flex gap-2">
                <button
                  disabled={data.pagina <= 1}
                  onClick={() => setPagina((p) => p - 1)}
                  className="px-2 py-1 border rounded disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <button
                  disabled={data.pagina >= data.totalPaginas}
                  onClick={() => setPagina((p) => p + 1)}
                  className="px-2 py-1 border rounded disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
