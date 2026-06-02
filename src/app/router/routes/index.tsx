import { createFileRoute, redirect } from "@tanstack/react-router"

// Ruta raiz — redirige segun estado de autenticacion.
// AuthGuard en /_authenticated se encarga de la proteccion real.
export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    const isAuthenticated = (context as { auth?: { isAuthenticated?: boolean } })
      ?.auth?.isAuthenticated ?? false
    throw redirect({
      to: isAuthenticated ? "/dashboard" : "/login",
      replace: true,
    })
  },
})
