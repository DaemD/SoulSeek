"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Volume2, VolumeX, Wind, Zap, Brain, HeartPulse, Moon, ArrowLeft, Settings } from "lucide-react"
import Link from "next/link"
import { AudioVisualizer } from "@/components/audio-visualizer"
import { TherapyMode } from "@/components/therapy-mode"
import { MoodCheckIn } from "@/components/mood-check-in"
import { useTherapySession } from "@/hooks/use-therapy-session"
import { SpeakingUI } from "@/components/speaking-ui"

export default function TherapyPage() {
  const [activeTab, setActiveTab] = useState("session")
  const [showMoodCheck, setShowMoodCheck] = useState(true)

  const {
    isListening,
    isAiSpeaking,
    currentMode,
    toggleListening,
    updateTranscript,
    toggleAiSpeaking,
    setTherapyMode,
    transcript,
    aiResponse,
    sessionHistory,
    generateAiResponse,
  } = useTherapySession()

  // 🔄 API call to start session
  const startSession = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/start-session/")
      const data = await response.json()
      console.log("Session started:", data)
    } catch (error) {
      console.error("Failed to start session:", error)
    }
  }

  // 🔄 API call to stop session
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

  // 🔄 Handle microphone button click
  const handleMicClick = async () => {
    if (isListening) {
      await stopSession() // Stop session if already listening
    } else {
      await startSession() // Start session if not listening
    }
    toggleListening() // Toggle listening state
  }

  const handleMoodCheckComplete = () => {
    setShowMoodCheck(false)
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-background/90">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold gradient-text">SoulSpeak</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {showMoodCheck ? (
          <MoodCheckIn onComplete={handleMoodCheckComplete} />
        ) : (
          <Tabs defaultValue="session" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="session">Session</TabsTrigger>
              <TabsTrigger value="modes">Therapy Modes</TabsTrigger>
            </TabsList>

            <TabsContent value="session" className="space-y-6 mt-6">
              <Card className="border-none bg-secondary/30 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium">{currentMode} Mode</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={toggleAiSpeaking}>
                          {isAiSpeaking ? (
                            <Volume2 className="h-5 w-5 text-purple-400" />
                          ) : (
                            <VolumeX className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="min-h-[200px] space-y-4">
                      {transcript && (
                        <div className="bg-secondary/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground">You</p>
                          <p>{transcript}</p>
                        </div>
                      )}

                      {aiResponse && (
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <p className="text-sm text-purple-400">SoulSpeak</p>
                          <p>{aiResponse}</p>
                        </div>
                      )}

                      {!transcript && !aiResponse && (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground text-center">
                            Tap the microphone and start speaking to begin your session
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div
                        className={`relative transition-all duration-500 ${isListening ? "scale-110" : "scale-100"}`}
                      >
                        <AudioVisualizer isActive={isListening} />

                        {/* 🔄 Updated Button Click Logic */}
                        <Button
                          size="lg"
                          className={`relative mt-6 rounded-full w-16 h-16 transition-all duration-300 ${
                            isListening
                              ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                              : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-600/20"
                          }`}
                          onClick={handleMicClick}
                        >
                          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                        </Button>
                      </div>

                      {isListening && (
                        <div className="text-sm text-muted-foreground animate-pulse">
                          Tap again when you're done speaking
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modes" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TherapyMode
                  title="Calm"
                  description="Grounding techniques and mindfulness exercises"
                  icon={<Wind className="h-8 w-8 text-blue-400" />}
                  isActive={currentMode === "Calm"}
                  onClick={() => setTherapyMode("Calm")}
                />

                <TherapyMode
                  title="Motivation"
                  description="Positive affirmations and goal-setting prompts"
                  icon={<Zap className="h-8 w-8 text-yellow-400" />}
                  isActive={currentMode === "Motivation"}
                  onClick={() => setTherapyMode("Motivation")}
                />

                <TherapyMode
                  title="Reflection"
                  description="Guided reflection on thoughts and emotions"
                  icon={<Brain className="h-8 w-8 text-purple-400" />}
                  isActive={currentMode === "Reflection"}
                  onClick={() => setTherapyMode("Reflection")}
                />

                <TherapyMode
                  title="Crisis"
                  description="Immediate support and grounding techniques"
                  icon={<HeartPulse className="h-8 w-8 text-red-400" />}
                  isActive={currentMode === "Crisis"}
                  onClick={() => setTherapyMode("Crisis")}
                />

                <TherapyMode
                  title="Sleep"
                  description="Bedtime stories and relaxation techniques"
                  icon={<Moon className="h-8 w-8 text-indigo-400" />}
                  isActive={currentMode === "Sleep"}
                  onClick={() => setTherapyMode("Sleep")}
                  className="md:col-span-2 md:max-w-md md:mx-auto"
                />
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <SpeakingUI isListening={isListening} transcript={transcript} onStopListening={handleMicClick} />
    </main>
  )
}

