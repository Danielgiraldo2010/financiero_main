// features/identidad/auth/perfil/ui/ChangePasswordForm.tsx
// 01a-I5: exito -> logout automatico
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/shared/ui/forms/FormField'
import { useChangePassword } from '../hook'
import { ChangePasswordSchema, type ChangePasswordValues } from '../schema'

export function ChangePasswordForm() {
  const { mutate, isPending, error } = useChangePassword()
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: { passwordActual: '', passwordNuevo: '', confirmarPassword: '' },
  })

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-destructive">{error.message}</p>}
      <FormField label="Contrasena actual" error={form.formState.errors.passwordActual?.message}>
        <Input type="password" autoComplete="current-password" {...form.register('passwordActual')} />
      </FormField>
      <FormField label="Nueva contrasena" error={form.formState.errors.passwordNuevo?.message}>
        <Input type="password" autoComplete="new-password" {...form.register('passwordNuevo')} />
      </FormField>
      <FormField label="Confirmar contrasena" error={form.formState.errors.confirmarPassword?.message}>
        <Input type="password" autoComplete="new-password" {...form.register('confirmarPassword')} />
      </FormField>
      <Button
        type="button"
        variant="destructive"
        disabled={isPending}
        onClick={form.handleSubmit((v) => mutate({ passwordActual: v.passwordActual, passwordNuevo: v.passwordNuevo }))}
      >
        {isPending ? 'Actualizando...' : 'Cambiar contrasena'}
      </Button>
    </div>
  )
}
