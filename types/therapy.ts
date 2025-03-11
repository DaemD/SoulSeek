// Define types for therapist and exercise themes
export type TherapistTheme = {
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
  
  export type ExerciseTheme = {
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
  
  // Define a type for journal images
  export type JournalImage = {
    id: string
    src: string
    width: number
    height: number
    x: number
    y: number
  }
  
  // Type for freehand drawing
  export type DoodlePath = {
    id: string
    points: { x: number; y: number }[]
    color: string
    width: number
  }
  
  