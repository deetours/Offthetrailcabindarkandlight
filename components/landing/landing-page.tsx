"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { SceneDiscoveryHero } from "./scene-discovery-hero"
import { SceneStaysGrid } from "./scene-stays-grid"
import { SceneJourneys } from "./scene-journeys"
import { SceneCafeEditorial } from "./scene-cafe-editorial"
import { SceneReveal } from "./scene-reveal"
import { SceneProof } from "./scene-proof"
import { SceneIndependence } from "./scene-independence"
import { SceneTrust } from "./scene-trust"
import { SceneFAQ } from "./scene-faq"
import { SceneExit } from "./scene-exit"
import { TravellerStories } from "../community/traveller-stories"
import { HighlightsGallery } from "../community/highlights-gallery"
import { PostTripJourney } from "../community/post-trip-journey"
import { Navbar } from "../ui/navbar"
import { FrontendEnquiryModal, EnquiryTab } from "../booking/frontend-enquiry-modal"

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [showNavbar, setShowNavbar] = useState(false)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTab, setModalTab] = useState<EnquiryTab>("stay")
  const [modalLocation, setModalLocation] = useState("")

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const [lastStayId, setLastStayId] = useState<string | null>(null)
  const [lastStayName, setLastStayName] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowNavbar(scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check local storage for abandoned selection
    if (typeof window !== "undefined") {
      const savedId = localStorage.getItem('offthetrail_last_stay_id')
      const savedName = localStorage.getItem('offthetrail_last_stay_name')
      if (savedId && savedName) {
        setLastStayId(savedId)
        setLastStayName(savedName)
      }
    }
  }, [isModalOpen]) // Re-check when modal closes

  const handleOpenModal = (tab: EnquiryTab, locationId?: string) => {
    setModalTab(tab)
    if (locationId) {
      setModalLocation(locationId)
    } else {
      setModalLocation("")
    }
    setIsModalOpen(true)
  }

  return (
    <main 
      ref={containerRef}
      className="grain min-h-screen bg-background relative overflow-x-hidden no-scrollbar"
    >
      <Navbar visible={showNavbar} />
      
      {/* Abandoned Selection Banner */}
      <AnimatePresence>
        {lastStayId && lastStayName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-0 right-0 z-40 px-4 flex justify-center pointer-events-none"
          >
            <button 
              onClick={() => handleOpenModal("stay", lastStayId)}
              className="bg-card/90 backdrop-blur-md border border-border shadow-2xl rounded-full px-6 py-3 flex items-center gap-3 text-sm hover:border-primary transition-colors group pointer-events-auto"
            >
              <span className="text-muted-foreground hidden sm:inline">Continue where you left off:</span>
              <span className="font-serif text-primary">Resume {lastStayName}</span>
              <span className="text-primary group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Traveler's Compass (Innovation Indicator) */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 h-1 bg-primary/30 z-50 origin-[0%]"
        style={{ scaleX }}
      />
      
      <div className="fixed top-1/2 right-4 -translate-y-1/2 flex-col gap-4 z-40 mix-blend-difference hidden md:flex">
        {[...Array(16)].map((_, i) => (
          <motion.div 
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/20"
            style={{ 
              backgroundColor: useTransform(
                scrollYProgress, 
                [i / 16, (i + 1) / 16], 
                ["rgba(255,255,255,0.2)", "#e6b873"]
              ) 
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <SceneDiscoveryHero onOpenModal={handleOpenModal} />
        <SceneStaysGrid onOpenModal={handleOpenModal} />
        <SceneCafeEditorial />
        <SceneJourneys onOpenModal={handleOpenModal} />
        <SceneReveal />
        <SceneProof />
        <SceneIndependence />
        <SceneTrust />
        <TravellerStories />
        <HighlightsGallery />
        <PostTripJourney />
        <SceneFAQ />
        <SceneExit />
      </div>

      <FrontendEnquiryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTab={modalTab}
        initialLocation={modalLocation}
      />
    </main>
  )
}
