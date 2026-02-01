"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from "lucide-react"
import React, { useCallback, useEffect, useState } from "react"

interface Slide {
  id: string
  title: string
  content: React.ReactNode
}

interface PresentationModeProps {
  slides: Slide[]
  onClose: () => void
  initialSlideId?: string
}

export function PresentationMode({ slides, onClose, initialSlideId }: PresentationModeProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(() => {
    const index = slides.findIndex((s) => s.id === initialSlideId)
    return index !== -1 ? index : 0
  })
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") nextSlide()
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [nextSlide, prevSlide, onClose])

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-primary">SLIDE {currentSlideIndex + 1} / {slides.length}</span>
          <h2 className="font-bold hidden sm:block">{currentSlide.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-md hover:bg-secondary transition-colors"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 md:p-12 lg:p-16 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="min-h-[60vh]"
            >
              {currentSlide.content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 flex items-center justify-center gap-4 border-t border-border bg-card/50 backdrop-blur">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full border border-border bg-background hover:bg-secondary transition-colors disabled:opacity-50"
          disabled={currentSlideIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlideIndex(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                i === currentSlideIndex ? "w-6 bg-primary" : "bg-muted hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full border border-border bg-background hover:bg-secondary transition-colors disabled:opacity-50"
          disabled={currentSlideIndex === slides.length - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
