import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, value, onValueChange, children, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value)

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const handleValueChange = (val: string) => {
    setInternalValue(val)
    if (onValueChange) {
      onValueChange(val)
    }
  }

  return (
    <div ref={ref} className={cn("flex flex-col", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null
        return React.cloneElement(child, { selectedValue: internalValue, onValueChange: handleValueChange })
      })}
    </div>
  )
})
Tabs.displayName = "Tabs"

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex border-b border-muted", className)} {...props}>
      {children}
    </div>
  )
})
TabsList.displayName = "TabsList"

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  selectedValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, value, selectedValue, onValueChange, children, ...props }, ref) => {
  const isSelected = value === selectedValue

  const handleClick = () => {
    if (onValueChange) {
      onValueChange(value)
    }
  }

  return (
    <button
      ref={ref}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors",
        isSelected ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  selectedValue?: string
  children?: React.ReactNode
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({ className, value, selectedValue, children, ...props }, ref) => {
  if (value !== selectedValue) {
    return null
  }

  return (
    <div ref={ref} className={cn("p-4", className)} {...props}>
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"
