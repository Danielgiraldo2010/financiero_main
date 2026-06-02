import { useEffect } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }          from '@/shared/ui/modal/Dialog';
import { FormField }       from '@/shared/ui/forms/FormField';
import { SelectField }     from '@/shared/ui/forms/SelectField';
import { DatePickerField } from '@/shared/ui/forms/DatePickerField';
import { Button }          from '@/shared/ui/primitives/button';
import { RegistrarViaticoSchema, type RegistrarViaticoFormValues } from '../../../model/schema';
import {
  TIPOS_PERSONAL_VIATICO, LABEL_TIPO_PERSONAL,
} from '../../../model/constants';
import { useActualizarViatico } from '../../listar/hook';
import { useViaticoDetalle }    from '../../detalle/hook';

interface Props { id: number; open: boolean; onClose: () => void; }

const tipoOptions = TIPOS_PERSONAL_VIATICO.map(t => ({
  value: t, label: LABEL_TIPO_PERSONAL[t] ?? t,
}));

export function ActualizarViaticoDialog({ id, open, onClose }: Props) {
  const { data }  = useViaticoDetalle(id);
  const mutation  = useActualizarViatico();

  const form = useForm<RegistrarViaticoFormValues>({
    resolver: zodResolver(RegistrarViaticoSchema),
  });

  const { control } = form;
  const tipoPersonal = useWatch({ control, name: 'tipoPersonal' });
  const esCatedratico = tipoPersonal === 'CATEDRATICO_AC44';

  useEffect(() => {
    if (!data) return;
    form.reset({
      vigencia:            data.vigencia,
      proyectoId:          data.proyectoId,
      unidadEjecutoraId:   data.unidadEjecutoraId,
      empleadoId:          data.empleadoId,
      tipoPersonal:        data.tipoPersonal as RegistrarViaticoFormValues['tipoPersonal'],
      municipioDestinoId:  data.municipioDestinoId,
      fechaSalida:         data.fechaSalida?.toString().slice(0, 10) ?? '',
      fechaRegreso:        data.fechaRegreso?.toString().slice(0, 10) ?? '',
      incluyePernoctacion: data.incluyePernoctacion,
      horasEfectivasDict:  data.horasEfectivasDict ?? null,
      observaciones:       data.observaciones ?? null,
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit((values: RegistrarViaticoFormValues) => {
    mutation.mutate(
      {
        id,
        payload: {
          proyectoId:          values.proyectoId,
          empleadoId:          values.empleadoId,
          tipoPersonal:        values.tipoPersonal,
          municipioDestinoId:  values.municipioDestinoId,
          fechaSalida:         values.fechaSalida,
          fechaRegreso:        values.fechaRegreso,
          incluyePernoctacion: values.incluyePernoctacion,
          horasEfectivasDict:  values.horasEfectivasDict ?? null,
          observaciones:       values.observaciones ?? null,
        },
      },
      { onSuccess: () => { form.reset(); onClose(); } },
    );
  });

  return (
    <Dialog open={open} onClose={onClose}
      title={`Editar Viatico #${id}`} maxWidth="lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller control={control} name="proyectoId"
            render={({ field, fieldState }) => (
              <FormField label="Proyecto ID" error={fieldState.error?.message}>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
          <Controller control={control} name="empleadoId"
            render={({ field, fieldState }) => (
              <FormField label="Empleado ID" error={fieldState.error?.message}>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
        </div>

        <Controller control={control} name="tipoPersonal"
          render={({ field, fieldState }) => (
            <SelectField label="Tipo personal" options={tipoOptions}
              value={field.value} onChange={field.onChange}
              error={fieldState.error?.message} />
          )}
        />

        <Controller control={control} name="municipioDestinoId"
          render={({ field, fieldState }) => (
            <FormField label="Municipio destino (ID)" error={fieldState.error?.message}>
              <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                value={field.value ?? ''} onChange={e => field.onChange(Number(e.target.value))} />
            </FormField>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller control={control} name="fechaSalida"
            render={({ field, fieldState }) => (
              <DatePickerField label="Fecha salida" value={field.value}
                onChange={field.onChange} error={fieldState.error?.message} />
            )}
          />
          <Controller control={control} name="fechaRegreso"
            render={({ field, fieldState }) => (
              <DatePickerField label="Fecha regreso" value={field.value}
                onChange={field.onChange} error={fieldState.error?.message} />
            )}
          />
        </div>

        <Controller control={control} name="incluyePernoctacion"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={field.value ?? false}
                onChange={e => field.onChange(e.target.checked)} />
              Incluye pernoctacion
            </label>
          )}
        />

        {esCatedratico && (
          <Controller control={control} name="horasEfectivasDict"
            render={({ field, fieldState }) => (
              <FormField label="Horas efectivas dictado" error={fieldState.error?.message} required>
                <input type="number" min={1} className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} />
              </FormField>
            )}
          />
        )}

        <Controller control={control} name="observaciones"
          render={({ field, fieldState }) => (
            <FormField label="Observaciones" error={fieldState.error?.message}>
              <textarea rows={2} className="w-full border rounded px-3 py-2 text-sm"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)} />
            </FormField>
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">Error al actualizar el viatico.</p>
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
