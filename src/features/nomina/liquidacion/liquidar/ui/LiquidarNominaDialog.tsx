import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SearchableSelect } from '@/shared/ui/forms/SearchableSelect'
import { useEmpleados } from '../../../empleados/listar/hook'
import { LiquidarNominaSchema, type LiquidarNominaFormValues } from '../schema'
import { useLiquidarNomina } from '../hook'

const MES_OPTIONS = [
  { value: 1,  label: 'Enero'      }, { value: 2,  label: 'Febrero'   },
  { value: 3,  label: 'Marzo'      }, { value: 4,  label: 'Abril'     },
  { value: 5,  label: 'Mayo'       }, { value: 6,  label: 'Junio'     },
  { value: 7,  label: 'Julio'      }, { value: 8,  label: 'Agosto'    },
  { value: 9,  label: 'Septiembre' }, { value: 10, label: 'Octubre'   },
  { value: 11, label: 'Noviembre'  }, { value: 12, label: 'Diciembre' },
]

interface Props {
  open:    boolean
  onClose: () => void
}

export function LiquidarNominaDialog({ open, onClose }: Props) {
  const mutation = useLiquidarNomina()
  const { data: empleadosData } = useEmpleados()

  const empleadoOptions = (empleadosData?.items ?? [])
    .filter((e) => e.estado === 'ACTIVO')
    .map((e) => ({
      value: e.id,
      label: `${e.nombreCompleto} — ${e.numeroIdentificacion}`,
    }))

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LiquidarNominaFormValues>({
    resolver: zodResolver(LiquidarNominaSchema),
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values)
    reset()
    onClose()
  })

  // 07c-I2: isPending bloquea el botón y muestra spinner
  const isRunning = mutation.isPending

  return (
    <Dialog open={open} onClose={onClose} title="Liquidar Nómina">
      <form onSubmit={onSubmit} className="space-y-4">

        <Controller
          control={control}
          name="empleadoId"
          render={({ field, fieldState }) => (
            <SearchableSelect
              label="Empleado"
              options={empleadoOptions}
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              placeholder="Buscar empleado…"
            />
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Vigencia" error={errors.vigencia?.message}>
            <input
              type="number"
              className="input"
              {...register('vigencia', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Mes" error={errors.mes?.message}>
            <select className="input" {...register('mes', { valueAsNumber: true })}>
              <option value="">Seleccionar…</option>
              {MES_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Días Laborados" error={errors.diasLaborados?.message}>
          <input
            type="number"
            min={1} max={31}
            className="input"
            {...register('diasLaborados', { valueAsNumber: true })}
          />
        </FormField>

        {mutation.error && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={isRunning}
          >
            Cancelar
          </button>
          {/* 07c-I2: PESIMISTA — spinner bloqueante */}
          <button type="submit" className="btn-primary" disabled={isRunning}>
            {isRunning ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Ejecutando liquidación…
              </span>
            ) : (
              'Liquidar'
            )}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
