import React from 'react'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { env } from '@/shared/config/env'

const TanStackRouterDevtools = import.meta.env.DEV
  ? React.lazy(() =>
      import('@tanstack/react-router-devtools').then((mod) => ({
        default: mod.TanStackRouterDevtools,
      }))
    )
  : () => null

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="rounded-lg border bg-white p-6 shadow">
        <h1 className="mb-2 text-lg font-semibold text-red-600">
          Error en la aplicación
        </h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  )
}

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
      {env.IS_DEV && (
        <React.Suspense fallback={null}>
          <TanStackRouterDevtools />
        </React.Suspense>
      )}
    </>
  ),
  errorComponent: RootErrorComponent,
})
