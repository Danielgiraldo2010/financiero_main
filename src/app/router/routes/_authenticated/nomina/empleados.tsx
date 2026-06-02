// src/app/router/routes/_authenticated/nomina/empleados.tsx
import { createFileRoute } from '@tanstack/react-router'
import { EmpleadosPage } from '@/features/nomina'

export const Route = createFileRoute('/_authenticated/nomina/empleados')({
  staticData: { breadcrumb: 'Empleados' },
  component: EmpleadosPage,
})
