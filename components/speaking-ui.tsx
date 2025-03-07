"use client"

import { Mic, Square, X } from "lucide-react"
import { AudioVisualizer } from "./audio-visualizer"
import { Button } from "@/components/ui/button"

interface SpeakingUIProps {
  isListening: boolean
  transcript: string
  onStopListening: () => void
}

export function SpeakingUI({ isListening, transcript, onStopListening }: SpeakingUIProps) {
  if (!isListening) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn">
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onStopListening}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-secondary/30 rounded-2xl p-8 shadow-xl border border-primary/20 animate-scaleIn">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/5 animate-pulse"></div>
              <div className="speaking-indicator">
                <Mic className="h-12 w-12 text-primary" />
              </div>
            </div>

            <AudioVisualizer isActive={true} />

            <div className="text-center space-y-2">
              <h3 className="text-xl font-medium gradient-text">Listening to you...</h3>
              <p className="text-muted-foreground text-sm">Speak clearly and I'll respond when you're done</p>
            </div>

            {transcript && (
              <div className="w-full bg-secondary/50 rounded-lg p-4 mt-4 animate-fadeIn">
                <p className="text-sm text-muted-foreground mb-1">I heard:</p>
                <p className="text-foreground">{transcript}</p>
              </div>
            )}

            <Button
              size="lg"
              variant="destructive"
              className="mt-4 rounded-full px-8 shadow-lg shadow-destructive/20"
              onClick={onStopListening}
            >
              <Square className="h-4 w-4 mr-2 fill-current" /> Stop Recording
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

