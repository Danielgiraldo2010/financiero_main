import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }          from '@/shared/ui/modal/Dialog';
import { FormField }       from '@/shared/ui/forms/FormField';
import { SelectField }     from '@/shared/ui/forms/SelectField';
import { DatePickerField } from '@/shared/ui/forms/DatePickerField';
import { CurrencyInput }   from '@/shared/ui/forms/CurrencyInput';
import { Button }          from '@/shared/ui/primitives/button';
import { RegistrarTarifaViaticoSchema, type RegistrarTarifaViaticoFormValues } from '../../../model/schema';
import {
  TIPOS_PERSONAL_VIATICO, LABEL_TIPO_PERSONAL,
  ZONAS_VIATICO,          LABEL_ZONA_VIATICO,
  MUNICIPIO_TIPOS,        LABEL_MUNICIPIO_TIPO,
} from '../../../model/constants';
import { useTarifaViatico, useActualizarTarifaViatico } from '../../listar/hook';

interface Props { id: number; open: boolean; onClose: () => void; }

const tipoOptions      = TIPOS_PERSONAL_VIATICO.map(t => ({ value: t, label: LABEL_TIPO_PERSONAL[t] ?? t }));
const zonaOptions      = ZONAS_VIATICO.map(z => ({ value: z, label: LABEL_ZONA_VIATICO[z] ?? z }));
const municipioOptions = MUNICIPIO_TIPOS.map(m => ({ value: m, label: LABEL_MUNICIPIO_TIPO[m] ?? m }));

export function ActualizarTarifaDialog({ id, open, onClose }: Props) {
  const { data }   = useTarifaViatico(id);
  const mutation   = useActualizarTarifaViatico();

  const form = useForm<RegistrarTarifaViaticoFormValues>({
    resolver: zodResolver(RegistrarTarifaViaticoSchema),
  });

  // Poblar el formulario cuando llegan los datos
  useEffect(() => {
    if (!data) return;
    form.reset({
      vigencia:            data.vigencia,
      tipoPersonal:        data.tipoPersonal as RegistrarTarifaViaticoFormValues['tipoPersonal'],
      zona:                data.zona as RegistrarTarifaViaticoFormValues['zona'],
      municipioTipo:       data.municipioTipo as RegistrarTarifaViaticoFormValues['municipioTipo'],
      incluyePernoctacion: data.incluyePernoctacion,
      horasMinimasDict:    data.horasMinimasDict ?? null,
      valorDiaCompleto:    data.valorDiaCompleto,
      valorMedioDia:       data.valorMedioDia,
      valorTransporte:     data.valorTransporte,
      normaAplicable:      data.normaAplicable,
      vigenteDesde:        data.vigenteDesde?.toString().slice(0, 10) ?? '',
      vigenteHasta:        data.vigenteHasta?.toString().slice(0, 10) ?? null,
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(
      { id, payload: {
    ...values,
    horasMinimasDict: values.horasMinimasDict ?? null,
    vigenteHasta:     values.vigenteHasta     ?? null,
  }
},
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose} title="Actualizar Tarifa de Viatico" maxWidth="lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller control={form.control} name="vigencia"
            render={({ field, fieldState }) => (
              <FormField label="Vigencia" error={fieldState.error?.message}>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
          <Controller control={form.control} name="tipoPersonal"
            render={({ field, fieldState }) => (
              <SelectField label="Tipo personal" options={tipoOptions}
                value={field.value} onChange={field.onChange}
                error={fieldState.error?.message} />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Controller control={form.control} name="zona"
            render={({ field, fieldState }) => (
              <SelectField label="Zona" options={zonaOptions}
                value={field.value} onChange={field.onChange}
                error={fieldState.error?.message} />
            )}
          />
          <Controller control={form.control} name="municipioTipo"
            render={({ field, fieldState }) => (
              <SelectField label="Tipo municipio" options={municipioOptions}
                value={field.value} onChange={field.onChange}
                error={fieldState.error?.message} />
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {(['valorDiaCompleto', 'valorMedioDia', 'valorTransporte'] as const).map(f => (
            <Controller key={f} control={form.control} name={f}
              render={({ field, fieldState }) => (
                <FormField
                  label={f === 'valorDiaCompleto' ? 'Dia completo'
                    : f === 'valorMedioDia' ? 'Medio dia' : 'Transporte'}
                  error={fieldState.error?.message}
                >
                  <CurrencyInput value={field.value} onChange={v => field.onChange(v ?? 0)} />
                </FormField>
              )}
            />
          ))}
        </div>

        <Controller control={form.control} name="normaAplicable"
          render={({ field, fieldState }) => (
            <FormField label="Norma aplicable" error={fieldState.error?.message}>
              <input className="w-full border rounded px-3 py-2 text-sm" {...field} />
            </FormField>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller control={form.control} name="vigenteDesde"
            render={({ field, fieldState }) => (
              <DatePickerField label="Vigente desde" value={field.value}
                onChange={field.onChange} error={fieldState.error?.message} />
            )}
          />
          <Controller control={form.control} name="vigenteHasta"
            render={({ field, fieldState }) => (
              <DatePickerField label="Vigente hasta (opc.)"
                value={field.value ?? ''} onChange={v => field.onChange(v || null)}
                error={fieldState.error?.message} />
            )}
          />
        </div>

        <Controller control={form.control} name="incluyePernoctacion"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={field.value ?? false}
                onChange={e => field.onChange(e.target.checked)} />
              Incluye pernoctacion
            </label>
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">Error al actualizar tarifa.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
