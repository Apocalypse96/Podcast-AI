"use client";

import { useState, useEffect } from "react";
import { PodcastFormData, PodcastState } from "@/types";
import { Toaster, toast } from "sonner";
import { motion } from "framer-motion";

// Animated Components
import AnimatedPodcastForm from "@/components/AnimatedPodcastForm";
import AnimatedScriptDisplay from "@/components/AnimatedScriptDisplay";
import AnimatedBackground from "@/components/AnimatedBackground";
import FloatingParticles from "@/components/FloatingParticles";
import AnimatedLogo from "@/components/AnimatedLogo";

export default function Home() {
  const [podcastState, setPodcastState] = useState<PodcastState>({
    script: null,
    audioUrl: null,
    isGeneratingScript: false,
    isGeneratingAudio: false,
    error: null,
  });

  const handleFormSubmit = async (data: PodcastFormData) => {
    try {
      setPodcastState((prev) => ({
        ...prev,
        isGeneratingScript: true,
        script: null,
        audioUrl: null,
        error: null,
      }));

      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate script");
      }

      const { script } = await response.json();

      setPodcastState((prev) => ({
        ...prev,
        script,
        isGeneratingScript: false,
      }));

      toast.success("Script generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      setPodcastState((prev) => ({
        ...prev,
        isGeneratingScript: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
      toast.error("Failed to generate script");
    }
  };

  const handleGenerateAudio = async () => {
    if (!podcastState.script) return;

    try {
      setPodcastState((prev) => ({
        ...prev,
        isGeneratingAudio: true,
        error: null,
      }));

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: podcastState.script }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const { audio, format } = await response.json();

      // Convert base64 to blob URL
      const audioBlob = base64ToBlob(audio, `audio/${format}`);
      const audioUrl = URL.createObjectURL(audioBlob);

      setPodcastState((prev) => ({
        ...prev,
        audioUrl,
        isGeneratingAudio: false,
      }));

      toast.success("Audio generated successfully!");
    } catch (error) {
      console.error("Error:", error);
      setPodcastState((prev) => ({
        ...prev,
        isGeneratingAudio: false,
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      }));
      toast.error("Failed to generate audio");
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  // Page transition animation
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  // Loading state for initial animations
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set loaded after a short delay to allow animations to start
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-hidden relative"
    >
      {/* Background elements - positioned with lower z-index */}
      <AnimatedBackground />
      <FloatingParticles />

      {/* Toast notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(0, 0, 0, 0.8)",
            color: "#fff",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            backdropFilter: "blur(10px)",
            zIndex: 100,
          },
        }}
      />

      {/* Main content container with higher z-index */}
      <div className="container mx-auto px-4 py-12 relative z-30">
        {/* Animated Logo */}
        <AnimatedLogo />

        {/* Content wrapper with spacing to allow background elements to be visible */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative z-30 mt-8"
        >
          {/* Form with proper spacing and z-index */}
          <div className="relative mb-20">
            <AnimatedPodcastForm
              onSubmit={handleFormSubmit}
              isLoading={podcastState.isGeneratingScript}
            />
          </div>

          {/* Error message */}
          {podcastState.error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-16 mb-16 p-4 bg-red-900/50 backdrop-blur-md border border-red-700 rounded-lg text-white max-w-2xl mx-auto relative z-30"
            >
              <p className="font-medium">Error: {podcastState.error}</p>
            </motion.div>
          )}

          {/* Script display with proper spacing */}
          {podcastState.script && (
            <div className="mt-20 relative z-30">
              <AnimatedScriptDisplay
                script={podcastState.script}
                audioUrl={podcastState.audioUrl}
                isGeneratingAudio={podcastState.isGeneratingAudio}
                onGenerateAudio={handleGenerateAudio}
              />
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
