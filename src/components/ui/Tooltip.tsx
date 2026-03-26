"use client";

import React, { forwardRef } from "react";
import * as RadixTooltip from "@radix-ui/react-tooltip";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  animated?: boolean;
  children: React.ReactNode;
  className?: string;
}

const translateMap = {
  top: { initial: { y: 4 }, animate: { y: 0 } },
  bottom: { initial: { y: -4 }, animate: { y: 0 } },
  left: { initial: { x: 4 }, animate: { x: 0 } },
  right: { initial: { x: -4 }, animate: { x: 0 } },
} as const;

const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>(
  (
    {
      content,
      side = "top",
      delay = 200,
      animated = true,
      children,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;
    const [open, setOpen] = React.useState(false);
    const translate = translateMap[side];

    return (
      <RadixTooltip.Provider delayDuration={delay}>
        <RadixTooltip.Root open={open} onOpenChange={setOpen}>
          <RadixTooltip.Trigger ref={ref} asChild>
            {children}
          </RadixTooltip.Trigger>

          <AnimatePresence>
            {open && (
              <RadixTooltip.Portal forceMount>
                <RadixTooltip.Content
                  side={side}
                  sideOffset={6}
                  asChild
                  forceMount
                >
                  <motion.div
                    initial={
                      shouldAnimate
                        ? { opacity: 0, ...translate.initial }
                        : undefined
                    }
                    animate={
                      shouldAnimate
                        ? { opacity: 1, ...translate.animate }
                        : undefined
                    }
                    exit={
                      shouldAnimate
                        ? { opacity: 0, ...translate.initial }
                        : undefined
                    }
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={cn(
                      "z-50 max-w-xs rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white shadow-md dark:bg-gray-100 dark:text-gray-900",
                      className
                    )}
                    role="tooltip"
                  >
                    {content}
                    <RadixTooltip.Arrow className="fill-gray-900 dark:fill-gray-100" />
                  </motion.div>
                </RadixTooltip.Content>
              </RadixTooltip.Portal>
            )}
          </AnimatePresence>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip, type TooltipProps };
