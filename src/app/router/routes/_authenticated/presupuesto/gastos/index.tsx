// app/router/routes/_authenticated/presupuesto/gastos/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { PresupuestoGastosPage } from '@/features/presupuesto'

export const Route = createFileRoute('/_authenticated/presupuesto/gastos/')({
  component: PresupuestoGastosPage,
  staticData: { breadcrumb: 'Gastos' },
})
