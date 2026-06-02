import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegistrarTechoSchema, type RegistrarTechoInput } from '../../../model/schema'
import { useRegistrarTecho } from '../hook'
import { useVigencia } from '@/shared/hooks/useVigencia'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/shared/ui/primitives/dialog'
import { Button } from '@/shared/ui/primitives/button'
import { Input } from '@/shared/ui/primitives/input'
import { Label } from '@/shared/ui/primitives/label'
import { Textarea } from '@/shared/ui/primitives/textarea'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegistrarTechoDialog({ open, onOpenChange }: Props) {
  const { vigenciaActiva } = useVigencia()
  const mutation = useRegistrarTecho()

  const form = useForm<RegistrarTechoInput>({
    resolver: zodResolver(RegistrarTechoSchema),
    defaultValues: {
      vigencia: vigenciaActiva,
      valorTecho: 0,
    },
  })

  function onSubmit(values: RegistrarTechoInput) {
    // exactOptionalPropertyTypes: solo incluir campos opcionales si tienen valor
    const command = {
      vigencia:   values.vigencia,
      valorTecho: values.valorTecho,
      ...(values.fechaComunicacion ? { fechaComunicacion: values.fechaComunicacion } : {}),
      ...(values.urlComunicacion   ? { urlComunicacion:   values.urlComunicacion   } : {}),
      ...(values.observaciones     ? { observaciones:     values.observaciones     } : {}),
    }
    mutation.mutate(command, {
      onSuccess: () => { form.reset(); onOpenChange(false) },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Techo Presupuestal</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label>Vigencia</Label>
            <Input type="number"
              {...form.register('vigencia', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <Label>Valor Techo</Label>
            <Input type="number" step="0.01"
              {...form.register('valorTecho', { valueAsNumber: true })} />
          </div>
          <div className="space-y-1">
            <Label>Fecha Comunicación (opcional)</Label>
            <Input type="date" {...form.register('fechaComunicacion')} />
          </div>
          <div className="space-y-1">
            <Label>URL Comunicación (opcional)</Label>
            <Input type="url" placeholder="https://..."
              {...form.register('urlComunicacion')} />
          </div>
          <div className="space-y-1">
            <Label>Observaciones (opcional)</Label>
            <Textarea rows={3} {...form.register('observaciones')} />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost"
              onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Registrando…' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
