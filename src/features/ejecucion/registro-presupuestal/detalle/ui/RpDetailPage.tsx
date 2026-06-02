// features/ejecucion/registro-presupuestal/detalle/ui/RpDetailPage.tsx
//
// INVARIANTE 09a-I6:
//   saldoPendiente mostrado prominentemente (tipografía grande, color semántico).
//   Color verde si porcentajeEjecutado < 80, naranja si ≥ 80, rojo si ≥ 95.
import { useParams } from '@tanstack/react-router';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { StatusBadge } from '@/shared/ui/feedback/StatusBadge';
import { formatCOP } from '@/shared/lib/currency';
import { useRp } from '../hook';
import { useRpSaldo } from '../../saldo/hook';

function saldoColor(pct: number): string {
  if (pct >= 95) return 'text-destructive';
  if (pct >= 80) return 'text-orange-600';
  return 'text-green-700';
}

const RP_LABEL: Record<string, string> = {
  ACTIVO: 'Activo', PARCIALMENTE_PAGADO: 'Parc. Pagado', PAGADO: 'Pagado', ANULADO: 'Anulado',
}

function rpVariant(estado: string): 'success' | 'warning' | 'error' | 'info' | 'default' {
  switch (estado) {
    case 'ACTIVO':              return 'success'
    case 'PARCIALMENTE_PAGADO': return 'info'
    case 'PAGADO':              return 'warning'
    case 'ANULADO':             return 'error'
    default:                    return 'default'
  }
}

export function RpDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const rpId = Number(id);

  const { data: rp,    isLoading: cargandoRp,    isError: errorRp    } = useRp(rpId);
  const { data: saldo, isLoading: cargandoSaldo                       } = useRpSaldo(rpId);

  if (cargandoRp) return <p className="text-sm text-muted-foreground">Cargando…</p>;
  if (errorRp || !rp)
    return <p className="text-sm text-destructive">No se pudo cargar el RP.</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`RP ${rp.numero}`}
        actions={<StatusBadge label={RP_LABEL[rp.estado] ?? rp.estado} variant={rpVariant(rp.estado)} />}
      />

      {/* Saldo prominente — INVARIANTE 09a-I6 */}
      <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-center">
        <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
          Saldo Pendiente
        </p>
        {cargandoSaldo ? (
          <p className="text-2xl font-bold text-muted-foreground">—</p>
        ) : saldo ? (
          <>
            <p className={`text-4xl font-bold ${saldoColor(saldo.porcentajeEjecutado)}`}>
              {formatCOP(saldo.saldoPendiente)}
            </p>
            <p className={`mt-2 text-sm font-medium ${saldoColor(saldo.porcentajeEjecutado)}`}>
              {saldo.porcentajeEjecutado.toFixed(1)}% ejecutado
            </p>
          </>
        ) : null}
      </div>

      {/* Ficha */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border rounded-lg p-4">
        <Field label="Vigencia"    value={String(rp.vigencia)} />
        <Field label="Fecha"       value={new Date(rp.fechaRegistro).toLocaleDateString('es-CO')} />
        <Field label="CDP"         value={rp.cdpNumero} />
        <Field label="Rubro"       value={rp.rubroGastoNombre} />
        <Field label="Beneficiario" value={rp.beneficiario ?? '—'} />
        <Field label="NIT/Cédula"  value={rp.nitCedula ?? '—'} />
      </div>

      {/* Valores */}
      <div className="grid grid-cols-3 gap-4">
        <MoneyCard label="Valor Total"  value={rp.valorTotal}  />
        <MoneyCard label="Valor Pagado" value={rp.valorPagado} />
        <MoneyCard label="Órdenes de Pago" value={rp.numeroOrdenesPago} isCurrency={false} />
      </div>
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
  label, value, isCurrency = true,
}: {
  label: string; value: number; isCurrency?: boolean;
}) {
  return (
    <div className="rounded-lg p-3 border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">
        {isCurrency ? formatCOP(value) : value}
      </p>
    </div>
  );
}
