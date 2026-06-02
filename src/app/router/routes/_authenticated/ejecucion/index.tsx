import { createFileRoute, Navigate } from '@tanstack/react-router'

function EjecucionIndex() {
  return <Navigate to="/ejecucion/cdp" replace />
}

export const Route = createFileRoute('/_authenticated/ejecucion/')({
  staticData: { breadcrumb: 'Ejecución Presupuestal' },
  component: EjecucionIndex,
})
