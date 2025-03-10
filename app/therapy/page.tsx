"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, X, Move, Trash, Undo, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useTherapySession } from "@/hooks/use-therapy-session"
import { StressBall } from "@/components/stress-ball"

// Define types for therapist and exercise themes
type TherapistTheme = {
  primary: string
  secondary: string
  inner: string
  border: string
  text: string
  hover: string
  bg: string
  solidBg: string
  hoverDark: string
  emoji: string
  description: string
  color: string
  fullDescription: {
    persona: string
    bio: string
    specialty: string
    style: string
  }
}

type ExerciseTheme = {
  emoji: string
  description: string
  primary: string
  secondary: string
  inner: string
  border: string
  text: string
  hover: string
  bg: string
  solidBg: string
  hoverDark: string
  color: string
}

// Therapist profiles with their details and color themes
const therapists = {
  "Lena Shore": {
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
    description: "The Grounded Guide",
    color: "rgb(59, 130, 246)", // Blue-500
    fullDescription: {
      persona:
        "A warm, gentle therapist with a voice like ocean waves, Lena specializes in mindfulness and grounding. She believes in the power of presence and acceptance, helping you feel anchored when emotions surge.",
      bio: "Hey there, I'm Lena. I'm glad you've chosen to spend this time together. Let's start with a few deep breaths and settle into the present moment. It's okay to feel what you're feeling—I'm here to help you find your center.",
      specialty: "Mindfulness, grounding techniques, and acceptance.",
      style: "Calm, slow, and soothing with gentle prompts to help you focus on the now.",
    },
  },
  "Theo Hart": {
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
    description: "The Motivator",
    color: "rgb(245, 158, 11)", // Amber-500
    fullDescription: {
      persona:
        "An upbeat and encouraging therapist with an infectious enthusiasm. Theo's sessions are like a pep talk from a trusted friend who believes in you wholeheartedly.",
      bio: "Hey! I'm Theo, and I'm so excited to chat with you. I believe in you and everything you're capable of achieving. Let's talk about what's on your mind—I know you've got this!",
      specialty: "Positive affirmations, motivation, and goal-setting.",
      style: "High-energy, supportive, and forward-focused.",
    },
  },
  "Evelyn Sage": {
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
    description: "The Reflective Listener",
    color: "rgb(168, 85, 247)", // Purple-500
    fullDescription: {
      persona:
        "A thoughtful and curious therapist who asks the right questions to help you uncover deeper insights. Evelyn's presence feels like a warm library with a cozy chair and time to reflect.",
      bio: "Hi, I'm Evelyn. It's so good to connect with you. I'd love to hear what's been on your mind lately—no rush, take your time. Let's explore your thoughts together and see where they lead.",
      specialty: "Deep self-reflection, thoughtful questioning, and pattern recognition.",
      style: "Inquisitive, non-judgmental, and validating.",
    },
  },
  "Sam Rivers": {
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
    description: "The Crisis Companion",
    color: "rgb(239, 68, 68)", // Red-500
    fullDescription: {
      persona:
        "A calm and steady therapist who is unflinching in the face of intense emotions. Sam's voice is a lifeline when things feel overwhelming, offering immediate support and reassurance.",
      bio: "Hey, I'm Sam. I'm right here with you. I know things are really hard right now, but you're not alone. Take a breath with me if you can—we'll take this one step at a time.",
      specialty: "Crisis management, grounding techniques, and active listening.",
      style: "Steady, reassuring, and focused on safety.",
    },
  },
  "Isla Moon": {
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
    description: "The Sleep Whisperer",
    color: "rgb(234, 179, 8)", // Yellow-500
    fullDescription: {
      persona:
        "A tranquil therapist with a voice like a lullaby. Isla's goal is to help you unwind and drift off with soft, melodic guidance and comforting imagery.",
      bio: "Hi there, I'm Isla. It's time to let go of today's worries and relax. Imagine a warm blanket wrapping around you as you take a slow, deep breath. I'll be here, guiding you gently.",
      specialty: "Relaxation techniques, sleep preparation, and calming imagery.",
      style: "Slow, soft, and melodic with lots of pauses.",
    },
  },
}

