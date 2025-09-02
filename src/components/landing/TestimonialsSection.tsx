"use client"

import type React from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "../ui/card"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Architect",
    company: "ModernSpace Design",
    content:
      "TerraPrice has revolutionized our cost estimation process. What used to take days now takes minutes, and the accuracy is incredible.",
    rating: 5,
    avatar: "/professional-woman-architect-headshot.png",
  },
  {
    name: "Michael Rodriguez",
    role: "Construction Manager",
    company: "BuildRight Construction",
    content:
      "The detailed breakdowns and regional pricing adjustments have saved us thousands on material costs. It's an essential tool for our team.",
    rating: 5,
    avatar: "/professional-man-construction-manager-headshot.png",
  },
  {
    name: "Emily Johnson",
    role: "Project Director",
    company: "Urban Development Corp",
    content:
      "The admin features are fantastic. Managing multiple projects and teams has never been easier. The reporting capabilities are top-notch.",
    rating: 5,
    avatar: "/professional-woman-project-director-headshot.png",
  },
]

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Trusted by Industry Professionals</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what architects, contractors, and construction professionals are saying about TerraPrice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 text-pretty">"{testimonial.content}"</blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-primary">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
