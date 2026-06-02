// src/app/router/routes/_authenticated/perfil/2fa.tsx
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'

const Setup2FAPage = lazy(
  () => import('@/features/identidad/auth/dos-factores/ui/Setup2FAPage')
)

export const Route = createFileRoute('/_authenticated/perfil/2fa')({
  // ✅ meta eliminado
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <Setup2FAPage />
    </Suspense>
  ),
})