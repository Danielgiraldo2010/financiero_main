import { createFileRoute } from '@tanstack/react-router'
import { PuntosSalarialesPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/puntos-salariales')({
  staticData: { breadcrumb: 'Puntos Salariales' },
  component: PuntosSalarialesPage,
})