"use client";

import { FaPlay, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";
import AudioVisualizer from "./AudioVisualizer";

interface AnimatedScriptDisplayProps {
  script: string;
  audioUrl: string | null;
  isGeneratingAudio: boolean;
  onGenerateAudio: () => void;
}

export default function AnimatedScriptDisplay({
  script,
  audioUrl,
  isGeneratingAudio,
  onGenerateAudio,
}: AnimatedScriptDisplayProps) {
  const handleAudioEnded = () => {
    // Audio playback ended
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)" },
    tap: { scale: 0.95 },
  };

  // Split script into paragraphs and add staggered animation
  const paragraphs = script.split("\n").filter((p) => p.trim() !== "");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-3xl mx-auto mt-8 bg-black/50 backdrop-blur-lg p-8 rounded-xl border border-purple-500/30 shadow-xl relative z-40"
    >
      <motion.div variants={itemVariants} className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">
          Your Podcast Script
        </h2>
        <div className="bg-gray-900/80 p-6 rounded-lg max-h-[400px] overflow-y-auto">
          <div className="prose prose-invert max-w-none">
            {paragraphs.map((paragraph, index) => (
              <motion.p
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        {!audioUrl && !isGeneratingAudio ? (
          <motion.button
            onClick={onGenerateAudio}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <FaPlay className="mr-2" /> Generate Audio
          </motion.button>
        ) : isGeneratingAudio ? (
          <div className="flex items-center justify-center text-white bg-black/40 p-4 rounded-lg">
            <FaSpinner className="animate-spin mr-2" />
            <span className="text-lg">Generating audio...</span>
          </div>
        ) : (
          <AudioVisualizer
            audioUrl={audioUrl as string}
            onEnded={handleAudioEnded}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
