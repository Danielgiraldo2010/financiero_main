import { createFileRoute, Navigate } from '@tanstack/react-router'
import { ResumenSarViaticosPanel } from '@/features/sar-viaticos'
import { useUIStore } from '@/shared/state/ui.store'

function SarViaticosIndex() {
  const vigencia = useUIStore(s => s.vigenciaActiva)
  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold">Resumen SAR y Viáticos</h2>
      <ResumenSarViaticosPanel vigencia={vigencia} />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/sar-viaticos/')({
  staticData: { breadcrumb: 'SAR / Viáticos' },
  component: SarViaticosIndex,
})