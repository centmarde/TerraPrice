"use client"

import type React from "react"
import { ArrowRight, CheckCircle } from "lucide-react"
import { Button } from "../ui/button"

interface CTASectionProps {
  onGetStarted: () => void
}

const benefits = [
  "Free 14-day trial",
  "No credit card required",
  "Full access to all features",
  "24/7 customer support",
]

export const CTASection: React.FC<CTASectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-secondary/10 via-secondary/5 to-secondary/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            Ready to Transform Your Cost Estimation Process?
          </h2>
          <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust TerraPrice for accurate, fast, and reliable cost estimates.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center justify-center md:justify-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-3">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              Schedule Demo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-6">No setup fees • Cancel anytime • GDPR compliant</p>
        </div>
      </div>
    </section>
  )
}
