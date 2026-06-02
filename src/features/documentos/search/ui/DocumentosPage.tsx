import { useState, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Link } from "@tanstack/react-router";
import { Plus, FileText } from "lucide-react";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { Button } from "@/shared/ui/primitives/button";
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner";
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog";
import { useAuthStore } from "@/shared/state/auth.store";
import { useBuscarDocumentos } from "../hook";
import { DocumentosFilters } from "./DocumentosFilters";
import { DocumentosTable } from "./DocumentosTable";
import SubirDocumentoDialog from "../../upload/ui/SubirDocumentoDialog";
import ActualizarDocumentoDialog from "../../actualizar/ui/ActualizarDocumentoDialog";
import { useArchivarDocumento } from "../../archivar/hook";
import { useReactivarDocumento } from "../../reactivar/hook";
import { useEliminarDocumento } from "../../eliminar/hook";
import { useDescargarDocumento } from "../../download/hook";
import {
  canUploadDoc,
  canArchiveDoc,
  canDeleteDoc,
  canEditDoc,
} from "../../shared/permissions";

export function DocumentosPage() {
  const roles = useAuthStore((s) => s.roles);
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("");
  const [page, setPage] = useState(1);
  const debouncedQ = useDebounce(q, 300);

  const [showSubir, setShowSubir] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [archivarId, setArchivarId] = useState<number | null>(null);
  const [reactivarId, setReactivarId] = useState<number | null>(null);
  const [eliminarId, setEliminarId] = useState<number | null>(null);

  const { data, isLoading, isError } = useBuscarDocumentos({
    q: debouncedQ,
    tipo,
    page,
    pageSize: 15,
  });

  const archivar = useArchivarDocumento();
  const reactivar = useReactivarDocumento();
  const eliminar = useEliminarDocumento();
  const { descargar } = useDescargarDocumento();

  const handleQChange = useCallback((val: string) => {
    setQ(val);
    setPage(1);
  }, []);
  const handleTipoChange = useCallback((val: string) => {
    setTipo(val);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#5a6c82]">
        <Link to="/" className="hover:underline">Inicio</Link>
        <span>/</span>
        <span className="text-neutral-800 font-medium">Documentos</span>
      </nav>

      <PageHeader
        title="Gestión documental"
        description="Busca, sube y administra todos los documentos del sistema."
        actions={
          canUploadDoc(roles) ? (
            <Button onClick={() => setShowSubir(true)}>
              <Plus className="mr-2 size-4" /> Subir documento
            </Button>
          ) : undefined
        }
      />

      <DocumentosFilters
        q={q}
        tipo={tipo}
        onQChange={handleQChange}
        onTipoChange={handleTipoChange}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <DocumentosTable
          data={data?.items ?? []}
          total={data?.totalRegistros ?? 0}
          page={page}
          pageSize={15}
          onPageChange={setPage}
          isError={isError}
          onDescargar={(id) => descargar(id)}
          onArchivar={(id) => setArchivarId(id)}
          onReactivar={(id) => setReactivarId(id)}
          onEliminar={(id) => setEliminarId(id)}
          onEditar={(id) => setEditId(id)}
          canArchive={canArchiveDoc(roles)}
          canDelete={canDeleteDoc(roles)}
          canEdit={canEditDoc(roles)}
        />
      )}

      {/* Dialogs */}
      <SubirDocumentoDialog open={showSubir} onClose={() => setShowSubir(false)} />

      {editId !== null && (
        <ActualizarDocumentoDialog
          documentoId={editId}
          open={editId !== null}
          onClose={() => setEditId(null)}
        />
      )}

      <ConfirmDialog
        open={archivarId !== null}
        onCancel={() => setArchivarId(null)}
        onConfirm={() => {
          if (archivarId !== null) archivar.mutate(archivarId);
          setArchivarId(null);
        }}
        variant="warning"
      >
        ¿Archivar este documento? Dejará de aparecer en las listas activas.
      </ConfirmDialog>

      <ConfirmDialog
        open={reactivarId !== null}
        onCancel={() => setReactivarId(null)}
        onConfirm={() => {
          if (reactivarId !== null) reactivar.mutate(reactivarId);
          setReactivarId(null);
        }}
        variant="info"
      >
        ¿Reactivar este documento?
      </ConfirmDialog>

      <ConfirmDialog
        open={eliminarId !== null}
        onCancel={() => setEliminarId(null)}
        onConfirm={() => {
          if (eliminarId !== null) eliminar.mutate(eliminarId);
          setEliminarId(null);
        }}
        variant="error"
      >
        ¿Eliminar permanentemente este documento? Esta acción no se puede deshacer.
      </ConfirmDialog>
    </div>
  );
}
