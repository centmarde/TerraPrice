"use client"

import type React from "react"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "../ui/button"

interface HeroSectionProps {
  onGetStarted: () => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative bg-gradient-to-br from-background via-muted/30 to-background py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23374151' fillOpacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
              Professional Floorplan Analysis
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 text-balance">
              Transform Floorplans into
              <span className="text-secondary block">Precise Cost Estimates</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              TerraPrice uses advanced analysis to deliver accurate construction cost estimates from your architectural
              plans. Get professional-grade insights in minutes, not days.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-3">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
              <img src="/modern-architectural-floorplan-analysis-dashboard-.png" alt="TerraPrice Dashboard Interface" className="w-full h-auto" />
            </div>
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              AI-Powered Analysis
            </div>
            <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              Instant Results
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
