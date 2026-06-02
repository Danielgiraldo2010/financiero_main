// features/ejecucion/orden-pago/registrar/ui/RegistrarOpDialog.tsx
//
// INVARIANTE 09b-I1:
//   Al seleccionar el RP se llama useRpSaldo(rpId) y se muestra saldoPendiente.
//   El schema Zod valida que valor <= saldoPendiente (si se conoce el saldo).
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog } from '@/shared/ui/modal/Dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { DatePickerField } from '@/shared/ui/forms/DatePickerField';
import { formatCOP } from '@/shared/lib/currency';
import { useRpSaldo } from '../../../registro-presupuestal/saldo/hook';
import { useRegistrarOp } from '../hook';
import { useRps } from '../../../registro-presupuestal/listar/hook';
import { registrarOpSchema, type RegistrarOpFormValues } from '../schema';

export function RegistrarOpDialog() {
  const [open, setOpen] = useState(false);
  const [rpId, setRpId] = useState<number>(0);
  const registrar = useRegistrarOp();
  const { data: rpsData, isLoading: cargandoRps } = useRps({ estado: 'ACTIVO' });
  const rpOptions = (rpsData?.items ?? []).map((rp) => ({
    value: rp.id,
    label: `${rp.numero} — ${rp.beneficiario ?? rp.rubroGastoNombre}`,
  }));

  // INVARIANTE 09b-I1: consultar saldo al seleccionar RP
  const { data: saldo } = useRpSaldo(rpId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarOpFormValues>({
    resolver: zodResolver(registrarOpSchema),
  });

  const onSubmit = async (values: RegistrarOpFormValues) => {
    await registrar.mutateAsync({
      ...values,
      concepto:     values.concepto     || null,
      urlDocumento: values.urlDocumento || null,
    });
    reset();
    setRpId(0);
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
      >
        + Registrar OP
      </button>

      <Dialog open={open} onClose={() => { setOpen(false); reset(); setRpId(0); }}
        title="Registrar Orden de Pago">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* RP — INVARIANTE 09b-I1 */}
          <Controller
            name="registroPresupuestalId"
            control={control}
            render={({ field }) => (
              <SearchableSelect
                label="Registro Presupuestal *"
                placeholder="Buscar RP activo…"
                options={rpOptions}
                isLoading={cargandoRps}
                value={field.value}
                onChange={(v) => { field.onChange(v); setRpId(Number(v)); }}
                error={errors.registroPresupuestalId?.message}
              />
            )}
          />

          {/* Panel de saldo disponible — INVARIANTE 09b-I1 */}
          {saldo && rpId > 0 && (
            <div className={`p-3 rounded-md border text-sm ${
              saldo.saldoPendiente <= 0
                ? 'bg-destructive/10 border-destructive text-destructive'
                : 'bg-green-50 border-green-300 text-green-800'
            }`}>
              <p className="font-semibold">Saldo disponible en el RP</p>
              <p className="text-lg font-bold">{formatCOP(saldo.saldoPendiente)}</p>
              <p className="text-xs mt-1">{saldo.porcentajeEjecutado.toFixed(1)}% ejecutado</p>
            </div>
          )}

          <Controller
            name="fechaOrden"
            control={control}
            render={({ field }) => (
              <DatePickerField
                label="Fecha de la Orden *"
                value={field.value}
                onChange={field.onChange}
                error={errors.fechaOrden?.message}
              />
            )}
          />

          <FormField label="Valor *" error={errors.valor?.message} required>
            <Controller
              name="valor"
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

          <FormField label="Concepto" error={errors.concepto?.message}>
            <textarea {...register('concepto')} rows={2} className="input" />
          </FormField>

          <FormField label="URL Documento" error={errors.urlDocumento?.message}>
            <input type="text" {...register('urlDocumento')} className="input" />
          </FormField>

          {registrar.isError && (
            <p className="text-sm text-destructive">Error al registrar la OP. Intente nuevamente.</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => { setOpen(false); reset(); setRpId(0); }}
              className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={isSubmitting || registrar.isPending}
              className="btn-primary">
              {registrar.isPending ? 'Registrando…' : 'Registrar OP'}
            </button>
          </div>
        </form>
      </Dialog>
    </>
  );
}
