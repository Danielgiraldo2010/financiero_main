import { fetcher } from "@/shared/api/fetcher";
import type { Documento } from "../model/types";
import { mapDocumento } from "../model/mappers";
import type { SubirDocumentoValues } from "./schema";

export async function subirDocumento(
  values: SubirDocumentoValues
): Promise<Documento> {
  const formData = new FormData();
  formData.append("Archivo", values.archivo);
  formData.append("Nombre", values.nombre);
  formData.append("TipoDocumento", values.tipoDocumento);
  formData.append("EsPublico", String(values.esPublico));
  if (values.descripcion) formData.append("Descripcion", values.descripcion);
  if (values.vigencia) formData.append("Vigencia", String(values.vigencia));

  const dto = await fetcher<Record<string, unknown>>("/api/v1/documentos", {
    method: "POST",
    body: formData,
  });

  return mapDocumento(dto);
}