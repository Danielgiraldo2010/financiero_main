// src/features/documentos/search/ui/DocumentosTable.tsx
import { useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Eye, Download, Pencil, Archive, RotateCcw, Trash2,
} from "lucide-react";
import { DataTable } from "@/shared/ui/data/DataTable";
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge";
import type { DocumentoBusqueda } from "../../model/types";
import { ESTADOS_DOCUMENTO } from "../../shared/constants";

function AccionBtn({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  danger?: boolean;
}) {
  return (
    <button
      title={label}
      aria-label={label}
      onClick={(e) => { e.stopPropagation(); onClick(e); }}
      className={[
        "rounded p-1.5 transition-colors",
        danger
          ? "text-neutral-400 hover:text-destructive hover:bg-destructive/10"
          : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100",
      ].join(" ")}
    >
      {icon}
    </button>
  );
}

interface AccionesProps {
  doc: DocumentoBusqueda;
  onVerDetalle: (id: number) => void;
  onDescargar: (id: number) => void;
  onArchivar: (id: number) => void;
  onReactivar: (id: number) => void;
  onEliminar: (id: number) => void;
  onEditar: (id: number) => void;
  canArchive: boolean;
  canDelete: boolean;
  canEdit: boolean;
}

function AccionesDoc({
  doc,
  onVerDetalle,
  onDescargar,
  onArchivar,
  onReactivar,
  onEliminar,
  onEditar,
  canArchive,
  canDelete,
  canEdit,
}: AccionesProps) {
  return (
    <div className="flex items-center gap-0.5">
      <AccionBtn icon={<Eye className="size-4" />} label="Ver detalle" onClick={() => onVerDetalle(doc.id)} />
      <AccionBtn icon={<Download className="size-4" />} label="Descargar" onClick={() => onDescargar(doc.id)} />
      {canEdit && (
        <AccionBtn icon={<Pencil className="size-4" />} label="Editar metadatos" onClick={() => onEditar(doc.id)} />
      )}
      {canArchive && doc.estado === "ACTIVO" && (
        <AccionBtn icon={<Archive className="size-4" />} label="Archivar" onClick={() => onArchivar(doc.id)} />
      )}
      {canArchive && doc.estado === "ARCHIVADO" && (
        <AccionBtn icon={<RotateCcw className="size-4" />} label="Reactivar" onClick={() => onReactivar(doc.id)} />
      )}
      {canDelete && (
        <AccionBtn icon={<Trash2 className="size-4" />} label="Eliminar" onClick={() => onEliminar(doc.id)} danger />
      )}
    </div>
  );
}

interface TableProps {
  data: DocumentoBusqueda[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  // ✅ isLoading opcional: DocumentosPage ya maneja el estado de carga
  // con render condicional — no necesita pasarlo a la tabla
  isLoading?: boolean | undefined;
  isError: boolean;
  onDescargar: (id: number) => void;
  onArchivar: (id: number) => void;
  onReactivar: (id: number) => void;
  onEliminar: (id: number) => void;
  onEditar: (id: number) => void;
  canArchive: boolean;
  canDelete: boolean;
  canEdit: boolean;
}

export function DocumentosTable({
  data,
  total,
  page,
  pageSize,
  onPageChange,
  isLoading = false,
  isError,
  onDescargar,
  onArchivar,
  onReactivar,
  onEliminar,
  onEditar,
  canArchive,
  canDelete,
  canEdit,
}: TableProps) {
  const navigate = useNavigate();

  const irAlDetalle = (id: number) =>
    navigate({ to: "/documentos/$id", params: { id: String(id) } });

  const columns: ColumnDef<DocumentoBusqueda>[] = [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.nombre}</span>
      ),
    },
    {
      accessorKey: "tipoDocumento",
      header: "Tipo",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => {
        const cfg = ESTADOS_DOCUMENTO[row.original.estado] ?? {
          label: row.original.estado,
          variant: "default" as const,
        };
        return <StatusBadge variant={cfg.variant} label={cfg.label} />;
      },
    },
    {
      accessorKey: "subidoPor",
      header: "Subido por",
      cell: ({ row }) => row.original.subidoPor ?? "—",
    },
    {
      accessorKey: "fechaSubida",
      header: "Fecha",
      cell: ({ row }) =>
        new Date(row.original.fechaSubida).toLocaleDateString("es-CO"),
    },
    {
      id: "acciones",
      header: "",
      cell: ({ row }) => (
        <AccionesDoc
          doc={row.original}
          onVerDetalle={irAlDetalle}
          onDescargar={onDescargar}
          onArchivar={onArchivar}
          onReactivar={onReactivar}
          onEliminar={onEliminar}
          onEditar={onEditar}
          canArchive={canArchive}
          canDelete={canDelete}
          canEdit={canEdit}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      isError={isError}
      pagination={{ page, pageSize, total, onPageChange }}
      onRowClick={(row) => irAlDetalle(row.id)}
    />
  );
}
