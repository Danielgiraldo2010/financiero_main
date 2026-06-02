// app/router/routes/_authenticated/presupuesto/ingresos/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PresupuestoIngresosPage } from '@/features/presupuesto'

export const Route = createFileRoute('/_authenticated/presupuesto/ingresos/')({
  component: PresupuestoIngresosPage,
  staticData: { breadcrumb: 'Ingresos' },
})
