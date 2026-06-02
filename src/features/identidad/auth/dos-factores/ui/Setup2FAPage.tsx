// features/identidad/auth/dos-factores/ui/Setup2FAPage.tsx
import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMiPerfil } from '../../perfil/hook'
import { useEnable2FA, useDisable2FA } from '../hook'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Manage2FaResponse } from '../../../model/types'

export default function Setup2FAPage() {
  const navigate = useNavigate()
  const { data: perfil, isLoading } = useMiPerfil()
  const enableMutation = useEnable2FA()
  const disableMutation = useDisable2FA()
  const [setup, setSetup] = useState<Manage2FaResponse | null>(null)

  if (isLoading) return <LoadingSpinner />
  if (!perfil) return null

  if (setup?.qrCodeUrl) {
    return (
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-semibold">Configurar autenticacion de dos factores</h1>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Escanea el codigo QR</CardTitle>
            <CardDescription>Usa Google Authenticator, Authy o similar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img src={setup.qrCodeUrl} alt="QR 2FA" className="h-48 w-48 rounded border" />
            </div>
            {setup.secretKey && (
              <div className="rounded bg-muted p-3 text-center">
                <p className="text-xs text-muted-foreground">Clave manual</p>
                <p className="font-mono text-sm tracking-widest">{setup.secretKey}</p>
              </div>
            )}
            <Button className="w-full" onClick={() => void navigate({ to: '/perfil' })}>
              Listo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Autenticacion de dos factores</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>{perfil.totp2FaEnabled ? '2FA activado' : '2FA desactivado'}</CardTitle>
          <CardDescription>
            {perfil.totp2FaEnabled
              ? 'Tu cuenta esta protegida con autenticacion de dos factores.'
              : 'Protege tu cuenta con una capa adicional de seguridad.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {perfil.totp2FaEnabled ? (
            <Button
              variant="destructive"
              disabled={disableMutation.isPending}
              onClick={() => disableMutation.mutate(undefined, {
                onSuccess: () => void navigate({ to: '/perfil' }),
              })}
            >
              {disableMutation.isPending ? 'Desactivando...' : 'Desactivar 2FA'}
            </Button>
          ) : (
            <Button
              disabled={enableMutation.isPending}
              onClick={() => enableMutation.mutate(undefined, {
                onSuccess: (data) => setSetup(data),
              })}
            >
              {enableMutation.isPending ? 'Generando QR...' : 'Activar 2FA'}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
