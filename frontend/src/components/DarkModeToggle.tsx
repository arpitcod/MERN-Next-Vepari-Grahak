// components/DarkModeToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is enabled in localStorage or system preference
    const isDarkMode = localStorage.getItem("darkMode") === "true" || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches && 
       localStorage.getItem("darkMode") !== "false");
    
    setDarkMode(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className=" p-4 rounded-full bg-gray-300 hover:bg-gray-400 dark:bg-gray-600  dark:hover:bg-gray-700 transition-colors cursor-pointer "
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <MdLightMode className="text-xl text-yellow-500" />
      ) : (
        <MdDarkMode className="text-xl text-gray-700" />
      )}
    </button>
  );
};

export default DarkModeToggle;