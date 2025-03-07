"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TherapyModeProps {
  title: string
  description: string
  icon: React.ReactNode
  isActive: boolean
  onClick: () => void
  className?: string
}

export function TherapyMode({ title, description, icon, isActive, onClick, className }: TherapyModeProps) {
  return (
    <Card
      className={cn(
        "mode-card cursor-pointer border-none shadow-md",
        isActive ? "bg-primary/20 ring-2 ring-primary/50" : "bg-secondary/30 hover:bg-secondary/50",
        className,
      )}
      onClick={onClick}
    >
      <CardContent className="p-6 flex items-center gap-4">
        <div className={cn("p-3 rounded-full", isActive ? "bg-primary/20" : "bg-secondary/50")}>{icon}</div>
        <div className="space-y-1">
          <h3 className="font-medium">{title} Mode</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

