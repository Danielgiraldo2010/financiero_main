import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-2.5 text-sm text-[#1f2937] shadow-sm transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1f2937] placeholder:text-[#6b7280] focus-visible:border-[#0a4f82] focus-visible:ring-4 focus-visible:ring-[#0a4f82]/12 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:bg-[#f8fafc] disabled:text-[#6b7280] disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/12 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
