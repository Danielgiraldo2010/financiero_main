import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/normatividad/")({
  beforeLoad: () => {
    throw redirect({ to: "/normatividad/normas" })
  },
})
