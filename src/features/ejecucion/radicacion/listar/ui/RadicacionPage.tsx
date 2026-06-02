// features/ejecucion/radicacion/listar/ui/RadicacionPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useRadicaciones } from '../hook';
import { RegistrarRadicacionDialog } from '../../registrar/ui/RegistrarRadicacionDialog';
import { AprobarRadicacionDialog } from '../../acciones/ui/AprobarRadicacionDialog';
import { RechazarRadicacionDialog } from '../../acciones/ui/RechazarRadicacionDialog';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';
import type { RadicacionCuentaResponse } from '../../model/types';

const RADICACION_LABEL: Record<string, string> = {
  RADICADA: 'Radicada', APROBADA: 'Aprobada', RECHAZADA: 'Rechazada',
}
function radicacionVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'RADICADA':  return 'warning'
    case 'APROBADA':  return 'success'
    case 'RECHAZADA': return 'error'
    default:          return 'default'
  }
}

export function RadicacionPage() {
  const [vigencia, setVigencia] = useState(new Date().getFullYear());
  const [estado, setEstado]    = useState('');
  const [pagina, setPagina]    = useState(1);
  const [radicAprobar, setRadicAprobar]   = useState<RadicacionCuentaResponse | null>(null);
  const [radicRechazar, setRadicRechazar] = useState<RadicacionCuentaResponse | null>(null);

  const { data, isLoading, isError } = useRadicaciones({
    vigencia, ...(estado ? { estado } : {}), pagina,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Radicación de Cuentas"
        actions={<RegistrarRadicacionDialog />}
      />

      <div className="flex gap-3 flex-wrap">
        <SelectField label="Vigencia" value={String(vigencia)}
          onChange={(v) => { setVigencia(Number(v)); setPagina(1); }}
          options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))} />
        <SelectField label="Estado" value={estado}
          onChange={(v) => { setEstado(v); setPagina(1); }}
          options={[
            { label: 'Todos',     value: ''         },
            { label: 'Radicada',  value: 'RADICADA' },
            { label: 'Aprobada',  value: 'APROBADA' },
            { label: 'Rechazada', value: 'RECHAZADA'},
          ]} />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando radicaciones…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar las radicaciones.</p>}

      {data && (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º Radicado</th>
                  <th className="px-3 py-2 text-left">Proveedor</th>
                  <th className="px-3 py-2 text-left">Concepto</th>
                  <th className="px-3 py-2 text-right">V. Bruto</th>
                  <th className="px-3 py-2 text-right">Retenciones</th>
                  <th className="px-3 py-2 text-right">V. Neto</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-left">Revisado por</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{r.numeroRadicado}</td>
                    <td className="px-3 py-2">
                      <p>{r.proveedorNombre}</p>
                      {r.proveedorNit && <p className="text-xs text-muted-foreground">{r.proveedorNit}</p>}
                    </td>
                    <td className="px-3 py-2 max-w-[160px] truncate text-xs" title={r.concepto}>
                      {r.concepto}
                    </td>
                    <td className="px-3 py-2 text-right">{formatCOP(r.valorBruto)}</td>
                    <td className="px-3 py-2 text-right text-orange-600">{formatCOP(r.valorRetenciones)}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCOP(r.valorNeto)}</td>
                    <td className="px-3 py-2 text-center"><StatusBadge label={RADICACION_LABEL[r.estado] ?? r.estado} variant={radicacionVariant(r.estado)} /></td>
                    <td className="px-3 py-2 text-xs">{r.revisadoPor ?? '—'}</td>
                    <td className="px-3 py-2 text-center space-x-1">
                      {r.estado === 'RADICADA' && (
                        <>
                          <button onClick={() => setRadicAprobar(r)}
                            className="text-primary hover:underline text-xs">Aprobar</button>
                          <button onClick={() => setRadicRechazar(r)}
                            className="text-destructive hover:underline text-xs">Rechazar</button>
                        </>
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

      {radicAprobar   && <AprobarRadicacionDialog radicacion={radicAprobar}   onClose={() => setRadicAprobar(null)}   />}
      {radicRechazar  && <RechazarRadicacionDialog radicacion={radicRechazar} onClose={() => setRadicRechazar(null)} />}
    </div>
  );
}