// Exercise types with their details - completely new color palette
const exerciseTypes = {
  Breathing: {
    emoji: "🫁",
    description: "Deep breathing techniques",
    primary: "from-teal-600/30 to-cyan-600/30",
    secondary: "from-teal-500/20 to-cyan-500/20",
    inner: "from-teal-400/30 to-cyan-400/30",
    border: "border-teal-500",
    text: "text-teal-500",
    hover: "hover:bg-teal-100",
    bg: "bg-teal-50",
    solidBg: "bg-teal-500",
    hoverDark: "hover:bg-teal-200",
    color: "rgb(20, 184, 166)", // Teal-500
  },
  Meditation: {
    emoji: "🧘",
    description: "Guided meditation sessions",
    primary: "from-indigo-600/30 to-violet-600/30",
    secondary: "from-indigo-500/20 to-violet-500/20",
    inner: "from-indigo-400/30 to-violet-400/30",
    border: "border-indigo-500",
    text: "text-indigo-500",
    hover: "hover:bg-indigo-100",
    bg: "bg-indigo-50",
    solidBg: "bg-indigo-500",
    hoverDark: "hover:bg-indigo-200",
    color: "rgb(99, 102, 241)", // Indigo-500
  },
  Gratitude: {
    emoji: "📝",
    description: "Positve reflection pratice",
    primary: "from-pink-600/30 to-rose-600/30",
    secondary: "from-pink-500/20 to-rose-500/20",
    inner: "from-pink-400/30 to-rose-400/30",
    border: "border-pink-500",
    text: "text-pink-500",
    hover: "hover:bg-pink-100",
    bg: "bg-pink-50",
    solidBg: "bg-pink-500",
    hoverDark: "hover:bg-pink-200",
    color: "rgb(236, 72, 153)", // Pink-500
  },
  Visualization: {
    emoji: "🌈",
    description: "Guided imagery exercises",
    primary: "from-lime-600/30 to-green-600/30",
    secondary: "from-lime-500/20 to-green-500/20",
    inner: "from-lime-400/30 to-green-400/30",
    border: "border-lime-500",
    text: "text-lime-500",
    hover: "hover:bg-lime-100",
    bg: "bg-lime-50",
    solidBg: "bg-lime-500",
    hoverDark: "hover:bg-lime-200",
    color: "rgb(132, 204, 22)", // Lime-500
  },
  Grounding: {
    emoji: "🌱",
    description: "5-4-3-2-1 sensory techniques",
    primary: "from-emerald-600/30 to-green-600/30",
    secondary: "from-emerald-500/20 to-green-500/20",
    inner: "from-emerald-400/30 to-green-400/30",
    border: "border-emerald-500",
    text: "text-emerald-500",
    hover: "hover:bg-emerald-100",
    bg: "bg-emerald-50",
    solidBg: "bg-emerald-500",
    hoverDark: "hover:bg-emerald-200",
    color: "rgb(16, 185, 129)", // Emerald-500
  },
  // Add Journalling as a new exercise type
  Journalling: {
    emoji: "✏️",
    description: "Expressive writing practice",
    primary: "from-orange-600/30 to-amber-600/30",
    secondary: "from-orange-500/20 to-amber-500/20",
    inner: "from-orange-400/30 to-amber-400/30",
    border: "border-orange-500",
    text: "text-orange-500",
    hover: "hover:bg-orange-100",
    bg: "bg-orange-50",
    solidBg: "bg-orange-500",
    hoverDark: "hover:bg-orange-200",
    color: "rgb(249, 115, 22)", // Orange-500
  },
}

// Define a type for journal images
type JournalImage = {
  id: string
  src: string
  width: number
  height: number
  x: number
  y: number
}

// Replace the DoodleLine type with a more appropriate type for freehand drawing
type DoodlePath = {
  id: string
  points: { x: number; y: number }[]
  color: string
  width: number
}

