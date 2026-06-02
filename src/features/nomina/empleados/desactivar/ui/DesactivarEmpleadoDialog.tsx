import { useState } from 'react'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { DatePickerField } from '@/shared/ui/forms/DatePickerField'
import { useDesactivarEmpleado } from '../hook'

interface Props {
  empleadoId:    number
  nombreCompleto: string
  open:          boolean
  onClose:       () => void
}

export function DesactivarEmpleadoDialog({
  empleadoId,
  nombreCompleto,
  open,
  onClose,
}: Props) {
  const [fechaRetiro, setFechaRetiro] = useState('')
  const desactivar = useDesactivarEmpleado()

  const handleConfirmar = async () => {
    if (!fechaRetiro) return
    await desactivar.mutateAsync({
      id:      empleadoId,
      payload: { fechaRetiro },
    })
    setFechaRetiro('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="Desactivar Empleado">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ¿Desactivar a{' '}
          <span className="font-semibold">{nombreCompleto}</span>?
          Ingresa la fecha de retiro para continuar.
        </p>

        <DatePickerField
          label="Fecha de Retiro"
          value={fechaRetiro}
          onChange={setFechaRetiro}
        />

        {desactivar.error && (
          <p className="text-sm text-red-600">
            {(desactivar.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={desactivar.isPending}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary bg-red-600 hover:bg-red-700"
            onClick={handleConfirmar}
            disabled={desactivar.isPending || !fechaRetiro}
          >
            {desactivar.isPending ? 'Desactivando…' : 'Confirmar Desactivación'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
