import { useParams } from '@tanstack/react-router';
import { PageHeader }      from '@/shared/ui/layout/PageHeader';
import { formatCOP }       from '@/shared/lib/currency';
import { LABEL_ESTADO_VIATICO } from '../../../model/constants';
import { useViaticoDetalle }    from '../hook';
import { DocumentosPanel }      from '@/features/documentos/entity/ui/DocumentosPanel';

export function ViaticoDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: viatico, isLoading } = useViaticoDetalle(Number(id));

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Cargando…</p>;
  if (!viatico)  return <p className="p-6 text-sm text-destructive">Viático no encontrado.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={`Viático #${viatico.id} — ${viatico.empleadoNombreCompleto}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Información general
            </h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Vigencia</dt>
              <dd>{viatico.vigencia}</dd>
              <dt className="text-muted-foreground">Proyecto</dt>
              <dd>{viatico.proyectoNombre}</dd>
              <dt className="text-muted-foreground">Tipo personal</dt>
              <dd>{viatico.tipoPersonal}</dd>
              <dt className="text-muted-foreground">Destino</dt>
              <dd>{viatico.municipioDestinoNombre}</dd>
              <dt className="text-muted-foreground">Fecha salida</dt>
              <dd>{viatico.fechaSalida}</dd>
              <dt className="text-muted-foreground">Fecha regreso</dt>
              <dd>{viatico.fechaRegreso}</dd>
              <dt className="text-muted-foreground">Días viaje</dt>
              <dd>{viatico.diasViaje}</dd>
              <dt className="text-muted-foreground">Pernoctación</dt>
              <dd>{viatico.incluyePernoctacion ? 'Sí' : 'No'}</dd>
              <dt className="text-muted-foreground">Estado</dt>
              <dd>{LABEL_ESTADO_VIATICO[viatico.estado]}</dd>
            </dl>
          </section>

          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Valores
            </h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Valor calculado</dt>
              <dd className="font-mono">{formatCOP(viatico.valorCalculado)}</dd>
              <dt className="text-muted-foreground">Valor aprobado</dt>
              <dd className="font-mono font-semibold">{formatCOP(viatico.valorAprobado)}</dd>
              {viatico.cdpNumero && (
                <>
                  <dt className="text-muted-foreground">CDP</dt>
                  <dd>{viatico.cdpNumero}</dd>
                </>
              )}
              {viatico.numeroResolucion && (
                <>
                  <dt className="text-muted-foreground">N° Resolución</dt>
                  <dd>{viatico.numeroResolucion}</dd>
                </>
              )}
            </dl>
          </section>

          {viatico.observaciones && (
            <section className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                Observaciones
              </h3>
              <p className="text-sm">{viatico.observaciones}</p>
            </section>
          )}
        </div>

        {/* FE8-I6 */}
        <div className="lg:col-span-1">
          <DocumentosPanel entidadTipo="VIATICO" entidadId={viatico.id} />
        </div>
      </div>
    </div>
  );
}
