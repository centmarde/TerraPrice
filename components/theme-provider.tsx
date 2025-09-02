import type React from "react"
import { ThemeProvider as CustomThemeProvider } from "../src/contexts/ThemeContext"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <CustomThemeProvider>{children}</CustomThemeProvider>
}
