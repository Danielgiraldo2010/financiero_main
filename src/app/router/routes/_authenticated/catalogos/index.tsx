import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/catalogos/")({
  beforeLoad: () => {
    throw redirect({ to: "/catalogos/unidades-ejecutoras" })
  },
})
