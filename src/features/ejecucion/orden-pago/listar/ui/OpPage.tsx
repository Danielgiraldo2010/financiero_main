// features/ejecucion/orden-pago/listar/ui/OpPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useOps } from '../hook';
import { RegistrarOpDialog } from '../../registrar/ui/RegistrarOpDialog';
import { ConfirmarPagoDialog } from '../../confirmar/ui/ConfirmarPagoDialog';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';
import type { OrdenPagoResponse } from '../../model/types';

const OP_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente', PAGADO: 'Pagado', ANULADO: 'Anulado',
}
function opVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'PENDIENTE': return 'warning'
    case 'PAGADO':    return 'success'
    case 'ANULADO':   return 'error'
    default:          return 'default'
  }
}

export function OpPage() {
  const [vigencia, setVigencia] = useState(new Date().getFullYear());
  const [estado, setEstado]    = useState('');
  const [pagina, setPagina]    = useState(1);
  const [opAConfirmar, setOpAConfirmar] = useState<OrdenPagoResponse | null>(null);

  const { data, isLoading, isError } = useOps({ vigencia, ...(estado ? { estado } : {}), pagina });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Órdenes de Pago"
        actions={<RegistrarOpDialog />}
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
            { label: 'Todos',    value: ''         },
            { label: 'Pendiente', value: 'PENDIENTE' },
            { label: 'Pagado',    value: 'PAGADO'    },
            { label: 'Anulado',   value: 'ANULADO'   },
          ]}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando órdenes…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar las órdenes de pago.</p>}

      {data && (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º OP</th>
                  <th className="px-3 py-2 text-left">RP</th>
                  <th className="px-3 py-2 text-left">Beneficiario</th>
                  <th className="px-3 py-2 text-left">Concepto</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-left">Fecha Pago</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((op) => (
                  <tr key={op.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{op.numero}</td>
                    <td className="px-3 py-2 font-mono text-xs">{op.rpNumero}</td>
                    <td className="px-3 py-2">{op.beneficiario ?? '—'}</td>
                    <td className="px-3 py-2 max-w-[180px] truncate" title={op.concepto ?? ''}>
                      {op.concepto ?? '—'}
                    </td>
                    <td className="px-3 py-2 text-right font-medium">{formatCOP(op.valor)}</td>
                    <td className="px-3 py-2 text-center"><StatusBadge label={OP_LABEL[op.estado] ?? op.estado} variant={opVariant(op.estado)} /></td>
                    <td className="px-3 py-2 text-xs">
                      {op.fechaPago
                        ? new Date(op.fechaPago).toLocaleDateString('es-CO')
                        : '—'}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {op.estado === 'PENDIENTE' && (
                        <button
                          onClick={() => setOpAConfirmar(op)}
                          className="text-primary hover:underline text-xs font-medium"
                        >
                          Confirmar Pago
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{data.total} registros</span>
            <div className="flex gap-2">
              <button disabled={data.pagina <= 1} onClick={() => setPagina((p) => p - 1)}
                className="px-2 py-1 border rounded disabled:opacity-40">← Anterior</button>
              <span>Pág. {data.pagina} / {data.totalPaginas}</span>
              <button disabled={data.pagina >= data.totalPaginas} onClick={() => setPagina((p) => p + 1)}
                className="px-2 py-1 border rounded disabled:opacity-40">Siguiente →</button>
            </div>
          </div>
        </>
      )}

      {opAConfirmar && (
        <ConfirmarPagoDialog op={opAConfirmar} onClose={() => setOpAConfirmar(null)} />
      )}
    </div>
  );
}
