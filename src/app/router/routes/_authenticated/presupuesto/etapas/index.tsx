// app/router/routes/_authenticated/presupuesto/etapas/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { EtapasPresupuestoPage } from '@/features/presupuesto'

export const Route = createFileRoute('/_authenticated/presupuesto/etapas/')({
  component: EtapasPresupuestoPage,
  staticData: { breadcrumb: 'Etapas de Aprobación' },
})
