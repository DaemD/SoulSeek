"use client"

import { useState, useCallback } from "react"

export const useTherapySession = () => {
  const [isListening, setIsListening] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [currentMode, setCurrentMode] = useState<string>("Lena Shore") // Default mode
  const [transcript, setTranscript] = useState("")

  const toggleListening = () => {
    setIsListening((prev) => !prev)
  }

  const updateTranscript = useCallback((newTranscript: string) => {
    setTranscript(newTranscript)
  }, [])

  const generateAiResponse = useCallback((userTranscript: string) => {
    setIsAiSpeaking(true)
    // Simulate AI response generation (replace with actual API call)
    setTimeout(() => {
      setIsAiSpeaking(false)
    }, 2000)
  }, [])

  const setTherapyMode = (mode: string) => {
    setCurrentMode(mode)
  }

  return {
    isListening,
    isAiSpeaking,
    currentMode,
    transcript,
    toggleListening,
    updateTranscript,
    generateAiResponse,
    setTherapyMode,
  }
}

