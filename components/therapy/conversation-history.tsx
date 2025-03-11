"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { TherapistTheme, ExerciseTheme } from "@/types/therapy"
import { useState } from "react"

interface ConversationHistoryProps {
  conversation: string[]
  theme: TherapistTheme | ExerciseTheme
  onClose: () => void
}

export function ConversationHistory({ conversation, theme, onClose }: ConversationHistoryProps) {
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false)

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
    const getColorValue = () => {
      // Simplified color extraction for this component
      return "rgba(37, 99, 235, 0.3), rgba(8, 145, 178, 0.3)" // Default blue gradient
    }

    return {
      borderRadius: "9999px",
      padding: "0 1.5rem",
      height: "44px",
      position: "relative" as const,
      overflow: "hidden",
      transition: "all 0.3s ease",
      color: isHovered ? "#1f2937" : "white",
      border: isHovered ? `2px solid ${theme.color}` : "none",
      background: isHovered ? "white" : `linear-gradient(to bottom right, ${getColorValue()})`,
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto animate-scaleIn">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-xl font-medium text-gray-800">Conversation</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 hover:bg-gray-100">
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
            onClick={onClose}
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
  )
}

