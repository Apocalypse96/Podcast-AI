"use client";

import { useState } from "react";
import { PodcastFormData } from "@/types";
import { FaMicrophone, FaSpinner } from "react-icons/fa";

interface PodcastFormProps {
  onSubmit: (data: PodcastFormData) => void;
  isLoading: boolean;
}

export default function PodcastForm({ onSubmit, isLoading }: PodcastFormProps) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-xl"
    >
      <div className="mb-6">
        <label
          htmlFor="topic"
          className="block text-lg font-medium text-gray-200 mb-2"
        >
          Podcast Topic
        </label>
        <input
          type="text"
          id="topic"
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          placeholder="e.g., The Future of AI, Space Exploration, Climate Change"
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
          required
        />
      </div>

      <div className="mb-6">
        <label
          htmlFor="additionalInfo"
          className="block text-lg font-medium text-gray-200 mb-2"
        >
          Additional Information (Optional)
        </label>
        <textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Add any specific angles, facts, or points you'd like to include..."
          rows={4}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.topic.trim()}
        className="w-full flex items-center justify-center py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
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
      </button>
    </form>
  );
}
