import { useState, type ReactNode } from "react"
import { useSearch } from "@tanstack/react-router"
import { AlertTriangle } from "lucide-react"
import { LogoSF } from "./LogoSF"
import { LoginForm } from "./LoginForm"
import { Verify2FAForm } from "../../dos-factores/ui/Verify2FAForm"
import type { LoginCredentials } from "../../../model/types"

export default function LoginPage() {
  const [pending2FA, setPending2FA] = useState<LoginCredentials | null>(null)

  // Leer query param ?expired=1 para mostrar aviso de sesion expirada
  let expired = false
  try {
    const search = useSearch({ strict: false }) as Record<string, unknown>
    expired = search?.expired === "1" || search?.expired === true
  } catch {
    // useSearch puede fallar si la ruta no declara validateSearch — ignorar
  }

  if (pending2FA) {
    return (
      <AuthShell>
        <div className="mb-6 lg:hidden">
          <LogoSF />
        </div>
        <AuthContentCard
          title="Verificación en dos pasos"
          subtitle="Ingresa el código de tu app de autenticación."
        >
          <Verify2FAForm pendingCredentials={pending2FA} />
        </AuthContentCard>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <div className="mb-6 lg:hidden">
        <LogoSF />
      </div>

      {expired && (
        <div
          className="mb-4 flex items-center gap-2 rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          role="status"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Su sesión ha expirado. Inicie sesión de nuevo.
        </div>
      )}

      <AuthContentCard
        title="Iniciar sesión"
        subtitle="Sistema Financiero Universidad de Caldas"
      >
        <LoginForm onRequires2FA={setPending2FA} />
      </AuthContentCard>
    </AuthShell>
  )
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center gap-8 px-5 py-12 pb-16 sm:px-6 sm:pb-12 md:px-10 lg:flex-row lg:justify-center lg:gap-20 lg:px-[8vw] xl:gap-28">
      <div className="login-bg-zoom absolute inset-0 bg-[url('/image/bg-universidad.png')] bg-cover bg-center opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_22%,rgba(213,187,135,0.22),transparent_31%),radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,rgba(0,54,94,0.88)_0%,rgba(0,75,130,0.74)_45%,rgba(0,75,130,0.58)_100%)]" />

      <section className="relative z-10 hidden min-w-[380px] max-w-[650px] flex-1 items-center justify-center lg:flex">
        <LogoSF variant="hero" showProductMark={false} />
      </section>

      <section className="relative z-10 flex w-full max-w-[440px] flex-col justify-center">
        {children}
      </section>

      <p className="absolute bottom-4 left-0 right-0 z-20 px-4 text-center text-xs leading-relaxed text-white/75">
        Sistema sujeto al Esquema Nacional de Seguridad (ENS)
        <br />
        El acceso no autorizado esta prohibido y puede ser sancionado.
      </p>
    </main>
  )
}

function AuthContentCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="relative w-full overflow-hidden rounded-[18px] border border-[#d1d5db] bg-white p-6 shadow-[0_1px_0_rgba(213,187,135,0.42)_inset,0_28px_80px_rgba(0,75,130,0.14)] sm:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#d5bb87,#004b82)]" aria-hidden="true" />
      <div className="mb-6 space-y-1 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-[#004b82]">{title}</h2>
        <p className="text-sm leading-6 text-[#57687d]">{subtitle}</p>
      </div>

      {children}
    </div>
  )
}
