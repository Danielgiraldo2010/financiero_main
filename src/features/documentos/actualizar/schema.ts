import { z } from "zod";
import { TIPOS_DOCUMENTO } from "../shared/constants";

export const actualizarDocumentoSchema = z.object({
  nombre: z.string().min(3, "Mínimo 3 caracteres").max(200),
  descripcion: z.string().max(500).nullable(),
  tipoDocumento: z.enum(TIPOS_DOCUMENTO, {
    errorMap: () => ({ message: "Selecciona un tipo de documento" }),
  }),
  vigencia: z.coerce.number().int().positive().nullable(),
  esPublico: z.boolean().nullable(),
});

export type ActualizarDocumentoValues = z.infer<typeof actualizarDocumentoSchema>;
