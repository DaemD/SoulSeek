import type { TherapistTheme } from "@/types/therapy"

// Therapist profiles with their details and color themes
export const therapists: Record<string, TherapistTheme> = {
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

// Add a mapping from therapist names to their corresponding moods
export const therapistToMoodMap: Record<string, string> = {
  "Lena Shore": "Calm",
  "Theo Hart": "Motivation",
  "Evelyn Sage": "Reflection",
  "Sam Rivers": "Crisis",
  "Isla Moon": "Sleep",
}

