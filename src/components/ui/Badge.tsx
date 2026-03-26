"use client";

import React, { forwardRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeVariant = "solid" | "outline" | "subtle";
type BadgeColor = "primary" | "success" | "error" | "warning";
type BadgeSize = "sm" | "md" | "lg";

interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  size?: BadgeSize;
  removable?: boolean;
  onRemove?: () => void;
  children: React.ReactNode;
  animated?: boolean;
  className?: string;
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-1",
  lg: "text-base px-3 py-1.5",
};

const colorConfig: Record<BadgeColor, { solid: string; outline: string; subtle: string }> = {
  primary: {
    solid: "bg-blue-600 text-white",
    outline: "border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400",
    subtle: "bg-blue-600/10 text-blue-600 dark:text-blue-400",
  },
  success: {
    solid: "bg-green-500 text-white",
    outline: "border border-green-500 text-green-600 dark:text-green-400 dark:border-green-400",
    subtle: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  error: {
    solid: "bg-red-500 text-white",
    outline: "border border-red-500 text-red-600 dark:text-red-400 dark:border-red-400",
    subtle: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  warning: {
    solid: "bg-amber-500 text-white",
    outline: "border border-amber-500 text-amber-600 dark:text-amber-400 dark:border-amber-400",
    subtle: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
};

const removeButtonColors: Record<BadgeColor, Record<BadgeVariant, string>> = {
  primary: {
    solid: "hover:bg-blue-700",
    outline: "hover:bg-blue-600/10",
    subtle: "hover:bg-blue-600/20",
  },
  success: {
    solid: "hover:bg-green-600",
    outline: "hover:bg-green-500/10",
    subtle: "hover:bg-green-500/20",
  },
  error: {
    solid: "hover:bg-red-600",
    outline: "hover:bg-red-500/10",
    subtle: "hover:bg-red-500/20",
  },
  warning: {
    solid: "hover:bg-amber-600",
    outline: "hover:bg-amber-500/10",
    subtle: "hover:bg-amber-500/20",
  },
};

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "solid",
      color = "primary",
      size = "md",
      removable = false,
      onRemove,
      children,
      animated = true,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const iconSize = size === "sm" ? "h-3 w-3" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4";

    return (
      <AnimatePresence mode="popLayout">
        <motion.span
          ref={ref}
          className={cn(
            "inline-flex items-center gap-1 rounded-full font-medium leading-none",
            sizeClasses[size],
            colorConfig[color][variant],
            className
          )}
          initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : undefined}
          animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
          exit={
            shouldAnimate
              ? { opacity: 0, scale: 0.8, x: -10, transition: { duration: 0.15 } }
              : undefined
          }
          transition={
            shouldAnimate
              ? { type: "spring", stiffness: 400, damping: 20 }
              : undefined
          }
          layout={shouldAnimate}
          role="status"
        >
          {children}

          {removable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.();
              }}
              className={cn(
                "ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                removeButtonColors[color][variant]
              )}
              aria-label="Remove badge"
            >
              <X className={iconSize} />
            </button>
          )}
        </motion.span>
      </AnimatePresence>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, type BadgeProps };
