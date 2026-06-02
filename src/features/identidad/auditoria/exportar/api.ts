import { fetcher } from "@/shared/api/fetcher"
import type { ExportarAuditoriaCommand } from "../model/types"

export async function exportarAuditoria(
  body: ExportarAuditoriaCommand
): Promise<void> {
  const res = await fetch("/api/v1/admin/auditoria/exportar", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error("HTTP " + res.status)
  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "auditoria.xlsx"
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}
