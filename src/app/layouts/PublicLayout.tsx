import { Outlet } from "@tanstack/react-router"

export function PublicLayout() {
  return (
    <div
      className="login-surface relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10 text-[#1f2937] sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(213,187,135,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(0,75,130,0.08),transparent_24%)]" />

      <div className="relative z-10 w-full">
        <Outlet />
      </div>

      <p className="absolute bottom-5 left-1/2 z-10 max-w-[28rem] -translate-x-1/2 text-center text-xs leading-relaxed text-[#6b7280]">
        Sistema sujeto al Esquema Nacional de Seguridad (ENS)
        <br />
        El acceso no autorizado esta prohibido y puede ser sancionado.
      </p>
    </div>
  )
}