export default function TherapyPage() {
  // Add a mapping from therapist names to their corresponding moods
  const therapistToMoodMap = {
    "Lena Shore": "Calm",
    "Theo Hart": "Motivation",
    "Evelyn Sage": "Reflection",
    "Sam Rivers": "Crisis",
    "Isla Moon": "Sleep",
  }

  // Add a new state variable for the stress ball near the other state variables (around line 100)
  const [stressBallOpen, setStressBallOpen] = useState(false)

  // Add a new state for the journal popup
  const [journalOpen, setJournalOpen] = useState(false)
  const [journalContent, setJournalContent] = useState("")
  const [journalTitle, setJournalTitle] = useState("")
  const [showConversation, setShowConversation] = useState(false)
  const [modeMenuOpen, setModeMenuOpen] = useState(false)
  const [exerciseMenuOpen, setExerciseMenuOpen] = useState(false)
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false) // New state for the options menu
  const [currentExercise, setCurrentExercise] = useState<string | null>(null)
  const [activeMode, setActiveMode] = useState<"mood" | "exercise">("mood") // Track which mode is active
  const circleRef = useRef<HTMLDivElement>(null)
  const [theme, setTheme] = useState<TherapistTheme | ExerciseTheme>(
    therapists["Lena Shore" as keyof typeof therapists],
  )
  const [conversation, setConversation] = useState<string[]>([])
  const [isConversationButtonHovered, setIsConversationButtonHovered] = useState(false)
  const [isCloseButtonHovered, setIsCloseButtonHovered] = useState(false)
  const [isExerciseButtonHovered, setIsExerciseButtonHovered] = useState(false)
  const [hoveredExercise, setHoveredExercise] = useState<string | null>(null)
  const [isPlusButtonHovered, setIsPlusButtonHovered] = useState(false) // New state for plus button hover
  const [journalStyle, setJournalStyle] = useState("notebook")
  const [journalFont, setJournalFont] = useState("handwritten")
  const [journalMood, setJournalMood] = useState("neutral")
  const [journalWeather, setJournalWeather] = useState("sunny")
  const [showJournalCustomizer, setShowJournalCustomizer] = useState(false)
  const [showTherapistProfile, setShowTherapistProfile] = useState<string | null>(null)

  // New states for photo and doodle functionality
  const [journalImages, setJournalImages] = useState<JournalImage[]>([])
  const [isMovingImage, setIsMovingImage] = useState<string | null>(null)

  // Replace the doodling-related states with these:
  const [isDoodlingMode, setIsDoodlingMode] = useState(false)
  const [currentPath, setCurrentPath] = useState<DoodlePath | null>(null)
  const [doodlePaths, setDoodlePaths] = useState<DoodlePath[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [doodleColor, setDoodleColor] = useState("#000000")
  const [doodleWidth, setDoodleWidth] = useState(2)
  const [showDoodleTools, setShowDoodleTools] = useState(false)

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const journalContentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    isListening,
    isAiSpeaking,
    currentMode,
    toggleListening,
    updateTranscript,
    generateAiResponse,
    setTherapyMode,
  } = useTherapySession()

  // Update theme when mode or exercise changes
  useEffect(() => {
    if (activeMode === "mood") {
      // Use therapist theme
      setTheme(therapists[currentMode as keyof typeof therapists])
    } else {
      // Use exercise theme
      if (currentExercise) {
        // Add type assertion to tell TypeScript this is okay
        setTheme(exerciseTypes[currentExercise as keyof typeof exerciseTypes] as ExerciseTheme)
      }
    }
  }, [currentMode, currentExercise, activeMode])

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
      // Determine which mode is active and send the appropriate parameter
      let url = "http://localhost:8000/api/start-session/?"

      if (activeMode === "mood") {
        // Map the therapist name to the corresponding mood
        const mood = therapistToMoodMap[currentMode as keyof typeof therapistToMoodMap] || "Calm"
        url += `type=mood&mode=${mood}`
      } else if (activeMode === "exercise" && currentExercise) {
        url += `type=exercise&mode=${currentExercise}`
      } else {
        // Default to mood if no exercise is selected
        const mood = therapistToMoodMap[currentMode as keyof typeof therapistToMoodMap] || "Calm"
        url += `type=mood&mode=${mood}`
      }

      const response = await fetch(url)
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

  // Toggle options menu
  const toggleOptionsMenu = () => {
    setOptionsMenuOpen(!optionsMenuOpen)
  }

  // Handle therapist selection
  const handleMoodSelect = (therapistName: string) => {
    setTherapyMode(therapistName as any)
    setModeMenuOpen(false)
    setActiveMode("mood")
    setCurrentExercise(null) // Clear exercise when therapist is selected
    setOptionsMenuOpen(false) // Close options menu
  }

  // Start the selected exercise
  const startExercise = (exercise: string) => {
    setCurrentExercise(exercise)
    setExerciseMenuOpen(false)
    setActiveMode("exercise")
    setOptionsMenuOpen(false) // Close options menu
    // Here you would add logic to start the specific exercise
    console.log(`Starting ${exercise} exercise`)
  }

  // Add a function to handle opening the journal
  const openJournal = () => {
    setJournalOpen(true)
    setOptionsMenuOpen(false) // Close the options menu
  }

  // Update the saveJournal function to use the new doodlePaths state
  const saveJournal = () => {
    console.log("Saving journal:", {
      title: journalTitle,
      content: journalContent,
      images: journalImages,
      doodlePaths: doodlePaths,
    })
    // Here you would add logic to save the journal to your backend
    // For now, we'll just log it and close the journal
    setJournalOpen(false)
    setJournalTitle("")
    setJournalContent("")
    setJournalImages([])
    setDoodlePaths([])
    setIsDoodlingMode(false)
    setShowDoodleTools(false)
  }

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        const target = event.target as FileReader
        if (target && target.result) {
          // Create a new image element to get dimensions
          const img = new window.Image()
          img.onload = () => {
            // Calculate dimensions to fit within journal
            const maxWidth = 300
            const maxHeight = 200
            let width = img.width
            let height = img.height

            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }

            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }

            // Add the image to the journal
            const newImage: JournalImage = {
              id: `img-${Date.now()}`,
              src: target.result as string,
              width,
              height,
              x: 50, // Default position
              y: 50,
            }

            setJournalImages([...journalImages, newImage])
          }

          img.src = target.result as string
        }
      }

      reader.readAsDataURL(file)
    }
  }

  // Handle image movement
  const handleImageMouseDown = (id: string) => {
    setIsMovingImage(id)
  }

  const handleImageMouseMove = (e: React.MouseEvent, id: string) => {
    if (isMovingImage !== id) return

    setJournalImages(
      journalImages.map((img) => {
        if (img.id === id) {
          return {
            ...img,
            x: img.x + e.movementX,
            y: img.y + e.movementY,
          }
        }
        return img
      }),
    )
  }

  const handleImageMouseUp = () => {
    setIsMovingImage(null)
  }

  // Handle image deletion
  const deleteImage = (id: string) => {
    setJournalImages(journalImages.filter((img) => img.id !== id))
  }

  // Replace the toggleDoodlingMode function with this:
  const toggleDoodlingMode = () => {
    const newMode = !isDoodlingMode
    setIsDoodlingMode(newMode)
    setShowDoodleTools(newMode)

    if (!newMode) {
      // Stop drawing if we're exiting doodle mode
      setIsDrawing(false)
      setCurrentPath(null)
    }
  }

  // Replace the handleJournalClick function with these mouse event handlers:
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isDoodlingMode || !journalContentRef.current) return

    const rect = journalContentRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Start a new path regardless of previous state
    setIsDrawing(true)
    setCurrentPath({
      id: `path-${Date.now()}`,
      points: [{ x, y }],
      color: doodleColor,
      width: doodleWidth,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDoodlingMode || !isDrawing || !currentPath || !journalContentRef.current) return

    const rect = journalContentRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Only add the point if it's within the journal content area
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      // Add point to the current path
      setCurrentPath({
        ...currentPath,
        points: [...currentPath.points, { x, y }],
      })
    }
  }

  const handleMouseUp = () => {
    if (!isDoodlingMode || !isDrawing || !currentPath) return

    // Save the current path if it has at least 2 points
    if (currentPath.points.length > 1) {
      setDoodlePaths([...doodlePaths, currentPath])
    }

    // Reset current path and drawing state
    setCurrentPath(null)
    setIsDrawing(false)
  }

  // Replace the handleUndo function with this:
  const handleUndo = () => {
    if (doodlePaths.length === 0) return

    // Remove the last path
    setDoodlePaths(doodlePaths.slice(0, -1))
  }

  // Replace the handleClearDoodles function with this:
  const handleClearDoodles = () => {
    setDoodlePaths([])
  }

  // Helper function to extract color values from Tailwind classes
  const getColorValue = (gradientClass: string) => {
    if (activeMode === "exercise" && currentExercise) {
      // Get color based on exercise
      if (currentExercise === "Breathing") return "rgba(20, 184, 166, 0.3), rgba(8, 145, 178, 0.3)" // Teal
      if (currentExercise === "Meditation") return "rgba(99, 102, 241, 0.3), rgba(139, 92, 246, 0.3)" // Indigo
      if (currentExercise === "Journalling") return "rgba(249, 115, 22, 0.3), rgba(245, 158, 11, 0.3)" // Orange
      if (currentExercise === "Visualization") return "rgba(132, 204, 22, 0.3), rgba(34, 197, 94, 0.3)" // Lime
      if (currentExercise === "Grounding") return "rgba(16, 185, 129, 0.3), rgba(34, 197, 94, 0.3)" // Emerald
    } else {
      // Get color based on therapist
      if (currentMode === "Lena Shore") return "rgba(37, 99, 235, 0.3), rgba(8, 145, 178, 0.3)"
      if (currentMode === "Theo Hart") return "rgba(217, 119, 6, 0.3), rgba(202, 138, 4, 0.3)"
      if (currentMode === "Evelyn Sage") return "rgba(147, 51, 234, 0.3), rgba(217, 70, 239, 0.3)"
      if (currentMode === "Sam Rivers") return "rgba(220, 38, 38, 0.3), rgba(225, 29, 72, 0.3)"
      if (currentMode === "Isla Moon") return "rgba(202, 138, 4, 0.3), rgba(180, 83, 9, 0.3)"
    }
    return "rgba(37, 99, 235, 0.3), rgba(8, 145, 178, 0.3)" // Default to Lena Shore
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

  // Update SVG viewBox when journal content size changes
  useEffect(() => {
    if (journalOpen && journalContentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        // Force a re-render to update the SVG viewBox
        setDoodlePaths([...doodlePaths])
      })

      resizeObserver.observe(journalContentRef.current)

      return () => {
        if (journalContentRef.current) {
          resizeObserver.unobserve(journalContentRef.current)
        }
      }
    }
  }, [journalOpen, doodlePaths])

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

      {/* Top right plus button */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleOptionsMenu}
          onMouseEnter={() => setIsPlusButtonHovered(true)}
          onMouseLeave={() => setIsPlusButtonHovered(false)}
          style={getPlusButtonStyle(isPlusButtonHovered)}
          aria-label="Options menu"
        >
          <Plus className="h-5 w-5" />
        </button>
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

      {/* Options menu popup */}
      {optionsMenuOpen && (
        <div className="fixed right-6 top-16 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg w-64 animate-scaleIn overflow-hidden">
            {/* Therapist selector button */}
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start px-4 py-3 transition-colors duration-300 
                ${activeMode === "mood" ? theme.border + " " + theme.text + " " + theme.hover : "text-gray-600 hover:bg-gray-100"}
                ${activeMode === "exercise" ? "opacity-70" : ""}
              `}
              onClick={() => setModeMenuOpen(true)}
            >
              <span className="mr-2">{therapists[currentMode as keyof typeof therapists]?.emoji || "👤"}</span>{" "}
              {currentMode}
            </Button>

            {/* Exercise selector button */}
            <Button
              variant="ghost"
              size="sm"
              className={`w-full justify-start px-4 py-3 transition-colors duration-300 
                ${
                  activeMode === "exercise" && currentExercise
                    ? exerciseTypes[currentExercise as keyof typeof exerciseTypes].border +
                      " " +
                      exerciseTypes[currentExercise as keyof typeof exerciseTypes].text +
                      " " +
                      exerciseTypes[currentExercise as keyof typeof exerciseTypes].hover
                    : "text-gray-600 hover:bg-gray-100"
                }
                ${activeMode === "mood" ? "opacity-70" : ""}
              `}
              onClick={() => setExerciseMenuOpen(true)}
            >
              <span className="mr-2">
                {currentExercise ? exerciseTypes[currentExercise as keyof typeof exerciseTypes].emoji : "🏋️"}
              </span>
              {currentExercise ? `${currentExercise} Exercise` : "Select Exercise"}
            </Button>

            {/* Journalling button - opens journal directly */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-3 transition-colors duration-300 text-gray-600 hover:bg-gray-100"
              onClick={openJournal}
            >
              <span className="mr-2">{exerciseTypes.Journalling.emoji}</span> Journalling
            </Button>

            {/* Stress Ball button */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-3 transition-colors duration-300 text-gray-600 hover:bg-gray-100"
              onClick={() => {
                setStressBallOpen(true)
                setOptionsMenuOpen(false)
              }}
            >
              <span className="mr-2">🧠</span> Stress Ball
            </Button>
          </div>
        </div>
      )}

      {/* Therapist selector popup */}
      {modeMenuOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full animate-scaleIn p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-800">Select Therapist</h3>
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
              {Object.entries(therapists).map(([therapistName, theme]) => {
                const isActive = currentMode === therapistName && activeMode === "mood"
                return (
                  <Button
                    key={therapistName}
                    variant="ghost"
                    className={`
                      w-full justify-start py-3 text-gray-700 
                      ${isActive ? theme.bg + " " + theme.text : ""}
                      ${isActive ? theme.hoverDark : theme.hover}
                      relative
                    `}
                    onClick={() => handleMoodSelect(therapistName)}
                    onMouseEnter={() => setShowTherapistProfile(therapistName)}
                    onMouseLeave={() => setShowTherapistProfile(null)}
                  >
                    <span className="mr-3 text-lg">{theme.emoji}</span> {therapistName}
                    <span className="ml-auto text-xs text-gray-400">{theme.description}</span>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Therapist profile popup */}
          {showTherapistProfile && (
            <div
              className="absolute bg-white rounded-xl shadow-lg p-5 max-w-sm animate-fadeIn"
              style={{
                left: "calc(50% + 220px)",
                top: "50%",
                transform: "translateY(-50%)",
                borderLeft: `4px solid ${therapists[showTherapistProfile as keyof typeof therapists].color}`,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${therapists[showTherapistProfile as keyof typeof therapists].bg}`}
                >
                  <span className="text-2xl">{therapists[showTherapistProfile as keyof typeof therapists].emoji}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">{showTherapistProfile}</h3>
                  <p className={`text-sm ${therapists[showTherapistProfile as keyof typeof therapists].text}`}>
                    {therapists[showTherapistProfile as keyof typeof therapists].description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <p className="italic text-gray-600">
                  "{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.persona}"
                </p>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="mb-2">
                    {therapists[showTherapistProfile as keyof typeof therapists].fullDescription.bio}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="font-semibold text-xs text-gray-500 mb-1">Specialty</p>
                    <p>{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.specialty}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-xs text-gray-500 mb-1">Style</p>
                    <p>{therapists[showTherapistProfile as keyof typeof therapists].fullDescription.style}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Exercise selector popup */}
      {exerciseMenuOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-md w-full animate-scaleIn p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-gray-800">Select Exercise</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setExerciseMenuOpen(false)}
                className="text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-2 mb-4">
              {Object.entries(exerciseTypes).map(([exercise, details]) => {
                const isActive = currentExercise === exercise && activeMode === "exercise"
                const isHovered = hoveredExercise === exercise

                // Determine background color based on hover/active state
                let bgColor = "bg-white"
                if (isActive) bgColor = details.bg
                if (isHovered && !isActive) bgColor = `${details.bg} opacity-50`

                return (
                  <Button
                    key={exercise}
                    variant="ghost"
                    className={`
                      w-full justify-start py-3 text-gray-700 
                      ${isActive ? details.text : ""}
                      ${isActive ? details.hoverDark : details.hover}
                      ${bgColor}
                      transition-colors duration-200
                    `}
                    onClick={() => startExercise(exercise)}
                    onMouseEnter={() => setHoveredExercise(exercise)}
                    onMouseLeave={() => setHoveredExercise(null)}
                  >
                    <span className="mr-3 text-lg">{details.emoji}</span> {exercise}
                    <span className="ml-auto text-xs text-gray-400">{details.description}</span>
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

      {/* Journal Popup */}
      {journalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scaleIn shadow-xl">
            {/* Journal header with decorative elements */}
            <div
              className={`relative ${journalStyle === "notebook" ? "bg-orange-50" : journalStyle === "modern" ? "bg-slate-50" : journalStyle === "vintage" ? "bg-amber-100" : "bg-emerald-50"} border-b ${journalStyle === "notebook" ? "border-orange-200" : journalStyle === "modern" ? "border-slate-200" : journalStyle === "vintage" ? "border-amber-300" : "border-emerald-200"} p-4`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${journalStyle === "notebook" ? "from-orange-300 to-amber-300" : journalStyle === "modern" ? "from-slate-300 to-blue-300" : journalStyle === "vintage" ? "from-amber-300 to-yellow-300" : "from-emerald-300 to-teal-300"}`}
              ></div>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={journalTitle}
                    onChange={(e) => setJournalTitle(e.target.value)}
                    placeholder="Journal Entry Title..."
                    className={`w-full bg-transparent border-none text-xl font-medium ${journalStyle === "notebook" ? "text-orange-800 placeholder-orange-300" : journalStyle === "modern" ? "text-slate-800 placeholder-slate-300" : journalStyle === "vintage" ? "text-amber-800 placeholder-amber-400" : "text-emerald-800 placeholder-emerald-300"} focus:outline-none focus:ring-0 ${journalFont === "handwritten" ? "font-journal" : journalFont === "typewriter" ? "font-mono" : journalFont === "elegant" ? "font-serif" : "font-sans"}`}
                  />
                  <div
                    className={`text-sm ${journalStyle === "notebook" ? "text-orange-500" : journalStyle === "modern" ? "text-slate-500" : journalStyle === "vintage" ? "text-amber-600" : "text-emerald-500"} mt-1 flex items-center gap-2`}
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}

                    {/* Weather indicator */}
                    <span className="ml-2">
                      {journalWeather === "sunny" && "☀️"}
                      {journalWeather === "rainy" && "🌧️"}
                      {journalWeather === "cloudy" && "☁️"}
                      {journalWeather === "snowy" && "❄️"}
                    </span>

                    {/* Mood indicator */}
                    <span className="ml-1">
                      {journalMood === "happy" && "😊"}
                      {journalMood === "sad" && "😔"}
                      {journalMood === "neutral" && "😐"}
                      {journalMood === "excited" && "🤩"}
                      {journalMood === "tired" && "😴"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setJournalOpen(false)}
                  className={`${journalStyle === "notebook" ? "text-orange-500 hover:bg-orange-100" : journalStyle === "modern" ? "text-slate-500 hover:bg-slate-100" : journalStyle === "vintage" ? "text-amber-600 hover:bg-amber-200" : "text-emerald-500 hover:bg-emerald-100"}`}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Journal customization toolbar */}
            <div
              className={`p-2 flex items-center gap-2 ${journalStyle === "notebook" ? "bg-orange-100" : journalStyle === "modern" ? "bg-slate-100" : journalStyle === "vintage" ? "bg-amber-200" : "bg-emerald-100"} border-b ${journalStyle === "notebook" ? "border-orange-200" : journalStyle === "modern" ? "border-slate-200" : journalStyle === "vintage" ? "border-amber-300" : "border-emerald-200"}`}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`text-xs rounded-full ${showJournalCustomizer ? "bg-white/50" : ""}`}
                onClick={() => setShowJournalCustomizer(!showJournalCustomizer)}
              >
                {showJournalCustomizer ? "Hide Options" : "Customize Journal"}
              </Button>

              {/* Quick mood selectors */}
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setJournalMood("happy")}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${journalMood === "happy" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                >
                  😊
                </button>
                <button
                  onClick={() => setJournalMood("sad")}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${journalMood === "sad" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                >
                  😔
                </button>
                <button
                  onClick={() => setJournalMood("excited")}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${journalMood === "excited" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                >
                  🤩
                </button>
                <button
                  onClick={() => setJournalMood("tired")}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${journalMood === "tired" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                >
                  😴
                </button>
              </div>
            </div>

            {/* Expanded customization options */}
            {showJournalCustomizer && (
              <div
                className={`p-3 ${journalStyle === "notebook" ? "bg-orange-50" : journalStyle === "modern" ? "bg-slate-50" : journalStyle === "vintage" ? "bg-amber-50" : "bg-emerald-50"} border-b ${journalStyle === "notebook" ? "border-orange-200" : journalStyle === "modern" ? "border-slate-200" : journalStyle === "vintage" ? "border-amber-300" : "border-emerald-200"} grid grid-cols-2 gap-3`}
              >
                <div>
                  <h4 className="text-xs font-medium mb-2 text-gray-500">Journal Style</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setJournalStyle("notebook")}
                      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 ${journalStyle === "notebook" ? "bg-orange-200 text-orange-800" : "bg-white/70 hover:bg-white"}`}
                    >
                      📓 Notebook
                    </button>
                    <button
                      onClick={() => setJournalStyle("modern")}
                      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 ${journalStyle === "modern" ? "bg-slate-200 text-slate-800" : "bg-white/70 hover:bg-white"}`}
                    >
                      💻 Modern
                    </button>
                    <button
                      onClick={() => setJournalStyle("vintage")}
                      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 ${journalStyle === "vintage" ? "bg-amber-200 text-amber-800" : "bg-white/70 hover:bg-white"}`}
                    >
                      📜 Vintage
                    </button>
                    <button
                      onClick={() => setJournalStyle("nature")}
                      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 ${journalStyle === "nature" ? "bg-emerald-200 text-emerald-800" : "bg-white/70 hover:bg-white"}`}
                    >
                      🌿 Nature
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2 text-gray-500">Font Style</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setJournalFont("handwritten")}
                      className={`px-3 py-1.5 text-xs rounded-full ${journalFont === "handwritten" ? "bg-white/90 shadow-sm font-journal" : "bg-white/50 hover:bg-white/70 font-journal"}`}
                    >
                      Handwritten
                    </button>
                    <button
                      onClick={() => setJournalFont("typewriter")}
                      className={`px-3 py-1.5 text-xs rounded-full font-mono ${journalFont === "typewriter" ? "bg-white/90 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      Typewriter
                    </button>
                    <button
                      onClick={() => setJournalFont("elegant")}
                      className={`px-3 py-1.5 text-xs rounded-full font-serif ${journalFont === "elegant" ? "bg-white/90 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      Elegant
                    </button>
                    <button
                      onClick={() => setJournalFont("modern")}
                      className={`px-3 py-1.5 text-xs rounded-full font-sans ${journalFont === "modern" ? "bg-white/90 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      Modern
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2 text-gray-500">Weather</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setJournalWeather("sunny")}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${journalWeather === "sunny" ? "bg-yellow-100 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      ☀️
                    </button>
                    <button
                      onClick={() => setJournalWeather("rainy")}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${journalWeather === "rainy" ? "bg-blue-100 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      🌧️
                    </button>
                    <button
                      onClick={() => setJournalWeather("cloudy")}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${journalWeather === "cloudy" ? "bg-gray-100 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      ☁️
                    </button>
                    <button
                      onClick={() => setJournalWeather("snowy")}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${journalWeather === "snowy" ? "bg-indigo-50 shadow-sm" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      ❄
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium mb-2 text-gray-500">Add Elements</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs rounded-full bg-white/50 hover:bg-white/70 flex items-center gap-1"
                    >
                      🖼️ Photo
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {/* Replace the "Add Elements" section with this updated Doodle button: */}
                    <button
                      onClick={toggleDoodlingMode}
                      className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1 ${isDoodlingMode ? "bg-white shadow-sm text-blue-600" : "bg-white/50 hover:bg-white/70"}`}
                    >
                      {isDoodlingMode ? "✓ Stop Doodle" : "🎨 Doodle"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Replace the doodle tools section with this: */}
            {showDoodleTools && (
              <div
                className={`p-2 ${journalStyle === "notebook" ? "bg-orange-100" : journalStyle === "modern" ? "bg-slate-100" : journalStyle === "vintage" ? "bg-amber-200" : "bg-emerald-100"} border-b ${journalStyle === "notebook" ? "border-orange-200" : journalStyle === "modern" ? "border-slate-200" : journalStyle === "vintage" ? "border-amber-300" : "border-emerald-200"} flex items-center gap-2`}
              >
                <div className="flex items-center gap-2">
                  <label className="text-xs text-gray-500">Color:</label>
                  <input
                    type="color"
                    value={doodleColor}
                    onChange={(e) => setDoodleColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer"
                  />

                  <label className="text-xs text-gray-500 ml-2">Width:</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={doodleWidth}
                    onChange={(e) => setDoodleWidth(Number.parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>

                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleUndo}
                    className="h-7 w-7 rounded-full"
                    disabled={doodlePaths.length === 0}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClearDoodles}
                    className="h-7 w-7 rounded-full"
                    disabled={doodlePaths.length === 0}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Replace the journal content area with this updated version: */}
            <div
              ref={journalContentRef}
              className={`p-6 ${journalStyle === "notebook" ? "bg-orange-50" : journalStyle === "modern" ? "bg-slate-50" : journalStyle === "vintage" ? "bg-amber-50" : "bg-emerald-50"} min-h-[400px] flex flex-col relative`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isDoodlingMode
                  ? "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'></path></svg>\") 0 24, crosshair"
                  : "text",
              }}
            >
              {/* Decorative lines to make it look like a journal page */}
              <div className="absolute inset-0 pointer-events-none">
                {journalStyle === "notebook" &&
                  Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-px bg-orange-200 opacity-50"
                      style={{ top: `${(i + 1) * 24}px`, position: "absolute" }}
                    ></div>
                  ))}
                {journalStyle === "modern" &&
                  Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-full h-px bg-slate-200 opacity-50"
                      style={{ top: `${(i + 1) * 24}px`, position: "absolute" }}
                    ></div>
                  ))}
                {journalStyle === "vintage" && (
                  <div className="absolute inset-0 bg-amber-100 opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNkOTdmMDYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-30"></div>
                  </div>
                )}
                {journalStyle === "nature" && (
                  <div className="absolute inset-0 bg-emerald-50 opacity-30 pointer-events-none">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwLDIwIEMzMCwxNSA0MCwyMCA0MCw0MCBDMjAsNDAgMTUsMzAgMjAsMjAiIHN0cm9rZT0iIzA2OTY4MiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBzdHJva30iIzA2OTY4MiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
                  </div>
                )}
                {(journalStyle === "notebook" || journalStyle === "modern") && (
                  <div
                    className={`absolute left-[30px] top-0 bottom-0 w-px ${journalStyle === "notebook" ? "bg-orange-300" : "bg-slate-300"} opacity-30`}
                  ></div>
                )}
              </div>

              {/* Uploaded images */}
              {journalImages.map((img) => (
                <div
                  key={img.id}
                  className="absolute cursor-move shadow-md rounded-md overflow-hidden border-2 border-white"
                  style={{
                    width: `${img.width}px`,
                    height: `${img.height}px`,
                    left: `${img.x}px`,
                    top: `${img.y}px`,
                    zIndex: isMovingImage === img.id ? 20 : 5,
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation() // Prevent drawing when interacting with images
                    handleImageMouseDown(img.id)
                  }}
                  onMouseMove={(e) => handleImageMouseMove(e, img.id)}
                  onMouseUp={handleImageMouseUp}
                >
                  <img src={img.src || "/placeholder.svg"} alt="Journal image" className="w-full h-full object-cover" />
                  <button
                    onClick={() => deleteImage(img.id)}
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm"
                  >
                    <Trash className="w-3 h-3 text-red-500" />
                  </button>
                  <button className="absolute top-1 left-1 bg-white/80 hover:bg-white rounded-full p-1 shadow-sm cursor-move">
                    <Move className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              ))}

              {/* Doodle paths */}
              <svg
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: 5, width: "100%", height: "100%" }}
                viewBox={`0 0 ${journalContentRef.current?.clientWidth || 600} ${journalContentRef.current?.clientHeight || 400}`}
                preserveAspectRatio="none"
              >
                {/* Render saved paths */}
                {doodlePaths.map((path) => (
                  <polyline
                    key={path.id}
                    points={path.points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={path.color}
                    strokeWidth={path.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}

                {/* Render current path being drawn */}
                {currentPath && currentPath.points.length > 1 && (
                  <polyline
                    points={currentPath.points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={currentPath.color}
                    strokeWidth={currentPath.width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
              </svg>

              {/* Text area for journal content */}
              <textarea
                value={journalContent}
                onChange={(e) => setJournalContent(e.target.value)}
                placeholder={
                  journalStyle === "vintage"
                    ? "My dearest journal..."
                    : journalStyle === "modern"
                      ? "Note to self..."
                      : journalStyle === "nature"
                        ? "Today in nature..."
                        : "Dear Journal..."
                }
                className={`w-full h-full min-h-[350px] bg-transparent border-none ${
                  journalStyle === "notebook"
                    ? "text-orange-900 placeholder-orange-300"
                    : journalStyle === "modern"
                      ? "text-slate-900 placeholder-slate-300"
                      : journalStyle === "vintage"
                        ? "text-amber-900 placeholder-amber-400"
                        : "text-emerald-900 placeholder-emerald-300"
                } focus:outline-none focus:ring-0 resize-none p-0 ${
                  journalStyle === "notebook" || journalStyle === "modern" ? "pl-[40px]" : "pl-[10px]"
                } leading-6 pt-[6px] ${
                  journalFont === "handwritten"
                    ? "font-journal"
                    : journalFont === "typewriter"
                      ? "font-mono"
                      : journalFont === "elegant"
                        ? "font-serif"
                        : "font-sans"
                }`}
                style={{ lineHeight: "24px", backgroundImage: "none" }}
                disabled={isDoodlingMode}
              ></textarea>
            </div>

            {/* Journal footer with save button */}
            <div
              className={`p-4 border-t ${journalStyle === "notebook" ? "border-orange-200 bg-orange-50" : journalStyle === "modern" ? "border-slate-200 bg-slate-50" : journalStyle === "vintage" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"} flex justify-end`}
            >
              <Button
                onClick={saveJournal}
                className={`${
                  journalStyle === "notebook"
                    ? "bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600"
                    : journalStyle === "modern"
                      ? "bg-gradient-to-r from-slate-400 to-blue-500 hover:from-slate-500 hover:to-blue-600"
                      : journalStyle === "vintage"
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
                        : "bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600"
                } text-white`}
              >
                Save Entry
              </Button>
            </div>

            {/* Decorative elements */}
            <div
              className={`absolute -right-3 -top-3 w-24 h-24 ${journalStyle === "notebook" ? "bg-amber-100" : journalStyle === "modern" ? "bg-blue-100" : journalStyle === "vintage" ? "bg-yellow-100" : "bg-teal-100"} rounded-full opacity-20 blur-xl`}
            ></div>
            <div
              className={`absolute -left-3 -bottom-3 w-20 h-20 ${journalStyle === "notebook" ? "bg-orange-200" : journalStyle === "modern" ? "bg-slate-200" : journalStyle === "vintage" ? "bg-amber-200" : "bg-emerald-200"} rounded-full opacity-20 blur-xl`}
            ></div>
          </div>
        </div>
      )}

      {/* Stress Ball Component */}
      {stressBallOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <StressBall onClose={() => setStressBallOpen(false)} theme={theme} />
        </div>
      )}
    </main>
  )
}

