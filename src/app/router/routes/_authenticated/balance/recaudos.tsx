import { createFileRoute } from '@tanstack/react-router'
import { RecaudosPage } from '@/features/balance'

export const Route = createFileRoute('/_authenticated/balance/recaudos')({
  staticData: { breadcrumb: 'Recaudos Reales' },
  component: RecaudosPage,
})
