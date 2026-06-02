import { createFileRoute } from '@tanstack/react-router'
import { RadicacionPage } from '@/features/ejecucion'

export const Route = createFileRoute('/_authenticated/ejecucion/radicacion')({
  staticData: { breadcrumb: 'Radicación' },
  component: RadicacionPage,
})
