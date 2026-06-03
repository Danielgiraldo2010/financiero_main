import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold tracking-[0.01em] whitespace-nowrap transition-all duration-200 ease-out focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/25 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border border-[#004b82]/25 bg-[#edf4fb] text-[#004b82] shadow-[0_4px_12px_rgba(15,23,42,0.08)] hover:border-[#004b82]/40 hover:bg-[#dbeaf7] hover:shadow-[0_8px_18px_rgba(15,23,42,0.10)] [a]:hover:bg-[#dbeaf7]",
        secondary:
          "border border-[#d5bb87]/55 bg-[#fff8e6] text-[#6f4d12] shadow-[0_6px_16px_rgba(154,106,31,0.06)] [a]:hover:bg-[#fff2cf]",
        destructive:
          "border border-destructive/15 bg-destructive/10 text-destructive focus-visible:ring-destructive/20 [a]:hover:bg-destructive/20",
        outline:
          "border-[#d6e0ea] bg-white text-[#27384b] shadow-[0_6px_16px_rgba(0,75,130,0.04)] [a]:hover:bg-[#edf4fb] [a]:hover:text-[#004b82]",
        ghost:
          "text-[#6b7280] hover:bg-[#f8fafc] hover:text-[#004b82]",
        link: "text-[#004b82] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
