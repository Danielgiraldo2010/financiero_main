// features/integracion/sistemas/listar/ui/SistemasPage.tsx

import { useListarSistemas } from "../hook"
import { useActivarSistema, useDesactivarSistema } from "../../acciones/hook"
import { usePermissions } from "@/shared/hooks/usePermissions"
import { ROLES } from "@/shared/lib/constants"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner"
import { ErrorMessage } from "@/shared/ui/feedback/ErrorMessage"
import { DataTable } from "@/shared/ui/data/DataTable"
import { ActionMenu } from "@/shared/ui/overlays/ActionMenu"
import { formatDate } from "@/shared/lib/date"
import type { SistemaIntegrado } from "../../../model/types"
import type { ColumnDef } from "@tanstack/react-table"

export function SistemasPage() {
  const { data: sistemas = [], isLoading, error } = useListarSistemas()
  const { mutate: activar, isPending: activando } = useActivarSistema()
  const { mutate: desactivar, isPending: desactivando } = useDesactivarSistema()
  const { hasRole } = usePermissions()

  const puedeGestionar = hasRole([ROLES.ADMIN_CENTRAL, ROLES.FINANCIERO_CENTRAL])
  const ocupado = activando || desactivando

  const columns: ColumnDef<SistemaIntegrado>[] = [
    {
      accessorKey: "codigo",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold">{row.original.codigo}</span>
      ),
    },
    {
      accessorKey: "nombre",
      header: "Sistema",
    },
    {
      accessorKey: "tipo",
      header: "Tipo",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.estado}
          variant={row.original.estado === "ACTIVO" ? "success" : "default"}
        />
      ),
    },
    {
      accessorKey: "ultimaSync",
      header: "Última sincronización",
      cell: ({ row }) =>
        row.original.ultimaSync ? formatDate(row.original.ultimaSync) : "—",
    },
    {
      accessorKey: "totalRegistros",
      header: "Registros",
      cell: ({ row }) => row.original.totalRegistros.toLocaleString("es-CO"),
    },
    ...(puedeGestionar
      ? [
          {
            id: "acciones",
            header: "",
            cell: ({ row }: { row: { original: SistemaIntegrado } }) => {
              const s = row.original
              return (
                <ActionMenu
                  items={[
                    s.estado === "INACTIVO"
                      ? {
                          label: "Activar",
                          onClick: () => activar(s.id),
                          disabled: ocupado,
                        }
                      : {
                          label: "Desactivar",
                          onClick: () => desactivar(s.id),
                          disabled: ocupado,
                          destructive: true,
                        },
                  ]}
                />
              )
            },
          } satisfies ColumnDef<SistemaIntegrado>,
        ]
      : []),
  ]

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error instanceof Error ? error.message : "Error al cargar sistemas."} />

  return (
    <div className="space-y-4">
      <PageHeader title="Sistemas integrados" />
      <DataTable columns={columns} data={sistemas} />
    </div>
  )
}
