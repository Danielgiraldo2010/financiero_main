import { cn } from "@/shared/lib/cn"

type BrandMarkSize = "sm" | "md" | "lg"

interface BrandMarkProps {
  className?: string
  inverse?: boolean
  showText?: boolean
  stacked?: boolean
  size?: BrandMarkSize
}

const sizeMap: Record<BrandMarkSize, { shell: string; image: string; title: string; subtitle: string }> = {
  sm: {
    shell: "h-10 w-10 rounded-[14px]",
    image: "h-7 w-7",
    title: "text-sm",
    subtitle: "text-[11px]",
  },
  md: {
    shell: "h-12 w-12 rounded-[16px]",
    image: "h-8 w-8",
    title: "text-base",
    subtitle: "text-[12px]",
  },
  lg: {
    shell: "h-16 w-16 rounded-[18px]",
    image: "h-10 w-10",
    title: "text-xl",
    subtitle: "text-sm",
  },
}

export function BrandMark({
  className,
  inverse = false,
  showText = true,
  stacked = false,
  size = "md",
}: BrandMarkProps) {
  const styles = sizeMap[size]

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        stacked && "flex-col gap-2 text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center border border-[#d1d5db] bg-white shadow-[0_12px_28px_rgba(31,41,55,0.10)]",
          styles.shell,
        )}
      >
        <img
          src="/logoUC.png"
          alt="Logo UC"
          className={cn("object-contain", styles.image)}
        />
      </div>

      {showText && (
        <div className={cn("min-w-0 leading-tight", stacked && "space-y-0.5")}>
          <div
            className={cn(
              "truncate font-semibold",
              inverse ? "text-white" : "text-[#19324d]",
              styles.title,
            )}
          >
            Sistema Financiero
          </div>
          <div
            className={cn(
              "truncate font-medium",
              inverse ? "text-[#efd9af]" : "text-[#5a6c82]",
              styles.subtitle,
            )}
          >
            Universidad de Caldas
          </div>
        </div>
      )}
    </div>
  )
}
