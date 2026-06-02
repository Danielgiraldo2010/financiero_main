import { useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }          from '@/shared/ui/modal/Dialog';
import { FormField }       from '@/shared/ui/forms/FormField';
import { SelectField }     from '@/shared/ui/forms/SelectField';
import { DatePickerField } from '@/shared/ui/forms/DatePickerField';
import { Button }          from '@/shared/ui/primitives/button';
import { useTenant }       from '@/shared/hooks/useTenant';
import { RegistrarViaticoSchema, type RegistrarViaticoFormValues } from '../../../model/schema';
import { TIPOS_PERSONAL_VIATICO, LABEL_TIPO_PERSONAL } from '../../../model/constants';
import { useRegistrarViatico } from '../hook';
import { CalculadoraViaticos } from '../../../tarifas-viaticos/calcular/ui/CalculadoraViaticos';
import type { CalculoViatico } from '../../../model/types';

interface Props { open: boolean; onClose: () => void; vigencia: number; }

// FIX-2: ?? t garantiza label: string, nunca undefined
const tipoOptions = TIPOS_PERSONAL_VIATICO.map(t => ({
  value: t,
  label: LABEL_TIPO_PERSONAL[t] ?? t,
}));

export function RegistrarViaticoDialog({ open, onClose, vigencia }: Props) {
  const { tenantActivo } = useTenant();
  const unidadEjecutoraId = tenantActivo?.id ?? 0;
  const mutation = useRegistrarViatico();
  const [_calculo, setCalculo] = useState<CalculoViatico | null>(null);

  const form = useForm<RegistrarViaticoFormValues>({
    resolver: zodResolver(RegistrarViaticoSchema),
    defaultValues: {
      vigencia,
      proyectoId:          0,
      unidadEjecutoraId,
      empleadoId:          0,
      tipoPersonal: 'PLANTA_SERVIDOR',
      municipioDestinoId:  0,
      fechaSalida:         '',
      fechaRegreso:        '',
      incluyePernoctacion: false,
      horasEfectivasDict:  null,
      observaciones:       null,
    },
  });

  const { control } = form;
  const tipoPersonal        = useWatch({ control, name: 'tipoPersonal' });
  const municipioDestinoId  = useWatch({ control, name: 'municipioDestinoId' });
  const incluyePernoctacion = useWatch({ control, name: 'incluyePernoctacion' });
  const fechaSalida         = useWatch({ control, name: 'fechaSalida' });
  const fechaRegreso        = useWatch({ control, name: 'fechaRegreso' });
  const horasEfectivasDict  = useWatch({ control, name: 'horasEfectivasDict' });

  const diasViaje = fechaSalida && fechaRegreso
    ? Math.max(1, Math.ceil(
        (new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) / 86_400_000
      ) + 1)
    : 0;

  const esCatedratico = tipoPersonal === 'CATEDRATICO_AC44';

  const onSubmit = form.handleSubmit((data: RegistrarViaticoFormValues) => {
      mutation.mutate(data, {
      onSuccess: () => { form.reset(); setCalculo(null); onClose(); },
    });
  });

  return (
    <Dialog open={open} onClose={onClose}
      title={`Registrar Solicitud de Viático — ${vigencia}`} maxWidth="lg">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Controller control={control} name="proyectoId"
            render={({ field, fieldState }) => (
              <FormField label="Proyecto" error={fieldState.error?.message}>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
          <Controller control={control} name="empleadoId"
            render={({ field, fieldState }) => (
              <FormField label="Empleado" error={fieldState.error?.message}>
                <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
              </FormField>
            )}
          />
        </div>

        <Controller control={control} name="tipoPersonal"
          render={({ field, fieldState }) => (
            <SelectField label="Tipo de personal" options={tipoOptions}
              value={field.value} onChange={field.onChange}
              error={fieldState.error?.message} />
          )}
        />

        <Controller control={control} name="municipioDestinoId"
          render={({ field, fieldState }) => (
            <FormField label="Municipio destino" error={fieldState.error?.message}>
              <input type="number" className="w-full border rounded px-3 py-2 text-sm"
                placeholder="ID municipio"
                value={field.value} onChange={e => field.onChange(Number(e.target.value))} />
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
              <input type="checkbox" checked={field.value}
                onChange={e => field.onChange(e.target.checked)} />
              Incluye pernoctación
            </label>
          )}
        />

        {esCatedratico && (
          <Controller control={control} name="horasEfectivasDict"
            render={({ field, fieldState }) => (
              <FormField label="Horas efectivas dictado" error={fieldState.error?.message} required>
                <input type="number" min={1}
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value ?? ''}
                  onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)} />
              </FormField>
            )}
          />
        )}

        {/* FIX-1+3: spreads condicionales — ningún campo opcional recibe undefined/null explícito */}
        <CalculadoraViaticos
          params={{
            tipoPersonal,
            ...(municipioDestinoId > 0 && { municipioDestinoId }),
            incluyePernoctacion,
            diasViaje,
            ...(horasEfectivasDict != null && { horasEfectivasDict }),
            vigencia,
          }}
          onResult={setCalculo}
        />

        <Controller control={control} name="observaciones"
          render={({ field, fieldState }) => (
            <FormField label="Observaciones" error={fieldState.error?.message}>
              <textarea className="w-full border rounded px-3 py-2 text-sm" rows={2}
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value || null)} />
            </FormField>
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">Error al registrar solicitud.</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Registrando...' : 'Registrar solicitud'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}