"use client";

import { useRef, useEffect, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { motion } from "framer-motion";
import { FaPlay, FaPause, FaDownload } from "react-icons/fa";

interface AudioVisualizerProps {
  audioUrl: string;
  onEnded: () => void;
}

const AudioVisualizer = ({ audioUrl, onEnded }: AudioVisualizerProps) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    // Destroy previous instance
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    // Create new WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#8b5cf6",
      progressColor: "#4f46e5",
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 3,
      height: 80,
      normalize: true,
    });

    // Load audio
    wavesurfer.load(audioUrl);

    // Set up event listeners
    wavesurfer.on("ready", () => {
      setIsLoaded(true);
    });

    wavesurfer.on("finish", () => {
      setIsPlaying(false);
      onEnded();
    });

    // Save to ref
    wavesurferRef.current = wavesurfer;

    // Cleanup
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audioUrl, onEnded]);

  const togglePlayPause = () => {
    if (!wavesurferRef.current) return;

    if (isPlaying) {
      wavesurferRef.current.pause();
    } else {
      wavesurferRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const downloadAudio = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "podcast.mp3";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-black/50 backdrop-blur-md p-6 rounded-xl border border-purple-500/30 shadow-xl relative z-50"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white mb-2">Audio Preview</h3>
      </div>

      <div
        ref={waveformRef}
        className="w-full rounded-lg overflow-hidden mb-4"
      />

      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={togglePlayPause}
          disabled={!isLoaded}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={downloadAudio}
          className="flex-1 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center"
        >
          <FaDownload className="mr-2" /> Download
        </motion.button>
      </div>
    </motion.div>
  );
};

export default AudioVisualizer;
