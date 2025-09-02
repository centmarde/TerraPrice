"use client"

import type React from "react"
import { useState } from "react"
import { Building2 } from "lucide-react"
import { HeroSection } from "../components/landing/HeroSection"
import { FeaturesSection } from "../components/landing/FeaturesSection"
import { TestimonialsSection } from "../components/landing/TestimonialsSection"
import { CTASection } from "../components/landing/CTASection"
import { Footer } from "../components/landing/Footer"
import { AuthPage } from "./AuthPage"
import { Button } from "../components/ui/button"

export const LandingPage: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false)

  if (showAuth) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-secondary" />
            <span className="text-xl font-bold text-primary">TerraPrice</span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => setShowAuth(true)}>
              Sign In
            </Button>
            <Button onClick={() => setShowAuth(true)}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection onGetStarted={() => setShowAuth(true)} />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="testimonials">
          <TestimonialsSection />
        </div>
        <CTASection onGetStarted={() => setShowAuth(true)} />
      </main>

      <Footer />
    </div>
  )
}
