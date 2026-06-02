import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { CohortesList } from '@/features/matriculas/cohortes/listar/ui/CohortesList'
import { RegistrarCohorteDialog } from '@/features/matriculas/cohortes/registrar/ui/RegistrarCohorteDialog'
import { useAuthStore } from '@/shared/state/auth.store'
import { ROLES } from '@/shared/lib/constants'

export const Route = createFileRoute('/_authenticated/matriculas/cohortes')({
  staticData: { breadcrumb: 'Cohortes' },
  component: CohortesRoute,
})

function CohortesRoute() {
  const [openDialog, setOpenDialog] = useState(false)
  const vigencia = new Date().getFullYear()
  const roles = useAuthStore((s) => s.roles)

  const canCreate = ([ROLES.FINANCIERO, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] as string[])
    .some((r) => roles.includes(r))
  const canEdit = ([ROLES.COORDINADOR, ROLES.DECANO, ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] as string[])
    .some((r) => roles.includes(r))
  const canAnular = ([ROLES.ADMIN_CENTRAL, ROLES.SUPERADMIN] as string[])
    .some((r) => roles.includes(r))

  return (
    <>
      <CohortesList
        filters={{ vigencia }}
        {...(canCreate ? { onRegistrar: () => setOpenDialog(true) } : {})}
        canEdit={canEdit}
        canAnular={canAnular}
      />
      <RegistrarCohorteDialog open={openDialog} onClose={() => setOpenDialog(false)} />
    </>
  )
}
