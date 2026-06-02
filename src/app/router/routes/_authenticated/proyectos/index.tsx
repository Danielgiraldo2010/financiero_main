import { createFileRoute } from '@tanstack/react-router'
import { ProyectosPage } from '@/features/proyectos'

export const Route = createFileRoute('/_authenticated/proyectos/')({
  component: ProyectosPage,
})
