import { createFileRoute } from '@tanstack/react-router'
import { AvancesPage } from '@/features/ejecucion'

export const Route = createFileRoute('/_authenticated/ejecucion/avances')({
  staticData: { breadcrumb: 'Avances' },
  component: AvancesPage,
})
