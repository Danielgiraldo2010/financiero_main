import { formatCOP } from '@/shared/lib/currency';
import { useResumenSarViaticos } from '../hook';

interface Props { vigencia: number; }

export function ResumenSarViaticosPanel({ vigencia }: Props) {
  const { data, isLoading } = useResumenSarViaticos(vigencia);
  if (isLoading) return <div className="h-24 animate-pulse rounded-lg bg-muted" />;
  if (!data)     return null;

  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      <section className="rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold">SAR — {vigencia}</h3>
        <dl className="space-y-1">
          {[
            ['Borrador',  data.totalSarBorrador],
            ['Aprobados', data.totalSarAprobados],
            ['Con CDP',   data.totalSarConCdp],
            ['Ejecutados',data.totalSarEjecutados],
          ].map(([label, count]) => (
            <div key={String(label)} className="flex justify-between">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{count}</dd>
            </div>
          ))}
        </dl>
        <div className="pt-2 border-t space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total aprobado</span>
            <span className="font-mono font-semibold">{formatCOP(data.montoTotalSarAprobado)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total ejecutado</span>
            <span className="font-mono">{formatCOP(data.montoTotalSarEjecutado)}</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border p-4 space-y-3">
        <h3 className="font-semibold">Viáticos — {vigencia}</h3>
        <dl className="space-y-1">
          {[
            ['Borrador',   data.totalViaticosBorrador],
            ['Aprobados',  data.totalViaticosAprobados],
            ['Con CDP',    data.totalViaticosConCdp],
            ['Liquidados', data.totalViaticosLiquidados],
          ].map(([label, count]) => (
            <div key={String(label)} className="flex justify-between">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium">{count}</dd>
            </div>
          ))}
        </dl>
        <div className="pt-2 border-t space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total aprobado</span>
            <span className="font-mono font-semibold">{formatCOP(data.montoTotalViaticosAprobado)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total calculado</span>
            <span className="font-mono">{formatCOP(data.montoTotalViaticosCalculado)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
