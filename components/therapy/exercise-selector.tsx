"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { ExerciseTheme } from "@/types/therapy"

interface ExerciseSelectorProps {
  exerciseTypes: Record<string, ExerciseTheme>
  currentExercise: string | null
  activeMode: "mood" | "exercise"
  onSelect: (exercise: string) => void
  onClose: () => void
}

export function ExerciseSelector({
  exerciseTypes,
  currentExercise,
  activeMode,
  onSelect,
  onClose,
}: ExerciseSelectorProps) {
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-md w-full animate-scaleIn p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-800">Select Exercise</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          {Object.entries(exerciseTypes).map(([exercise, details]) => {
            const isActive = currentExercise === exercise && activeMode === "exercise"
            const isHovered = hoveredExercise === exercise

            // Determine background color based on hover/active state
            let bgColor = "bg-white"
            if (isActive) bgColor = details.bg
            if (isHovered && !isActive) bgColor = `${details.bg} opacity-50`

            return (
              <Button
                key={exercise}
                variant="ghost"
                className={`
                  w-full justify-start py-3 text-gray-700 
                  ${isActive ? details.text : ""}
                  ${isActive ? details.hoverDark : details.hover}
                  ${bgColor}
                  transition-colors duration-200
                `}
                onClick={() => onSelect(exercise)}
                onMouseEnter={() => setHoveredExercise(exercise)}
                onMouseLeave={() => setHoveredExercise(null)}
              >
                <span className="mr-3 text-lg">{details.emoji}</span> {exercise}
                <span className="ml-auto text-xs text-gray-400">{details.description}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

