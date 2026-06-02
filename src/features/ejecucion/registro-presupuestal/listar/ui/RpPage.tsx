// features/ejecucion/registro-presupuestal/listar/ui/RpPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useRps } from '../hook';
import { GenerarRpDialog } from '../../generar/ui/GenerarRpDialog';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

const RP_LABEL: Record<string, string> = {
  ACTIVO: 'Activo', PARCIALMENTE_PAGADO: 'Parc. Pagado', PAGADO: 'Pagado', ANULADO: 'Anulado',
}

function rpVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'ACTIVO':              return 'success'
    case 'PARCIALMENTE_PAGADO': return 'info'
    case 'PAGADO':              return 'warning'
    case 'ANULADO':             return 'error'
    default:                    return 'default'
  }
}

export function RpPage() {
  const [vigencia, setVigencia] = useState<number>(new Date().getFullYear());
  const [estado, setEstado]    = useState('');
  const [pagina, setPagina]    = useState(1);

  const { data, isLoading, isError } = useRps({ vigencia, ...(estado ? { estado } : {}), pagina });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Registros Presupuestales"
        actions={<GenerarRpDialog />}
      />

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
            { label: 'Activo',              value: 'ACTIVO'              },
            { label: 'Parcialmente Pagado', value: 'PARCIALMENTE_PAGADO' },
            { label: 'Pagado',              value: 'PAGADO'              },
            { label: 'Anulado',             value: 'ANULADO'             },
          ]}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando registros…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar los registros.</p>}

      {data && (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º RP</th>
                  <th className="px-3 py-2 text-left">CDP</th>
                  <th className="px-3 py-2 text-left">Beneficiario</th>
                  <th className="px-3 py-2 text-left">NIT / Cédula</th>
                  <th className="px-3 py-2 text-right">Valor Total</th>
                  <th className="px-3 py-2 text-right">Saldo Pendiente</th>
                  <th className="px-3 py-2 text-right">% Ejec.</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">OPs</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((rp) => (
                  <tr key={rp.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{rp.numero}</td>
                    <td className="px-3 py-2 font-mono text-xs">{rp.cdpNumero}</td>
                    <td className="px-3 py-2">{rp.beneficiario ?? '—'}</td>
                    <td className="px-3 py-2 text-xs">{rp.nitCedula ?? '—'}</td>
                    <td className="px-3 py-2 text-right">{formatCOP(rp.valorTotal)}</td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatCOP(rp.saldoPendiente)}
                    </td>
                    <td className="px-3 py-2 text-right">
                      {rp.porcentajeEjecutado.toFixed(1)}%
                    </td>
                    <td className="px-3 py-2 text-center">
                      <StatusBadge label={RP_LABEL[rp.estado] ?? rp.estado} variant={rpVariant(rp.estado)} />
                    </td>
                    <td className="px-3 py-2 text-center text-xs">
                      {rp.numeroOrdenesPago}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <a
                        href={`/ejecucion/rp/${rp.id}`}
                        className="text-primary hover:underline text-xs"
                      >
                        Ver
                      </a>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <a
                        href={`/ejecucion/rp/${rp.id}`}
                        className="text-primary hover:underline text-xs"
                      >
                        Ver
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{data.total} registros</span>
            <div className="flex gap-2">
              <button
                disabled={data.pagina <= 1}
                onClick={() => setPagina((p) => p - 1)}
                className="px-2 py-1 border rounded disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span>Pág. {data.pagina} / {data.totalPaginas}</span>
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
