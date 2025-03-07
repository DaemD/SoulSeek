"use client"

import { useEffect, useState, useRef } from "react"

interface AudioVisualizerProps {
  isActive: boolean
}

export function AudioVisualizer({ isActive }: AudioVisualizerProps) {
  const [bars] = useState(Array.from({ length: 12 }))
  const [heights, setHeights] = useState<number[]>([])
  const animationRef = useRef<number | null>(null)

  // More natural wave pattern generation
  const generateWavePattern = () => {
    // Create a more natural wave pattern with a base sine wave and some randomness
    const time = Date.now() / 1000
    return bars.map((_, i) => {
      const baseHeight = Math.sin(time * 3 + i * 0.5) * 0.5 + 0.5 // Sine wave between 0 and 1
      const randomFactor = Math.random() * 0.3 // Add some randomness
      const height = Math.floor((baseHeight + randomFactor) * 30) + 10
      return height
    })
  }

  useEffect(() => {
    if (isActive) {
      const updateHeights = () => {
        setHeights(generateWavePattern())
        animationRef.current = requestAnimationFrame(updateHeights)
      }

      animationRef.current = requestAnimationFrame(updateHeights)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    } else {
      setHeights(bars.map(() => 5))
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, bars])

  return (
    <div className="relative">
      {isActive && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium opacity-0 animate-fadeIn">
          Listening...
        </div>
      )}

      <div className="audio-wave">
        {bars.map((_, index) => (
          <div
            key={index}
            className={`audio-wave-bar transition-all duration-100 ease-spring ${isActive ? "active" : ""}`}
            style={{
              height: isActive ? `${heights[index] || 10}px` : "5px",
              opacity: isActive ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {isActive && (
        <div
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full bg-primary/5 -z-10 animate-pulse"
          style={{
            boxShadow: "0 0 60px 20px rgba(168, 85, 247, 0.15)",
          }}
        />
      )}
    </div>
  )
}

