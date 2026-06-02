// features/ejecucion/registro-presupuestal/generar/ui/GenerarRpDialog.tsx
//
// INVARIANTE 09a-I5:
//   El SearchableSelect de CDP filtra SOLO CDPs en estado ACTIVO.
import { useState } from 'react';
import { useCdps } from '../../../cdp/listar/hook';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { generarRpSchema, type GenerarRpFormValues } from '../schema';
import { useGenerarRp } from '../hook';

export function GenerarRpDialog() {
  const [open, setOpen] = useState(false);
  const generar  = useGenerarRp();
  const { data: cdpsData, isLoading: cargandoCdps } = useCdps({ estado: 'ACTIVO' });
  const cdpOptions = (cdpsData?.items ?? []).map((cdp) => ({
    value: cdp.id,
    label: `${cdp.numero} — ${cdp.beneficiario ?? cdp.rubroGastoNombre}`,
  }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GenerarRpFormValues>({
    resolver: zodResolver(generarRpSchema),
  });

  const onSubmit = async (values: GenerarRpFormValues) => {
    await generar.mutateAsync({
      ...values,
      descripcion:  values.descripcion  || null,
      urlDocumento: values.urlDocumento || null,
    });
    reset();
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
      >
        + Generar RP
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Generar Registro Presupuestal">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* INVARIANTE 09a-I5: filtrar solo CDPs ACTIVOS */}
          <Controller
            name="cdpId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="CDP *"
                placeholder="Buscar CDP activo…"
                options={cdpOptions}
                isLoading={cargandoCdps}
                value={field.value}
                onChange={(v) => field.onChange(v)}
                error={errors.cdpId?.message}
              />
            )}
          />

          <FormField label="Valor Total *" error={errors.valorTotal?.message} required>
            <Controller
              name="valorTotal"
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

          <FormField label="NIT / Cédula *" error={errors.nitCedula?.message}>
            <input type="text" {...register('nitCedula')} className="input" />
          </FormField>

          <FormField label="Descripción" error={errors.descripcion?.message}>
            <textarea {...register('descripcion')} rows={2} className="input" />
          </FormField>

          <FormField label="URL Documento" error={errors.urlDocumento?.message}>
            <input type="text" {...register('urlDocumento')} className="input" />
          </FormField>

          {generar.isError && (
            <p className="text-sm text-destructive">
              Error al generar el RP. Verifique los datos e intente nuevamente.
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting || generar.isPending} className="btn-primary">
              {generar.isPending ? 'Generando…' : 'Generar RP'}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
