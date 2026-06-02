import { createFileRoute } from '@tanstack/react-router'
import { SarPage } from '@/features/sar-viaticos'

export const Route = createFileRoute('/_authenticated/sar-viaticos/sar')({
  staticData: { breadcrumb: 'SAR' },
  component: SarPage,
})