// Fix: CurrencyInput.onChange devuelve (number | undefined).
// RHF setValue('valor', v) espera number según el schema (z.number().positive()).
// Solución: ignorar el evento cuando v es undefined — el campo queda con su
// valor anterior. El schema Zod validará que sea > 0 al submit.
import { useState } from 'react'
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
import { Label }    from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input }    from '@/components/ui/input'
import { CurrencyInput } from '@/shared/ui/forms/CurrencyInput'
import { useAgregarLinea } from '../hook'
import { AgregarTrasladoSchema, type AgregarTrasladoInput } from '../../model/schema'

interface Props {
  modId: number
  open: boolean
  onClose: () => void
}

export function AgregarLineaModificacionDialog({ modId, open, onClose }: Props) {
  const mutation = useAgregarLinea(modId)
  const [step, setStep] = useState<'form' | 'sending'>('form')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgregarTrasladoInput>({
    resolver: zodResolver(AgregarTrasladoSchema),
    defaultValues: { esIngreso: false, valor: 0 },
  })

  function handleClose() {
    reset()
    setStep('form')
    onClose()
  }

  function onSubmit(values: AgregarTrasladoInput) {
    setStep('sending')

    mutation.mutate(
      {
        tipoMovimiento: 'DEBITO',
        esIngreso: values.esIngreso,
        rubroId: values.rubroOrigenId,
        valor: values.valor,
        descripcion: values.descripcion ?? null,
      },
      {
        onSuccess: () => {
          mutation.mutate(
            {
              tipoMovimiento: 'CREDITO',
              esIngreso: values.esIngreso,
              rubroId: values.rubroDestinoId,
              valor: values.valor,
              descripcion: values.descripcion ?? null,
            },
            {
              onSuccess: handleClose,
              onError:   () => setStep('form'),
            },
          )
        },
        onError: () => setStep('form'),
      },
    )
  }

  const isSending = step === 'sending' || mutation.isPending

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar traslado de recursos</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          El valor se <strong>debita</strong> del rubro origen y se{' '}
          <strong>acredita</strong> al rubro destino. Se registran dos movimientos.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="rubroOrigenId">ID Rubro origen (débito)</Label>
            <Input
              id="rubroOrigenId"
              type="number"
              placeholder="ID del rubro de origen"
              {...register('rubroOrigenId', { valueAsNumber: true })}
            />
            {errors.rubroOrigenId && (
              <p className="text-xs text-destructive">{errors.rubroOrigenId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="rubroDestinoId">ID Rubro destino (crédito)</Label>
            <Input
              id="rubroDestinoId"
              type="number"
              placeholder="ID del rubro de destino"
              {...register('rubroDestinoId', { valueAsNumber: true })}
            />
            {errors.rubroDestinoId && (
              <p className="text-xs text-destructive">{errors.rubroDestinoId.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="valor">Valor ($)</Label>
            {/* Fix: CurrencyInput devuelve number | undefined.
                Solo llamamos setValue cuando v es number — si el usuario
                borra el campo (undefined) el valor anterior se conserva
                y Zod lo validará como inválido al submit. */}
            <CurrencyInput
              id="valor"
              value={watch('valor')}
              onChange={(v) => {
                if (v !== undefined) {
                  setValue('valor', v, { shouldValidate: true })
                }
              }}
            />
            {errors.valor && (
              <p className="text-xs text-destructive">{errors.valor.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              rows={2}
              placeholder="Concepto del traslado..."
              {...register('descripcion')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? 'Registrando movimientos...' : 'Registrar traslado'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
