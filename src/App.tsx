"use client"

import type React from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { ProjectProvider } from "./contexts/ProjectContext"
import { AdminProvider } from "./contexts/AdminContext"
import { ToastProvider } from "./components/ui/toast"
import { ErrorBoundary } from "./components/ui/ErrorBoundary"
import { LoadingScreen } from "./components/ui/LoadingSpinner"
import { Header } from "./components/layout/Header"
import { LandingPage } from "./pages/LandingPage"
import { DashboardPage } from "./pages/DashboardPage"
import { AdminDashboard } from "./pages/AdminDashboard"

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <LandingPage />
      </ErrorBoundary>
    )
  }

  return (
    <ProjectProvider>
      <AdminProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <ErrorBoundary>{user?.role === "admin" ? <AdminDashboard /> : <DashboardPage />}</ErrorBoundary>
            </main>
          </div>
        </ErrorBoundary>
      </AdminProvider>
    </ProjectProvider>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
