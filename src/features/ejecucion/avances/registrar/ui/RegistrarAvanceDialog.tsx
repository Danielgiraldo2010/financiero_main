// features/ejecucion/avances/registrar/ui/RegistrarAvanceDialog.tsx
// fechaAvance y fechaLimiteLegal son ISO date-time requeridos (OpenAPI).
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { useTenant } from '@/shared/hooks/useTenant';
import { registrarAvanceSchema, type RegistrarAvanceFormValues } from '../schema';
import { useRegistrarAvance } from '../hook';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

export function RegistrarAvanceDialog() {
  const [open, setOpen] = useState(false);
  const { tenantActivo } = useTenant();
  const registrar = useRegistrarAvance();

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarAvanceFormValues>({
    resolver: zodResolver(registrarAvanceSchema),
    defaultValues: {
      vigencia: new Date().getFullYear(),
      unidadEjecutoraId: tenantActivo?.id ?? 0,
    },
  });

  const onSubmit = async (values: RegistrarAvanceFormValues) => {
    await registrar.mutateAsync({
      ...values,
      nitCedula:          values.nitCedula          || null,
      cdpId:              values.cdpId              || null,
      urlDocumentoAvance: values.urlDocumentoAvance || null,
      observaciones:      values.observaciones      || null,
      // Convertir date strings a ISO
      fechaAvance:        new Date(values.fechaAvance).toISOString(),
      fechaLimiteLegal:   new Date(values.fechaLimiteLegal).toISOString(),
    });
    reset();
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
        + Registrar Avance
      </button>

      <Dialog open={open} onClose={() => { setOpen(false); reset(); }} title="Registrar Avance">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="vigencia" control={control} render={({ field }) => (
            <SelectField label="Vigencia *" value={String(field.value)}
              onChange={(v) => field.onChange(Number(v))}
              options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
              error={errors.vigencia?.message} />
          )} />

          <FormField label="Beneficiario *" error={errors.beneficiario?.message}>
            <input type="text" {...register('beneficiario')} className="input" />
          </FormField>

          <FormField label="NIT / Cédula" error={errors.nitCedula?.message}>
            <input type="text" {...register('nitCedula')} className="input" />
          </FormField>

          <FormField label="Concepto *" error={errors.concepto?.message}>
            <textarea {...register('concepto')} rows={2} className="input" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Rubro Gasto ID *" error={errors.rubroGastoId?.message}>
              <input type="number" {...register('rubroGastoId', { valueAsNumber: true })} className="input" />
            </FormField>
            <FormField label="Fuente Recurso ID *" error={errors.fuenteRecursoId?.message}>
              <input type="number" {...register('fuenteRecursoId', { valueAsNumber: true })} className="input" />
            </FormField>
          </div>

          <FormField label="CDP ID (opcional)" error={errors.cdpId?.message}>
            <input type="number" {...register('cdpId', { valueAsNumber: true, setValueAs: (v) => v || null })} className="input" />
          </FormField>

          <FormField label="Valor del Avance *" error={errors.valorAvance?.message} required>
            <Controller name="valorAvance" control={control} render={({ field }) => (
              <CurrencyInput value={field.value} onChange={field.onChange} />
            )} />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Fecha del Avance *" error={errors.fechaAvance?.message}>
              <input type="date" {...register('fechaAvance')} className="input" />
            </FormField>
            <FormField label="Fecha Límite Legal *" error={errors.fechaLimiteLegal?.message}>
              <input type="date" {...register('fechaLimiteLegal')} className="input" />
            </FormField>
          </div>

          <FormField label="URL Documento Avance" error={errors.urlDocumentoAvance?.message}>
            <input type="text" {...register('urlDocumentoAvance')} className="input" />
          </FormField>

          <FormField label="Observaciones" error={errors.observaciones?.message}>
            <textarea {...register('observaciones')} rows={2} className="input" />
          </FormField>

          {registrar.isError && (
            <p className="text-sm text-destructive">Error al registrar el avance.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setOpen(false); reset(); }} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={isSubmitting || registrar.isPending} className="btn-primary">
              {registrar.isPending ? 'Registrando…' : 'Registrar Avance'}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
