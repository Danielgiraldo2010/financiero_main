import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[12px] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/20 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-100 disabled:shadow-none aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/15 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#004b82] text-white shadow-[0_12px_28px_rgba(0,75,130,0.20)] hover:bg-[#0a5f9b] hover:shadow-[0_14px_32px_rgba(0,75,130,0.24)] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/35 disabled:bg-[#93a9bd] disabled:text-white",
        outline:
          "border-[#d1d5db] bg-white text-[#1f2937] shadow-sm hover:border-[#004b82] hover:bg-[#edf4fb] hover:text-[#004b82] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/30 aria-expanded:border-[#004b82] aria-expanded:bg-[#edf4fb] aria-expanded:text-[#004b82] disabled:border-[#d1d5db] disabled:bg-[#f8fafc] disabled:text-[#6b7280]",
        secondary:
          "border border-[#d5bb87]/45 bg-[#fff8e6] text-[#6f4d12] hover:border-[#d5bb87] hover:bg-[#fff2cf] hover:text-[#004b82] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/30 aria-expanded:border-[#d5bb87] aria-expanded:bg-[#fff2cf] aria-expanded:text-[#004b82] disabled:bg-[#f8fafc] disabled:text-[#6b7280]",
        ghost:
          "text-[#374151] hover:bg-[#edf4fb] hover:text-[#004b82] focus-visible:border-[#d5bb87] focus-visible:ring-[#d5bb87]/25 aria-expanded:bg-[#edf4fb] aria-expanded:text-[#004b82] disabled:text-[#6b7280]",
        destructive:
          "border border-destructive/15 bg-destructive/10 text-destructive hover:bg-destructive/16 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 disabled:border-destructive/10 disabled:bg-destructive/6 disabled:text-[#b97373]",
        link: "text-[#004b82] underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-1.5 px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-[12px] px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 rounded-[12px] px-3 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-1.5 rounded-[12px] px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-10 rounded-[12px]",
        "icon-xs":
          "size-7 rounded-[12px] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[12px] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11 rounded-[12px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
