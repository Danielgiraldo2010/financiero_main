import { cn } from "@/shared/lib/cn"

type BadgeVariant = "success" | "warning" | "error" | "info" | "default"

interface StatusBadgeProps {
  variant?: BadgeVariant
  label: string
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  success:
    "bg-emerald-50 text-emerald-800 ring-emerald-700/20",
  warning:
    "bg-amber-50 text-amber-800 ring-amber-700/20",
  error:
    "bg-red-50 text-red-800 ring-red-700/20",
  info:
    "bg-blue-50 text-blue-800 ring-blue-700/20",
  default:
    "bg-slate-50 text-slate-800 ring-slate-700/15",
}

export function StatusBadge({
  variant = "default",
  label,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
