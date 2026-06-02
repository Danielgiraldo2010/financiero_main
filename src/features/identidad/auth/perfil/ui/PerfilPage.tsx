// src/features/identidad/auth/perfil/ui/PerfilPage.tsx
import React from 'react'
import { Link } from '@tanstack/react-router'
import { useMiPerfil } from '../hook'
import { PerfilForm } from './PerfilForm'
import { ChangePasswordForm } from './ChangePasswordForm'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function PerfilPage() {
  const { data: perfil, isLoading, error } = useMiPerfil()

  if (isLoading) return <LoadingSpinner />
  if (error) return <p className="p-4 text-destructive">{error.message}</p>
  if (!perfil) return null

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Mi perfil</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Informacion personal</CardTitle></CardHeader>
          <CardContent><PerfilForm perfil={perfil} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cambiar contrasena</CardTitle></CardHeader>
          <CardContent><ChangePasswordForm /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Autenticacion de dos factores</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {perfil.totp2FaEnabled
                ? 'La verificacion en dos pasos esta activada.'
                : 'La verificacion en dos pasos no esta activada.'}
            </p>
            <Badge variant={perfil.totp2FaEnabled ? 'default' : 'secondary'} className="mt-1">
              {perfil.totp2FaEnabled ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {/*
            ✅ Base UI Button NO tiene asChild.
            render prop delega el renderizado al Link de TanStack Router,
            que inyecta href + navegación sin anidar <button><a>.
          */}
          <Button
            variant="outline"
            render={<Link to="/perfil/2fa" />}
          >
            {perfil.totp2FaEnabled ? 'Administrar 2FA' : 'Activar 2FA'}
          </Button>
        </CardContent>
      </Card>

      {perfil.unidades.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Unidades ejecutoras asignadas</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {perfil.unidades.map((u) => (
                <li key={u.unidadEjecutoraId}
                  className="flex items-center justify-between text-sm">
                  <span>{u.unidadEjecutoraNombre}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline">{u.rol}</Badge>
                    {!u.esActivo && <Badge variant="destructive">Inactivo</Badge>}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}