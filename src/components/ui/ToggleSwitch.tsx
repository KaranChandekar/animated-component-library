"use client";

import React, { forwardRef, useId } from "react";
import * as RadixSwitch from "@radix-ui/react-switch";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type ToggleSwitchColor = "primary" | "success" | "error";

interface ToggleSwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  color?: ToggleSwitchColor;
  label?: string;
  className?: string;
}

const sizeConfig = {
  sm: {
    root: "w-8 h-4",
    thumb: "h-3 w-3",
    translate: 16,
  },
  md: {
    root: "w-11 h-6",
    thumb: "h-5 w-5",
    translate: 20,
  },
  lg: {
    root: "w-14 h-7",
    thumb: "h-6 w-6",
    translate: 28,
  },
} as const;

const colorConfig = {
  primary: "bg-primary",
  success: "bg-success",
  error: "bg-error",
} as const;

const ToggleSwitch = forwardRef<HTMLButtonElement, ToggleSwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      size = "md",
      disabled = false,
      color = "primary",
      label,
      className,
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = `toggle-switch-${generatedId}`;
    const prefersReducedMotion = useReducedMotion();
    const config = sizeConfig[size];

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <RadixSwitch.Root
          ref={ref}
          id={switchId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={cn(
            "relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-surface-dark",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "bg-gray-300 dark:bg-gray-600",
            config.root
          )}
          style={{
            backgroundColor:
              checked !== undefined
                ? checked
                  ? undefined
                  : undefined
                : undefined,
          }}
          aria-label={label || undefined}
        >
          <span
            className={cn(
              "absolute inset-0 rounded-full transition-colors duration-200",
              checked ? colorConfig[color] : "bg-gray-300 dark:bg-gray-600"
            )}
            aria-hidden="true"
          />
          <RadixSwitch.Thumb asChild>
            <motion.span
              className={cn(
                "relative block rounded-full bg-white shadow-sm",
                config.thumb
              )}
              layout
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }
              }
              style={{
                marginLeft: checked ? config.translate : 0,
              }}
              animate={{
                marginLeft: checked ? config.translate : 0,
              }}
            />
          </RadixSwitch.Thumb>
        </RadixSwitch.Root>

        {label && (
          <label
            htmlFor={switchId}
            className={cn(
              "select-none text-sm text-gray-700 dark:text-gray-200",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";

export { ToggleSwitch, type ToggleSwitchProps, type ToggleSwitchColor };
