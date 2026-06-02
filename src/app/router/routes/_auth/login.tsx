// Ruta: /login — PublicLayout (reemplaza placeholder FE0)
// Invariante 01a-I3: usa el componente real, no el mock
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'

const LoginPage = lazy(() => import('@/features/identidad/auth/login/ui/LoginPage'))

export const Route = createFileRoute('/_auth/login')({
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginPage />
    </Suspense>
  ),
})
