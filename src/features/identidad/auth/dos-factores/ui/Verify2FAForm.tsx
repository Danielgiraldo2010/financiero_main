// features/identidad/auth/dos-factores/ui/Verify2FAForm.tsx
// 01a-I6: input 6 digitos con autosubmit al completar
import React from 'react'
import { useLogin } from '../../login/hook'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LoginCredentials } from '../../../model/types'

interface Props { pendingCredentials: LoginCredentials }

export function Verify2FAForm({ pendingCredentials }: Props) {
  const { mutate, isPending, error } = useLogin()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6)
    e.target.value = value
    if (value.length === 6) {
      mutate({ ...pendingCredentials, codigoTotp: value })
    }
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-[#d92d20]">{error.message}</p>}
      <div className="space-y-2">
        <Label htmlFor="totp" className="block text-sm font-semibold text-[#304155]">
          Código de verificación
        </Label>
        <Input
          id="totp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          autoComplete="one-time-code"
          disabled={isPending}
          onChange={handleChange}
          className="h-14 text-center font-mono text-2xl tracking-[0.5em] placeholder:tracking-[0.2em]"
          placeholder="______"
        />
        <p className="text-center text-xs text-[#607085]">
          Ingresa el código de 6 dígitos de tu app
        </p>
      </div>
      {isPending && <div className="flex justify-center"><LoadingSpinner /></div>}
    </div>
  )
}
