// src/app/router/routes/_authenticated/perfil.tsx
import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'

const PerfilPage = lazy(
  () => import('@/features/identidad/auth/perfil/ui/PerfilPage')
)

export const Route = createFileRoute('/_authenticated/perfil')({
  // ✅ meta eliminado — no existe en createFileRoute options de TanStack Router v1
  // Si necesitas título de página, usa document.title en el componente
  // o el hook useHead si está disponible en el proyecto
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <PerfilPage />
    </Suspense>
  ),
})