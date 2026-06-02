import { RouterProvider } from "@tanstack/react-router"
import { QueryProvider } from "@/app/providers/QueryProvider"
import { AuthProvider } from "@/app/providers/AuthProvider"
import { ThemeProvider } from "@/app/providers/ThemeProvider"
import { router } from "@/app/router"
import { useAuthStore } from "@/shared/state/auth.store"

function AppRouter() {
  // ✅ roles vive en AuthState, NO en UsuarioSesion
  const { isAuthenticated, roles } = useAuthStore()

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuthenticated,
          roles: roles ?? [],
        },
      }}
    />
  )
}

export function bootstrap() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}