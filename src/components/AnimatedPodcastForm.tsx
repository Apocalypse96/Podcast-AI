"use client";

import { useState } from "react";
import { PodcastFormData } from "@/types";
import { FaMicrophone, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

interface AnimatedPodcastFormProps {
  onSubmit: (data: PodcastFormData) => void;
  isLoading: boolean;
}

export default function AnimatedPodcastForm({
  onSubmit,
  isLoading,
}: AnimatedPodcastFormProps) {
  const [formData, setFormData] = useState<PodcastFormData>({
    topic: "",
    additionalInfo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)" },
    blur: { scale: 1, boxShadow: "0 0 0px rgba(139, 92, 246, 0)" },
  };

  const buttonVariants = {
    hover: { scale: 1.03, boxShadow: "0 0 20px rgba(139, 92, 246, 0.6)" },
    tap: { scale: 0.97 },
    disabled: { opacity: 0.7 },
  };

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      variants={formVariants}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-black/50 backdrop-blur-lg p-8 rounded-xl border border-purple-500/30 shadow-xl relative z-40"
    >
      <div className="mb-6">
        <label
          htmlFor="topic"
          className="block text-lg font-medium text-gray-200 mb-2"
        >
          Podcast Topic
        </label>
        <motion.input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          placeholder="e.g., The Future of AI, Space Exploration, Climate Change"
          className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
          required
          variants={inputVariants}
          whileFocus="focus"
          initial="blur"
          animate="blur"
        />
      </div>

      <div className="mb-8">
        <label
          htmlFor="additionalInfo"
          className="block text-lg font-medium text-gray-200 mb-2"
        >
          Additional Information (Optional)
        </label>
        <motion.textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Add any specific angles, facts, or points you'd like to include..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
          variants={inputVariants}
          whileFocus="focus"
          initial="blur"
          animate="blur"
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading || !formData.topic.trim()}
        className="w-full flex items-center justify-center py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        variants={buttonVariants}
        whileHover={!isLoading && formData.topic.trim() ? "hover" : "disabled"}
        whileTap={!isLoading && formData.topic.trim() ? "tap" : "disabled"}
        initial="blur"
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Generating...
          </>
        ) : (
          <>
            <FaMicrophone className="mr-2" />
            Generate Podcast
          </>
        )}
      </motion.button>
    </motion.form>
  );
}
