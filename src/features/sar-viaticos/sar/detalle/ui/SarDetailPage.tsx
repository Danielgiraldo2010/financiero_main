import { useParams } from '@tanstack/react-router';
import { PageHeader }  from '@/shared/ui/layout/PageHeader';
import { formatCOP }   from '@/shared/lib/currency';
import { formatDate }  from '@/shared/lib/date';
import {
  LABEL_ESTADO_SAR, LABEL_FUENTE_SAR, LABEL_TIPO_SAR,
} from '../../../model/constants';
import { useSarDetalle } from '../hook';
import { DocumentosPanel } from '@/features/documentos/entity/ui/DocumentosPanel';

export function SarDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: sar, isLoading } = useSarDetalle(Number(id));

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Cargando…</p>;
  if (!sar)      return <p className="p-6 text-sm text-destructive">SAR no encontrado.</p>;

  return (
    <div className="space-y-6">
      <PageHeader title={`SAR #${sar.id} — ${sar.empleadoNombreCompleto}`} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Información general
            </h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Vigencia</dt>
              <dd>{sar.vigencia}</dd>
              <dt className="text-muted-foreground">Proyecto</dt>
              <dd>{sar.proyectoNombre}</dd>
              <dt className="text-muted-foreground">Tipo SAR</dt>
              <dd>{LABEL_TIPO_SAR[sar.tipoSar] ?? sar.tipoSar}</dd>
              <dt className="text-muted-foreground">Tipo empleado</dt>
              <dd>{sar.tipoEmpleado}</dd>
              <dt className="text-muted-foreground">Descripción</dt>
              <dd>{sar.descripcion}</dd>
              <dt className="text-muted-foreground">Estado</dt>
              <dd>{LABEL_ESTADO_SAR[sar.estado]}</dd>
            </dl>
          </section>

          <section className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Horas y valores
            </h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Horas aprobadas</dt>
              <dd>{sar.horasAprobadas}</dd>
              <dt className="text-muted-foreground">Horas ejecutadas</dt>
              <dd>{sar.horasEjecutadas}</dd>
              <dt className="text-muted-foreground">Valor hora</dt>
              <dd className="font-mono">{formatCOP(sar.valorHora)}</dd>
              <dt className="text-muted-foreground">Total aprobado</dt>
              <dd className="font-mono font-semibold">{formatCOP(sar.valorTotalAprobado)}</dd>
              <dt className="text-muted-foreground">Total ejecutado</dt>
              <dd className="font-mono">{formatCOP(sar.valorTotalEjecutado)}</dd>
              <dt className="text-muted-foreground">Fuente financiación</dt>
              <dd>{LABEL_FUENTE_SAR[sar.fuenteFinanciacion as keyof typeof LABEL_FUENTE_SAR] ?? sar.fuenteFinanciacion}</dd>
            </dl>
          </section>

          {(sar.numeroResolucionDec || sar.cdpNumero) && (
            <section className="rounded-lg border p-4 space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Resolución y CDP
              </h3>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {sar.numeroResolucionDec && (
                  <>
                    <dt className="text-muted-foreground">N° Resolución Dec.</dt>
                    <dd>{sar.numeroResolucionDec}</dd>
                  </>
                )}
                {sar.fechaResolucion && (
                  <>
                    <dt className="text-muted-foreground">Fecha resolución</dt>
                    <dd>{formatDate(sar.fechaResolucion)}</dd>
                  </>
                )}
                {sar.cdpNumero && (
                  <>
                    <dt className="text-muted-foreground">CDP</dt>
                    <dd>{sar.cdpNumero}</dd>
                  </>
                )}
                {sar.urlResolucion && (
                  <>
                    <dt className="text-muted-foreground">Soporte</dt>
                    <dd>
                      <a href={sar.urlResolucion} target="_blank" rel="noreferrer"
                        className="text-primary underline text-xs">
                        Ver documento
                      </a>
                    </dd>
                  </>
                )}
              </dl>
            </section>
          )}
        </div>

        {/* Panel de documentos — FE8-I6 */}
        <div className="lg:col-span-1">
          <DocumentosPanel entidadTipo="SAR" entidadId={sar.id} />
        </div>
      </div>
    </div>
  );
}
