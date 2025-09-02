import * as React from "react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border bg-background p-4 shadow-lg", className)} {...props}>
      {children}
    </div>
  )
})
Toast.displayName = "Toast"

export const ToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, children, ...props }, ref) => {
  return (
    <h4 ref={ref} className={cn("text-sm font-semibold", className)} {...props}>
      {children}
    </h4>
  )
})
ToastTitle.displayName = "ToastTitle"

export const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
  return (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  )
})
ToastDescription.displayName = "ToastDescription"

export const ToastAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
  return (
    <button ref={ref} className={cn("", className)} {...props}>
      {children}
    </button>
  )
})
ToastAction.displayName = "ToastAction"

export const ToastClose = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
  return (
    <button ref={ref} className={cn("", className)} {...props}>
      {children}
    </button>
  )
})
ToastClose.displayName = "ToastClose"

// Toast Context
interface ToastContextType {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => void
  removeToast: (id: string) => void
}

interface ToastItem {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  duration?: number
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const addToast = React.useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])

    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, toast.duration || 5000)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id}>
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            {toast.action && <ToastAction>{toast.action}</ToastAction>}
            <ToastClose onClick={() => removeToast(toast.id)}>×</ToastClose>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
