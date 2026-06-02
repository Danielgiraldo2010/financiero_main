// features/identidad/auth/dos-factores/ui/Verify2FAForm.tsx
// 01a-I6: input 6 digitos con autosubmit al completar
import React from 'react'
import { useLogin } from '../../login/hook'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'
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
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      <div className="space-y-2">
        <label htmlFor="totp" className="block text-sm font-medium">
          Codigo de verificacion
        </label>
        <input
          id="totp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          autoFocus
          autoComplete="one-time-code"
          disabled={isPending}
          onChange={handleChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2
            text-center font-mono text-2xl tracking-[0.5em] focus:outline-none
            focus:ring-2 focus:ring-ring disabled:opacity-50"
          placeholder="______"
        />
        <p className="text-center text-xs text-muted-foreground">
          Ingresa el codigo de 6 digitos de tu app
        </p>
      </div>
      {isPending && <div className="flex justify-center"><LoadingSpinner /></div>}
    </div>
  )
}
