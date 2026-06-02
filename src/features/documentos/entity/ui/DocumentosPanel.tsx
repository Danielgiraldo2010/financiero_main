import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Download, Link2Off, Plus, FileText } from "lucide-react";
import { Button } from "@/shared/ui/primitives/button";
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge";
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner";
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog";
import { useDocumentosPorEntidad } from "../hook";
import { useDescargarDocumento } from "../../download/hook";
import { useDesvincularDocumento } from "../../unlink/hook";
import SubirYVincularDialog from "./SubirYVincularDialog";
import type { TipoEntidadDocumento } from "../../model/types";

interface Props {
  entidadTipo: TipoEntidadDocumento;
  entidadId: number;
  canUpload?: boolean;
  canArchive?: boolean;
  compact?: boolean;
}

export function DocumentosPanel({
  entidadTipo,
  entidadId,
  canUpload = false,
  canArchive = false,
  compact = false,
}: Props) {
  const navigate = useNavigate();
  const [showSubir, setShowSubir] = useState(false);
  const [desvincularVinculoId, setDesvincularVinculoId] = useState<number | null>(null);

  const { data: docs = [], isLoading } = useDocumentosPorEntidad(entidadTipo, entidadId);
  const { descargar } = useDescargarDocumento();
  const desvincular = useDesvincularDocumento(entidadTipo, entidadId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-700">
          Documentos adjuntos ({docs.length})
        </p>
        {canUpload && (
          <Button size="sm" variant="outline" onClick={() => setShowSubir(true)}>
            <Plus className="mr-1.5 size-3.5" /> Subir documento
          </Button>
        )}
      </div>

      {/* Lista */}
      {docs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-neutral-400 border border-dashed rounded-lg">
          <FileText className="size-6" />
          <p className="text-sm">No hay documentos adjuntos</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li
              key={doc.id}
              className={[
                "flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5",
                compact ? "text-xs" : "text-sm",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="size-4 shrink-0 text-neutral-400" />
                <div className="min-w-0">
                  <button
                    className="font-medium truncate hover:underline text-left"
                    onClick={() =>
                      navigate({
                        to: "/documentos/$id",
                        params: { id: String(doc.documentoId) },
                      })
                    }
                  >
                    {doc.nombreDocumento}
                  </button>
                  {!compact && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-[#5a6c82]">
                        {doc.tipoDocumento}
                      </span>
                      {doc.esPrincipal && (
                        <StatusBadge variant="info" label="Principal" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  title="Descargar"
                  onClick={() => descargar(doc.documentoId, doc.nombreDocumento)}
                  className="rounded p-1 text-[#5a6c82] hover:bg-neutral-100 hover:text-[#19324d]"
                >
                  <Download className="size-3.5" />
                </button>
                {canArchive && (
                  <button
                    title="Desvincular"
                    onClick={() => setDesvincularVinculoId(doc.id)}
                    className="rounded p-1 text-[#5a6c82] hover:bg-neutral-100 hover:text-destructive"
                  >
                    <Link2Off className="size-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <SubirYVincularDialog
        open={showSubir}
        onClose={() => setShowSubir(false)}
        entidadTipo={entidadTipo}
        entidadId={entidadId}
      />

      <ConfirmDialog
        open={desvincularVinculoId !== null}
        title="Desvincular documento"
        description="¿Desvincular este documento de la entidad? El documento seguirá existiendo en el sistema."
        confirmLabel="Desvincular"
        variant="destructive"
        onCancel={() => setDesvincularVinculoId(null)}
        onConfirm={() => {
          if (desvincularVinculoId !== null)
            desvincular.mutate(desvincularVinculoId);
          setDesvincularVinculoId(null);
        }}
      />
    </div>
  );
}
