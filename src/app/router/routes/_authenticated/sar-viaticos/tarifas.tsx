import { createFileRoute } from '@tanstack/react-router'
import { TarifasPage } from '@/features/sar-viaticos/tarifas-viaticos/listar/ui/TarifasPage'

export const Route = createFileRoute('/_authenticated/sar-viaticos/tarifas')({
  staticData: { breadcrumb: 'Tarifas' },
  component: TarifasPage,
})