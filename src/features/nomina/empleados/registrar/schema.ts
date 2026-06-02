import { z } from 'zod'

export const RegistrarEmpleadoSchema = z.object({
  tipoIdentificacion:   z.string().min(1, 'Requerido'),
  numeroIdentificacion: z.string().min(1, 'Requerido'),
  primerNombre:         z.string().min(1, 'Requerido'),
  segundoNombre:        z.string().nullable().optional(),
  primerApellido:       z.string().min(1, 'Requerido'),
  segundoApellido:      z.string().nullable().optional(),
  email:                z.string().email('Email inválido').nullable().optional(),
  telefono:             z.string().nullable().optional(),
  tipoEmpleado:         z.enum([
    'PLANTA', 'OCASIONAL', 'CATEDRATICO', 'SUPERNUMERARIO', 'PLANTA_TEMPORAL',
  ], { required_error: 'Requerido' }),
  cargo:                z.string().nullable().optional(),
  salarioBaseMensual:   z.number({ required_error: 'Requerido' }).positive(),
  programaAcademicoId:  z.number().int().nullable().optional(),
  unidadEjecutoraId:    z.number({ required_error: 'Requerido' }).int().positive(),
  fechaIngreso:         z.string().nullable().optional(),
  urlContrato:          z.string().url('URL inválida').nullable().optional(),
  categoriaDocente:     z.string().nullable().optional(),
})

export type RegistrarEmpleadoFormValues = z.infer<typeof RegistrarEmpleadoSchema>
