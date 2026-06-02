import { z } from "zod";
import {
  MIMES_PERMITIDOS,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  TIPOS_DOCUMENTO,
} from "../shared/constants";

const currentYear = new Date().getFullYear();

export const subirDocumentoSchema = z.object({
  archivo: z
    .instanceof(File, { message: "Selecciona un archivo" })
    .refine((f) => f.size <= MAX_FILE_SIZE_BYTES, {
      message: `El archivo no puede superar ${MAX_FILE_SIZE_MB} MB`,
    })
    .refine((f) => MIMES_PERMITIDOS.includes(f.type), {
      message: "Formato no permitido. Usa PDF, DOCX, XLSX, PNG o JPG",
    }),
  nombre: z.string().min(3, "Mínimo 3 caracteres").max(200),
  tipoDocumento: z.enum(TIPOS_DOCUMENTO, {
    errorMap: () => ({ message: "Selecciona un tipo de documento" }),
  }),
  descripcion: z.string().max(500).optional(),
  vigencia: z.coerce
    .number({ invalid_type_error: "Ingresa un año válido" })
    .int("El año debe ser un número entero")
    .min(1900, "El año no puede ser anterior a 1900")
    .max(currentYear, `El año no puede ser posterior a ${currentYear}`)
    .optional(),
  // boolean opcional — compatible con exactOptionalPropertyTypes
  esPublico: z.boolean().optional(),
});

export type SubirDocumentoValues = z.infer<typeof subirDocumentoSchema>;