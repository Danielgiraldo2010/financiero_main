// features/ejecucion/reportes/seguimiento-cdp/ui/SeguimientoCdpPage.tsx
//
// INVARIANTE 09c-I1: solo lectura — sin botones de mutación.
// INVARIANTE 09c-I3: totales vienen del backend. saldoDisponible con color semántico.
// CORRECCIÓN: CdpResponse tiene saldoDisponible (no calculado en frontend).
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useSeguimientoCdp } from '../hook';
import { VIGENCIAS_DISPONIBLES, ESTADOS_CDP } from '../../../model/constants';


const CDP_VARIANT_MAP: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
  VIGENTE:   'success',
  AGOTADO:   'error',
  VENCIDO:   'warning',
  ANULADO:   'error',
};
function cdpVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  return CDP_VARIANT_MAP[estado] ?? 'default';
}

export function SeguimientoCdpPage() {
  const [vigencia, setVigencia] = useState(new Date().getFullYear());
  const [estado, setEstado]    = useState('');
  const [pagina, setPagina]    = useState(1);

  const { data, isLoading, isError } = useSeguimientoCdp({
    vigencia,
    ...(estado ? { estado } : {}),
    pagina,
    tamanoPagina: 20,
  });

  // Totales del backend — INVARIANTE 09c-I3: no calcular en frontend
  const totalItems  = data?.total ?? 0;

  return (
    <div className="space-y-4">
      <PageHeader title="Seguimiento de CDPs" />

      {/* Filtros */}
      <div className="flex gap-3 flex-wrap">
        <SelectField
          label="Vigencia"
          value={String(vigencia)}
          onChange={(v) => { setVigencia(Number(v)); setPagina(1); }}
          options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
        />
        <SelectField
          label="Estado"
          value={estado}
          onChange={(v) => { setEstado(v); setPagina(1); }}
          options={[
            { label: 'Todos', value: '' },
            ...Object.entries(ESTADOS_CDP).map(([k, v]) => ({ label: v.label, value: k })),
          ]}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando reporte…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar el reporte de seguimiento.</p>}

      {data && (
        <>
          <p className="text-xs text-muted-foreground">
            {data?.total ?? 0} CDPs en vigencia {vigencia}
            {estado ? ` · estado: ${ESTADOS_CDP[estado as keyof typeof ESTADOS_CDP]?.label ?? estado}` : ''}
          </p>

          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º CDP</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Rubro de Gasto</th>
                  <th className="px-3 py-2 text-left">Fuente</th>
                  <th className="px-3 py-2 text-left">Beneficiario</th>
                  <th className="px-3 py-2 text-right">V. Aprobado</th>
                  <th className="px-3 py-2 text-right">V. Comprometido</th>
                  <th className="px-3 py-2 text-right">V. Reintegrado</th>
                  {/* INVARIANTE 09c-I3: saldoDisponible con color semántico */}
                  <th className="px-3 py-2 text-right">Saldo Disp.</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((cdp) => {
                  const saldoColor =
                    cdp.saldoDisponible > 0
                      ? 'text-green-700 font-semibold'
                      : 'text-destructive font-semibold';

                  return (
                    <tr key={cdp.id} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2 font-mono text-xs">{cdp.numero}</td>
                      <td className="px-3 py-2 text-xs">
                        {new Date(cdp.fechaExpedicion).toLocaleDateString('es-CO')}
                      </td>
                      <td
                        className="px-3 py-2 text-xs max-w-[180px] truncate"
                        title={cdp.rubroGastoNombre}
                      >
                        {cdp.rubroGastoNombre}
                      </td>
                      <td
                        className="px-3 py-2 text-xs max-w-[140px] truncate"
                        title={cdp.fuenteRecursoNombre}
                      >
                        {cdp.fuenteRecursoNombre}
                      </td>
                      <td className="px-3 py-2 text-xs">{cdp.beneficiario ?? '—'}</td>
                      <td className="px-3 py-2 text-right text-xs">
                        {formatCOP(cdp.valorAprobado)}
                      </td>
                      <td className="px-3 py-2 text-right text-xs">
                        {formatCOP(cdp.valorComprometidoRp)}
                      </td>
                      <td className="px-3 py-2 text-right text-xs">
                        {formatCOP(cdp.valorReintegrado)}
                      </td>
                      {/* INVARIANTE 09c-I3: color semántico verde/rojo */}
                      <td className={`px-3 py-2 text-right text-xs ${saldoColor}`}>
                        {formatCOP(cdp.saldoDisponible)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <StatusBadge label={ESTADOS_CDP[cdp.estado as keyof typeof ESTADOS_CDP]?.label ?? cdp.estado} variant={cdpVariant(cdp.estado)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Página {data.pagina} de {data.totalPaginas} · {totalItems} registros
            </span>
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
        </>
      )}
    </div>
  );
}
