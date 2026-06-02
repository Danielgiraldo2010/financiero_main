import { createFileRoute } from '@tanstack/react-router'
import { OpPage } from '@/features/ejecucion'

export const Route = createFileRoute('/_authenticated/ejecucion/op')({
  staticData: { breadcrumb: 'Órdenes de Pago' },
  component: OpPage,
})
