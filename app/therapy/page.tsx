"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import Link from "next/link"
import { useTherapySession } from "@/hooks/use-therapy-session"

// Color themes for each therapy mode
const modeThemes = {
  Calm: {
    primary: "from-blue-600/30 to-cyan-600/30",
    secondary: "from-blue-500/20 to-cyan-500/20",
    inner: "from-blue-400/30 to-cyan-400/30",
    border: "border-blue-500",
    text: "text-blue-500",
    hover: "hover:bg-blue-100",
    bg: "bg-blue-50",
    solidBg: "bg-blue-500",
    hoverDark: "hover:bg-blue-200",
    emoji: "🌊",
    description: "Grounding & mindfulness",
    color: "rgb(59, 130, 246)", // Blue-500
  },
  Motivation: {
    primary: "from-amber-600/30 to-yellow-600/30",
    secondary: "from-amber-500/20 to-yellow-500/20",
    inner: "from-amber-400/30 to-yellow-400/30",
    border: "border-amber-500",
    text: "text-amber-500",
    hover: "hover:bg-amber-100",
    bg: "bg-amber-50",
    solidBg: "bg-amber-500",
    hoverDark: "hover:bg-amber-200",
    emoji: "⚡",
    description: "Positive affirmations",
    color: "rgb(245, 158, 11)", // Amber-500
  },
  Reflection: {
    primary: "from-purple-600/30 to-fuchsia-600/30",
    secondary: "from-purple-500/20 to-fuchsia-500/20",
    inner: "from-purple-400/30 to-fuchsia-400/30",
    border: "border-purple-500",
    text: "text-purple-500",
    hover: "hover:bg-purple-100",
    bg: "bg-purple-50",
    solidBg: "bg-purple-500",
    hoverDark: "hover:bg-purple-200",
    emoji: "🧠",
    description: "Thought exploration",
    color: "rgb(168, 85, 247)", // Purple-500
  },
  Crisis: {
    primary: "from-red-600/30 to-rose-600/30",
    secondary: "from-red-500/20 to-rose-500/20",
    inner: "from-red-400/30 to-rose-400/30",
    border: "border-red-500",
    text: "text-red-500",
    hover: "hover:bg-red-100",
    bg: "bg-red-50",
    solidBg: "bg-red-500",
    hoverDark: "hover:bg-red-200",
    emoji: "❤️",
    description: "Immediate support",
    color: "rgb(239, 68, 68)", // Red-500
  },
  Sleep: {
    primary: "from-yellow-600/30 to-amber-700/30",
    secondary: "from-yellow-500/20 to-amber-600/20",
    inner: "from-yellow-400/30 to-amber-500/30",
    border: "border-yellow-500",
    text: "text-yellow-500",
    hover: "hover:bg-yellow-100",
    bg: "bg-yellow-50",
    solidBg: "bg-yellow-500",
    hoverDark: "hover:bg-yellow-200",
    emoji: "🌙",
    description: "Relaxation techniques",
    color: "rgb(234, 179, 8)", // Yellow-500
  },
}

