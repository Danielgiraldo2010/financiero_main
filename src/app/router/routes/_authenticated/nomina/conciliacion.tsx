import { createFileRoute } from '@tanstack/react-router'
import { ConciliacionPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/conciliacion')({
  staticData: { breadcrumb: 'Conciliación' },
  component: ConciliacionPage,
})