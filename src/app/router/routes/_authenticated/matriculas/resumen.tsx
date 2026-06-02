import { createFileRoute } from '@tanstack/react-router'
import { ResumenMatriculasPage } from '@/features/matriculas/cohortes/resumen/ui/ResumenMatriculasPage'

export const Route = createFileRoute('/_authenticated/matriculas/resumen')({
  staticData: { breadcrumb: 'Resumen' },
  component: ResumenRoute,
})

function ResumenRoute() {
  return <ResumenMatriculasPage />
}
