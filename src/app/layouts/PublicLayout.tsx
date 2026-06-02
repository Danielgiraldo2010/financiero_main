import { Outlet } from "@tanstack/react-router"

export function PublicLayout() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
      style={{
        background: "linear-gradient(160deg, #0f2044 0%, #1a3a6e 50%, #0f2044 100%)",
      }}
    >
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
      <p
        className="mt-8 text-center text-xs leading-relaxed"
        style={{ color: "rgba(214,232,247,0.55)" }}
      >
        Sistema sujeto al Esquema Nacional de Seguridad (ENS)
        <br />
        El acceso no autorizado esta prohibido y puede ser sancionado.
      </p>
    </div>
  )
}
