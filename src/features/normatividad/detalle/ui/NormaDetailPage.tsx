import { useNormaDetalle } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { BADGE_ESTADO_NORMA } from "../../model/constants"

interface Props {
  normaId: number
}

export function NormaDetailPage({ normaId }: Props) {
  const { data: norma, isLoading, isError } = useNormaDetalle(normaId)

  if (isLoading) return <p className="text-sm text-muted-foreground p-6">Cargando detalle...</p>
  if (isError || !norma) return <p className="text-sm text-destructive p-6">Error al cargar la norma.</p>

  const badgeClass = BADGE_ESTADO_NORMA[norma.estado] ?? "bg-gray-100 text-gray-600"

  return (
    <div className="space-y-6">
      <PageHeader
        title={norma.codigo}
        description={norma.titulo}
        actions={
          norma.urlDocumento ? (
            <a
              href={norma.urlDocumento}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-sm"
            >
              Ver documento
            </a>
          ) : undefined
        }
      />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium text-muted-foreground">Estado</span>
          <p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeClass}`}>
              {norma.estado}
            </span>
          </p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Tipo / Ambito</span>
          <p>{norma.tipo} / {norma.ambito}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Entidad emisora</span>
          <p>{norma.entidadEmisora ?? "—"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Fecha expedicion</span>
          <p>{norma.fechaExpedicion ? new Date(norma.fechaExpedicion).toLocaleDateString("es-CO") : "—"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Vigencia desde</span>
          <p>{norma.fechaVigenciaDesde ? new Date(norma.fechaVigenciaDesde).toLocaleDateString("es-CO") : "—"}</p>
        </div>
        <div>
          <span className="font-medium text-muted-foreground">Vigencia hasta</span>
          <p>{norma.fechaVigenciaHasta ? new Date(norma.fechaVigenciaHasta).toLocaleDateString("es-CO") : "—"}</p>
        </div>
      </div>

      {norma.descripcion && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Descripcion</h3>
          <p className="text-sm text-muted-foreground">{norma.descripcion}</p>
        </div>
      )}

      {norma.procesos.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Dominios de aplicacion</h3>
          <div className="space-y-2">
            {norma.procesos.map((p) => (
              <div key={p.id} className="border rounded p-3 text-sm">
                <span className="font-medium">{p.dominio}</span>
                {p.descripcionAplicacion && (
                  <p className="text-muted-foreground text-xs mt-0.5">{p.descripcionAplicacion}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
