// features/integracion/sincronizaciones/log/ui/LogSincronizacionesTable.tsx
// Solo lectura — FE14-I4

import { useLogSincronizaciones } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner"
import { ErrorMessage } from "@/shared/ui/feedback/ErrorMessage"
import { DataTable } from "@/shared/ui/data/DataTable"
import { formatDate } from "@/shared/lib/date"
import type { Sincronizacion } from "../../../model/types"
import type { ColumnDef } from "@tanstack/react-table"

const columns: ColumnDef<Sincronizacion>[] = [
  {
    accessorKey: "integracionNombre",
    header: "Sistema",
  },
  {
    accessorKey: "tipoOperacion",
    header: "Operación",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.tipoOperacion}</span>
    ),
  },
  {
    accessorKey: "vigencia",
    header: "Vigencia",
    cell: ({ row }) => row.original.vigencia ?? "—",
  },
  {
    accessorKey: "unidadEjecutoraNombre",
    header: "Unidad ejecutora",
    cell: ({ row }) => row.original.unidadEjecutoraNombre ?? "—",
  },
  {
    accessorKey: "estado",
    header: "Estado",
    cell: ({ row }) => {
      const variantMap: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
        COMPLETADO: "success",
        ERROR: "error",
        EN_PROCESO: "warning",
        PENDIENTE: "info",
      }
      return (
        <StatusBadge
          label={row.original.estado}
          variant={variantMap[row.original.estado] ?? "default"}
        />
      )
    },
  },
  {
    accessorKey: "registrosProcesados",
    header: "Procesados",
    cell: ({ row }) => row.original.registrosProcesados?.toLocaleString("es-CO") ?? "—",
  },
  {
    accessorKey: "registrosError",
    header: "Errores",
    cell: ({ row }) =>
      row.original.registrosError != null ? (
        <span className={row.original.registrosError > 0 ? "text-red-600 font-semibold" : ""}>
          {row.original.registrosError}
        </span>
      ) : (
        "—"
      ),
  },
  {
    accessorKey: "fechaInicio",
    header: "Inicio",
    cell: ({ row }) => formatDate(row.original.fechaInicio),
  },
  {
    accessorKey: "fechaFin",
    header: "Fin",
    cell: ({ row }) => (row.original.fechaFin ? formatDate(row.original.fechaFin) : "—"),
  },
  {
    accessorKey: "iniciadoPor",
    header: "Iniciado por",
    cell: ({ row }) => row.original.iniciadoPor ?? "—",
  },
]

export function LogSincronizacionesTable() {
  const { data: sincronizaciones = [], isLoading, error } = useLogSincronizaciones()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : "Error al cargar sincronizaciones."} />

  return (
    <div className="space-y-4">
      <PageHeader title="Log de sincronizaciones" />
      <DataTable columns={columns} data={sincronizaciones} />
    </div>
  )
}