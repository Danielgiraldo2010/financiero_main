import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/balance/')({
  beforeLoad: () => { throw redirect({ to: '/balance/cierre' }) },
})
