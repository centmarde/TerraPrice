import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, max = 100, ...props }, ref) => {
  const percentage = value && max ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div ref={ref} className={cn("relative w-full rounded-md bg-muted h-4", className)} {...props}>
      <div className="h-4 rounded-md bg-primary transition-all" style={{ width: `${percentage}%` }} />
    </div>
  )
})
Progress.displayName = "Progress"
