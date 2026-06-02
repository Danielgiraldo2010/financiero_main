// features/integracion/ui/IntegracionPage.tsx
// Página raíz del dominio — RoleGuard(ADMIN_CENTRAL, FINANCIERO_CENTRAL)

import { useState } from "react"
import { SistemasPage } from "../sistemas/listar/ui/SistemasPage"
import { LogSincronizacionesTable } from "../sincronizaciones/log/ui/LogSincronizacionesTable"
import { ExportarChipDialog } from "../exportaciones/chip/ui/ExportarChipDialog"
import { ExportarSniesDialog } from "../exportaciones/snies/ui/ExportarSniesDialog"
import { ExportarPresupuestoDialog } from "../exportaciones/presupuesto/ui/ExportarPresupuestoDialog"
import { usePermissions } from "@/shared/hooks/usePermissions"
import { ROLES } from "@/shared/lib/constants"
import { PageHeader } from "@/shared/ui/layout/PageHeader"
import { Button } from "@/shared/ui/primitives/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ExportDialog = "chip" | "snies" | "presupuesto" | null

export function IntegracionPage() {
  const [exportDialog, setExportDialog] = useState<ExportDialog>(null)
  const { hasRole } = usePermissions()

  const puedeExportar = hasRole([ROLES.ADMIN_CENTRAL, ROLES.FINANCIERO_CENTRAL])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Integración de sistemas"
        description="CHIP · SNIES · Exportaciones presupuestales"
      />

      <Tabs defaultValue="sistemas">
        <TabsList>
          <TabsTrigger value="sistemas">Sistemas</TabsTrigger>
          <TabsTrigger value="sincronizaciones">Log de sincronizaciones</TabsTrigger>
          {puedeExportar && (
            <TabsTrigger value="exportaciones">Exportaciones</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="sistemas" className="mt-4">
          <SistemasPage />
        </TabsContent>

        <TabsContent value="sincronizaciones" className="mt-4">
          <LogSincronizacionesTable />
        </TabsContent>

        {puedeExportar && (
          <TabsContent value="exportaciones" className="mt-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Las exportaciones son asíncronas. Una vez iniciadas, el sistema procesa
                el archivo en segundo plano y notifica cuando está listo para descarga.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setExportDialog("chip")}>
                  Exportar CHIP
                </Button>
                <Button onClick={() => setExportDialog("snies")}>
                  Exportar SNIES
                </Button>
                <Button onClick={() => setExportDialog("presupuesto")}>
                  Exportar presupuesto
                </Button>
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      <ExportarChipDialog
        open={exportDialog === "chip"}
        onClose={() => setExportDialog(null)}
      />
      <ExportarSniesDialog
        open={exportDialog === "snies"}
        onClose={() => setExportDialog(null)}
      />
      <ExportarPresupuestoDialog
        open={exportDialog === "presupuesto"}
        onClose={() => setExportDialog(null)}
      />
    </div>
  )
}
