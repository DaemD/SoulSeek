"use client"

import { useState, useCallback } from "react"

export const useTherapySession = () => {
  const [isListening, setIsListening] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(false)
  const [currentMode, setCurrentMode] = useState("Calm")
  const [transcript, setTranscript] = useState("")

  const toggleListening = useCallback(() => {
    setIsListening((prevIsListening) => !prevIsListening)
  }, [])

  const updateTranscript = useCallback((newTranscript: string) => {
    setTranscript(newTranscript)
  }, [])

  const generateAiResponse = useCallback(async (userTranscript: string) => {
    setIsAiSpeaking(true)
    // Simulate AI response generation (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsAiSpeaking(false)
  }, [])

  const setTherapyMode = useCallback((mode: string) => {
    setCurrentMode(mode)
  }, [])

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

