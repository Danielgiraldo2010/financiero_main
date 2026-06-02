import { createFileRoute } from '@tanstack/react-router'
import { CierreVigenciaPage } from '@/features/balance'

export const Route = createFileRoute('/_authenticated/balance/cierre')({
  staticData: { breadcrumb: 'Cierre de Vigencia' },
  component: CierreVigenciaPage,
})
