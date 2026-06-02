import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { SelectField } from '@/shared/ui/forms/SelectField'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { useTenant } from '@/shared/hooks/useTenant'
import {
  RegistrarEmpleadoSchema,
  type RegistrarEmpleadoFormValues,
} from '../schema'
import { useRegistrarEmpleado } from '../hook'
import { TIPO_EMPLEADO_OPTIONS } from '../../../model/constants'

const TIPO_ID_OPTIONS = [
  { value: 'CC',  label: 'Cédula de Ciudadanía' },
  { value: 'CE',  label: 'Cédula de Extranjería' },
  { value: 'PA',  label: 'Pasaporte' },
  { value: 'TI',  label: 'Tarjeta de Identidad' },
]

interface Props {
  open:    boolean
  onClose: () => void
}

export function RegistrarEmpleadoDialog({ open, onClose }: Props) {
  const mutation = useRegistrarEmpleado()
  const { tenantActivo } = useTenant()
  const unidadEjecutoraId = tenantActivo?.id ?? 0

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegistrarEmpleadoFormValues>({
    resolver: zodResolver(RegistrarEmpleadoSchema),
    defaultValues: {
      unidadEjecutoraId:   unidadEjecutoraId,
      segundoNombre:       null,
      segundoApellido:     null,
      email:               null,
      telefono:            null,
      cargo:               null,
      programaAcademicoId: null,
      fechaIngreso:        null,
      urlContrato:         null,
      categoriaDocente:    null,
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync({
      ...values,
      segundoNombre:       values.segundoNombre       ?? null,
      segundoApellido:     values.segundoApellido     ?? null,
      email:               values.email               ?? null,
      telefono:            values.telefono             ?? null,
      cargo:               values.cargo               ?? null,
      programaAcademicoId: values.programaAcademicoId ?? null,
      fechaIngreso:        values.fechaIngreso         ?? null,
      urlContrato:         values.urlContrato          ?? null,
      categoriaDocente:    values.categoriaDocente     ?? null,
    })
    reset()
    onClose()
  })

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Empleado">
      <form onSubmit={onSubmit} className="space-y-4">

        {/* Identificación */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="tipoIdentificacion"
            render={({ field, fieldState }) => (
              <SelectField
                label="Tipo Identificación"
                options={TIPO_ID_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <FormField label="Número Identificación" error={errors.numeroIdentificacion?.message}>
            <input type="text" className="input" {...register('numeroIdentificacion')} />
          </FormField>
        </div>

        {/* Nombres */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Primer Nombre" error={errors.primerNombre?.message}>
            <input type="text" className="input" {...register('primerNombre')} />
          </FormField>
          <FormField label="Segundo Nombre" error={errors.segundoNombre?.message}>
            <input type="text" className="input" {...register('segundoNombre')} />
          </FormField>
        </div>

        {/* Apellidos */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Primer Apellido" error={errors.primerApellido?.message}>
            <input type="text" className="input" {...register('primerApellido')} />
          </FormField>
          <FormField label="Segundo Apellido" error={errors.segundoApellido?.message}>
            <input type="text" className="input" {...register('segundoApellido')} />
          </FormField>
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email" error={errors.email?.message}>
            <input type="email" className="input" {...register('email')} />
          </FormField>
          <FormField label="Teléfono" error={errors.telefono?.message}>
            <input type="text" className="input" {...register('telefono')} />
          </FormField>
        </div>

        {/* Tipo empleado + cargo */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="tipoEmpleado"
            render={({ field, fieldState }) => (
              <SelectField
                label="Tipo Empleado"
                options={TIPO_EMPLEADO_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
          <FormField label="Cargo" error={errors.cargo?.message}>
            <input type="text" className="input" {...register('cargo')} />
          </FormField>
        </div>

        {/* Salario + categoría docente */}
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Salario Base Mensual ($)" error={errors.salarioBaseMensual?.message}>
            <input
              type="number"
              step="0.01"
              className="input"
              {...register('salarioBaseMensual', { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Categoría Docente" error={errors.categoriaDocente?.message}>
            <input type="text" className="input" {...register('categoriaDocente')} />
          </FormField>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={control}
            name="fechaIngreso"
            render={({ field, fieldState }) => (
              <DatePickerField
                label="Fecha Ingreso"
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v || null)}
                error={fieldState.error?.message}
              />
            )}
          />
          <FormField label="URL Contrato" error={errors.urlContrato?.message}>
            <input type="url" className="input" {...register('urlContrato')} />
          </FormField>
        </div>

        {mutation.error && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando…' : 'Registrar'}
          </button>
        </div>
      </form>
    </Dialog>
  )
}
