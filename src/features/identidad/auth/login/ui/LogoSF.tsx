import { BrandMark } from '@/shared/ui/branding/BrandMark'
import { cn } from '@/lib/utils'

interface LogoSFProps {
  className?: string
  variant?: 'default' | 'hero'
  showProductMark?: boolean
}

export function LogoSF({
  className,
  variant = 'default',
  showProductMark = true,
}: LogoSFProps) {
  const isHero = variant === 'hero'

  return (
    <div className={cn('flex flex-col items-center gap-5 text-center', className)}>
      <div className="flex items-center justify-center gap-6">
        <img
          src="/image/logo1ucaldas.png"
          alt="Universidad de Caldas"
          className={cn(
            "h-auto max-w-[58vw] object-contain brightness-0 invert drop-shadow-[0_10px_24px_rgba(0,40,77,0.28)]",
            isHero ? "w-[360px] xl:w-[440px]" : "w-[210px] sm:w-[240px]",
          )}
        />
        <img
          src="/image/logo-cidt.png"
          alt="CIDT"
          className={cn(
            "hidden h-auto object-contain brightness-0 invert drop-shadow-[0_10px_24px_rgba(0,40,77,0.28)] sm:block",
            isHero ? "w-[136px] xl:w-[168px]" : "w-[96px]",
          )}
        />
      </div>

      {showProductMark && (
        <BrandMark
          inverse
          size="sm"
          stacked
          className="hidden lg:flex"
        />
      )}
    </div>
  )
}
