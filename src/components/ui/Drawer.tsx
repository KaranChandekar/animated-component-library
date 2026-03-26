"use client";

import React, { forwardRef, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerSide = "left" | "right" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg" | "full";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  size?: DrawerSize;
  overlay?: boolean;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const horizontalSizeClasses: Record<DrawerSize, string> = {
  sm: "w-64",
  md: "w-80",
  lg: "w-96",
  full: "w-screen",
};

const verticalSizeClasses: Record<DrawerSize, string> = {
  sm: "h-1/4",
  md: "h-1/3",
  lg: "h-1/2",
  full: "h-screen",
};

const sidePositionClasses: Record<DrawerSide, string> = {
  left: "inset-y-0 left-0",
  right: "inset-y-0 right-0",
  top: "inset-x-0 top-0",
  bottom: "inset-x-0 bottom-0",
};

const slideVariantsMap = {
  left: {
    hidden: { x: "-100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" as const } },
  },
  right: {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" as const } },
  },
  top: {
    hidden: { y: "-100%" },
    visible: { y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { y: "-100%", transition: { duration: 0.2, ease: "easeIn" as const } },
  },
  bottom: {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    exit: { y: "100%", transition: { duration: 0.2, ease: "easeIn" as const } },
  },
} as const;

const getDragProps = (side: DrawerSide, onClose: () => void) => {
  const isHorizontal = side === "left" || side === "right";
  const drag = isHorizontal ? ("x" as const) : ("y" as const);

  const constraint =
    side === "left"
      ? { dragConstraints: { right: 0 }, dragElastic: { left: 0.5, right: 0 } }
      : side === "right"
        ? { dragConstraints: { left: 0 }, dragElastic: { left: 0, right: 0.5 } }
        : side === "top"
          ? { dragConstraints: { bottom: 0 }, dragElastic: { top: 0.5, bottom: 0 } }
          : { dragConstraints: { top: 0 }, dragElastic: { top: 0, bottom: 0.5 } };

  const threshold = 100;

  return {
    drag,
    ...constraint,
    onDragEnd: (_: unknown, info: { offset: { x: number; y: number } }) => {
      const offset = isHorizontal ? info.offset.x : info.offset.y;
      const shouldClose =
        (side === "left" && offset < -threshold) ||
        (side === "right" && offset > threshold) ||
        (side === "top" && offset < -threshold) ||
        (side === "bottom" && offset > threshold);
      if (shouldClose) onClose();
    },
  };
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onOpenChange,
      side = "right",
      size = "md",
      overlay = true,
      title,
      children,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const isHorizontal = side === "left" || side === "right";
    const sizeClass = isHorizontal
      ? horizontalSizeClasses[size]
      : verticalSizeClasses[size];

    const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

    const slideVariants = prefersReducedMotion
      ? {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.15 } },
          exit: { opacity: 0, transition: { duration: 0.1 } },
        }
      : slideVariantsMap[side];

    const dragProps = prefersReducedMotion ? {} : getDragProps(side, handleClose);

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              {overlay && (
                <Dialog.Overlay asChild>
                  <motion.div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ duration: 0.2 }}
                  />
                </Dialog.Overlay>
              )}

              <Dialog.Content asChild>
                <motion.div
                  ref={ref}
                  className={cn(
                    "fixed z-50 flex flex-col bg-white shadow-2xl dark:bg-surface-dark dark:border dark:border-white/10",
                    sidePositionClasses[side],
                    sizeClass,
                    isHorizontal ? "h-full" : "w-full",
                    className
                  )}
                  variants={slideVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={title ? "drawer-title" : undefined}
                  {...dragProps}
                >
                  <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-white/10">
                    {title ? (
                      <Dialog.Title
                        id="drawer-title"
                        className="text-lg font-semibold text-gray-900 dark:text-white"
                      >
                        {title}
                      </Dialog.Title>
                    ) : (
                      <span />
                    )}

                    <Dialog.Close asChild>
                      <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-white/10 dark:hover:text-white"
                        aria-label="Close drawer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Dialog.Close>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4">{children}</div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    );
  }
);

Drawer.displayName = "Drawer";

export { Drawer, type DrawerProps };
