import { Outlet } from "@tanstack/react-router"

export function PublicLayout() {
  return (
    <div className="login-surface relative flex min-h-screen w-full items-stretch justify-center overflow-hidden text-[#1f2937]">
      <div className="relative z-10 w-full min-h-screen">
        <Outlet />
      </div>
    </div>
  )
}
