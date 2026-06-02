import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog } from "@/shared/ui/modal/Dialog"
import { useDerogarNorma } from "../hook"
import { derogarNormaSchema, type DerogarNormaForm } from "../../model/schema"
import type { NormaResponse } from "../../model/types"

interface Props {
  norma: NormaResponse
  open: boolean
  onClose: () => void
}

export function DerogarNormaDialog({ norma, open, onClose }: Props) {
  const { mutate, isPending } = useDerogarNorma()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DerogarNormaForm>({
    resolver: zodResolver(derogarNormaSchema),
  })

  function onSubmit(data: DerogarNormaForm) {
    if (data.confirmacion !== "DEROGAR") return
    mutate(norma.id, { onSuccess: () => onClose() })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Derogar norma" maxWidth="sm">
      <div className="space-y-4">
        <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-800">
          Esta accion es <strong>IRREVERSIBLE</strong>. La norma quedara marcada como derogada
          y no podra reactivarse.
        </div>

        <p className="text-sm">
          Norma a derogar: <strong>{norma.codigo} - {norma.titulo}</strong>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Escriba <span className="font-mono font-bold">DEROGAR</span> para confirmar
            </label>
            <input
              className="input w-full font-mono"
              {...register("confirmacion")}
              placeholder="DEROGAR"
              autoComplete="off"
            />
            {errors.confirmacion && (
              <p className="text-xs text-destructive mt-0.5">{errors.confirmacion.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Volver
            </button>
            <button
              type="submit"
              className="btn-destructive"
              disabled={isPending}
            >
              {isPending ? "Derogando..." : "Confirmar derogacion"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
