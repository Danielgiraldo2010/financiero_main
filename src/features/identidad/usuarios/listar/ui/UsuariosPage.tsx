// src/features/identidad/usuarios/listar/ui/UsuariosPage.tsx
import { lazy, Suspense, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useUsuarios } from "../hook"
import { useDesactivarUsuario, useBloquearUsuario } from "../../acciones/hook"
import { UsuariosFilters } from "./UsuariosFilters"
import { DataTable } from "@/shared/ui/data/DataTable"
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog"
import type { ColumnDef } from "@tanstack/react-table"
import type { Usuario, UsuariosParams } from "../../model/types"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { MoreHorizontal, Eye, UserX, Lock, Pencil } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const CrearUsuarioDialog = lazy(
  () => import("../../crear/ui/CrearUsuarioDialog")
)

const ModificarUsuarioDialog = lazy(
  () => import("../../modificar/ui/ModificarUsuarioDialog")
)

function AccionesUsuario({ usuario }: { usuario: Usuario }) {
  const navigate = useNavigate()
  const [confirmAccion, setConfirmAccion] = useState<"desactivar" | "bloquear" | null>(null)
  const [showModificar, setShowModificar] = useState(false)

  const { mutate: desactivar, isPending: desactivando } = useDesactivarUsuario()
  const { mutate: bloquear, isPending: bloqueando } = useBloquearUsuario()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted outline-none">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Acciones</span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => navigate({ to: "/admin/usuarios/$id", params: { id: usuario.id } })}
          >
            <Eye className="h-4 w-4" />
            Ver detalle
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowModificar(true)}>
            <Pencil className="h-4 w-4" />
            Editar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setConfirmAccion("bloquear")}>
            <Lock className="h-4 w-4" />
            Bloquear
          </DropdownMenuItem>

          {usuario.activo && (
            <DropdownMenuItem
              onClick={() => setConfirmAccion("desactivar")}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <UserX className="h-4 w-4" />
              Desactivar
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {showModificar && (
        <Suspense fallback={null}>
          <ModificarUsuarioDialog
            open={showModificar}
            usuario={usuario}
            onClose={() => setShowModificar(false)}
          />
        </Suspense>
      )}

      <ConfirmDialog
        open={confirmAccion === "desactivar"}
        title="Desactivar usuario"
        description={`Se desactivara el acceso de ${usuario.nombreCompleto ?? usuario.userName}. Esta accion es irreversible desde la UI.`}
        confirmLabel="Desactivar"
        variant="destructive"
        isLoading={desactivando}
        onConfirm={() => desactivar(usuario.id, { onSuccess: () => setConfirmAccion(null) })}
        onCancel={() => setConfirmAccion(null)}
      />

      <ConfirmDialog
        open={confirmAccion === "bloquear"}
        title="Bloquear usuario"
        description={`Se bloqueara temporalmente el acceso de ${usuario.nombreCompleto ?? usuario.userName}.`}
        confirmLabel="Bloquear"
        variant="destructive"
        isLoading={bloqueando}
        onConfirm={() => bloquear(usuario.id, { onSuccess: () => setConfirmAccion(null) })}
        onCancel={() => setConfirmAccion(null)}
      />
    </>
  )
}

const columns: ColumnDef<Usuario>[] = [
  {
    accessorKey: "nombreCompleto",
    header: "Nombre",
    cell: ({ row }) => {
      const u = row.original
      return (
        <Link
          to="/admin/usuarios/$id"
          params={{ id: u.id }}
          className="font-medium text-primary hover:underline"
        >
          {u.nombreCompleto ?? u.userName}
        </Link>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "activo",
    header: "Estado",
    cell: ({ row }) => {
      const u = row.original
      return (
        <StatusBadge
          variant={u.activo ? "success" : "error"}
          label={u.activo ? "Activo" : "Inactivo"}
        />
      )
    },
  },
  {
    // ✅ Corregido typo: totpP2FaEnabled -> totp2FaEnabled
    accessorKey: "totp2FaEnabled",
    header: "2FA",
    cell: ({ row }) => {
      const u = row.original
      return (
        <StatusBadge
          variant={u.totp2FaEnabled ? "success" : "warning"}
          label={u.totp2FaEnabled ? "Activo" : "Sin 2FA"}
        />
      )
    },
  },
  {
    accessorKey: "unidades",
    header: "Unidades",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.unidades.length} unidad(es)</span>
    ),
  },
  {
    accessorKey: "lastLoginAt",
    header: "Ultimo acceso",
    cell: ({ row }) => {
      const u = row.original
      return u.lastLoginAt ? (
        <span className="text-sm text-muted-foreground">
          {formatDistanceToNow(new Date(u.lastLoginAt), { addSuffix: true, locale: es })}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">Nunca</span>
      )
    },
  },
  {
    id: "acciones",
    header: "",
    cell: ({ row }) => <AccionesUsuario usuario={row.original} />,
  },
]

export function UsuariosPage() {
  const [params, setParams] = useState<UsuariosParams>({ page: 1, pageSize: 20 })
  const [showCrear, setShowCrear] = useState(false)
  const { data, isLoading, isError } = useUsuarios(params)

  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Usuarios"
        description="Gestion de cuentas y asignaciones de unidades ejecutoras"
        actions={
          <button
            onClick={() => setShowCrear(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            + Nuevo usuario
          </button>
        }
      />

      <UsuariosFilters onChange={setParams} />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        isError={isError}
        // ✅ exactOptionalPropertyTypes: spread condicional — nunca pasar pagination={undefined}
        {...(data
          ? {
              pagination: {
                page: params.page ?? 1,
                pageSize: params.pageSize ?? 20,
                total: data.total,
                onPageChange: (page: number) => setParams((p) => ({ ...p, page })),
              },
            }
          : {})}
        emptyMessage="No se encontraron usuarios con los filtros aplicados"
      />

      {showCrear && (
        <Suspense fallback={null}>
          <CrearUsuarioDialog
            open={showCrear}
            onClose={() => setShowCrear(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
