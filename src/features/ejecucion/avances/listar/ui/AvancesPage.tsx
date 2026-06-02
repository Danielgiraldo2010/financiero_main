// features/ejecucion/avances/listar/ui/AvancesPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useAvances } from '../hook';
import { RegistrarAvanceDialog } from '../../registrar/ui/RegistrarAvanceDialog';
import { LegalizarAvanceDialog } from '../../legalizar/ui/LegalizarAvanceDialog';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';
import type { AvanceLegalizacionResponse } from '../../model/types';

function diasColor(dias: number | null): string {
  if (dias === null) return 'text-muted-foreground';
  if (dias <= 0)  return 'text-destructive font-bold';
  if (dias <= 5)  return 'text-orange-600 font-semibold';
  return 'text-muted-foreground';
}

const AVANCE_LABEL: Record<string, string> = {
  PENDIENTE: 'Pendiente', LEGALIZADO: 'Legalizado', VENCIDO: 'Vencido',
}
function avanceVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'PENDIENTE':  return 'warning'
    case 'LEGALIZADO': return 'success'
    case 'VENCIDO':    return 'error'
    default:           return 'default'
  }
}

export function AvancesPage() {
  const [vigencia, setVigencia] = useState(new Date().getFullYear());
  const [estado, setEstado]    = useState('');
  const [pagina, setPagina]    = useState(1);
  const [avanceLegalizar, setAvanceLegalizar] = useState<AvanceLegalizacionResponse | null>(null);

  const { data, isLoading, isError } = useAvances({ vigencia, ...(estado ? { estado } : {}), pagina });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Avances y Legalizaciones"
        actions={<RegistrarAvanceDialog />}
      />

      <div className="flex gap-3 flex-wrap">
        <SelectField label="Vigencia" value={String(vigencia)}
          onChange={(v) => { setVigencia(Number(v)); setPagina(1); }}
          options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))} />
        <SelectField label="Estado" value={estado}
          onChange={(v) => { setEstado(v); setPagina(1); }}
          options={[
            { label: 'Todos',      value: ''          },
            { label: 'Pendiente',  value: 'PENDIENTE' },
            { label: 'Legalizado', value: 'LEGALIZADO'},
            { label: 'Vencido',    value: 'VENCIDO'   },
          ]} />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando avances…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar los avances.</p>}

      {data && (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º</th>
                  <th className="px-3 py-2 text-left">Beneficiario</th>
                  <th className="px-3 py-2 text-left">Concepto</th>
                  <th className="px-3 py-2 text-right">Valor Avance</th>
                  <th className="px-3 py-2 text-right">Legalizado</th>
                  <th className="px-3 py-2 text-left">Límite Legal</th>
                  <th className="px-3 py-2 text-right">Días Rest.</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((a) => (
                  <tr key={a.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{a.numero}</td>
                    <td className="px-3 py-2">{a.beneficiario}</td>
                    <td className="px-3 py-2 max-w-[160px] truncate text-xs" title={a.concepto}>
                      {a.concepto}
                    </td>
                    <td className="px-3 py-2 text-right">{formatCOP(a.valorAvance)}</td>
                    <td className="px-3 py-2 text-right">{formatCOP(a.valorLegalizado)}</td>
                    <td className="px-3 py-2 text-xs">
                      {a.fechaLimiteLegal
                        ? new Date(a.fechaLimiteLegal).toLocaleDateString('es-CO')
                        : '—'}
                    </td>
                    <td className={`px-3 py-2 text-right text-xs ${diasColor(a.diasParaVencimiento)}`}>
                      {a.diasParaVencimiento !== null ? a.diasParaVencimiento : '—'}
                    </td>
                    <td className="px-3 py-2 text-center"><StatusBadge label={AVANCE_LABEL[a.estado] ?? a.estado} variant={avanceVariant(a.estado)} /></td>
                    <td className="px-3 py-2 text-center">
                      {a.estado === 'PENDIENTE' && (
                        <button onClick={() => setAvanceLegalizar(a)}
                          className="text-primary hover:underline text-xs font-medium">
                          Legalizar
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

      {avanceLegalizar && (
        <LegalizarAvanceDialog avance={avanceLegalizar} onClose={() => setAvanceLegalizar(null)} />
      )}
    </div>
  );
}
