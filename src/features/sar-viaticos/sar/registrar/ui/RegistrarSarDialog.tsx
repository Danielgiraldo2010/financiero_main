import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog }        from '@/shared/ui/modal/Dialog';
import { FormField }     from '@/shared/ui/forms/FormField';
import { SelectField }   from '@/shared/ui/forms/SelectField';
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput';
import { Button }        from '@/shared/ui/primitives/button';
import { RegistrarSarSchema, type RegistrarSarFormValues } from '../../../model/schema';
import {
  TIPOS_SAR, LABEL_TIPO_SAR,
  FUENTES_SAR, LABEL_FUENTE_SAR,
  SAR_HORAS_MAX,
} from '../../../model/constants';
import { useRegistrarSar } from '../hook';

interface Props {
  open:     boolean;
  onClose:  () => void;
  vigencia: number;
}

const tipoSarOptions = TIPOS_SAR.map(t => ({ value: t, label: LABEL_TIPO_SAR[t] ?? t }));
const fuenteOptions  = FUENTES_SAR.map(f => ({ value: f, label: LABEL_FUENTE_SAR[f] }));

export function RegistrarSarDialog({ open, onClose, vigencia }: Props) {
  const mutation = useRegistrarSar();

  const form = useForm<RegistrarSarFormValues>({
    resolver: zodResolver(RegistrarSarSchema),
    defaultValues: {
      vigencia,
      proyectoId:         0,
      empleadoId:         0,
      tipoSar:            'DOCENCIA',
      descripcion:        '',
      horasAprobadas:     0,
      valorHora:          0,
      fuenteFinanciacion: 'GASTOS_OPERACIONALES_AC14',
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data, {
      onSuccess: () => { form.reset(); onClose(); },
    });
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Registrar SAR — Vigencia ${vigencia}`}
      maxWidth="lg"
    >
      {/* FE8-I1: alerta informativa — SAR solo PLANTA */}
      <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 mb-4">
        ⚠️ El SAR aplica exclusivamente para <strong>personal de planta</strong>{' '}
        (Acuerdo 44/2017). Máximo {SAR_HORAS_MAX} horas por evento.
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Controller
          control={form.control}
          name="proyectoId"
          render={({ field, fieldState }) => (
            <FormField label="Proyecto" error={fieldState.error?.message}>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="ID del proyecto"
                value={field.value}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="empleadoId"
          render={({ field, fieldState }) => (
            <FormField label="Empleado (planta)" error={fieldState.error?.message}>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="ID del empleado"
                value={field.value}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormField>
          )}
        />

        <Controller
          control={form.control}
          name="tipoSar"
          render={({ field, fieldState }) => (
            <SelectField
              label="Tipo de SAR"
              options={tipoSarOptions}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={form.control}
          name="descripcion"
          render={({ field, fieldState }) => (
            <FormField label="Descripción" error={fieldState.error?.message}>
              <textarea
                className="w-full border rounded px-3 py-2 text-sm"
                rows={3}
                {...field}
              />
            </FormField>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="horasAprobadas"
            render={({ field, fieldState }) => (
              <FormField label={`Horas (máx. ${SAR_HORAS_MAX})`} error={fieldState.error?.message}>
                <input
                  type="number"
                  min={1}
                  max={SAR_HORAS_MAX}
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={field.value}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormField>
            )}
          />
          <Controller
            control={form.control}
            name="valorHora"
            render={({ field, fieldState }) => (
              <FormField label="Valor por hora" error={fieldState.error?.message}>
                <CurrencyInput value={field.value} onChange={v => field.onChange(v ?? 0)} />
              </FormField>
            )}
          />
        </div>

        <Controller
          control={form.control}
          name="fuenteFinanciacion"
          render={({ field, fieldState }) => (
            <SelectField
              label="Fuente de financiación"
              options={fuenteOptions}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        {mutation.isError && (
          <p className="text-sm text-destructive">
            Error al registrar SAR. Verifique los datos e intente de nuevo.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando…' : 'Registrar SAR'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
