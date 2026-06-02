// features/presupuesto/ui/PresupuestoIndexPage.tsx
// Página raíz de /presupuesto — resumen ejecutivo + techo presupuestal
import { ResumenPresupuestoPanel } from '../resumen/ui/ResumenPresupuestoPanel'
import { TechoPresupuestalPanel }  from '../techo/listar/ui/TechoPresupuestalPanel'

export function PresupuestoIndexPage() {
  return (
    <div className="space-y-8">
      <ResumenPresupuestoPanel />
      <TechoPresupuestalPanel />
    </div>
  )
}
