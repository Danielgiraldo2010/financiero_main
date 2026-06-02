import { useState } from "react"
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
      <>
        <LogoSF />
        <div
          className="w-full rounded-2xl p-8 shadow-2xl"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-xl font-semibold" style={{ color: "#f0f7ff" }}>
              Verificacion en dos pasos
            </h2>
            <p className="text-sm" style={{ color: "rgba(214,232,247,0.65)" }}>
              Ingresa el codigo de tu app de autenticacion
            </p>
          </div>
          <Verify2FAForm pendingCredentials={pending2FA} />
        </div>
      </>
    )
  }

  return (
    <>
      {/* Logo institucional */}
      <LogoSF />

      {/* Aviso sesion expirada */}
      {expired && (
        <div
          className="mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(255,243,205,0.10)",
            borderColor: "rgba(202,138,4,0.45)",
            color: "#fde68a",
          }}
          role="status"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          Su sesion ha expirado. Inicie sesion de nuevo.
        </div>
      )}

      {/* Card del formulario */}
      <div
        className="w-full rounded-2xl p-8 shadow-2xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mb-6 space-y-1 text-center">
          <h2 className="text-xl font-semibold" style={{ color: "#f0f7ff" }}>
            Iniciar sesion
          </h2>
          <p className="text-sm" style={{ color: "rgba(214,232,247,0.65)" }}>
            Sistema Financiero Universidad de Caldas
          </p>
        </div>

        <LoginForm onRequires2FA={setPending2FA} />
      </div>
    </>
  )
}