export default function TherapyPage() {
  const [showConversation, setShowConversation] = useState(false)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const circleRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState(modeThemes.Calm)
  const [conversation, setConversation] = useState<string[]>([])
  const [isConversationButtonHovered, setIsConversationButtonHovered] = useState(false)
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false)

  const {
    isListening,
    isAiSpeaking,
    currentMode,
    toggleListening,
    updateTranscript,
    generateAiResponse,
    setTherapyMode,
  } = useTherapySession()

  // Update theme when mode changes
  useEffect(() => {
    setTheme(modeThemes[currentMode as keyof typeof modeThemes])
  }, [currentMode])

  // 🟢 Fetch conversation from the backend
  const fetchConversation = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/get-conversation")
      const data = await response.json()
      if (data.conversation) {
        setConversation(data.conversation.split("\n").filter((line: string) => line.trim() !== ""))
      }
    } catch (error) {
      console.error("Failed to fetch conversation:", error)
    }
  }

  // Fetch conversation when the popup opens
  useEffect(() => {
    if (showConversation) {
      fetchConversation()
    }
  }, [showConversation])

  // API call to start session
  const startSession = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/start-session/?mode=${currentMode}`)
      const data = await response.json()
      console.log("Session started:", data)
    } catch (error) {
      console.error("Failed to start session:", error)
    }
  }

  // API call to stop session
  const stopSession = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/stop-session/")
      const data = await response.json()
      console.log("Session stopped:", data)

      // If there's transcript data in the response, use it
      if (data.transcript) {
        updateTranscript(data.transcript)
        generateAiResponse(data.transcript)
      }
    } catch (error) {
      console.error("Failed to stop session:", error)
    }
  }

  // Handle circle click (replaces microphone button)
  const handleCircleClick = async () => {
    if (isListening) {
      await stopSession()
    } else {
      await startSession()
    }
    toggleListening()
  }

  // Toggle conversation popup
  const toggleConversation = () => {
    setShowConversation(!showConversation)
  }

  // Helper function to extract color values from Tailwind classes
  const getColorValue = (gradientClass: string) => {
    if (currentMode === "Calm") return "rgba(37, 99, 235, 0.3), rgba(8, 145, 178, 0.3)"
    if (currentMode === "Motivation") return "rgba(217, 119, 6, 0.3), rgba(202, 138, 4, 0.3)"
    if (currentMode === "Reflection") return "rgba(147, 51, 234, 0.3), rgba(217, 70, 239, 0.3)"
    if (currentMode === "Crisis") return "rgba(220, 38, 38, 0.3), rgba(225, 29, 72, 0.3)"
    if (currentMode === "Sleep") return "rgba(202, 138, 4, 0.3), rgba(180, 83, 9, 0.3)"
    return "rgba(37, 99, 235, 0.3), rgba(8, 145, 178, 0.3)" // Default to Calm
  }

  // Process conversation data for display
  const processedConversation =
    conversation.length > 0
      ? conversation.map((line) => {
          if (line.startsWith("You:")) {
            return { speaker: "You", text: line.substring(4).trim() }
          } else if (line.startsWith("SoulSpeak:")) {
            return { speaker: "SoulSpeak", text: line.substring(10).trim() }
          } else if (line.startsWith("USER:")) {
            return { speaker: "You", text: line.substring(5).trim() }
          } else if (line.startsWith("ASSISTANT:")) {
            return { speaker: "SoulSpeak", text: line.substring(10).trim() }
          } else {
            // If line doesn't have a speaker prefix, assume it's continuing from previous
            return { speaker: "SoulSpeak", text: line.trim() }
          }
        })
      : []

  // Custom button style based on hover state
  const getButtonStyle = (isHovered: boolean) => {
    return {
      borderRadius: "9999px",
      padding: "0 1.5rem",
      height: "44px",
      position: "relative" as const,
      overflow: "hidden",
      transition: "all 0.3s ease",
      color: isHovered ? "#1f2937" : "white", // Text color: gray-800 when hovered, white otherwise
      border: isHovered ? `2px solid ${theme.color}` : "none",
      background: isHovered ? "white" : `linear-gradient(to bottom right, ${getColorValue(theme.primary)})`,
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-800 relative transition-colors duration-700">
      {/* Background gradient based on theme */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-white to-white opacity-90 transition-colors duration-700`}
      >
        <div
          className={`absolute inset-0 bg-gradient-radial ${theme.primary} opacity-10 transition-colors duration-700`}
        ></div>
      </div>

      {/* Back button */}
      <Link href="/" className="absolute top-6 left-6 z-10">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-800 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </Link>

      {/* Mode selector button */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="sm"
          className={`border rounded-full px-4 transition-colors duration-300 ${theme.border} ${theme.text} ${theme.hover}`}
          onClick={() => setModeMenuOpen(true)}
        >
          <span className="mr-2">{theme.emoji}</span> {currentMode} Mode
        </Button>
      </div>

      {/* Vertically stacked elements with proper spacing */}
      <div className="flex flex-col items-center space-y-16 z-10">
        {/* Central circle that animates always and acts as the microphone button */}
        <div className="relative">
          <div
            ref={circleRef}
            onClick={handleCircleClick}
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
            <div
              className={`w-48 h-48 rounded-full bg-gradient-to-br ${theme.secondary} flex items-center justify-center`}
            >
              <div
                className={`w-32 h-32 rounded-full bg-gradient-to-br ${theme.inner} flex items-center justify-center`}
              >
                {/* Status indicator text */}
                <span className={`text-sm font-medium ${theme.text}`}>
                  {isListening ? "Listening..." : "Tap to speak"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Show Conversation button - directly below the circle with more spacing */}
        <button
          onClick={toggleConversation}
          onMouseEnter={() => setIsConversationButtonHovered(true)}
          onMouseLeave={() => setIsConversationButtonHovered(false)}
          style={getButtonStyle(isConversationButtonHovered)}
          className="font-medium"
        >
          Show Conversation
        </button>
      </div>

      {/* Mode selector popup */}
      {modeMenuOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full animate-scaleIn p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-800">Select Therapy Mode</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModeMenuOpen(false)}
                className="text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              {Object.entries(modeThemes).map(([mode, theme]) => {
                const isActive = currentMode === mode
                return (
                  <Button
                    key={mode}
                    variant="ghost"
                    className={`
                      w-full justify-start py-3 text-gray-700 
                      ${isActive ? theme.bg + " " + theme.text : ""}
                      ${isActive ? theme.hoverDark : theme.hover}
                    `}
                    onClick={() => {
                      setTherapyMode(mode as any)
                      setModeMenuOpen(false)
                    }}
                  >
                    <span className="mr-3 text-lg">{theme.emoji}</span> {mode}
                    <span className="ml-auto text-xs text-gray-400">{theme.description}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Conversation Popup */}
      {showConversation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scaleIn">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-xl font-medium text-gray-800">Conversation</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleConversation}
                className="text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              {processedConversation.length > 0 ? (
                processedConversation.map((message, index) => (
                  <div key={index} className={`p-4 rounded-lg ${message.speaker === "You" ? "bg-gray-100" : theme.bg}`}>
                    <p className={`text-sm mb-1 ${message.speaker === "You" ? "text-gray-500" : theme.text}`}>
                      {message.speaker}
                    </p>
                    <p className="text-gray-800">{message.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No conversation history yet.</p>
                  <p className="text-sm mt-2">Start talking to begin your therapy session.</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={toggleConversation}
                onMouseEnter={() => setIsCloseButtonHovered(true)}
                onMouseLeave={() => setIsCloseButtonHovered(false)}
                style={getButtonStyle(isCloseButtonHovered)}
                className="font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

