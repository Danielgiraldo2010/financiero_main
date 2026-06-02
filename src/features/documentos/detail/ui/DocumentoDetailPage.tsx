import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Download, Archive, RotateCcw, Trash2, Pencil,
  FileText, Hash, Eye, FileX,
} from "lucide-react";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { StatusBadge } from "@/shared/ui/feedback/StatusBadge";
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner";
import { Button } from "@/shared/ui/primitives/button";
import { ConfirmDialog } from "@/shared/ui/overlays/ConfirmDialog";
import { useAuthStore } from "@/shared/state/auth.store";
import { useDocumento, useVersionesDocumento, useHistorialDescargas } from "../hook";
import { useDescargarDocumento } from "../../download/hook";
import { useArchivarDocumento } from "../../archivar/hook";
import { useReactivarDocumento } from "../../reactivar/hook";
import { useEliminarDocumento } from "../../eliminar/hook";
import ActualizarDocumentoDialog from "../../actualizar/ui/ActualizarDocumentoDialog";
import { getAccessToken } from "@/shared/api/auth/token-store";
import {
  ESTADOS_DOCUMENTO,
  formatBytes,
  mimeToExtension,
} from "../../shared/constants";
import {
  canArchiveDoc,
  canDeleteDoc,
  canEditDoc,
} from "../../shared/permissions";

type Tab = "preview" | "info" | "versiones" | "descargas";

interface Props {
  documentoId: number;
}

// ─── Vista previa según MIME ─────────────────────────────────────────────────
function PreviewDocumento({
  documentoId,
  mimeType,
  nombre,
}: {
  documentoId: number;
  mimeType: string | null;
  nombre: string;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = getAccessToken() ?? "";
    setLoading(true);
    setError(false);

    fetch(`/api/v1/documentos/${documentoId}/descargar`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.blob();
      })
      .then((blob) => {
        setBlobUrl(URL.createObjectURL(blob));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));

    return () => {
      setBlobUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, [documentoId]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !blobUrl) {
    return (
      <EmptyState
        icon={<FileX />}
        message="No se pudo cargar la vista previa. Descarga el archivo para verlo."
      />
    );
  }

  // PDF — iframe nativo del navegador
  if (mimeType === "application/pdf") {
    return (
      <iframe
        src={blobUrl}
        title={nombre}
        className="w-full rounded-lg border border-neutral-200"
        style={{ height: "70vh" }}
      />
    );
  }

  // Imágenes
  if (mimeType?.startsWith("image/")) {
    return (
      <div className="flex justify-center">
        <img
          src={blobUrl}
          alt={nombre}
          className="max-w-full max-h-[70vh] rounded-lg border border-neutral-200 object-contain"
        />
      </div>
    );
  }

  // DOCX / XLSX — no renderizables en browser
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-neutral-400">
      <FileText className="size-12" />
      <p className="text-sm font-medium">
        Vista previa no disponible para {mimeToExtension(mimeType)}
      </p>
      <p className="text-xs">Descarga el archivo para abrirlo con la aplicación correspondiente.</p>
    </div>
  );
}

