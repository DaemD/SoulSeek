"use client"

import { Button } from "@/components/ui/button"
import type { TherapistTheme, ExerciseTheme } from "@/types/therapy"

interface OptionsMenuProps {
  activeMode: "mood" | "exercise"
  currentMode: string
  currentExercise: string | null
  theme: TherapistTheme | ExerciseTheme
  therapists: Record<string, TherapistTheme>
  exerciseTypes: Record<string, ExerciseTheme>
  onModeMenuOpen: () => void
  onExerciseMenuOpen: () => void
  onJournalOpen: () => void
  onStressBallOpen: () => void
}

export function OptionsMenu({
  activeMode,
  currentMode,
  currentExercise,
  theme,
  therapists,
  exerciseTypes,
  onModeMenuOpen,
  onExerciseMenuOpen,
  onJournalOpen,
  onStressBallOpen,
}: OptionsMenuProps) {
  return (
    <div className="fixed right-6 top-16 z-50 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg w-64 animate-scaleIn overflow-hidden">
        {/* Therapist selector button */}
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start px-4 py-3 transition-colors duration-300 
            ${activeMode === "mood" ? theme.border + " " + theme.text + " " + theme.hover : "text-gray-600 hover:bg-gray-100"}
            ${activeMode === "exercise" ? "opacity-70" : ""}
          `}
          onClick={onModeMenuOpen}
        >
          <span className="mr-2">{therapists[currentMode as keyof typeof therapists]?.emoji || "👤"}</span>{" "}
          {currentMode}
        </Button>

        {/* Exercise selector button */}
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start px-4 py-3 transition-colors duration-300 
            ${
              activeMode === "exercise" && currentExercise
                ? exerciseTypes[currentExercise as keyof typeof exerciseTypes].border +
                  " " +
                  exerciseTypes[currentExercise as keyof typeof exerciseTypes].text +
                  " " +
                  exerciseTypes[currentExercise as keyof typeof exerciseTypes].hover
                : "text-gray-600 hover:bg-gray-100"
            }
            ${activeMode === "mood" ? "opacity-70" : ""}
          `}
          onClick={onExerciseMenuOpen}
        >
          <span className="mr-2">
            {currentExercise ? exerciseTypes[currentExercise as keyof typeof exerciseTypes].emoji : "🏋️"}
          </span>
          {currentExercise ? `${currentExercise} Exercise` : "Select Exercise"}
        </Button>

        {/* Journalling button - opens journal directly */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start px-4 py-3 transition-colors duration-300 text-gray-600 hover:bg-gray-100"
          onClick={onJournalOpen}
        >
          <span className="mr-2">{exerciseTypes.Journalling.emoji}</span> Journalling
        </Button>

        {/* Stress Ball button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start px-4 py-3 transition-colors duration-300 text-gray-600 hover:bg-gray-100"
          onClick={onStressBallOpen}
        >
          <span className="mr-2">🧠</span> Stress Ball
        </Button>
      </div>
    </div>
  )
}

