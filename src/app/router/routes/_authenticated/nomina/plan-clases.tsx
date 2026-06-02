import { createFileRoute } from '@tanstack/react-router'
import { PlanClasesPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/plan-clases')({
  staticData: { breadcrumb: 'Plan de Clases' },
  component: PlanClasesPage,
})