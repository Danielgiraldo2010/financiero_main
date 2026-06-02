// features/ejecucion/reportes/generar-alertas/ui/GenerarAlertasPage.tsx
//
// CORRECCIÓN: el backend devuelve { alertas_generadas: number },
// no PagedResult<AlertaResponse>. El componente se adapta a la respuesta real.
import { useState } from 'react';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { useGenerarAlertas } from '../hook';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

interface GenerarAlertasResponse {
  alertas_generadas: number;
}

export function GenerarAlertasPage() {
  const [vigencia, setVigencia]   = useState(new Date().getFullYear());
  const [resultado, setResultado] = useState<GenerarAlertasResponse | null>(null);
  const generar = useGenerarAlertas();

  const handleGenerar = async () => {
    const data = await generar.mutateAsync({ vigencia });
    setResultado(data as unknown as GenerarAlertasResponse);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Generar Alertas Presupuestales" />

      {/* Panel de accion */}
      <div className="rounded-lg border p-5 space-y-4 bg-background">
        <p className="text-sm text-muted-foreground">
          Analiza los CDPs de la vigencia seleccionada y genera alertas para los rubros
          que han superado los umbrales de ejecucion configurados.
          Los resultados se actualizan tambien en el dashboard de alertas.
        </p>

        <div className="flex gap-3 items-end">
          <SelectField
            label="Vigencia"
            value={String(vigencia)}
            onChange={(v) => {
              setVigencia(Number(v));
              setResultado(null);
            }}
            options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
          />
          <button
            onClick={handleGenerar}
            disabled={generar.isPending}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50"
          >
            {generar.isPending ? 'Generando alertas...' : 'Generar Alertas'}
          </button>
        </div>

        {generar.isError && (
          <p className="text-sm text-destructive">
            Error al generar las alertas. Intente nuevamente.
          </p>
        )}
      </div>

      {/* Resultado */}
      {resultado !== null && (
        <div className="rounded-lg border p-5 bg-background space-y-2">
          <h2 className="text-sm font-semibold">
            Resultado — Vigencia {vigencia}
          </h2>

          {resultado.alertas_generadas === 0 ? (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              Sin alertas — todos los rubros estan dentro de los umbrales configurados.
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary">
                {resultado.alertas_generadas}
              </span>
              <span className="text-sm text-muted-foreground">
                alerta{resultado.alertas_generadas !== 1 ? 's' : ''} generada{resultado.alertas_generadas !== 1 ? 's' : ''} correctamente.
                Puedes consultarlas en el modulo de Alertas del Dashboard.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
