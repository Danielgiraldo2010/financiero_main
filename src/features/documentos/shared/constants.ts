export const TIPOS_DOCUMENTO = [
  "CONTRATO",
  "RESOLUCION",
  "ACTA",
  "FACTURA",
  "INFORME",
  "CERTIFICADO",
  "SOLICITUD",
  "OFICIO",
  "CONVENIO",
  "OTRO",
] as const;

export type TipoDocumentoValue = (typeof TIPOS_DOCUMENTO)[number];

export const MIMES_PERMITIDOS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/png",
  "image/jpeg",
];

export const EXTENSIONES_PERMITIDAS = ".pdf,.docx,.xlsx,.png,.jpg,.jpeg";

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const ESTADOS_DOCUMENTO = {
  ACTIVO: { label: "Activo", variant: "success" as const },
  ARCHIVADO: { label: "Archivado", variant: "warning" as const },
  ELIMINADO: { label: "Eliminado", variant: "error" as const },
};

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function mimeToExtension(mime: string | null): string {
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "DOCX",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "XLSX",
    "image/png": "PNG",
    "image/jpeg": "JPG",
  };
  return mime ? (map[mime] ?? mime.split("/")[1]?.toUpperCase() ?? "—") : "—";
}
