"use client";

import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";

const AnimatedLogo = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
        yoyo: Infinity
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-center mb-4">
        <motion.div
          variants={iconVariants}
          whileHover="hover"
          className="relative"
        >
          <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-30 scale-150" />
          <FaMicrophone className="text-6xl text-purple-400 relative z-10" />
        </motion.div>
        
        <motion.h1
          variants={itemVariants}
          className="ml-4 text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400"
        >
          Podcast AI
        </motion.h1>
      </div>
      
      <motion.p
        variants={textVariants}
        className="text-xl text-gray-300 max-w-2xl mx-auto text-center"
      >
        Generate professional podcast scripts and audio with AI.
        <br />
        <span className="text-purple-300">Just enter a topic and let the magic happen.</span>
      </motion.p>
    </motion.div>
  );
};

export default AnimatedLogo;
