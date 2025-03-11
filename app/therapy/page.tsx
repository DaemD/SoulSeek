"use client"

import { useState, useEffect, useRef } from "react"
import { TherapyCircle } from "@/components/therapy/therapy-circle"
import { TherapistSelector } from "@/components/therapy/therapist-selector"
import { ExerciseSelector } from "@/components/therapy/exercise-selector"
import { ConversationHistory } from "@/components/therapy/conversation-history"
import { JournalEditor } from "@/components/therapy/journal-editor"
import { OptionsMenu } from "@/components/therapy/options-menu"
import { StressBall } from "@/components/stress-ball"
import { useTherapySession } from "@/hooks/use-therapy-session"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, X, MessageSquare, Eye } from "lucide-react"
import Link from "next/link"
import { therapists, therapistToMoodMap } from "@/data/therapists"
import { exerciseTypes } from "@/data/exercises"
import type { TherapistTheme, ExerciseTheme } from "@/types/therapy"

// Replace the MessageCarousel component with this updated version that focuses on the latest message
function MessageDisplay({
  messages,
  theme,
  onDismiss,
}: {
  messages: Array<{ speaker: string; text: string }>
  theme: TherapistTheme | ExerciseTheme
  onDismiss: () => void
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [currentMessage, setCurrentMessage] = useState<{ speaker: string; text: string } | null>(null)

  // Effect to show the latest message whenever messages array changes
  useEffect(() => {
    if (messages.length === 0) {
      setCurrentMessage(null)
      return
    }

    // Only update if we have a new message or no current message
    const latestMessage = messages[messages.length - 1]

    // If this is the first message or a different message than current
    if (
      !currentMessage ||
      latestMessage.text !== currentMessage.text ||
      latestMessage.speaker !== currentMessage.speaker
    ) {
      // Fade out only when changing messages, not on every render
      setIsVisible(false)

      // After fade out, show the latest message
      setTimeout(() => {
        setCurrentMessage(latestMessage)
        setIsVisible(true)
      }, 300) // Wait for fade out animation
    }
  }, [messages, currentMessage])

  // If no messages or no current message, show placeholder
  if (!currentMessage) {
    return (
      <div className="text-center py-6 text-gray-400 bg-white/40 backdrop-blur-sm shadow-sm p-6 rounded-lg w-full border border-gray-100">
        <p className="text-sm font-medium">No conversation yet</p>
        <p className="text-xs mt-1 text-gray-300">Tap the circle to start talking</p>
      </div>
    )
  }

  // Get appropriate background based on speaker
  const getBgClass = () => {
    return currentMessage.speaker === "You" ? "bg-gray-100" : theme.bg
  }

  // Get appropriate text color based on speaker
  const getTextClass = () => {
    return currentMessage.speaker === "You" ? "text-gray-500" : theme.text
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
        aria-label="Dismiss message"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>

      <div
        key={`message-${currentMessage.speaker}-${currentMessage.text.substring(0, 20)}`}
        className={`
          transition-all duration-500 transform
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          p-6 rounded-xl shadow-md ${getBgClass()}
          flex flex-col items-center text-center
        `}
      >
        {/* Speaker avatar */}
        <div
          className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center ${
            currentMessage.speaker === "You" ? "bg-gray-200" : theme.primary
          }`}
        >
          <span className={`text-lg ${currentMessage.speaker === "You" ? "text-gray-700" : "text-white"}`}>
            {currentMessage.speaker === "You" ? "Y" : "S"}
          </span>
        </div>

        {/* Speaker name */}
        <p className={`text-sm font-medium mb-3 ${getTextClass()}`}>{currentMessage.speaker}</p>

        {/* Message text */}
        <p className="text-gray-800 text-lg leading-relaxed">{currentMessage.text}</p>
      </div>
    </div>
  )
}

export default function TherapyPage() {
  // State management for UI components and therapy session
  const [stressBallOpen, setStressBallOpen] = useState(false)
  const [journalOpen, setJournalOpen] = useState(false)
  const [showConversation, setShowConversation] = useState(false)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [exerciseMenuOpen, setExerciseMenuOpen] = useState(false)
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false)
  const [currentExercise, setCurrentExercise] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<"mood" | "exercise">("mood")
  const [theme, setTheme] = useState<TherapistTheme | ExerciseTheme>(therapists["Lena Shore"])
  const [conversation, setConversation] = useState<string[]>([])
  const [isConversationButtonHovered, setIsConversationButtonHovered] = useState(false)
  const [isShowMessageButtonHovered, setIsShowMessageButtonHovered] = useState(false)
  const [showTherapistProfile, setShowTherapistProfile] = useState<string | null>(null)
  const [isPlusButtonHovered, setIsPlusButtonHovered] = useState(false)
  const [displayedMessages, setDisplayedMessages] = useState<Array<{ speaker: string; text: string }>>([])
  const [sessionActive, setSessionActive] = useState(false)
  const [lastConversationLength, setLastConversationLength] = useState(0)
  const [isMessageVisible, setIsMessageVisible] = useState(true)

  // Ref for auto-scrolling conversation
  const conversationEndRef = useRef<HTMLDivElement>(null)

  // Custom hook for therapy session management
  const {
    isListening,
    isAiSpeaking,
    currentMode,
    toggleListening,
    updateTranscript,
    generateAiResponse,
    setTherapyMode,
  } = useTherapySession()

  // Define improved exercise colors
  const exerciseColors = {
    Breathing: {
      gradient: "rgba(56, 189, 248, 0.2), rgba(14, 165, 233, 0.2)", // Sky blue
      solid: "#0ea5e9", // Sky-500
    },
    Meditation: {
      gradient: "rgba(168, 85, 247, 0.2), rgba(139, 92, 246, 0.2)", // Purple
      solid: "#a855f7", // Purple-500
    },
    Journalling: {
      gradient: "rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.2)", // Orange
      solid: "#f97316", // Orange-500
    },
    Visualization: {
      gradient: "rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2)", // Emerald
      solid: "#10b981", // Emerald-500
    },
    Grounding: {
      gradient: "rgba(101, 163, 13, 0.2), rgba(77, 124, 15, 0.2)", // Lime
      solid: "#65a30d", // Lime-600
    },
  }

  // Update theme when mode or exercise changes
  useEffect(() => {
    if (activeMode === "mood") {
      setTheme(therapists[currentMode as keyof typeof therapists])
    } else if (activeMode === "exercise" && currentExercise) {
      // Create a custom theme for the selected exercise
      const exerciseColor = exerciseColors[currentExercise as keyof typeof exerciseColors]

      if (exerciseColor) {
        const customExerciseTheme: ExerciseTheme = {
          ...(exerciseTypes[currentExercise as keyof typeof exerciseTypes] as ExerciseTheme),
          primary: `from-[${exerciseColor.solid}]/10 to-[${exerciseColor.solid}]/30`,
          color: exerciseColor.solid,
          bg: `bg-[${exerciseColor.solid}]/10`,
        }

        setTheme(customExerciseTheme)
      } else {
        // Fallback to the default exercise theme
        setTheme(exerciseTypes[currentExercise as keyof typeof exerciseTypes] as ExerciseTheme)
      }
    }
  }, [activeMode, currentMode, currentExercise])

  // Process conversation data for display
  const processConversation = (rawConversation: string[]) => {
    return rawConversation.map((line) => {
      if (line.startsWith("USER:")) {
        return { speaker: "You", text: line.substring(5).trim() }
      } else if (line.startsWith("ASSISTANT:")) {
        return { speaker: "SoulSpeak", text: line.substring(10).trim() }
      } else if (line.startsWith("You:")) {
        return { speaker: "You", text: line.substring(4).trim() }
      } else if (line.startsWith("SoulSpeak:")) {
        return { speaker: "SoulSpeak", text: line.substring(10).trim() }
      } else {
        // If line doesn't have a speaker prefix, assume it's continuing from previous
        return { speaker: "SoulSpeak", text: line.trim() }
      }
    })
  }

  // Fetch conversation from the backend
  const fetchConversation = async () => {
    try {
      const response = await fetch("/api/get-conversation")
      const data = await response.json()
      if (data.conversation) {
        const conversationLines = data.conversation.split("\n").filter((line: string) => line.trim() !== "")

        // Check if we have new messages
        const hasNewMessages = conversationLines.length > lastConversationLength

        setConversation(conversationLines)
        setLastConversationLength(conversationLines.length)

        const processedMessages = processConversation(conversationLines)
        setDisplayedMessages(processedMessages)

        // If we have new messages and the AI was speaking, update the AI speaking state
        if (hasNewMessages && isAiSpeaking) {
          // Check if the last message is from the assistant
          const lastMessage = processedMessages[processedMessages.length - 1]
          if (lastMessage && lastMessage.speaker === "SoulSpeak") {
            // Continue polling as the AI might still be speaking
          } else {
            // If the last message is from the user, AI has finished speaking
            updateAiSpeakingState(false)
          }
        }

        // Show message card when new message arrives
        if (hasNewMessages) {
          setIsMessageVisible(true)
        }
      }
    } catch (error) {
      console.error("Failed to fetch conversation:", error)
    }
  }

  // Update AI speaking state
  const updateAiSpeakingState = (speaking: boolean) => {
    if (isAiSpeaking !== speaking) {
      // This would normally be handled by the useTherapySession hook
      // But we're manually updating it here based on conversation changes
    }
  }

  // Poll for conversation updates
  useEffect(() => {
    // Initial fetch
    fetchConversation()

    // Set up polling interval (every 1 second)
    const intervalId = setInterval(() => {
      if (sessionActive) {
        fetchConversation()
      }
    }, 1000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [sessionActive])

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [displayedMessages])

  // API call to start session
  const startSession = async () => {
    try {
      let url = "/api/start-session/?"

      if (activeMode === "mood") {
        const mood = therapistToMoodMap[currentMode as keyof typeof therapistToMoodMap] || "Calm"
        url += `mode=${mood}`
      } else if (activeMode === "exercise" && currentExercise) {
        url += `mode=${currentExercise}`
      } else {
        const mood = therapistToMoodMap[currentMode as keyof typeof therapistToMoodMap] || "Calm"
        url += `mode=${mood}`
      }

      const response = await fetch(url)
      const data = await response.json()
      console.log("Session started:", data)

      if (data.status === "started" || data.status === "running") {
        setSessionActive(true)
      }
    } catch (error) {
      console.error("Failed to start session:", error)
    }
  }

  // API call to stop session
  const stopSession = async () => {
    try {
      const response = await fetch("/api/stop-session/")
      const data = await response.json()
      console.log("Session stopped:", data)

      if (data.status === "stopped" || data.status === "not_running") {
        setSessionActive(false)
      }

      // Fetch the final conversation after stopping
      setTimeout(fetchConversation, 1000)
    } catch (error) {
      console.error("Failed to stop session:", error)
    }
  }

  // Handle circle click (replaces microphone button)
  const handleCircleClick = async () => {
    if (sessionActive) {
      await stopSession()
    } else {
      await startSession()
    }
    toggleListening()
  }

  // Toggle conversation popup
  const toggleConversation = () => {
    if (!showConversation) {
      fetchConversation()
    }
    setShowConversation(!showConversation)
  }

  // Handle therapist selection
  const handleMoodSelect = (therapistName: string) => {
    setTherapyMode(therapistName as any)
    setModeMenuOpen(false)
    setActiveMode("mood")
    setCurrentExercise(null)
    setOptionsMenuOpen(false)
  }

  // Start the selected exercise
  const startExercise = (exercise: string) => {
    setCurrentExercise(exercise)
    setExerciseMenuOpen(false)
    setActiveMode("exercise")
    setOptionsMenuOpen(false)
    console.log(`Starting ${exercise} exercise`)
  }

  // Handle message dismissal
  const handleMessageDismiss = () => {
    setIsMessageVisible(false)
  }

  // Handle showing message again
  const handleShowMessage = () => {
    setIsMessageVisible(true)
  }

  // Helper function to extract color values from Tailwind classes
  const getColorValue = (gradientClass: string) => {
    if (activeMode === "exercise" && currentExercise) {
      // Get color based on exercise using the improved colors
      const exerciseColor = exerciseColors[currentExercise as keyof typeof exerciseColors]
      if (exerciseColor) {
        return exerciseColor.gradient
      }
    } else {
      // Get color based on therapist - use lighter colors (reduced opacity)
      if (currentMode === "Lena Shore") return "rgba(37, 99, 235, 0.2), rgba(8, 145, 178, 0.2)"
      if (currentMode === "Theo Hart") return "rgba(217, 119, 6, 0.2), rgba(202, 138, 4, 0.2)"
      if (currentMode === "Evelyn Sage") return "rgba(147, 51, 234, 0.2), rgba(217, 70, 239, 0.2)"
      if (currentMode === "Sam Rivers") return "rgba(220, 38, 38, 0.2), rgba(225, 29, 72, 0.2)"
      if (currentMode === "Isla Moon") return "rgba(202, 138, 4, 0.2), rgba(180, 83, 9, 0.2)"
    }
    return "rgba(37, 99, 235, 0.2), rgba(8, 145, 178, 0.2)" // Default to Lena Shore
  }

  // Custom button style based on hover state
  const getButtonStyle = (isHovered: boolean) => {
    return {
      borderRadius: "9999px",
      padding: "0 1rem",
      height: "44px",
      position: "relative" as const,
      overflow: "hidden",
      transition: "all 0.3s ease",
      color: isHovered ? "#1f2937" : "white", // Text color: gray-800 when hovered, white otherwise
      border: isHovered ? `2px solid ${theme.color}` : "none",
      background: isHovered ? "white" : `linear-gradient(to bottom right, ${getColorValue(theme.primary)})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
    }
  }

  // Custom plus button style
  const getPlusButtonStyle = (isHovered: boolean) => {
    return {
      borderRadius: "9999px",
      width: "44px",
      height: "44px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative" as const,
      overflow: "hidden",
      transition: "all 0.3s ease",
      color: isHovered ? "#1f2937" : "white",
      border: isHovered ? `2px solid ${theme.color}` : "none",
      background: isHovered ? "white" : `linear-gradient(to bottom right, ${getColorValue(theme.primary)})`,
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-gray-800 relative transition-colors duration-700">
      {/* Background gradient based on theme */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-white to-gray-50 opacity-98 transition-colors duration-700`}
      >
        <div
          className={`absolute inset-0 bg-gradient-radial ${theme.primary} opacity-5 transition-colors duration-700`}
        ></div>
      </div>

      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-800 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>

      {/* Top right plus button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
          onMouseEnter={() => setIsPlusButtonHovered(true)}
          onMouseLeave={() => setIsPlusButtonHovered(false)}
          style={{
            ...getPlusButtonStyle(isPlusButtonHovered),
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            width: "40px",
            height: "40px",
          }}
          aria-label="Options menu"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Show message button (only visible when message is hidden) */}
      {!isMessageVisible && displayedMessages.length > 0 && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleShowMessage}
            onMouseEnter={() => setIsShowMessageButtonHovered(true)}
            onMouseLeave={() => setIsShowMessageButtonHovered(false)}
            style={getButtonStyle(isShowMessageButtonHovered)}
            aria-label="Show message"
          >
            <Eye className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">Show Message</span>
          </button>
        </div>
      )}

      {/* Conditional layout based on message visibility */}
      {isMessageVisible ? (
        <>
          {/* Top section with circle when message is visible */}
          <div className="flex flex-col items-center pt-16 z-10">
            <TherapyCircle
              theme={theme}
              isListening={sessionActive}
              isAiSpeaking={isAiSpeaking}
              onClick={handleCircleClick}
            />
          </div>

          {/* Conversation display area */}
          <div className="w-full max-w-2xl mx-auto flex-grow px-4 py-4 z-10 mt-2 flex items-center justify-center">
            <div className="relative w-full h-[35vh] flex items-center justify-center">
              {displayedMessages.length > 0 ? (
                <MessageDisplay messages={displayedMessages} theme={theme} onDismiss={handleMessageDismiss} />
              ) : (
                <div className="text-center py-6 text-gray-400 bg-white/40 backdrop-blur-sm shadow-sm p-6 rounded-lg w-full border border-gray-100">
                  <p className="text-sm font-medium">No conversation yet</p>
                  <p className="text-xs mt-1 text-gray-300">Tap the circle to start talking</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Center section with large circle when message is hidden */
        <div className="flex-grow flex items-center justify-center z-10">
          <div className="transform scale-[2.5] transition-all duration-700">
            <TherapyCircle
              theme={theme}
              isListening={sessionActive}
              isAiSpeaking={isAiSpeaking}
              onClick={handleCircleClick}
            />
          </div>
        </div>
      )}

      {/* Bottom section with buttons */}
      <div className="w-full max-w-2xl mx-auto pb-6 px-4 z-10 flex justify-center mt-[-20px]">
        <button
          onClick={toggleConversation}
          onMouseEnter={() => setIsConversationButtonHovered(true)}
          onMouseLeave={() => setIsConversationButtonHovered(false)}
          style={{
            ...getButtonStyle(isConversationButtonHovered),
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            height: "40px",
            minWidth: "40px",
          }}
          className="font-medium"
          aria-label={showConversation ? "Hide conversation history" : "Show conversation history"}
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only md:not-sr-only text-sm">{showConversation ? "Hide" : "History"}</span>
        </button>
      </div>

      {/* Options menu popup */}
      {optionsMenuOpen && (
        <OptionsMenu
          activeMode={activeMode}
          currentMode={currentMode}
          currentExercise={currentExercise}
          theme={theme}
          therapists={therapists}
          exerciseTypes={exerciseTypes}
          onModeMenuOpen={() => setModeMenuOpen(true)}
          onExerciseMenuOpen={() => setExerciseMenuOpen(true)}
          onJournalOpen={() => setJournalOpen(true)}
          onStressBallOpen={() => {
            setStressBallOpen(true)
            setOptionsMenuOpen(false)
          }}
        />
      )}

      {/* Therapist selector popup */}
      {modeMenuOpen && (
        <TherapistSelector
          therapists={therapists}
          currentMode={currentMode}
          activeMode={activeMode}
          onSelect={handleMoodSelect}
          onClose={() => setModeMenuOpen(false)}
          onTherapistHover={setShowTherapistProfile}
          showTherapistProfile={showTherapistProfile}
        />
      )}

      {/* Exercise selector popup */}
      {exerciseMenuOpen && (
        <ExerciseSelector
          exerciseTypes={exerciseTypes}
          currentExercise={currentExercise}
          activeMode={activeMode}
          onSelect={startExercise}
          onClose={() => setExerciseMenuOpen(false)}
        />
      )}

      {/* Conversation Popup (full history) */}
      {showConversation && (
        <ConversationHistory conversation={conversation} theme={theme} onClose={toggleConversation} />
      )}

      {/* Journal Popup */}
      {journalOpen && <JournalEditor onClose={() => setJournalOpen(false)} onSave={() => setJournalOpen(false)} />}

      {/* Stress Ball Component */}
      {stressBallOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <StressBall onClose={() => setStressBallOpen(false)} theme={theme} />
        </div>
      )}
    </main>
  )
}

