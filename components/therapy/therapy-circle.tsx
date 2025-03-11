"use client"

import { useRef } from "react"
import type { TherapistTheme, ExerciseTheme } from "@/types/therapy"

interface TherapyCircleProps {
  theme: TherapistTheme | ExerciseTheme
  isListening: boolean
  isAiSpeaking: boolean
  onClick: () => void
}

export function TherapyCircle({ theme, isListening, isAiSpeaking, onClick }: TherapyCircleProps) {
  const circleRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      <div
        ref={circleRef}
        onClick={onClick}
        className={`
          w-64 h-64 rounded-full bg-gradient-to-br ${theme.primary}
          flex items-center justify-center transition-all duration-1000
          cursor-pointer hover:shadow-lg
          ${isAiSpeaking || isListening ? "scale-110" : "scale-100"}
        `}
      >
        {/* Inner circles that always animate, but intensify when AI speaks or user is speaking */}
        <div className={`absolute inset-0 rounded-full ${theme.bg} animate-pulse-slow opacity-70`}></div>
        <div
          className={`absolute w-[110%] h-[110%] rounded-full border ${theme.border.replace("border-", "border-")} opacity-10 animate-spin-very-slow`}
        ></div>
        <div
          className={`absolute w-[120%] h-[120%] rounded-full border ${theme.border.replace("border-", "border-")} opacity-10 animate-spin-slow-reverse`}
        ></div>

        {/* Additional animation elements when active */}
        {(isAiSpeaking || isListening) && (
          <>
            <div className={`absolute inset-0 rounded-full ${theme.bg} animate-pulse opacity-50`}></div>
            <div
              className={`absolute w-[130%] h-[130%] rounded-full border-2 ${theme.border.replace("border-", "border-")} opacity-20 animate-ping`}
            ></div>
          </>
        )}

        {/* Central gradient circle */}
        <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${theme.secondary} flex items-center justify-center`}>
          <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${theme.inner} flex items-center justify-center`}>
            {/* Status indicator text */}
            <span className={`text-sm font-medium ${theme.text}`}>{isListening ? "Listening..." : "Tap to speak"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

