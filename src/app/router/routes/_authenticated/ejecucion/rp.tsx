import { createFileRoute } from '@tanstack/react-router'
import { RpPage } from '@/features/ejecucion'

export const Route = createFileRoute('/_authenticated/ejecucion/rp')({
  staticData: { breadcrumb: 'Registros Presupuestales' },
  component: RpPage,
})
