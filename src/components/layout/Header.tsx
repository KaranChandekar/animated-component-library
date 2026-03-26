"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Github, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 border-b",
        "bg-white/80 backdrop-blur-md border-neutral-200",
        "dark:bg-neutral-950/80 dark:border-neutral-800"
      )}
    >
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className={cn(
              "inline-flex md:hidden items-center justify-center rounded-md p-2",
              "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
              "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
              "transition-colors"
            )}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="flex items-center gap-2 select-none">
            <motion.span
              className={cn(
                "text-xl font-bold tracking-tight",
                "bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent",
                "dark:from-violet-400 dark:to-indigo-400"
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              AnimateUI
            </motion.span>
          </Link>
        </div>

        {/* Right: dark mode toggle + GitHub */}
        <div className="flex items-center gap-1">
          <motion.button
            type="button"
            onClick={toggleDarkMode}
            className={cn(
              "inline-flex items-center justify-center rounded-md p-2",
              "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
              "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
              "transition-colors"
            )}
            whileTap={{ scale: 0.9, rotate: 15 }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center justify-center rounded-md p-2",
              "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
              "dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
              "transition-colors"
            )}
            aria-label="GitHub repository"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
