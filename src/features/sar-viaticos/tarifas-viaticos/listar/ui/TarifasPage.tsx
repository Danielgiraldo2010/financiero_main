import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { formatCOP }  from '@/shared/lib/currency';
import { useTarifasViaticos, useDesactivarTarifaViatico } from '../hook';
import { RegistrarTarifaDialog }  from '../../registrar/ui/RegistrarTarifaDialog';
import { ConsultarTarifaDialog }  from '../../consultar/ui/ConsultarTarifaDialog';
import { ActualizarTarifaDialog } from '../../actualizar/ui/ActualizarTarifaDialog';
import {
  LABEL_TIPO_PERSONAL,
  LABEL_ZONA_VIATICO,
} from '../../../model/constants';
import type { TipoPersonalViatico, ZonaViatico } from '../../../model/constants';

type Dialog =
  | { type: 'consultar' | 'actualizar'; id: number }
  | null;

export function TarifasPage() {
  const [openRegistrar, setOpenRegistrar] = useState(false);
  const [dialog, setDialog]               = useState<Dialog>(null);
  const [vigencia, setVigencia]           = useState(new Date().getFullYear());

  const { data, isLoading, isError } = useTarifasViaticos({ vigencia });
  const desactivar = useDesactivarTarifaViatico();

  const closeDialog = () => setDialog(null);

  function handleDesactivar(id: number) {
    if (!confirm('Desactivar esta tarifa? Esta accion no se puede deshacer.')) return;
    desactivar.mutate(id);
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Tarifas de Viaticos"
        actions={
          <button className="btn-primary" onClick={() => setOpenRegistrar(true)}>
            Nueva tarifa
          </button>
        }
      />

      <div className="flex gap-3 items-end border-b pb-3">
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Vigencia
          </label>
          <input type="number" className="input w-28" value={vigencia} min={2020} max={2099}
            onChange={e => setVigencia(Number(e.target.value))} />
        </div>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {isError   && <p className="text-sm text-red-600">Error al cargar tarifas.</p>}

      {data && data.items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No hay tarifas registradas para {vigencia}.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead>
              <tr>
                <th>Tipo personal</th>
                <th>Zona</th>
                <th>Municipio</th>
                <th>Pernoc.</th>
                <th>Dia completo</th>
                <th>Medio dia</th>
                <th>Transporte</th>
                <th>Norma</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((t) => (
                <tr key={t.id}>
                  <td>{LABEL_TIPO_PERSONAL[t.tipoPersonal as TipoPersonalViatico] ?? t.tipoPersonal}</td>
                  <td>{LABEL_ZONA_VIATICO[t.zona as ZonaViatico] ?? t.zona}</td>
                  <td>{t.municipioTipo}</td>
                  <td>{t.incluyePernoctacion ? 'Si' : 'No'}</td>
                  <td className="font-mono">{formatCOP(t.valorDiaCompleto)}</td>
                  <td className="font-mono">{formatCOP(t.valorMedioDia)}</td>
                  <td className="font-mono">{formatCOP(t.valorTransporte)}</td>
                  <td className="text-xs text-muted-foreground">{t.normaAplicable}</td>
                  <td>
                    <div className="flex gap-1">
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => setDialog({ type: 'consultar', id: t.id })}
                      >
                        Ver
                      </button>
                      <button
                        className="btn-ghost text-xs"
                        onClick={() => setDialog({ type: 'actualizar', id: t.id })}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-ghost text-xs text-destructive"
                        onClick={() => handleDesactivar(t.id)}
                        disabled={desactivar.isPending}
                      >
                        Desactivar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RegistrarTarifaDialog
        open={openRegistrar}
        onClose={() => setOpenRegistrar(false)}
      />

      {dialog?.type === 'consultar' && (
        <ConsultarTarifaDialog id={dialog.id} open onClose={closeDialog} />
      )}

      {dialog?.type === 'actualizar' && (
        <ActualizarTarifaDialog id={dialog.id} open onClose={closeDialog} />
      )}
    </div>
  );
}
