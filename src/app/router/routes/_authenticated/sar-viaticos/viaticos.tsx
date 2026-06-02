import { createFileRoute } from '@tanstack/react-router'
import { ViaticosPage } from '@/features/sar-viaticos'

export const Route = createFileRoute('/_authenticated/sar-viaticos/viaticos')({
  staticData: { breadcrumb: 'Viáticos' },
  component: ViaticosPage,
})