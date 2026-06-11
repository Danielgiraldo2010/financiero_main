import { useState } from "react"
import { useNormatividad } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { NormatividadFilters } from "./NormatividadFilters"
import { RegistrarNormaDialog } from "../../registrar/ui/RegistrarNormaDialog"
import { DerogarNormaDialog } from "../../derogar/ui/DerogarNormaDialog"
import { ActualizarNormaDialog } from "../../actualizar/ui/ActualizarNormaDialog"
import { Button } from "@/components/ui/button"
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
          <div className="flex flex-wrap items-center gap-2">
            <NormatividadFilters
              tipo={tipo}
              ambito={ambito}
              vigente={vigente}
              onTipo={(v) => { setTipo(v); setPagina(1) }}
              onAmbito={(v) => { setAmbito(v); setPagina(1) }}
              onVigente={(v) => { setVigente(v); setPagina(1) }}
            />
            <Button size="sm" onClick={() => setRegistrarOpen(true)}>
              + Nueva norma
            </Button>
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
            <div key={norma.id} className="corporate-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-[#004b82]">{norma.codigo}</span>
                    <span className="text-xs text-muted-foreground">{norma.tipo}</span>
                    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
                      {norma.estado}
                    </span>
                    <span className="text-xs text-muted-foreground">{norma.ambito}</span>
                  </div>
                  <p className="text-sm mt-1">{norma.titulo}</p>
                  {norma.entidadEmisora && (
                    <p className="text-xs text-muted-foreground mt-0.5">{norma.entidadEmisora}</p>
                  )}
                  {norma.fechaExpedicion && (
                    <p className="text-xs text-muted-foreground">
                      Expedición: {new Date(norma.fechaExpedicion).toLocaleDateString("es-CO")}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {norma.urlDocumento && (
                    <Button size="xs" variant="outline" asChild>
                      <a href={norma.urlDocumento} target="_blank" rel="noreferrer">Ver doc.</a>
                    </Button>
                  )}
                  {norma.estado !== "DEROGADA" && (
                    <>
                      <Button size="xs" variant="secondary" onClick={() => setEditar(norma)}>
                        Editar
                      </Button>
                      <Button size="xs" variant="destructive" onClick={() => setDerogar(norma)}>
                        Derogar
                      </Button>
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
          <Button size="sm" variant="secondary" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1}>
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground">Página {pagina} de {totalPaginas}</span>
          <Button size="sm" variant="secondary" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}>
            Siguiente
          </Button>
        </div>
      )}

      <RegistrarNormaDialog open={registrarOpen} onClose={() => setRegistrarOpen(false)} />
      {derogar && <DerogarNormaDialog norma={derogar} open onClose={() => setDerogar(null)} />}
      {editar && <ActualizarNormaDialog norma={editar} open onClose={() => setEditar(null)} />}
    </div>
  )
}
