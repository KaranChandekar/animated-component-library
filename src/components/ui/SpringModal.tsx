"use client";

import React, { forwardRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpringModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  size?: "sm" | "md" | "lg";
  blurBackdrop?: boolean;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 10,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const SpringModal = forwardRef<HTMLDivElement, SpringModalProps>(
  (
    {
      open,
      onOpenChange,
      size = "md",
      blurBackdrop = true,
      title,
      description,
      children,
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const variants = prefersReducedMotion ? reducedMotionVariants : modalVariants;

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className={cn(
                    "fixed inset-0 z-50 bg-black/50",
                    blurBackdrop && "backdrop-blur-sm"
                  )}
                  variants={backdropVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              <Dialog.Content asChild>
                <motion.div
                  ref={ref}
                  className={cn(
                    "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl dark:bg-surface-dark dark:border dark:border-white/10",
                    sizeClasses[size],
                    className
                  )}
                  variants={variants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={title ? "spring-modal-title" : undefined}
                  aria-describedby={
                    description ? "spring-modal-description" : undefined
                  }
                >
                  {title && (
                    <Dialog.Title
                      id="spring-modal-title"
                      className="text-lg font-semibold text-gray-900 dark:text-white"
                    >
                      {title}
                    </Dialog.Title>
                  )}

                  {description && (
                    <Dialog.Description
                      id="spring-modal-description"
                      className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                    >
                      {description}
                    </Dialog.Description>
                  )}

                  <div className={cn(title || description ? "mt-4" : "")}>
                    {children}
                  </div>

                  <Dialog.Close asChild>
                    <button
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:hover:bg-white/10 dark:hover:text-white"
                      aria-label="Close dialog"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    );
  }
);

SpringModal.displayName = "SpringModal";

export { SpringModal, type SpringModalProps };
