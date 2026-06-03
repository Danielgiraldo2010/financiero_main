import { cn } from "@/shared/lib/cn"

type BadgeVariant = "success" | "warning" | "error" | "info" | "default"

interface StatusBadgeProps {
  variant?: BadgeVariant
  label: string
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success:
    "bg-emerald-50 text-emerald-800 ring-emerald-700/20 before:bg-emerald-500",
  warning:
    "bg-amber-50 text-amber-800 ring-amber-700/20 before:bg-amber-500",
  error:
    "bg-red-50 text-red-800 ring-red-700/20 before:bg-red-500",
  info:
    "bg-blue-50 text-blue-800 ring-blue-700/20 before:bg-blue-500",
  default:
    "bg-slate-50 text-slate-800 ring-slate-700/15 before:bg-slate-500",
}

export function StatusBadge({
  variant = "default",
  label,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-[0.01em] shadow-[0_8px_18px_rgba(0,75,130,0.06)] ring-1 ring-inset before:h-1.5 before:w-1.5 before:rounded-full before:content-['']",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
