// features/identidad/auth/perfil/ui/PerfilForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/shared/ui/forms/FormField'
import { useUpdatePerfil } from '../hook'
import { UpdatePerfilSchema, type UpdatePerfilValues } from '../schema'
import type { UsuarioResponse } from '../../../model/types'

export function PerfilForm({ perfil }: { perfil: UsuarioResponse }) {
  const { mutate, isPending, error } = useUpdatePerfil()
  const form = useForm<UpdatePerfilValues>({
    resolver: zodResolver(UpdatePerfilSchema),
    defaultValues: { userName: perfil.userName },
  })

  return (
    <div className="space-y-4">
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">Email</p>
        <p className="font-medium">{perfil.email}</p>
      </div>
      <FormField
        label="Nombre de usuario"
        error={form.formState.errors.userName?.message ?? error?.fieldError('userName')}
      >
        <Input {...form.register('userName')} autoComplete="username" />
      </FormField>
      <Button
        type="button"
        disabled={isPending || !form.formState.isDirty}
        onClick={form.handleSubmit((v) => mutate(v))}
      >
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </Button>
    </div>
  )
}
