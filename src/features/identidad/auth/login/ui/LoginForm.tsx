import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
    <div className="space-y-5">
      {/* Error global */}
      {error && (
        <div
          className="rounded-[14px] border border-[#f3b4b4] bg-[#fff7f7] px-4 py-3 text-sm text-[#b42318]"
          role="alert"
        >
          {error.message || "Credenciales incorrectas. Revise su usuario y contrasena."}
        </div>
      )}

      {/* Campo email */}
      <div className="space-y-1.5">
        <Label
          htmlFor="sf-email"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#304155]"
        >
          Correo electrónico
          <span className="text-[#d92d20]" aria-hidden="true">*</span>
        </Label>
        <Input
          id="sf-email"
          type="email"
          autoComplete="email"
          placeholder="usuario@ucaldas.edu.co"
          className={cn(
            "placeholder:text-[#8b96a8]",
            errors.email
              ? "border-[#d92d20] focus-visible:border-[#d92d20] focus-visible:ring-[#d92d20]/12"
              : ""
          )}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "sf-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="sf-email-error" className="text-xs text-[#d92d20]" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Campo contrasena */}
      <div className="space-y-1.5">
        <Label
          htmlFor="sf-password"
          className="flex items-center gap-1.5 text-sm font-semibold text-[#304155]"
        >
          Contraseña
          <span className="text-[#d92d20]" aria-hidden="true">*</span>
        </Label>
        <PasswordInput
          id="sf-password"
          autoComplete="current-password"
          placeholder="Mínimo 8 caracteres"
          hasError={!!errors.password}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "sf-password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="sf-password-error" className="text-xs text-[#d92d20]" role="alert">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Boton submit */}
      <div className="pt-2">
        <Button
          type="button"
          disabled={isPending}
          onClick={handleSubmit(onSubmit)}
          className={cn(
            "flex h-11 w-full items-center justify-center gap-2 rounded-[12px]",
            "border border-[#004b82] bg-[#004b82] text-sm font-semibold text-white shadow-[0_14px_32px_rgba(0,75,130,0.24)] transition-all",
            "hover:border-[#0a5f9b] hover:bg-[#0a5f9b] hover:shadow-[0_16px_36px_rgba(0,75,130,0.28)]",
            "focus-visible:border-[#d5bb87] focus-visible:ring-4 focus-visible:ring-[#d5bb87]/35",
            "disabled:cursor-not-allowed disabled:border-[#93a9bd] disabled:bg-[#93a9bd] disabled:text-white disabled:opacity-100",
            isPending ? "cursor-wait" : "active:scale-[0.98]"
          )}
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
        </Button>
      </div>

      {/* Link recuperar contrasena */}
      <p className="text-center text-sm text-[#627081]">
        <button
          type="button"
          className="font-medium text-[#004b82] transition-colors hover:underline"
          onClick={() => {/* TODO: ruta recuperar contrasena */}}
        >
          ¿Olvidó su contraseña?
        </button>
      </p>
    </div>
  )
}
