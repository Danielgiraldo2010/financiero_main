import { createFileRoute } from '@tanstack/react-router'
import { ConciliacionBalancePage } from '@/features/balance'

export const Route = createFileRoute('/_authenticated/balance/conciliacion')({
  staticData: { breadcrumb: 'Conciliacion' },
  component: ConciliacionBalancePage,
})
