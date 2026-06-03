import { Outlet } from "@tanstack/react-router"

export function PublicLayout() {
  return (
    <div
      className="login-surface relative flex min-h-screen w-full items-stretch justify-center overflow-hidden text-[#1f2937]"
    >
      <div className="relative z-10 w-full min-h-screen">
        <Outlet />
      </div>

      <p className="absolute bottom-5 left-1/2 z-20 max-w-[28rem] -translate-x-1/2 text-center text-xs leading-relaxed text-white/75">
        Sistema sujeto al Esquema Nacional de Seguridad (ENS)
        <br />
        El acceso no autorizado esta prohibido y puede ser sancionado.
      </p>
    </div>
  )
}
