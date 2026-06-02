import { Link } from "@tanstack/react-router"
import { useRoles } from "../hook"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { DataTable } from "@/shared/ui/data/DataTable"
import type { ColumnDef } from "@tanstack/react-table"
import type { Rol } from "../../model/types"

const columns: ColumnDef<Rol>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <Link
        to="/admin/roles/$id"
        params={{ id: row.original.name }}
        className="font-medium text-primary hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "claims",
    header: "Permisos",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.claims.length} permiso(s)
      </span>
    ),
  },
]

export function RolesPage() {
  const { data, isLoading, isError } = useRoles()

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Roles"
        description="Gestion de roles y permisos del sistema"
      />
      <DataTable
        columns={columns}
        data={data ?? []}
        isLoading={isLoading}
        isError={isError}
        emptyMessage="No hay roles definidos en el sistema"
      />
    </div>
  )
}
