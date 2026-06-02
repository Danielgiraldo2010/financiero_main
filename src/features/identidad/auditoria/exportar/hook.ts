import { useMutation } from "@tanstack/react-query"
import { exportarAuditoria } from "./api"
import type { ExportarAuditoriaCommand } from "../model/types"

export function useExportarAuditoria() {
  return useMutation({
    mutationFn: (body: ExportarAuditoriaCommand) => exportarAuditoria(body),
  })
}
