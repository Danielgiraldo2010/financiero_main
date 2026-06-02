import { createFileRoute } from '@tanstack/react-router'
import { LiquidacionPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/liquidacion')({
  staticData: { breadcrumb: 'Liquidación' },
  component: LiquidacionPage,
})