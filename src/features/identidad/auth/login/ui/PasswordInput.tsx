import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export function PasswordInput({ hasError, className, ...props }: PasswordInputProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        className={cn(
          "h-11 w-full rounded-lg border bg-white/10 px-3 pr-10 text-sm text-white",
          "placeholder:text-white/40 outline-none transition-colors",
          "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30",
          hasError
            ? "border-red-400/70"
            : "border-white/20 hover:border-white/40",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
        tabIndex={-1}
        aria-label={show ? "Ocultar contrasena" : "Mostrar contrasena"}
      >
        {show ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
