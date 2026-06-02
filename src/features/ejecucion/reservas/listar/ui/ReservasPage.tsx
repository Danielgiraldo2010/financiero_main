// features/ejecucion/reservas/listar/ui/ReservasPage.tsx
// INVARIANTE 09b-I5: las reservas ANULADAS se muestran con StatusBadge, no se ocultan.
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { formatCOP } from '@/shared/lib/currency';
import { useReservas } from '../hook';
import { RegistrarReservaDialog } from '../../registrar/ui/RegistrarReservaDialog';
import { EjecutarReservaDialog } from '../../acciones/ui/EjecutarReservaDialog';
import { AnularReservaDialog } from '../../acciones/ui/AnularReservaDialog';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';
import type { ReservaPresupuestalResponse } from '../../model/types';

const RESERVA_LABEL: Record<string, string> = {
  ACTIVA: 'Activa', EJECUTADA: 'Ejecutada', ANULADA: 'Anulada',
}
function reservaVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'ACTIVA':    return 'success'
    case 'EJECUTADA': return 'info'
    case 'ANULADA':   return 'error'
    default:          return 'default'
  }
}

export function ReservasPage() {
  const [vigenciaOrigen, setVigenciaOrigen] = useState(new Date().getFullYear());
  // INVARIANTE 09b-I5: default '' (todos, incluyendo ANULADAS)
  const [estado, setEstado] = useState('');
  const [pagina, setPagina] = useState(1);
  const [reservaEjecutar, setReservaEjecutar] = useState<ReservaPresupuestalResponse | null>(null);
  const [reservaAnular, setReservaAnular]     = useState<ReservaPresupuestalResponse | null>(null);

  const { data, isLoading, isError } = useReservas({
    vigenciaOrigen,
    ...(estado ? { estado } : {}),
    pagina,
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Reservas Presupuestales"
        actions={<RegistrarReservaDialog />}
      />

      <div className="flex gap-3 flex-wrap">
        <SelectField
          label="Vigencia Origen"
          value={String(vigenciaOrigen)}
          onChange={(v) => { setVigenciaOrigen(Number(v)); setPagina(1); }}
          options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
        />
        <SelectField
          label="Estado"
          value={estado}
          onChange={(v) => { setEstado(v); setPagina(1); }}
          options={[
            { label: 'Todos (incl. anuladas)', value: ''         },
            { label: 'Activa',                  value: 'ACTIVA'   },
            { label: 'Ejecutada',               value: 'EJECUTADA'},
            { label: 'Anulada',                 value: 'ANULADA'  },
          ]}
        />
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando reservas…</p>}
      {isError   && <p className="text-sm text-destructive">Error al cargar las reservas.</p>}

      {data && (
        <>
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-3 py-2 text-left">N.º</th>
                  <th className="px-3 py-2 text-left">Tipo</th>
                  <th className="px-3 py-2 text-left">Vig. Orig/Dest</th>
                  <th className="px-3 py-2 text-left">Rubro</th>
                  <th className="px-3 py-2 text-right">Valor</th>
                  <th className="px-3 py-2 text-right">Ejecutado</th>
                  <th className="px-3 py-2 text-right">Saldo</th>
                  <th className="px-3 py-2 text-center">Estado</th>
                  <th className="px-3 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.id} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 font-mono text-xs">{r.numero}</td>
                    <td className="px-3 py-2 text-xs">{r.tipo}</td>
                    <td className="px-3 py-2 text-xs text-muted-foreground">
                      {r.vigenciaOrigen} → {r.vigenciaDestino}
                    </td>
                    <td className="px-3 py-2 max-w-[160px] truncate text-xs" title={r.rubroGastoNombre}>
                      {r.rubroGastoNombre}
                    </td>
                    <td className="px-3 py-2 text-right">{formatCOP(r.valor)}</td>
                    <td className="px-3 py-2 text-right">{formatCOP(r.valorEjecutado)}</td>
                    <td className="px-3 py-2 text-right font-medium">{formatCOP(r.saldo)}</td>
                    {/* INVARIANTE 09b-I5 */}
                    <td className="px-3 py-2 text-center"><StatusBadge label={RESERVA_LABEL[r.estado] ?? r.estado} variant={reservaVariant(r.estado)} /></td>
                    <td className="px-3 py-2 text-center space-x-1">
                      {r.estado === 'ACTIVA' && (
                        <>
                          <button onClick={() => setReservaEjecutar(r)}
                            className="text-primary hover:underline text-xs">Ejecutar</button>
                          <button onClick={() => setReservaAnular(r)}
                            className="text-destructive hover:underline text-xs">Anular</button>
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

      {reservaEjecutar && (
        <EjecutarReservaDialog reserva={reservaEjecutar} onClose={() => setReservaEjecutar(null)} />
      )}
      {reservaAnular && (
        <AnularReservaDialog reserva={reservaAnular} onClose={() => setReservaAnular(null)} />
      )}
    </div>
  );
}
