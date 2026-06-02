// features/ejecucion/cdp/listar/ui/CdpPage.tsx
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useCdps } from '../hook';
import { GenerarCdpDialog } from '../../generar/ui/GenerarCdpDialog';
import { AnularCdpDialog } from '../../anular/ui/AnularCdpDialog';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';
import type { CdpResponse } from '../../model/types';

const CDP_LABEL: Record<string, string> = {
  ACTIVO: 'Activo', COMPROMETIDO: 'Comprometido', AGOTADO: 'Agotado', ANULADO: 'Anulado',
}

function cdpVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'ACTIVO':       return 'success'
    case 'COMPROMETIDO': return 'info'
    case 'AGOTADO':      return 'warning'
    case 'ANULADO':      return 'error'
    default:             return 'default'
  }
}

export function CdpPage() {
  const [vigencia, setVigencia] = useState<number>(new Date().getFullYear());
  const [estado, setEstado]   = useState<string>('');
  const [pagina, setPagina]   = useState(1);
  const [cdpAAnular, setCdpAAnular] = useState<CdpResponse | null>(null);

  const { data, isLoading, isError } = useCdps({ vigencia, ...(estado ? { estado } : {}), pagina });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Certificados de Disponibilidad Presupuestal"
        actions={<GenerarCdpDialog />}
      />

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
            { label: 'Activo',       value: 'ACTIVO'       },
            { label: 'Comprometido', value: 'COMPROMETIDO' },
            { label: 'Agotado',      value: 'AGOTADO'      },
            { label: 'Anulado',      value: 'ANULADO'      },
          ]}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando CDPs…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar los CDPs.</p>}

      {data && (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º CDP</th>
                  <th className="px-3 py-2 text-left">Fecha</th>
                  <th className="px-3 py-2 text-left">Rubro</th>
                  <th className="px-3 py-2 text-left">Beneficiario</th>
                  <th className="px-3 py-2 text-right">V. Solicitado</th>
                  <th className="px-3 py-2 text-right">Saldo Disp.</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((cdp) => (
                  <tr key={cdp.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{cdp.numero}</td>
                    <td className="px-3 py-2">
                      {new Date(cdp.fechaExpedicion).toLocaleDateString('es-CO')}
                    </td>
                    <td className="px-3 py-2 max-w-[200px] truncate" title={cdp.rubroGastoNombre}>
                      {cdp.rubroGastoNombre}
                    </td>
                    <td className="px-3 py-2">{cdp.beneficiario ?? '—'}</td>
                    <td className="px-3 py-2 text-right">
                      {cdp.valorSolicitado != null ? formatCOP(cdp.valorSolicitado) : '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">
                      {formatCOP(cdp.saldoDisponible)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <StatusBadge label={CDP_LABEL[cdp.estado] ?? cdp.estado} variant={cdpVariant(cdp.estado)} />
                    </td>
                    <td className="px-3 py-2 text-center space-x-1">
                      <a
                        href={`/ejecucion/cdp/${cdp.id}`}
                        className="text-primary hover:underline text-xs"
                      >
                        Ver
                      </a>
                      {cdp.estado === 'ACTIVO' && (
                        <button
                          onClick={() => setCdpAAnular(cdp)}
                          className="text-destructive hover:underline text-xs"
                        >
                          Anular
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación simple */}
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

      {cdpAAnular && (
        <AnularCdpDialog
          cdp={cdpAAnular}
          onClose={() => setCdpAAnular(null)}
        />
      )}
    </div>
  );
}
