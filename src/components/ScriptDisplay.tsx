"use client";

import { FaPlay, FaPause, FaSpinner, FaDownload } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

interface ScriptDisplayProps {
  script: string;
  audioUrl: string | null;
  isGeneratingAudio: boolean;
  onGenerateAudio: () => void;
}

export default function ScriptDisplay({
  script,
  audioUrl,
  isGeneratingAudio,
  onGenerateAudio,
}: ScriptDisplayProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "podcast.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 bg-black/30 backdrop-blur-lg p-6 rounded-xl border border-gray-700 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Your Podcast Script</h2>
        <div className="bg-gray-900 p-4 rounded-lg max-h-[400px] overflow-y-auto">
          <div className="prose prose-invert max-w-none">
            {script.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {!audioUrl && !isGeneratingAudio ? (
          <button
            onClick={onGenerateAudio}
            className="w-full sm:w-auto py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            Generate Audio
          </button>
        ) : isGeneratingAudio ? (
          <div className="flex items-center text-white">
            <FaSpinner className="animate-spin mr-2" />
            Generating audio...
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <audio ref={audioRef} onEnded={handleAudioEnded} className="hidden" />
            <button
              onClick={togglePlayPause}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isPlaying ? (
                <>
                  <FaPause className="mr-2" /> Pause
                </>
              ) : (
                <>
                  <FaPlay className="mr-2" /> Play
                </>
              )}
            </button>
            <button
              onClick={downloadAudio}
              className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
