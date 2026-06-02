import { lazy, Suspense, useState } from "react"
import { useAuditoria } from "../hook"
import { useExportarAuditoria } from "../../exportar/hook"
import { AuditoriaFilters } from "./AuditoriaFilters"
import { DataTable } from "@/shared/ui/data/DataTable"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import type { ColumnDef } from "@tanstack/react-table"
import type { AuditoriaParams, EventoAuditoria } from "../../model/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// ✅ .then(m => ({ default: m.EventoAuditoriaDialog })) — no requiere default export
const EventoAuditoriaDialog = lazy(
  () =>
    import("../../detalle/ui/EventoAuditoriaDialog").then((m) => ({
      default: m.EventoAuditoriaDialog,
    }))
)

const columns: ColumnDef<EventoAuditoria>[] = [
  {
    accessorKey: "fechaHora",
    header: "Fecha",
    cell: ({ row }) => (
      <span className="text-sm font-mono text-muted-foreground">
        {format(new Date(row.original.fechaHora), "dd/MM/yy HH:mm:ss", { locale: es })}
      </span>
    ),
  },
  {
    accessorKey: "usuarioNombre",
    header: "Usuario",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.usuarioNombre ?? "Sistema"}</span>
    ),
  },
  {
    accessorKey: "accion",
    header: "Accion",
    cell: ({ row }) => (
      <span className="text-sm font-mono">{row.original.accion}</span>
    ),
  },
  {
    accessorKey: "entidadTipo",
    header: "Entidad",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.entidadTipo ?? "-"}
      </span>
    ),
  },
  {
    accessorKey: "resultado",
    header: "Resultado",
    cell: ({ row }) => (
      <StatusBadge
        variant={row.original.resultado === "Exito" ? "success" : "error"}
        label={row.original.resultado}
      />
    ),
  },
  {
    accessorKey: "duracionMs",
    header: "Duracion",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.duracionMs != null ? row.original.duracionMs + " ms" : "-"}
      </span>
    ),
  },
]

export function AuditoriaPage() {
  const [params, setParams] = useState<AuditoriaParams>({ page: 1, pageSize: 30 })
  const [selected, setSelected] = useState<EventoAuditoria | null>(null)
  const { data, isLoading, isError } = useAuditoria(params)
  const { mutate: exportar, isPending: exportando } = useExportarAuditoria()

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Auditoria"
        description="Registro de eventos del sistema. Solo lectura."
        actions={
          <button
            disabled={exportando}
            onClick={() =>
              exportar({
                // ✅ exactOptionalPropertyTypes: spread condicional por campo
                ...(params.desde !== undefined      && { desde: params.desde }),
                ...(params.hasta !== undefined      && { hasta: params.hasta }),
                ...(params.usuarioNombre !== undefined && { usuarioNombre: params.usuarioNombre }),
                formato: "xlsx",
              })
            }
            className="rounded-md border border-input px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
          >
            {exportando ? "Exportando..." : "Exportar XLSX"}
          </button>
        }
      />

      <AuditoriaFilters onChange={setParams} />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        onRowClick={setSelected}
        // ✅ exactOptionalPropertyTypes: no pasar pagination={undefined}
        // spread condicional omite la prop completamente cuando data es null
        {...(data
          ? {
              pagination: {
                page: params.page ?? 1,
                pageSize: params.pageSize ?? 30,
                total: data.total,
                onPageChange: (page: number) => setParams((p) => ({ ...p, page })),
              },
            }
          : {})}
        emptyMessage="No se encontraron eventos de auditoria"
      />

      {selected && (
        <Suspense fallback={null}>
          <EventoAuditoriaDialog
            open={selected !== null}
            evento={selected}
            onClose={() => setSelected(null)}
          />
        </Suspense>
      )}
    </div>
  )
}