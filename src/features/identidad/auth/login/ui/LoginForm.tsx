import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { PasswordInput } from "./PasswordInput"
import { useLogin } from "../hook"
import { LoginSchema, type LoginFormValues } from "../schema"
import type { LoginCredentials } from "../../../model/types"

interface Props {
  onRequires2FA: (c: LoginCredentials) => void
}

export function LoginForm({ onRequires2FA: _ }: Props) {
  const { mutate, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: LoginFormValues) {
    mutate(values)
  }

  return (
    <div className="space-y-4">
      {/* Error global */}
      {error && (
        <div
          className="rounded-lg border px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.12)",
            borderColor: "rgba(239,68,68,0.4)",
            color: "#fca5a5",
          }}
          role="alert"
        >
          {error.message || "Credenciales incorrectas. Revise su usuario y contrasena."}
        </div>
      )}

      {/* Campo email */}
      <div className="space-y-1.5">
        <label
          htmlFor="sf-email"
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "rgba(214,232,247,0.85)" }}
        >
          Correo electronico
          <span style={{ color: "#f87171" }} aria-hidden="true">*</span>
        </label>
        <input
          id="sf-email"
          type="email"
          autoComplete="email"
          placeholder="usuario@ucaldas.edu.co"
          className={cn(
            "h-11 w-full rounded-lg border bg-white/10 px-3 text-sm text-white",
            "placeholder:text-white/40 outline-none transition-colors",
            "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30",
            errors.email
              ? "border-red-400/70"
              : "border-white/20 hover:border-white/40"
          )}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "sf-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="sf-email-error" className="text-xs" style={{ color: "#f87171" }} role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Campo contrasena */}
      <div className="space-y-1.5">
        <label
          htmlFor="sf-password"
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "rgba(214,232,247,0.85)" }}
        >
          Contrasena
          <span style={{ color: "#f87171" }} aria-hidden="true">*</span>
        </label>
        <PasswordInput
          id="sf-password"
          autoComplete="current-password"
          placeholder="Minimo 8 caracteres"
          hasError={!!errors.password}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "sf-password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="sf-password-error" className="text-xs" style={{ color: "#f87171" }} role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Boton submit */}
      <div className="pt-2">
        <button
          type="button"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-lg",
            "text-sm font-semibold text-white transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50",
            "disabled:opacity-60 disabled:cursor-not-allowed",
            isPending ? "cursor-wait" : "hover:brightness-110 active:scale-[0.98]"
          )}
          style={{
            background: isPending
              ? "linear-gradient(135deg, #1d4ed8, #1e40af)"
              : "linear-gradient(135deg, #2563eb, #1d4ed8)",
            boxShadow: "0 4px 14px rgba(37,99,235,0.45)",
          }}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Verificando...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Entrar al sistema
            </>
          )}
        </button>
      </div>

      {/* Link recuperar contrasena */}
      <p className="text-center text-sm" style={{ color: "rgba(214,232,247,0.6)" }}>
        <button
          type="button"
          className="hover:underline transition-colors"
          style={{ color: "rgba(147,197,253,0.85)" }}
          onClick={() => {/* TODO: ruta recuperar contrasena */}}
        >
          ¿Olvido su contrasena?
        </button>
      </p>
    </div>
  )
}
