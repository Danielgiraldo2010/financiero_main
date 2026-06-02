// features/ejecucion/cdp/generar/ui/GenerarCdpDialog.tsx
//
// INVARIANTE 09a-I1:
//   Al montarse llama useVerificarDisponibilidad() cuando los campos
//   vigencia, rubroGastoId, fuenteRecursoId y valorSolicitado están completos.
//   Muestra el saldo disponible antes de que el usuario confirme.
//   Si disponible < valorSolicitado → advertencia roja (no bloquea).
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { formatCOP } from '@/shared/lib/currency';
import { useTenant } from '@/shared/hooks/useTenant';
import { generarCdpSchema, type GenerarCdpFormValues } from '../schema';
import { useGenerarCdp } from '../hook';
import { useVerificarDisponibilidad } from '../../verificar/hook';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

export function GenerarCdpDialog() {
  const [open, setOpen] = useState(false);
  const { tenantActivo } = useTenant();
  const generar   = useGenerarCdp();
  const verificar = useVerificarDisponibilidad();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerarCdpFormValues>({
    resolver: zodResolver(generarCdpSchema),
    defaultValues: {
      vigencia:          new Date().getFullYear(),
      unidadEjecutoraId: tenantActivo?.id ?? 0,
    },
  });

  // Observar campos para verificación de disponibilidad
  const [watchVigencia, watchRubro, watchFuente, watchValor] = watch([
    'vigencia', 'rubroGastoId', 'fuenteRecursoId', 'valorSolicitado',
  ]);

  // INVARIANTE 09a-I1: verificar disponibilidad al tener todos los campos
  useEffect(() => {
    if (
      open &&
      watchVigencia &&
      watchRubro > 0 &&
      watchFuente > 0 &&
      watchValor > 0
    ) {
      verificar.mutate({
        vigencia:       watchVigencia,
        rubroGastoId:   watchRubro,
        fuenteRecursoId: watchFuente,
        valorSolicitado: watchValor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, watchVigencia, watchRubro, watchFuente, watchValor]);

  const onSubmit = async (values: GenerarCdpFormValues) => {
    await generar.mutateAsync({
      ...values,
      objeto:       values.objeto       || null,
      descripcion:  values.descripcion  || null,
      urlDocumento: values.urlDocumento || null,
    });
    reset();
    setOpen(false);
  };

  // Alerta de disponibilidad (09a-I1)
  const disp = verificar.data;
  const hayAlertaDisponibilidad =
    disp != null && watchValor > 0 && disp.disponible < watchValor;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
      >
        + Generar CDP
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Generar CDP">
        {/* Panel de disponibilidad — 09a-I1 */}
        {disp && (
          <div
            className={`mb-4 p-3 rounded-md text-sm border ${
              hayAlertaDisponibilidad
                ? 'bg-destructive/10 border-destructive text-destructive'
                : 'bg-green-50 border-green-300 text-green-800'
            }`}
          >
            <p className="font-semibold">
              {hayAlertaDisponibilidad
                ? '⚠ Saldo insuficiente (el backend tomará la decisión final)'
                : '✓ Disponibilidad confirmada'}
            </p>
            <p>
              Disponible en {disp.rubroNombre}: <strong>{formatCOP(disp.disponible)}</strong>
            </p>
            {disp.mensaje && <p className="mt-1 text-xs">{disp.mensaje}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Vigencia */}
          <Controller
            name="vigencia"
            control={control}
            render={({ field }) => (
              <SelectField
                label="Vigencia *"
                value={String(field.value)}
                onChange={(v) => field.onChange(Number(v))}
                options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
                error={errors.vigencia?.message}
              />
            )}
          />

          {/* rubroGastoId — el componente SearchableSelect real del proyecto */}
          <FormField label="Rubro de Gasto *" error={errors.rubroGastoId?.message}>
            <input
              type="number"
              {...register('rubroGastoId', { valueAsNumber: true })}
              placeholder="ID del rubro"
              className="input"
            />
            {/* TODO: reemplazar con <SearchableSelect endpoint="/api/v1/rubros-gasto" /> */}
          </FormField>

          {/* fuenteRecursoId */}
          <FormField label="Fuente de Recurso *" error={errors.fuenteRecursoId?.message}>
            <input
              type="number"
              {...register('fuenteRecursoId', { valueAsNumber: true })}
              placeholder="ID de la fuente"
              className="input"
            />
            {/* TODO: reemplazar con <SearchableSelect endpoint="/api/v1/fuentes-recurso" /> */}
          </FormField>

          {/* Valor solicitado */}
          <FormField label="Valor Solicitado *" error={errors.valorSolicitado?.message} required>
            <Controller
              name="valorSolicitado"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>

          <FormField label="Beneficiario *" error={errors.beneficiario?.message}>
            <input type="text" {...register('beneficiario')} className="input" />
          </FormField>

          <FormField label="Objeto" error={errors.objeto?.message}>
            <textarea {...register('objeto')} rows={2} className="input" />
          </FormField>

          <FormField label="Descripción" error={errors.descripcion?.message}>
            <textarea {...register('descripcion')} rows={2} className="input" />
          </FormField>

          <FormField label="URL Documento" error={errors.urlDocumento?.message}>
            <input type="text" {...register('urlDocumento')} className="input" />
          </FormField>

          {generar.isError && (
            <p className="text-sm text-destructive">
              Error al generar el CDP. Intente nuevamente.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || generar.isPending} className="btn-primary">
              {generar.isPending ? 'Generando…' : 'Generar CDP'}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
