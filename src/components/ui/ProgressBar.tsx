"use client";

import React, { forwardRef } from "react";
import * as Progress from "@radix-ui/react-progress";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ProgressVariant = "default" | "striped" | "indeterminate";
type ProgressSize = "sm" | "md" | "lg";
type ProgressColor = "primary" | "success" | "error" | "warning";

interface ProgressBarProps {
  value?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  color?: ProgressColor;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const sizeClasses: Record<ProgressSize, string> = {
  sm: "h-1",
  md: "h-2.5",
  lg: "h-4",
};

const colorClasses: Record<ProgressColor, string> = {
  primary: "bg-blue-600",
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
};

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value = 0,
      variant = "default",
      size = "md",
      color = "primary",
      label,
      showValue = false,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const clampedValue = Math.min(100, Math.max(0, value));
    const isIndeterminate = variant === "indeterminate";

    return (
      <div ref={ref} className={cn("w-full", className)}>
        {(label || showValue) && (
          <div className="mb-1.5 flex items-center justify-between">
            {label && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
              </span>
            )}
            {showValue && !isIndeterminate && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {Math.round(clampedValue)}%
              </span>
            )}
          </div>
        )}

        <Progress.Root
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700",
            sizeClasses[size]
          )}
          value={isIndeterminate ? undefined : clampedValue}
          aria-label={label || "Progress"}
          aria-valuenow={isIndeterminate ? undefined : clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {isIndeterminate ? (
            <motion.div
              className={cn(
                "h-full w-1/3 rounded-full",
                colorClasses[color]
              )}
              animate={
                prefersReducedMotion
                  ? { opacity: [0.5, 1, 0.5] }
                  : { x: ["-100%", "400%"] }
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ) : (
            <Progress.Indicator asChild>
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  colorClasses[color],
                  variant === "striped" && "bg-stripes"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${clampedValue}%` }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0.1 }
                    : { type: "spring", stiffness: 100, damping: 20 }
                }
                style={
                  variant === "striped"
                    ? {
                        backgroundImage:
                          "linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)",
                        backgroundSize: "1rem 1rem",
                        animation: prefersReducedMotion
                          ? undefined
                          : "stripe-slide 0.6s linear infinite",
                      }
                    : undefined
                }
              />
            </Progress.Indicator>
          )}
        </Progress.Root>

        <style jsx global>{`
          @keyframes stripe-slide {
            0% {
              background-position: 1rem 0;
            }
            100% {
              background-position: 0 0;
            }
          }
        `}</style>
      </div>
    );
  }
);

ProgressBar.displayName = "ProgressBar";

export { ProgressBar, type ProgressBarProps };
