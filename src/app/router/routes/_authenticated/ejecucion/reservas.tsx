import { createFileRoute } from '@tanstack/react-router'
import { ReservasPage } from '@/features/ejecucion'

export const Route = createFileRoute('/_authenticated/ejecucion/reservas')({
  staticData: { breadcrumb: 'Reservas' },
  component: ReservasPage,
})
