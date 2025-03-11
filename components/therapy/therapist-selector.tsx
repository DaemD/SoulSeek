"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { TherapistTheme } from "@/types/therapy"

interface TherapistSelectorProps {
  therapists: Record<string, TherapistTheme>
  currentMode: string
  activeMode: "mood" | "exercise"
  onSelect: (therapistName: string) => void
  onClose: () => void
  onTherapistHover: (therapistName: string | null) => void
  showTherapistProfile: string | null
}

export function TherapistSelector({
  therapists,
  currentMode,
  activeMode,
  onSelect,
  onClose,
  onTherapistHover,
  showTherapistProfile,
}: TherapistSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-md w-full animate-scaleIn p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-gray-800">Select Therapist</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-2 mb-4">
          {Object.entries(therapists).map(([therapistName, theme]) => {
            const isActive = currentMode === therapistName && activeMode === "mood"
            return (
              <Button
                key={therapistName}
                variant="ghost"
                className={`
                  w-full justify-start py-3 text-gray-700 
                  ${isActive ? theme.bg + " " + theme.text : ""}
                  ${isActive ? theme.hoverDark : theme.hover}
                  relative
                `}
                onClick={() => onSelect(therapistName)}
                onMouseEnter={() => onTherapistHover(therapistName)}
                onMouseLeave={() => onTherapistHover(null)}
              >
                <span className="mr-3 text-lg">{theme.emoji}</span> {therapistName}
                <span className="ml-auto text-xs text-gray-400">{theme.description}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Therapist profile popup */}
      {showTherapistProfile && (
        <div
          className="absolute bg-white rounded-xl shadow-lg p-5 max-w-sm animate-fadeIn"
          style={{
            left: "calc(50% + 220px)",
            top: "50%",
            transform: "translateY(-50%)",
            borderLeft: `4px solid ${therapists[showTherapistProfile as keyof typeof therapists].color}`,
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${therapists[showTherapistProfile as keyof typeof therapists].bg}`}
            >
              <span className="text-2xl">{therapists[showTherapistProfile as keyof typeof therapists].emoji}</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">{showTherapistProfile}</h3>
              <p className={`text-sm ${therapists[showTherapistProfile as keyof typeof therapists].text}`}>
                {therapists[showTherapistProfile as keyof typeof therapists].description}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <p className="italic text-gray-600">
              "{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.persona}"
            </p>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="mb-2">{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.bio}</p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-xs text-gray-500 mb-1">Specialty</p>
                <p>{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.specialty}</p>
              </div>
              <div>
                <p className="font-semibold text-xs text-gray-500 mb-1">Style</p>
                <p>{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.style}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

