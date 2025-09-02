"use client"

import type React from "react"
import { Upload, BarChart3, Users, Download, Shield, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const features = [
  {
    icon: Upload,
    title: "Smart Upload System",
    description:
      "Drag and drop floorplans in any format. Our AI automatically detects and processes architectural elements.",
  },
  {
    icon: BarChart3,
    title: "Detailed Cost Analysis",
    description:
      "Get comprehensive breakdowns by material, labor, and regional pricing with interactive charts and reports.",
  },
  {
    icon: Users,
    title: "Admin Dashboard",
    description:
      "Powerful admin tools for user management, analytics, and system configuration with role-based access.",
  },
  {
    icon: Download,
    title: "Export & Reports",
    description: "Download professional reports in PDF, CSV, or Excel formats. Perfect for client presentations.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level security with encrypted data storage and secure user authentication systems.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get accurate cost estimates in under 60 seconds. No more waiting days for manual calculations.",
  },
]

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Everything You Need for Accurate Estimates
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional-grade tools designed for architects, contractors, and construction professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
