"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Frown, Meh, Smile, ArrowRight } from "lucide-react"

interface MoodCheckInProps {
  onComplete: () => void
}

export function MoodCheckIn({ onComplete }: MoodCheckInProps) {
  const [moodValue, setMoodValue] = useState(50)
  const [step, setStep] = useState(1)

  const getMoodIcon = () => {
    if (moodValue < 30) return <Frown className="h-12 w-12 text-red-400" />
    if (moodValue < 60) return <Meh className="h-12 w-12 text-yellow-400" />
    return <Smile className="h-12 w-12 text-green-400" />
  }

  const getMoodText = () => {
    if (moodValue < 30) return "Not so great"
    if (moodValue < 60) return "Okay"
    if (moodValue < 80) return "Good"
    return "Great"
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else {
      onComplete()
    }
  }

  return (
    <Card className="border-none bg-secondary/30 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">
          {step === 1 ? "How are you feeling today?" : "What would you like to focus on?"}
        </CardTitle>
        <CardDescription>
          {step === 1
            ? "This helps SoulSpeak personalize your experience"
            : "Select the areas you'd like to work on today"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {step === 1 ? (
          <>
            <div className="flex flex-col items-center justify-center space-y-4">
              {getMoodIcon()}
              <h3 className="text-lg font-medium">{getMoodText()}</h3>
            </div>

            <div className="px-4">
              <Slider
                value={[moodValue]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => setMoodValue(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Not great</span>
                <span>Great</span>
              </div>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["Anxiety", "Stress", "Sleep", "Mood", "Focus", "Relationships"].map((focus) => (
              <Button key={focus} variant="outline" className="justify-start h-auto py-3 px-4 border-secondary">
                {focus}
              </Button>
            ))}
          </div>
        )}

        <div className="flex justify-center pt-4">
          <Button onClick={handleNext} className="group">
            {step === 1 ? "Next" : "Start Session"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

