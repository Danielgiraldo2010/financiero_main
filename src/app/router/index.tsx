import { createRouter } from "@tanstack/react-router"
import { routeTree } from "../../routeTree.gen"

// Contexto tipado disponible en beforeLoad de todas las rutas
export interface RouterContext {
  auth?: {
    isAuthenticated: boolean
    roles?: string[]
  }
}

export const router = createRouter({
  routeTree,
  context: {} as RouterContext,
  defaultPreload: "intent",
})

// Tipado global del router para useNavigate, Link, etc.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
