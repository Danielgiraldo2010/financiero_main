import { useState } from 'react'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { useCerrarPlanClases } from '../hook'

interface Props {
  planClasesId:  number
  asignatura:    string
  open:          boolean
  onClose:       () => void
}

export function CerrarPlanClasesDialog({
  planClasesId,
  asignatura,
  open,
  onClose,
}: Props) {
  const [observaciones, setObservaciones] = useState('')
  const cerrar = useCerrarPlanClases()

  const handleCerrar = async () => {
    // 07b-I4: PESIMISTA — el botón se deshabilita mientras la mutación está activa
    await cerrar.mutateAsync({
      id:      planClasesId,
      payload: { observaciones: observaciones.trim() || null },
    })
    setObservaciones('')
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="Cerrar Plan de Clases">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          ¿Cerrar el plan de clases de{' '}
          <span className="font-semibold">{asignatura}</span>?
          Esta acción marca el plan como finalizado.
        </p>

        <FormField label="Observaciones (opcional)">
          <textarea
            className="input"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            disabled={cerrar.isPending}
          />
        </FormField>

        {cerrar.error && (
          <p className="text-sm text-red-600">
            {(cerrar.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={cerrar.isPending}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleCerrar}
            disabled={cerrar.isPending}
          >
            {cerrar.isPending ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Cerrando…
              </span>
            ) : (
              'Cerrar Plan'
            )}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
