import { useState } from "react"
import { useCohortes } from "../hook"
import { TIPOS_MATRICULA } from "../../../model/constants"
import { formatCOP } from "@/shared/lib/currency"
import { ModificarCohorteDialog } from "../../modificar/ui/ModificarCohorteDialog"
import { AnularCohorteDialog } from "../../anular/ui/AnularCohorteDialog"
import type { ListarCohortesParams } from "../api"
import type { CohorteResponse } from "../../../model/types"

interface Props {
  filters: ListarCohortesParams
  onRegistrar?: () => void
  canEdit?: boolean
  canAnular?: boolean
}

export function CohortesList({ filters, onRegistrar, canEdit = false, canAnular = false }: Props) {
  const { data, isLoading, isError } = useCohortes(filters)
  const [editando, setEditando] = useState<CohorteResponse | null>(null)
  const [anulando, setAnulando] = useState<CohorteResponse | null>(null)

  if (isLoading) return <div className="text-sm text-muted-foreground p-4">Cargando cohortes...</div>
  if (isError) return <div className="text-sm text-destructive p-4">Error al cargar cohortes.</div>

  const items = data?.items ?? []

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{data?.totalItems ?? 0} cohortes registradas</p>
          {onRegistrar && (
            <button
              onClick={onRegistrar}
              className="text-sm bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90"
            >
              + Registrar Cohorte
            </button>
          )}
        </div>

        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-2 font-medium">Programa</th>
                <th className="text-left p-2 font-medium">Período</th>
                <th className="text-left p-2 font-medium">Tipo Matrícula</th>
                <th className="text-right p-2 font-medium">Estudiantes</th>
                <th className="text-right p-2 font-medium">Valor Estimado</th>
                <th className="text-left p-2 font-medium">Estado</th>
                {(canEdit || canAnular) && <th className="p-2" />}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={canEdit || canAnular ? 7 : 6} className="text-center p-4 text-muted-foreground">
                    No hay cohortes registradas para los filtros seleccionados.
                  </td>
                </tr>
              )}
              {items.map((c) => {
                const tipo = TIPOS_MATRICULA.find((t) => t.value === c.tipoMatricula)
                const isAnulada = c.estado === "ANULADO"
                return (
                  <tr key={c.id} className={`border-t hover:bg-muted/20 ${isAnulada ? "opacity-50" : ""}`}>
                    <td className="p-2">{c.programaAcademico}</td>
                    <td className="p-2">{c.periodo}</td>
                    <td className="p-2">
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        {tipo?.label ?? c.tipoMatricula}
                      </span>
                    </td>
                    <td className="p-2 text-right">{c.numeroEstudiantes}</td>
                    <td className="p-2 text-right font-mono">{formatCOP(c.valorTotalEstimado)}</td>
                    <td className="p-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        isAnulada
                          ? "bg-destructive/10 text-destructive"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                    {(canEdit || canAnular) && (
                      <td className="p-2 text-right">
                        {!isAnulada && (
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => setEditando(c)}
                                className="text-xs text-primary underline underline-offset-2"
                              >
                                Editar
                              </button>
                            )}
                            {canAnular && (
                              <button
                                onClick={() => setAnulando(c)}
                                className="text-xs text-destructive underline underline-offset-2"
                              >
                                Anular
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editando && (
        <ModificarCohorteDialog
          cohorte={editando}
          open={true}
          onClose={() => setEditando(null)}
        />
      )}
      {anulando && (
        <AnularCohorteDialog
          cohorte={anulando}
          open={true}
          onClose={() => setAnulando(null)}
        />
      )}
    </>
  )
}
