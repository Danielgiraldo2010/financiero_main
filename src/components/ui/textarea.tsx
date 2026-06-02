import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-[12px] border border-[#d1d5db] bg-white px-3.5 py-3 text-sm text-[#1f2937] shadow-sm transition-all outline-none placeholder:text-[#6b7280] focus-visible:border-[#0a4f82] focus-visible:ring-4 focus-visible:ring-[#0a4f82]/12 disabled:cursor-not-allowed disabled:border-[#d1d5db] disabled:bg-[#f8fafc] disabled:text-[#6b7280] disabled:opacity-100 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/12 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
