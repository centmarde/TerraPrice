"use client"

import type React from "react"
import { useState } from "react"
import { LoginForm } from "../components/auth/LoginForm"
import { SignupForm } from "../components/auth/SignupForm"
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm"

type AuthView = "login" | "signup" | "forgot-password"

export const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<AuthView>("login")

  const renderAuthForm = () => {
    switch (currentView) {
      case "login":
        return (
          <LoginForm
            onToggleForm={() => setCurrentView("signup")}
            onForgotPassword={() => setCurrentView("forgot-password")}
          />
        )
      case "signup":
        return <SignupForm onToggleForm={() => setCurrentView("login")} />
      case "forgot-password":
        return <ForgotPasswordForm onBack={() => setCurrentView("login")} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">{renderAuthForm()}</div>
    </div>
  )
}
