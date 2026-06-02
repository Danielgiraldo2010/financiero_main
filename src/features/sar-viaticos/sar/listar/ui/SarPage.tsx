import { useState } from 'react';
import { useNavigate }  from '@tanstack/react-router';
import { PageHeader }   from '@/shared/ui/layout/PageHeader';
import { formatCOP }    from '@/shared/lib/currency';
import { useSar }       from '../hook';
import { RegistrarSarDialog }  from '../../registrar/ui/RegistrarSarDialog';
import { SarActionsMenu }      from './SarActionsMenu';
import { ActualizarSarDialog } from '../../actualizar/ui/ActualizarSarDialog';
import { LABEL_ESTADO_SAR }    from '../../../model/constants';

export function SarPage() {
  const navigate = useNavigate();
  const [openRegistrar, setOpenRegistrar] = useState(false);
  const [editId, setEditId]               = useState<number | null>(null);
  const [vigencia, setVigencia]           = useState(new Date().getFullYear());
  const { data, isLoading, isError }      = useSar({ vigencia });

  return (
    <div className="space-y-4">
      <PageHeader
        title="SAR — Servicios Academicos Remunerados"
        actions={
          <button className="btn-primary" onClick={() => setOpenRegistrar(true)}>
            Registrar SAR
          </button>
        }
      />

      <div className="flex gap-3 items-end border-b pb-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Vigencia</label>
          <input type="number" className="input w-28" value={vigencia} min={2020} max={2099}
            onChange={e => setVigencia(Number(e.target.value))} />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {isError   && <p className="text-sm text-red-600">Error al cargar registros SAR.</p>}

      {data && data.items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay registros SAR para {vigencia}.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Tipo</th>
                <th>Horas</th>
                <th>Valor Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((sar) => (
                <tr key={sar.id}>
                  <td className="font-mono text-xs">{sar.id}</td>
                  <td>{sar.empleadoNombreCompleto}</td>
                  <td>{sar.tipoSar}</td>
                  <td>{sar.horasAprobadas}</td>
                  <td className="font-mono">{formatCOP(sar.valorTotalAprobado)}</td>
                  <td>
                    <span className={
                      sar.estado === 'EJECUTADO' ? 'badge-success' :
                      sar.estado === 'APROBADO'  ? 'badge-warning' :
                      sar.estado === 'ANULADO'   ? 'badge-destructive' :
                      'badge-neutral'
                    }>
                      {LABEL_ESTADO_SAR[sar.estado]}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1 items-center">
                      <button className="btn-ghost text-xs"
                        onClick={() => navigate({
                          to: '/sar-viaticos/sar/$id',
                          params: { id: String(sar.id) },
                        })}>
                        Ver
                      </button>
                      {sar.estado === 'BORRADOR' && (
                        <button className="btn-ghost text-xs"
                          onClick={() => setEditId(sar.id)}>
                          Editar
                        </button>
                      )}
                      <SarActionsMenu sar={sar} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RegistrarSarDialog
        open={openRegistrar}
        onClose={() => setOpenRegistrar(false)}
        vigencia={vigencia}
      />

      {editId !== null && (
        <ActualizarSarDialog
          id={editId}
          open
          onClose={() => setEditId(null)}
        />
      )}
    </div>
  );
}
