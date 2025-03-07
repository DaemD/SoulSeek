"use client"

import { useState } from "react"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type TherapyMode = "Calm" | "Motivation" | "Reflection" | "Crisis" | "Sleep"

interface SessionEntry {
  user: string
  ai: string
  timestamp: Date
}

export function useTherapySession() {
  const [isListening, setIsListening] = useState(false)
  const [isAiSpeaking, setIsAiSpeaking] = useState(true)
  const [transcript, setTranscript] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [currentMode, setCurrentMode] = useState<TherapyMode>("Calm")
  const [sessionHistory, setSessionHistory] = useState<SessionEntry[]>([])

  // Toggle listening state - connect to your backend here
  const toggleListening = async () => {
    if (isListening) {
      setIsListening(false)
      // Your backend will handle stopping the recording

      if (transcript) {
        await generateAiResponse(transcript)
      }
    } else {
      setIsListening(true)
      setTranscript("") // Clear transcript when starting to listen
      setAiResponse("") // Clear previous AI response
      // Your backend will handle starting the recording
    }
  }

  // Update transcript - call this from your backend
  const updateTranscript = (text: string) => {
    setTranscript(text)
  }

  const toggleAiSpeaking = () => {
    setIsAiSpeaking(!isAiSpeaking)
    // Your backend will handle speech synthesis
  }

  const setTherapyMode = (mode: TherapyMode) => {
    setCurrentMode(mode)
  }

  const generateAiResponse = async (userInput: string) => {
    try {
      // Get system prompt based on current mode
      const systemPrompt = getSystemPromptForMode(currentMode)

      // Generate response using AI SDK
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: systemPrompt,
        prompt: userInput,
      })

      setAiResponse(text)

      // Add to session history
      setSessionHistory((prev) => [
        ...prev,
        {
          user: userInput,
          ai: text,
          timestamp: new Date(),
        },
      ])

      // Your backend will handle speaking the response
      if (isAiSpeaking) {
        // Notify your backend to speak the text
        console.log("Speaking response:", text)
      }
    } catch (error) {
      console.error("Error generating AI response:", error)
      setAiResponse("I'm sorry, I'm having trouble responding right now. Please try again.")
    }
  }

  const getSystemPromptForMode = (mode: TherapyMode): string => {
    switch (mode) {
      case "Calm":
        return `You are SoulSpeak, a calming and supportive AI therapist specializing in mindfulness and grounding techniques. 
                Use a gentle, soothing tone and focus on helping the user feel present and relaxed. 
                Offer breathing exercises, guided visualizations, and gentle reassurance.
                Keep responses concise (3-4 sentences max) and focused on calming techniques.
                Avoid clinical language and use warm, supportive phrasing.`

      case "Motivation":
        return `You are SoulSpeak, an energetic and encouraging AI therapist specializing in motivation and positive psychology.
                Use an upbeat, enthusiastic tone and focus on helping the user feel empowered and capable.
                Offer positive affirmations, goal-setting frameworks, and celebrate small wins.
                Keep responses concise (3-4 sentences max) and action-oriented.
                Use energizing language that inspires action while remaining supportive.`

      case "Reflection":
        return `You are SoulSpeak, a thoughtful and insightful AI therapist specializing in self-reflection and emotional awareness.
                Use a balanced, contemplative tone and focus on helping the user explore their thoughts and feelings.
                Ask open-ended questions, offer gentle prompts for journaling, and validate emotions.
                Keep responses concise (3-4 sentences max) and thought-provoking.
                Use language that encourages introspection without judgment.`

      case "Crisis":
        return `You are SoulSpeak, a stabilizing and supportive AI therapist specializing in crisis support and emotional regulation.
                Use a calm, steady tone and focus on helping the user feel safe and grounded.
                Offer immediate coping strategies, validation, and resources for professional help if needed.
                Keep responses concise (3-4 sentences max) and focused on immediate support.
                If user expresses suicidal thoughts or severe distress, gently suggest contacting a crisis helpline or emergency services.
                Use language that conveys stability and hope.`

      case "Sleep":
        return `You are SoulSpeak, a gentle and soothing AI therapist specializing in sleep support and relaxation.
                Use a soft, slow-paced tone and focus on helping the user wind down and prepare for rest.
                Offer progressive muscle relaxation, bedtime stories, or gentle breathing exercises.
                Keep responses concise (3-4 sentences max) and use rhythmic, calming language.
                Use imagery related to peaceful settings and restful states.`

      default:
        return `You are SoulSpeak, a supportive AI therapist using cognitive behavioral therapy principles.
                Respond with empathy and warmth while offering practical insights.
                Keep responses concise (3-4 sentences max) and conversational.
                Focus on being present with the user and understanding their needs.`
    }
  }

  return {
    isListening,
    isAiSpeaking,
    currentMode,
    transcript,
    aiResponse,
    sessionHistory,
    toggleListening,
    updateTranscript,
    toggleAiSpeaking,
    setTherapyMode,
    generateAiResponse,
  }
}

