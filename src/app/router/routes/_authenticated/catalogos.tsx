import { createFileRoute } from "@tanstack/react-router"
import { CatalogosIndexPage } from "@/features/catalogos/index/ui/CatalogosIndexPage"

export const Route = createFileRoute("/_authenticated/catalogos")({
  component: CatalogosIndexPage,
  head: () => ({
  meta: [
    { title: "Catalogos" },
  ],
})
})