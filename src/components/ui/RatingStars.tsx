"use client";

import React, { forwardRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type RatingSize = "sm" | "md" | "lg";
type RatingColor = "primary" | "warning";

interface RatingStarsProps {
  value: number;
  onChange?: (value: number) => void;
  size?: RatingSize;
  color?: RatingColor;
  count?: number;
  readOnly?: boolean;
  animated?: boolean;
  className?: string;
}

const sizeClasses: Record<RatingSize, string> = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

const colorClasses: Record<RatingColor, { filled: string; half: string; empty: string }> = {
  primary: {
    filled: "text-blue-500",
    half: "text-blue-500",
    empty: "text-gray-300 dark:text-gray-600",
  },
  warning: {
    filled: "text-amber-400",
    half: "text-amber-400",
    empty: "text-gray-300 dark:text-gray-600",
  },
};

type StarFill = "full" | "half" | "empty";

function getStarFill(starIndex: number, value: number): StarFill {
  if (value >= starIndex + 1) return "full";
  if (value >= starIndex + 0.5) return "half";
  return "empty";
}

const RatingStars = forwardRef<HTMLDivElement, RatingStarsProps>(
  (
    {
      value,
      onChange,
      size = "md",
      color = "warning",
      count = 5,
      readOnly = false,
      animated = true,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleClick = useCallback(
      (starIndex: number) => {
        if (readOnly) return;
        const newValue = starIndex + 1;
        setClickedIndex(starIndex);
        onChange?.(newValue);
        setTimeout(() => setClickedIndex(null), 300);
      },
      [readOnly, onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (readOnly) return;
        let newValue = value;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          newValue = Math.min(value + 1, count);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          newValue = Math.max(value - 1, 0);
        }
        if (newValue !== value) {
          onChange?.(newValue);
        }
      },
      [readOnly, value, count, onChange]
    );

    const colors = colorClasses[color];
    const iconSize = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-0.5", className)}
        role="radiogroup"
        aria-label="Rating"
        tabIndex={readOnly ? undefined : 0}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => !readOnly && setHoverValue(null)}
      >
        {Array.from({ length: count }, (_, i) => {
          const fill = getStarFill(i, displayValue);
          const isClicked = clickedIndex === i;

          return (
            <motion.button
              key={i}
              type="button"
              disabled={readOnly}
              className={cn(
                "relative inline-flex items-center justify-center p-0.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                !readOnly && "cursor-pointer",
                readOnly && "cursor-default"
              )}
              onClick={() => handleClick(i)}
              onMouseEnter={() => !readOnly && setHoverValue(i + 1)}
              role="radio"
              aria-checked={Math.round(value) === i + 1}
              aria-label={`${i + 1} star${i === 0 ? "" : "s"}`}
              animate={
                shouldAnimate && isClicked
                  ? { scale: [1, 1.3, 1] }
                  : { scale: 1 }
              }
              transition={
                shouldAnimate
                  ? { type: "spring", stiffness: 400, damping: 15 }
                  : undefined
              }
              tabIndex={-1}
            >
              {fill === "half" ? (
                <span className="relative">
                  {/* Empty star (background) */}
                  <Star
                    className={cn(iconSize, colors.empty)}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                  {/* Half-filled star (overlay) */}
                  <span
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: "50%" }}
                    aria-hidden="true"
                  >
                    <Star
                      className={cn(iconSize, colors.half)}
                      fill="currentColor"
                    />
                  </span>
                </span>
              ) : (
                <Star
                  className={cn(
                    iconSize,
                    fill === "full" ? colors.filled : colors.empty
                  )}
                  fill={fill === "full" ? "currentColor" : "none"}
                  aria-hidden="true"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }
);

RatingStars.displayName = "RatingStars";

export { RatingStars, type RatingStarsProps };
