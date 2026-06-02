import { createFileRoute } from '@tanstack/react-router'
import { FlujoCajaAnualPage } from '@/features/balance'

export const Route = createFileRoute('/_authenticated/balance/flujo-caja')({
  staticData: { breadcrumb: 'Flujo de Caja' },
  component: FlujoCajaAnualPage,
})
