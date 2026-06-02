import { useEffect } from 'react';
import { formatCOP } from '@/shared/lib/currency';
import type { CalculoViatico } from '../../../model/types';
import type { CalcularViaticoParams } from '../api';
import { useCalcularViatico } from '../hook';
import { Loader2 } from 'lucide-react';

interface Props {
  params:   Partial<CalcularViaticoParams>;
  onResult: (calculo: CalculoViatico) => void;
}

export function CalculadoraViaticos({ params, onResult }: Props) {
  const mutation = useCalcularViatico();

  const isReady =
    !!params.tipoPersonal &&
    !!params.municipioDestinoId &&
    params.diasViaje !== undefined &&
    params.diasViaje > 0 &&
    !!params.vigencia;

  useEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {
      mutation.mutate(params as CalcularViaticoParams, { onSuccess: onResult });
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.tipoPersonal, params.municipioDestinoId,
    params.incluyePernoctacion, params.diasViaje,
    params.horasEfectivasDict, params.vigencia,
  ]);

  if (!isReady)          return null;
  if (mutation.isPending) return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> Calculando…
    </div>
  );
  if (mutation.isError)  return (
    <p className="text-sm text-destructive">
      No se encontró tarifa para los parámetros seleccionados.
    </p>
  );
  if (!mutation.data)    return null;

  const c = mutation.data;
  return (
    <div className="rounded-md bg-muted/50 p-4 space-y-2 text-sm">
      <p className="font-semibold">Estimación de viático</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <dt className="text-muted-foreground">Zona / tipo municipio</dt>
        <dd>{c.zona} / {c.municipioTipo}</dd>
        <dt className="text-muted-foreground">Valor día completo</dt>
        <dd className="font-mono">{formatCOP(c.valorDiaCompleto)}</dd>
        <dt className="text-muted-foreground">Valor medio día</dt>
        <dd className="font-mono">{formatCOP(c.valorMedioDia)}</dd>
        <dt className="text-muted-foreground">Transporte</dt>
        <dd className="font-mono">{formatCOP(c.valorTransporte)}</dd>
        <dt className="text-muted-foreground">Norma</dt>
        <dd>{c.normaAplicable}</dd>
      </dl>
      <p className="font-semibold text-base">
        Total estimado:{' '}
        <span className="font-mono text-primary">{formatCOP(c.valorTotalCalculado)}</span>
      </p>
      {c.detalleCalculo && (
        <p className="text-xs text-muted-foreground">{c.detalleCalculo}</p>
      )}
    </div>
  );
}
