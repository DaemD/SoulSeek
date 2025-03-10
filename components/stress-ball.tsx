"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

type StressBallProps = {
  onClose: () => void
  theme: any
}

export const StressBall = ({ onClose, theme }: StressBallProps) => {
  const [isSqueezing, setIsSqueezing] = useState(false)
  const [squeezeIntensity, setSqueezeIntensity] = useState(0)
  const [squeezeCount, setSqueezeCount] = useState(0)
  const [stressLevel, setStressLevel] = useState(100)
  const [message, setMessage] = useState("")
  const ballRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef({ x: 0, y: 0 })

  const calmingMessages = [
    "Let it out...",
    "You're doing great!",
    "Take a deep breath...",
    "Feel the tension release...",
    "One squeeze at a time...",
    "That's it, nice and easy...",
    "Breathe in... breathe out...",
    "You've got this!",
    "Release the stress...",
    "Feel your shoulders relax...",
  ]

  useEffect(() => {
    setMessage(calmingMessages[Math.floor(Math.random() * calmingMessages.length)])
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ballRef.current) return

    e.preventDefault()
    setIsSqueezing(true)
    startPosRef.current = { x: e.clientX, y: e.clientY }
    setSqueezeIntensity(0.1)

    // Vibrate based on squeeze intensity
    if ("vibrate" in navigator) {
      navigator.vibrate(100)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSqueezing || !ballRef.current) return

    const dx = Math.abs(e.clientX - startPosRef.current.x)
    const dy = Math.abs(e.clientY - startPosRef.current.y)
    const distance = Math.sqrt(dx * dx + dy * dy)

    const newIntensity = Math.min(0.6, 0.1 + distance / 200)
    setSqueezeIntensity(newIntensity)

    if ("vibrate" in navigator) {
      navigator.vibrate(30 + newIntensity * 70)
    }
  }

  const handleMouseUp = () => {
    if (!isSqueezing) return

    if (squeezeIntensity > 0.2) {
      setSqueezeCount((prev) => prev + 1)
      const stressReduction = Math.floor(squeezeIntensity * 20)
      setStressLevel((prev) => Math.max(0, prev - stressReduction))
      setMessage(calmingMessages[Math.floor(Math.random() * calmingMessages.length)])
    }

    setIsSqueezing(false)
    setSqueezeIntensity(0)
  }

  const getBallStyle = () => {
    const scale = 1 - squeezeIntensity * 0.3
  
    return {
      transform: `scale(${scale})`,
      borderRadius: "50%", // Keep it circular
      transition: "transform 0.1s ease-out",
      boxShadow: `0 ${10 - squeezeIntensity * 8}px ${20 - squeezeIntensity * 15}px rgba(0, 0, 0, 0.2)`,
      backgroundColor: theme.color || "#3b82f6",
    }
  }

  const getStressColor = () => {
    if (stressLevel > 75) return "text-red-500"
    if (stressLevel > 50) return "text-orange-500"
    if (stressLevel > 25) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <div className="bg-white rounded-xl max-w-md w-full animate-scaleIn p-6 flex flex-col items-center">
      <div className="flex justify-between items-center w-full mb-6">
        <h3 className="text-xl font-medium text-gray-800">Stress Ball</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-center mb-4">
        <p className="text-gray-600 mb-2">Squeeze the ball to release stress</p>
        <p className="text-lg font-medium">{message}</p>
      </div>

      <div
        className="relative mb-6 mt-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={ballRef}
          className="w-48 h-48 rounded-full cursor-grab active:cursor-grabbing transition-all duration-200"
          style={getBallStyle()}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-4 bg-black/10 rounded-full blur-md transition-all duration-200"
          style={{
            width: `${160 - squeezeIntensity * 40}px`,
            opacity: 0.2 - squeezeIntensity * 0.1,
          }}
        ></div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Stress Level:</span>
          <span className={`font-medium ${getStressColor()}`}>{stressLevel}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${getStressColor()}`}
            style={{ width: `${stressLevel}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Squeezes:</span>
          <span className="font-medium">{squeezeCount}</span>
        </div>
      </div>
    </div>
  )
}
