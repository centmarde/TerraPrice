"use client"

import type React from "react"
import { useEffect } from "react"

export const AccessibilityFeatures: React.FC = () => {
  useEffect(() => {
    // Add keyboard navigation support
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content with Alt+M
      if (event.altKey && event.key === "m") {
        event.preventDefault()
        const main = document.querySelector("main")
        if (main) {
          main.focus()
          main.scrollIntoView()
        }
      }

      // Focus management for modals and dropdowns
      if (event.key === "Escape") {
        const activeElement = document.activeElement as HTMLElement
        if (activeElement && activeElement.closest('[role="dialog"]')) {
          const closeButton = activeElement
            .closest('[role="dialog"]')
            ?.querySelector('[aria-label="Close"]') as HTMLElement
          closeButton?.click()
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>

      {/* Screen reader announcements */}
      <div id="sr-announcements" className="sr-only" aria-live="polite" aria-atomic="true" />
    </>
  )
}

export const announceToScreenReader = (message: string) => {
  const announcer = document.getElementById("sr-announcements")
  if (announcer) {
    announcer.textContent = message
    setTimeout(() => {
      announcer.textContent = ""
    }, 1000)
  }
}
