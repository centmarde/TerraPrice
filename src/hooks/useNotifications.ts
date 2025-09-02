"use client"

import { useState, useCallback } from "react"
import type { ToastNotification } from "../components/ui/NotificationToast"

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  const addNotification = useCallback(
    (type: ToastNotification["type"], title: string, message?: string, duration?: number) => {
      const id = Math.random().toString(36).substr(2, 9)
      const notification: ToastNotification = {
        id,
        type,
        title,
        message,
        duration,
      }

      setNotifications((prev) => [...prev, notification])
      return id
    },
    [],
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success: (title: string, message?: string) => addNotification("success", title, message),
    error: (title: string, message?: string) => addNotification("error", title, message),
    warning: (title: string, message?: string) => addNotification("warning", title, message),
    info: (title: string, message?: string) => addNotification("info", title, message),
  }
}
