import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/nomina/')({
  staticData: { breadcrumb: 'Nómina' },
  component: () => <Navigate to="/nomina/empleados" />,
})