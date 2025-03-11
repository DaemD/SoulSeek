import type { ExerciseTheme } from "@/types/therapy"

// Exercise types with their details - completely new color palette
export const exerciseTypes: Record<string, ExerciseTheme> = {
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

