import { createFileRoute } from '@tanstack/react-router'
import { RecursosBalancePage } from '@/features/balance'

export const Route = createFileRoute('/_authenticated/balance/recursos')({
  staticData: { breadcrumb: 'Recursos de Balance' },
  component: RecursosBalancePage,
})
