"use client";

import React, { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type StepperOrientation = "horizontal" | "vertical";

interface StepItem {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: StepItem[];
  activeStep: number;
  orientation?: StepperOrientation;
  animated?: boolean;
  onChange?: (step: number) => void;
  className?: string;
}

type StepStatus = "completed" | "active" | "pending";

function getStepStatus(index: number, activeStep: number): StepStatus {
  if (index < activeStep) return "completed";
  if (index === activeStep) return "active";
  return "pending";
}

const circleVariants = {
  completed: {
    backgroundColor: "rgb(34 197 94)",
    borderColor: "rgb(34 197 94)",
    scale: 1,
  },
  active: {
    backgroundColor: "rgb(59 130 246)",
    borderColor: "rgb(59 130 246)",
    scale: 1,
  },
  pending: {
    backgroundColor: "rgb(229 231 235)",
    borderColor: "rgb(209 213 219)",
    scale: 1,
  },
};

const circleVariantsDark = {
  completed: "bg-green-500 border-green-500",
  active: "bg-blue-500 border-blue-500",
  pending: "bg-gray-700 border-gray-600",
};

const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  ({ steps, activeStep, orientation = "horizontal", animated = true, onChange, className }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const isHorizontal = orientation === "horizontal";

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          isHorizontal ? "flex-row items-start" : "flex-col",
          className
        )}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => {
          const status = getStepStatus(index, activeStep);
          const isLast = index === steps.length - 1;

          return (
            <div
              key={index}
              className={cn(
                "flex",
                isHorizontal
                  ? "flex-1 items-start"
                  : "items-start"
              )}
              role="listitem"
            >
              <div
                className={cn(
                  "flex",
                  isHorizontal ? "flex-col items-center flex-1" : "flex-row items-start"
                )}
              >
                {/* Circle + connector row */}
                <div
                  className={cn(
                    "flex items-center",
                    isHorizontal ? "w-full" : "flex-col"
                  )}
                >
                  {/* Step circle */}
                  <motion.button
                    type="button"
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      status === "completed" && "bg-green-500 border-green-500 text-white",
                      status === "active" && "bg-blue-500 border-blue-500 text-white",
                      status === "pending" && "bg-gray-200 border-gray-300 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
                    )}
                    onClick={() => onChange?.(index)}
                    aria-label={`${step.label}, step ${index + 1} of ${steps.length}, ${status}`}
                    aria-current={status === "active" ? "step" : undefined}
                    initial={shouldAnimate ? { scale: 0, opacity: 0 } : undefined}
                    animate={shouldAnimate ? { scale: 1, opacity: 1 } : undefined}
                    transition={
                      shouldAnimate
                        ? { delay: index * 0.12, type: "spring", stiffness: 400, damping: 20 }
                        : undefined
                    }
                  >
                    {status === "completed" ? (
                      <motion.span
                        initial={shouldAnimate ? { scale: 0 } : undefined}
                        animate={shouldAnimate ? { scale: 1 } : undefined}
                        transition={
                          shouldAnimate
                            ? { type: "spring", stiffness: 500, damping: 15 }
                            : undefined
                        }
                      >
                        <Check className="h-5 w-5" aria-hidden="true" />
                      </motion.span>
                    ) : (
                      index + 1
                    )}

                    {/* Active pulse ring */}
                    {status === "active" && shouldAnimate && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-blue-500"
                        initial={{ scale: 1, opacity: 0.6 }}
                        animate={{ scale: 1.6, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        aria-hidden="true"
                      />
                    )}
                  </motion.button>

                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "relative",
                        isHorizontal ? "flex-1 h-0.5 mx-2 mt-5" : "w-0.5 ml-5 min-h-[3rem]"
                      )}
                    >
                      {/* Background track */}
                      <div
                        className={cn(
                          "absolute bg-gray-200 dark:bg-gray-700",
                          isHorizontal ? "inset-x-0 top-0 h-full" : "inset-y-0 left-0 w-full"
                        )}
                      />
                      {/* Fill */}
                      <motion.div
                        className={cn(
                          "absolute bg-green-500",
                          isHorizontal ? "top-0 left-0 h-full" : "top-0 left-0 w-full"
                        )}
                        initial={
                          shouldAnimate
                            ? isHorizontal
                              ? { width: "0%" }
                              : { height: "0%" }
                            : undefined
                        }
                        animate={
                          shouldAnimate
                            ? isHorizontal
                              ? { width: status === "completed" ? "100%" : "0%" }
                              : { height: status === "completed" ? "100%" : "0%" }
                            : isHorizontal
                              ? { width: status === "completed" ? "100%" : "0%" }
                              : { height: status === "completed" ? "100%" : "0%" }
                        }
                        transition={
                          shouldAnimate
                            ? { delay: index * 0.12 + 0.1, duration: 0.4, ease: "easeInOut" }
                            : { duration: 0 }
                        }
                      />
                    </div>
                  )}
                </div>

                {/* Label + description */}
                <motion.div
                  className={cn(
                    isHorizontal ? "mt-3 text-center" : "ml-4 pb-8",
                    isLast && !isHorizontal && "pb-0"
                  )}
                  initial={shouldAnimate ? { opacity: 0, y: 4 } : undefined}
                  animate={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
                  transition={shouldAnimate ? { delay: index * 0.12 + 0.06 } : undefined}
                >
                  <p
                    className={cn(
                      "text-sm font-medium",
                      status === "completed" && "text-green-600 dark:text-green-400",
                      status === "active" && "text-blue-600 dark:text-blue-400",
                      status === "pending" && "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500 max-w-[10rem]">
                      {step.description}
                    </p>
                  )}
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = "Stepper";

export { Stepper, type StepperProps, type StepItem };
