import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button }   from '@/components/ui/button'
import { Input }    from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label }    from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRegistrarModificacion } from '../hook'
import {
  RegistrarModificacionSchema,
  type RegistrarModificacionInput,
} from '../../model/schema'
import { TIPOS_MODIFICACION } from '../../model/constants'

interface Props {
  open: boolean
  onClose: () => void
}

export function RegistrarModificacionDialog({ open, onClose }: Props) {
  const mutation = useRegistrarModificacion()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegistrarModificacionInput>({
    resolver: zodResolver(RegistrarModificacionSchema),
    defaultValues: {
      vigencia: new Date().getFullYear(),
      justificacion: '',
    },
  })

  function onSubmit(values: RegistrarModificacionInput) {
    mutation.mutate(values, {
      onSuccess: () => { reset(); onClose() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nueva modificación presupuestal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Vigencia */}
          <div className="space-y-1">
            <Label htmlFor="vigencia">Vigencia</Label>
            <Input
              id="vigencia"
              type="number"
              {...register('vigencia', { valueAsNumber: true })}
            />
            {errors.vigencia && (
              <p className="text-xs text-destructive">{errors.vigencia.message}</p>
            )}
          </div>

          {/* Tipo de modificación */}
          <div className="space-y-1">
            <Label>Tipo de modificación</Label>
            <Select
              value={watch('tipoModificacion') ?? ''}
              onValueChange={(v) =>
                setValue('tipoModificacion', v as RegistrarModificacionInput['tipoModificacion'], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_MODIFICACION.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.tipoModificacion && (
              <p className="text-xs text-destructive">{errors.tipoModificacion.message}</p>
            )}
          </div>

          {/* Justificación */}
          <div className="space-y-1">
            <Label htmlFor="justificacion">Justificación</Label>
            <Textarea
              id="justificacion"
              rows={3}
              placeholder="Explique el motivo de la modificación..."
              {...register('justificacion')}
            />
            {errors.justificacion && (
              <p className="text-xs text-destructive">{errors.justificacion.message}</p>
            )}
          </div>

          {/* Detalle adicional */}
          <div className="space-y-1">
            <Label htmlFor="detalleModificacion">Detalle adicional (opcional)</Label>
            <Textarea
              id="detalleModificacion"
              rows={2}
              placeholder="Información complementaria..."
              {...register('detalleModificacion')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando...' : 'Registrar modificación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