// ─── Página de detalle ───────────────────────────────────────────────────────
export function DocumentoDetailPage({ documentoId }: Props) {
  const roles = useAuthStore((s) => s.roles);
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("info");
  const [showEdit, setShowEdit] = useState(false);
  const [showArchivar, setShowArchivar] = useState(false);
  const [showReactivar, setShowReactivar] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);

  const { data: doc, isLoading } = useDocumento(documentoId);
  const { data: versiones = [] } = useVersionesDocumento(documentoId);
  const { data: descargas = [] } = useHistorialDescargas(documentoId);

  const { descargar } = useDescargarDocumento();
  const archivar = useArchivarDocumento(() => navigate({ to: "/documentos" }));
  const reactivar = useReactivarDocumento();
  const eliminar = useEliminarDocumento(() => navigate({ to: "/documentos" }));

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!doc) return null;

  const estadoCfg = ESTADOS_DOCUMENTO[doc.estado] ?? {
    label: doc.estado,
    variant: "default" as const,
  };

  const tabs: { id: Tab; label: string }[] = [
  { id: "info", label: "Información" },
  { id: "preview", label: "Vista previa" },
  { id: "versiones", label: `Versiones (${versiones.length})` },
  { id: "descargas", label: `Descargas (${descargas.length})` },
];

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-[#5a6c82]">
        <Link to="/" className="hover:underline">Inicio</Link>
        <span>/</span>
        <Link to="/documentos" className="hover:underline">Documentos</Link>
        <span>/</span>
        <span className="text-neutral-800 font-medium truncate max-w-xs">
          {doc.nombre}
        </span>
      </nav>

      <PageHeader
        title={doc.nombre}
        description={doc.descripcion ?? "Sin descripción"}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => descargar(doc.id, doc.nombreOriginal)}>
              <Download className="mr-2 size-4" /> Descargar
            </Button>
            {canEditDoc(roles) && (
              <Button variant="outline" onClick={() => setShowEdit(true)}>
                <Pencil className="mr-2 size-4" /> Editar
              </Button>
            )}
            {canArchiveDoc(roles) && doc.estado === "ACTIVO" && (
              <Button variant="outline" onClick={() => setShowArchivar(true)}>
                <Archive className="mr-2 size-4" /> Archivar
              </Button>
            )}
            {canArchiveDoc(roles) && doc.estado === "ARCHIVADO" && (
              <Button variant="outline" onClick={() => setShowReactivar(true)}>
                <RotateCcw className="mr-2 size-4" /> Reactivar
              </Button>
            )}
            {canDeleteDoc(roles) && (
              <Button variant="destructive" onClick={() => setShowEliminar(true)}>
                <Trash2 className="mr-2 size-4" /> Eliminar
              </Button>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="sf-tabs-shell">
        <nav className="sf-tabs-nav">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "sf-tab",
                tab === t.id
                  ? "sf-tab-active"
                  : "",
              ].join(" ")}
            >
              {t.id === "preview" && <Eye className="inline mr-1.5 size-3.5" />}
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab: Vista previa */}
      {tab === "preview" && (
        <PreviewDocumento
          documentoId={documentoId}
          mimeType={doc.mimeType}
          nombre={doc.nombreOriginal}
        />
      )}

      {/* Tab: Información */}
      {tab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <MetaItem label="Nombre original" value={doc.nombreOriginal} />
            <MetaItem label="Tipo" value={doc.tipoDocumento} />
            <MetaItem label="Estado">
              <StatusBadge variant={estadoCfg.variant} label={estadoCfg.label} />
            </MetaItem>
            <MetaItem label="Proveedor de almacenamiento" value={doc.proveedorStorage} />
            <MetaItem
              label="Tamaño"
              value={doc.tamanioBytes ? formatBytes(doc.tamanioBytes) : "—"}
            />
            <MetaItem label="Formato" value={mimeToExtension(doc.mimeType)} />
          </div>
          <div className="space-y-4">
            <MetaItem label="Subido por" value={doc.subidoPor ?? "—"} />
            <MetaItem
              label="Fecha de subida"
              value={new Date(doc.fechaSubida).toLocaleString("es-CO")}
            />
            <MetaItem
              label="Año de vigencia presupuestal"
              value={doc.vigencia ? String(doc.vigencia) : "—"}
            />
            <MetaItem
              label="Visibilidad"
              value={doc.esPublico ? "Público" : "Privado"}
            />
            {doc.hashSha256 && (
              <div>
                <p className="mb-1 flex items-center gap-1 text-xs font-medium text-[#5a6c82]">
                  <Hash className="size-3" /> Integridad SHA-256
                </p>
                <p className="text-xs font-mono bg-neutral-100 rounded px-2 py-1 break-all">
                  {doc.hashSha256}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Versiones */}
      {tab === "versiones" && (
        <div className="space-y-2">
          {versiones.length === 0 ? (
            <EmptyState icon={<FileText />} message="No hay versiones registradas" />
          ) : (
            versiones.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-200"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    Versión {v.version} — {v.nombre}
                  </p>
                  <p className="text-xs text-[#5a6c82]">
                    {v.subidoPor} ·{" "}
                    {new Date(v.fechaSubida).toLocaleString("es-CO")}
                    {v.tamanioBytes ? ` · ${formatBytes(v.tamanioBytes)}` : ""}
                  </p>
                  {v.hashSha256 && (
                    <p className="text-xs font-mono text-neutral-400 truncate max-w-sm">
                      {v.hashSha256}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Historial descargas */}
      {tab === "descargas" && (
        <div className="space-y-2">
          {descargas.length === 0 ? (
            <EmptyState icon={<Download />} message="No hay descargas registradas" />
          ) : (
            descargas.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between p-3 rounded-lg border border-neutral-200"
              >
                <p className="text-sm">
                  {d.usuarioId ?? "Anónimo"} —{" "}
                  {new Date(d.fecha).toLocaleString("es-CO")}
                </p>
                {d.ipAddress && (
                  <span className="text-xs text-neutral-400 font-mono">
                    {d.ipAddress}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Dialogs */}
      <ActualizarDocumentoDialog
        documentoId={documentoId}
        open={showEdit}
        onClose={() => setShowEdit(false)}
      />
      <ConfirmDialog
  open={showArchivar}
  title="Archivar documento"
  description="¿Archivar este documento? Dejará de aparecer en las listas activas."
  confirmLabel="Archivar"
  variant="default"
  onCancel={() => setShowArchivar(false)}
  onConfirm={() => { archivar.mutate(documentoId); setShowArchivar(false); }}
/>

<ConfirmDialog
  open={showReactivar}
  title="Reactivar documento"
  description="¿Reactivar este documento? Volverá a aparecer en las listas activas."
  confirmLabel="Reactivar"
  variant="default"
  onCancel={() => setShowReactivar(false)}
  onConfirm={() => { reactivar.mutate(documentoId); setShowReactivar(false); }}
/>

<ConfirmDialog
  open={showEliminar}
  title="Eliminar documento"
  description="¿Eliminar permanentemente este documento? Esta acción no se puede deshacer."
  confirmLabel="Eliminar"
  variant="destructive"
  onCancel={() => setShowEliminar(false)}
  onConfirm={() => { eliminar.mutate(documentoId); setShowEliminar(false); }}
/>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function MetaItem({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs font-medium text-[#5a6c82]">{label}</p>
      {children ?? <p className="text-sm">{value ?? "—"}</p>}
    </div>
  );
}

function EmptyState({
  icon,
  message,
}: {
  icon: React.ReactNode;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-neutral-400">
      <div className="size-8">{icon}</div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
