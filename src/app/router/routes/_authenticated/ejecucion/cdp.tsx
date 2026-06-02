import { createFileRoute } from '@tanstack/react-router'
import { CdpPage } from '@/features/ejecucion'

export const Route = createFileRoute('/_authenticated/ejecucion/cdp')({
  staticData: { breadcrumb: 'CDP' },
  component: CdpPage,
})
