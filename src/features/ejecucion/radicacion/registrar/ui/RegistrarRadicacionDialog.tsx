// features/ejecucion/radicacion/registrar/ui/RegistrarRadicacionDialog.tsx
// valorNeto es calculado en backend: solo se envían valorBruto y valorRetenciones.
import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { SelectField } from '@/shared/ui/forms/SelectField';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { formatCOP } from '@/shared/lib/currency';
import { useTenant } from '@/shared/hooks/useTenant';
import { registrarRadicacionSchema, type RegistrarRadicacionFormValues } from '../schema';
import { useRegistrarRadicacion } from '../hook';
import { VIGENCIAS_DISPONIBLES } from '../../../model/constants';

const TIPOS_CUENTA = [
  { label: 'Factura',          value: 'FACTURA'          },
  { label: 'Cuenta de Cobro',  value: 'CUENTA_COBRO'     },
  { label: 'Acta de Liquidación', value: 'ACTA_LIQUIDACION'},
];

export function RegistrarRadicacionDialog() {
  const [open, setOpen] = useState(false);
  const { tenantActivo } = useTenant();
  const registrar = useRegistrarRadicacion();

  const {
    register, handleSubmit, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarRadicacionFormValues>({
    resolver: zodResolver(registrarRadicacionSchema),
    defaultValues: {
      vigencia: new Date().getFullYear(),
      unidadEjecutoraId: tenantActivo?.id ?? 0,
      valorRetenciones: 0,
    },
  });

  const valorBruto      = useWatch({ control, name: 'valorBruto',     defaultValue: 0 });
  const valorRetenciones = useWatch({ control, name: 'valorRetenciones', defaultValue: 0 });
  const valorNeto = (valorBruto ?? 0) - (valorRetenciones ?? 0);

  const onSubmit = async (values: RegistrarRadicacionFormValues) => {
    await registrar.mutateAsync({
      ...values,
      proveedorNit:           values.proveedorNit           || null,
      cdpId:                  values.cdpId                  || null,
      registroPresupuestalId: values.registroPresupuestalId || null,
      observaciones:          values.observaciones           || null,
      urlDocumento:           values.urlDocumento            || null,
    });
    reset();
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
        + Radicar Cuenta
      </button>

      <Dialog open={open} onClose={() => { setOpen(false); reset(); }} title="Radicar Cuenta">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Controller name="vigencia" control={control} render={({ field }) => (
              <SelectField label="Vigencia *" value={String(field.value)}
                onChange={(v) => field.onChange(Number(v))}
                options={VIGENCIAS_DISPONIBLES.map((y) => ({ label: String(y), value: String(y) }))}
                error={errors.vigencia?.message} />
            )} />
            <Controller name="tipoCuenta" control={control} render={({ field }) => (
              <SelectField label="Tipo de Cuenta *" value={field.value}
                onChange={field.onChange} options={TIPOS_CUENTA}
                error={errors.tipoCuenta?.message} />
            )} />
          </div>

          <FormField label="Proveedor *" error={errors.proveedorNombre?.message}>
            <input type="text" {...register('proveedorNombre')} className="input" />
          </FormField>

          <FormField label="NIT Proveedor" error={errors.proveedorNit?.message}>
            <input type="text" {...register('proveedorNit')} className="input" />
          </FormField>

          <FormField label="Concepto *" error={errors.concepto?.message}>
            <textarea {...register('concepto')} rows={2} className="input" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Valor Bruto *" error={errors.valorBruto?.message} required>
              <Controller name="valorBruto" control={control} render={({ field }) => (
                <CurrencyInput value={field.value} onChange={field.onChange} />
              )} />
            </FormField>
            <FormField label="Retenciones *" error={errors.valorRetenciones?.message} required>
              <Controller name="valorRetenciones" control={control} render={({ field }) => (
                <CurrencyInput value={field.value} onChange={field.onChange} />
              )} />
            </FormField>
          </div>

          {/* Valor neto calculado localmente — referencial */}
          <div className="rounded-md bg-muted/40 p-2 text-sm">
            <span className="text-muted-foreground">Valor Neto estimado: </span>
            <strong className={valorNeto < 0 ? 'text-destructive' : 'text-green-700'}>
              {formatCOP(Math.max(0, valorNeto))}
            </strong>
            <span className="text-xs text-muted-foreground ml-2">(calculado definitivamente por el backend)</span>
          </div>

          <FormField label="CDP ID (opcional)" error={errors.cdpId?.message}>
            <input type="number" {...register('cdpId', { valueAsNumber: true, setValueAs: (v) => v || null })} className="input" />
          </FormField>

          <FormField label="RP ID (opcional)" error={errors.registroPresupuestalId?.message}>
            <input type="number" {...register('registroPresupuestalId', { valueAsNumber: true, setValueAs: (v) => v || null })} className="input" />
          </FormField>

          <FormField label="Observaciones" error={errors.observaciones?.message}>
            <textarea {...register('observaciones')} rows={2} className="input" />
          </FormField>

          <FormField label="URL Documento" error={errors.urlDocumento?.message}>
            <input type="text" {...register('urlDocumento')} className="input" />
          </FormField>

          {registrar.isError && (
            <p className="text-sm text-destructive">Error al registrar la radicación.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setOpen(false); reset(); }} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={isSubmitting || registrar.isPending} className="btn-primary">
              {registrar.isPending ? 'Radicando…' : 'Radicar Cuenta'}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
