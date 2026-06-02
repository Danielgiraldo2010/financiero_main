import { createFileRoute } from '@tanstack/react-router'
import { ProyectoDetailPage } from '@/features/proyectos'

export const Route = createFileRoute('/_authenticated/proyectos/$id')({
  component: ProyectoDetailPage,
})
