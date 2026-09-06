import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-blue-500/40 bg-blue-950/80 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
        secondary:
          "border-slate-700 bg-slate-800/80 text-slate-200",
        destructive:
          "border-red-500/40 bg-red-950/80 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.2)]",
        outline: "text-slate-300 border-slate-700 bg-slate-900/60",
        success: "border-emerald-500/40 bg-emerald-950/80 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
        warning: "border-amber-500/40 bg-amber-950/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
