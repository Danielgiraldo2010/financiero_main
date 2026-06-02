import { useState } from "react"
import { useNormatividad } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { NormatividadFilters } from "./NormatividadFilters"
import { RegistrarNormaDialog } from "../../registrar/ui/RegistrarNormaDialog"
import { DerogarNormaDialog } from "../../derogar/ui/DerogarNormaDialog"
import { ActualizarNormaDialog } from "../../actualizar/ui/ActualizarNormaDialog"
import { BADGE_ESTADO_NORMA } from "../../model/constants"
import type { NormaResponse, ListarNormasParams } from "../../model/types"

export function NormatividadPage() {
  const [tipo, setTipo] = useState("")
  const [ambito, setAmbito] = useState("")
  const [vigente, setVigente] = useState("")
  const [pagina, setPagina] = useState(1)
  const [registrarOpen, setRegistrarOpen] = useState(false)
  const [derogar, setDerogar] = useState<NormaResponse | null>(null)
  const [editar, setEditar] = useState<NormaResponse | null>(null)

  const params: ListarNormasParams = {
    pagina,
    elementosPorPagina: 20,
    ...(tipo ? { tipo } : {}),
    ...(ambito ? { ambito } : {}),
    ...(vigente === "true" ? { vigente: true } : vigente === "false" ? { vigente: false } : {}),
  }

  const { data, isLoading, isError } = useNormatividad(params)
  const normas = data?.items ?? []
  const totalPaginas = data?.totalPaginas ?? 1

  if (isLoading) return <p className="text-sm text-muted-foreground p-6">Cargando...</p>
  if (isError) return <p className="text-sm text-destructive p-6">Error al cargar normatividad.</p>

  return (
    <div className="space-y-4">
      <PageHeader
        title="Normatividad"
        description="Repositorio de normas institucionales vigentes"
        actions={
          <div className="flex items-center gap-2">
            <NormatividadFilters
              tipo={tipo}
              ambito={ambito}
              vigente={vigente}
              onTipo={(v: string) => { setTipo(v); setPagina(1) }}
              onAmbito={(v: string) => { setAmbito(v); setPagina(1) }}
              onVigente={(v: string) => { setVigente(v); setPagina(1) }}
            />
            <button
              className="btn-primary text-sm whitespace-nowrap"
              onClick={() => setRegistrarOpen(true)}
            >
              + Nueva norma
            </button>
          </div>
        }
      />

      {normas.length === 0 && (
        <p className="text-sm text-muted-foreground">Sin resultados para los filtros aplicados.</p>
      )}

      <div className="space-y-2">
        {normas.map((norma: NormaResponse) => {
          const badgeClass = BADGE_ESTADO_NORMA[norma.estado] ?? "bg-gray-100 text-gray-600"
          return (
            <div key={norma.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{norma.codigo}</span>
                    <span className="text-xs text-muted-foreground">{norma.tipo}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}>
                      {norma.estado}
                    </span>
                    <span className="text-xs text-muted-foreground">{norma.ambito}</span>
                  </div>
                  <p className="text-sm mt-0.5">{norma.titulo}</p>
                  {norma.entidadEmisora && (
                    <p className="text-xs text-muted-foreground mt-0.5">{norma.entidadEmisora}</p>
                  )}
                  {norma.fechaExpedicion && (
                    <p className="text-xs text-muted-foreground">
                      Expedicion: {new Date(norma.fechaExpedicion).toLocaleDateString("es-CO")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {norma.urlDocumento && (
                    <a href={norma.urlDocumento} target="_blank" rel="noreferrer"
                      className="text-xs text-blue-600 hover:underline">
                      Ver doc.
                    </a>
                  )}
                  {norma.estado !== "DEROGADA" && (
                    <>
                      <button className="text-xs text-blue-600 hover:underline"
                        onClick={() => setEditar(norma)}>
                        Editar
                      </button>
                      <button className="text-xs text-red-600 hover:underline"
                        onClick={() => setDerogar(norma)}>
                        Derogar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            className="btn-secondary text-xs"
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <span className="text-xs text-muted-foreground">
            Pagina {pagina} de {totalPaginas}
          </span>
          <button
            className="btn-secondary text-xs"
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}

      <RegistrarNormaDialog open={registrarOpen} onClose={() => setRegistrarOpen(false)} />
      {derogar && (
        <DerogarNormaDialog norma={derogar} open onClose={() => setDerogar(null)} />
      )}
      {editar && (
        <ActualizarNormaDialog norma={editar} open onClose={() => setEditar(null)} />
      )}
    </div>
  )
}
