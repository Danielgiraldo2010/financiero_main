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
          "h-11 w-full rounded-[12px] border border-[#d9dee7] bg-white px-3.5 pr-10 text-sm text-[#2f3947] shadow-sm outline-none transition-all",
          "placeholder:text-[#8b96a8] focus:border-[#0a4f82] focus:ring-4 focus:ring-[#0a4f82]/12",
          hasError
            ? "border-[#d92d20] focus:border-[#d92d20] focus:ring-[#d92d20]/12"
            : "",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7a8595] transition-colors hover:text-[#004b82]"
        tabIndex={-1}
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
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
