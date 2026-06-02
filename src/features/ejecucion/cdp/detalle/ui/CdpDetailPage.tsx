// features/ejecucion/cdp/detalle/ui/CdpDetailPage.tsx
//
// INVARIANTE 09a-I4:
//   DocumentosPanel se monta con entidadTipo="CDP" y canUpload solo si rol FINANCIERO.
import { useParams } from '@tanstack/react-router';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { DocumentosPanel } from '@/features/documentos/entity/ui/DocumentosPanel';
import { formatCOP } from '@/shared/lib/currency';
import { usePermissions } from '@/shared/hooks/usePermissions';
import { useCdp } from '../hook';

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

export function CdpDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const cdpId  = Number(id);
  const { data: cdp, isLoading, isError } = useCdp(cdpId);
  const { hasRole } = usePermissions();
  const puedeSubir = hasRole('FINANCIERO');

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (isError || !cdp)
    return <p className="text-sm text-destructive">No se pudo cargar el CDP.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`CDP ${cdp.numero}`}
        actions={<StatusBadge label={CDP_LABEL[cdp.estado] ?? cdp.estado} variant={cdpVariant(cdp.estado)} />}
      />

      {/* Ficha principal */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4">
        <Field label="Vigencia"       value={String(cdp.vigencia)} />
        <Field label="Fecha Expedición"
          value={new Date(cdp.fechaExpedicion).toLocaleDateString('es-CO')} />
        <Field label="Unidad Ejecutora" value={cdp.unidadEjecutoraNombre} />
        <Field label="Rubro de Gasto"  value={cdp.rubroGastoNombre} />
        <Field label="Fuente"          value={cdp.fuenteRecursoNombre} />
        <Field label="Beneficiario"    value={cdp.beneficiario ?? '—'} />
        <Field label="Objeto"          value={cdp.objeto ?? '—'} />
        <Field label="Descripción"     value={cdp.descripcion ?? '—'} />
      </div>

      {/* Valores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MoneyCard label="V. Solicitado"   value={cdp.valorSolicitado ?? 0} />
        <MoneyCard label="V. Aprobado"     value={cdp.valorAprobado} />
        <MoneyCard label="V. Comprometido" value={cdp.valorComprometidoRp} />
        <MoneyCard label="Saldo Disponible" value={cdp.saldoDisponible} highlight />
      </div>

      {/* RPs vinculados: se renderiza desde RpPage filtrado por cdpId (navegación) */}

      {/* Documentos — INVARIANTE 09a-I4 */}
      <DocumentosPanel
        entidadTipo="CDP"
        entidadId={cdp.id}
        {...(puedeSubir ? { canUpload: true } : {})}
      />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function MoneyCard({
  label, value, highlight = false,
}: {
  label: string; value: number; highlight?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 border ${highlight ? 'border-primary bg-primary/5' : ''}`}>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-semibold ${highlight ? 'text-primary text-lg' : 'text-sm'}`}>
        {formatCOP(value)}
      </p>
    </div>
  );
}
