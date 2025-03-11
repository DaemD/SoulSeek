"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Move, Trash, Undo, RefreshCw } from "lucide-react"
import type { JournalImage, DoodlePath } from "@/types/therapy"

interface JournalEditorProps {
  onClose: () => void
  onSave: () => void
}

export function JournalEditor({ onClose, onSave }: JournalEditorProps) {
  const [journalContent, setJournalContent] = useState("")
  const [journalTitle, setJournalTitle] = useState("")
  const [journalStyle, setJournalStyle] = useState("notebook")
  const [journalFont, setJournalFont] = useState("handwritten")
  const [journalMood, setJournalMood] = useState("neutral")
  const [journalWeather, setJournalWeather] = useState("sunny")
  const [showJournalCustomizer, setShowJournalCustomizer] = useState(false)

  // States for photo and doodle functionality
  const [journalImages, setJournalImages] = useState<JournalImage[]>([])
  const [isMovingImage, setIsMovingImage] = useState<string | null>(null)

  // Doodling-related states
  const [isDoodlingMode, setIsDoodlingMode] = useState(false)
  const [currentPath, setCurrentPath] = useState<DoodlePath | null>(null)
  const [doodlePaths, setDoodlePaths] = useState<DoodlePath[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [doodleColor, setDoodleColor] = useState("#000000")
  const [doodleWidth, setDoodleWidth] = useState(2)
  const [showDoodleTools, setShowDoodleTools] = useState(false)

  // State to control journal open status (assuming it's needed for the useEffect)
  const [journalOpen, setJournalOpen] = useState(true) // Or false, depending on initial state

  // Refs
  const journalContentRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Save journal entry
  const saveJournal = () => {
    console.log("Saving journal:", {
      title: journalTitle,
      content: journalContent,
      images: journalImages,
      doodlePaths: doodlePaths,
    })
    // Here you would add logic to save the journal to your backend
    onSave()
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

  // Toggle doodling mode
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

  // Mouse event handlers for doodling
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

  // Undo last doodle path
  const handleUndo = () => {
    if (doodlePaths.length === 0) return
    setDoodlePaths(doodlePaths.slice(0, -1))
  }

  // Clear all doodles
  const handleClearDoodles = () => {
    setDoodlePaths([])
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
  }, [journalOpen, journalContentRef.current, doodlePaths])

  return (
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
              onClick={onClose}
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

        {/* Doodle tools section */}
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

        {/* Journal content area */}
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
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTIwLDIwIEMzMCwxNSA0MCwyMCA0MCw0MCBDMjAsNDAgMTUsMzAgMjAsMjAiIHN0cm9rZT0iIzA2OTY4MiIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBzdHJva2Utb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20"></div>
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
  )
}

