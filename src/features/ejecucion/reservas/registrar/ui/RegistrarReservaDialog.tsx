// features/ejecucion/reservas/registrar/ui/RegistrarReservaDialog.tsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { useTenant } from '@/shared/hooks/useTenant';
import { registrarReservaSchema, type RegistrarReservaFormValues } from '../schema';
import { useRegistrarReserva } from '../hook';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

const TIPOS_RESERVA = [
  { label: 'Reserva Presupuestal', value: 'RESERVA_PRESUPUESTAL' },
  { label: 'Cuenta por Pagar',     value: 'CUENTA_POR_PAGAR'     },
];

export function RegistrarReservaDialog() {
  const [open, setOpen] = useState(false);
  const { tenantActivo } = useTenant();
  const registrar = useRegistrarReserva();
  const year = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarReservaFormValues>({
    resolver: zodResolver(registrarReservaSchema),
    defaultValues: {
      vigenciaOrigen:    year,
      vigenciaDestino:   year + 1,
      unidadEjecutoraId: tenantActivo?.id ?? 0,
    },
  });

  const onSubmit = async (values: RegistrarReservaFormValues) => {
    await registrar.mutateAsync({
      ...values,
      cdpId:                  values.cdpId                  || null,
      registroPresupuestalId: values.registroPresupuestalId || null,
      beneficiario:           values.beneficiario            || null,
      concepto:               values.concepto                || null,
      justificacion:          values.justificacion           || null,
      urlDocumento:           values.urlDocumento            || null,
    });
    reset();
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
        + Registrar Reserva
      </button>

      <Dialog open={open} onClose={() => { setOpen(false); reset(); }} title="Registrar Reserva Presupuestal">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller name="tipo" control={control} render={({ field }) => (
            <SelectField label="Tipo *" value={field.value} onChange={field.onChange}
              options={TIPOS_RESERVA} error={errors.tipo?.message} />
          )} />

          <div className="grid grid-cols-2 gap-3">
            <Controller name="vigenciaOrigen" control={control} render={({ field }) => (
              <SelectField label="Vigencia Origen *" value={String(field.value)}
                onChange={(v) => field.onChange(Number(v))}
                options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
                error={errors.vigenciaOrigen?.message} />
            )} />
            <Controller name="vigenciaDestino" control={control} render={({ field }) => (
              <SelectField label="Vigencia Destino *" value={String(field.value)}
                onChange={(v) => field.onChange(Number(v))}
                options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
                error={errors.vigenciaDestino?.message} />
            )} />
          </div>

          <FormField label="Rubro de Gasto ID *" error={errors.rubroGastoId?.message}>
            <input type="number" {...register('rubroGastoId', { valueAsNumber: true })} className="input" />
          </FormField>

          <FormField label="Fuente de Recurso ID *" error={errors.fuenteRecursoId?.message}>
            <input type="number" {...register('fuenteRecursoId', { valueAsNumber: true })} className="input" />
          </FormField>

          <FormField label="Valor *" error={errors.valor?.message} required>
            <Controller name="valor" control={control} render={({ field }) => (
              <CurrencyInput value={field.value} onChange={field.onChange} />
            )} />
          </FormField>

          <FormField label="CDP ID (opcional)" error={errors.cdpId?.message}>
            <input type="number" {...register('cdpId', { valueAsNumber: true, setValueAs: (v) => v || null })} className="input" />
          </FormField>

          <FormField label="RP ID (opcional)" error={errors.registroPresupuestalId?.message}>
            <input type="number" {...register('registroPresupuestalId', { valueAsNumber: true, setValueAs: (v) => v || null })} className="input" />
          </FormField>

          <FormField label="Beneficiario" error={errors.beneficiario?.message}>
            <input type="text" {...register('beneficiario')} className="input" />
          </FormField>

          <FormField label="Concepto" error={errors.concepto?.message}>
            <textarea {...register('concepto')} rows={2} className="input" />
          </FormField>

          <FormField label="Justificación" error={errors.justificacion?.message}>
            <textarea {...register('justificacion')} rows={2} className="input" />
          </FormField>

          <FormField label="URL Documento" error={errors.urlDocumento?.message}>
            <input type="text" {...register('urlDocumento')} className="input" />
          </FormField>

          {registrar.isError && (
            <p className="text-sm text-destructive">Error al registrar la reserva.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setOpen(false); reset(); }} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={isSubmitting || registrar.isPending} className="btn-primary">
              {registrar.isPending ? 'Registrando…' : 'Registrar Reserva'}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
