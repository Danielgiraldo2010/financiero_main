import { createFileRoute } from '@tanstack/react-router'
import { ParafiscalesPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/costos-parafiscales')({
  staticData: { breadcrumb: 'Costos Parafiscales' },
  component: ParafiscalesPage,
})