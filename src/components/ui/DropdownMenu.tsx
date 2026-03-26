"use client";

import React, { forwardRef } from "react";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface DropdownMenuSeparator {
  separator: true;
}

type DropdownMenuEntry = DropdownMenuItem | DropdownMenuSeparator;

function isSeparator(
  entry: DropdownMenuEntry
): entry is DropdownMenuSeparator {
  return "separator" in entry && entry.separator === true;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuEntry[];
  align?: "start" | "center" | "end";
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "min-w-[140px] text-xs",
  md: "min-w-[180px] text-sm",
  lg: "min-w-[220px] text-base",
} as const;

const itemSizeStyles = {
  sm: "px-2 py-1",
  md: "px-3 py-2",
  lg: "px-4 py-2.5",
} as const;

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut",
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: { duration: 0.1, ease: "easeIn" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

const DropdownMenu = forwardRef<HTMLButtonElement, DropdownMenuProps>(
  (
    {
      trigger,
      items,
      align = "start",
      animated = true,
      size = "md",
      className,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;
    const [open, setOpen] = React.useState(false);

    return (
      <RadixDropdownMenu.Root open={open} onOpenChange={setOpen}>
        <RadixDropdownMenu.Trigger ref={ref} asChild>
          {trigger}
        </RadixDropdownMenu.Trigger>

        <AnimatePresence>
          {open && (
            <RadixDropdownMenu.Portal forceMount>
              <RadixDropdownMenu.Content
                align={align}
                sideOffset={6}
                asChild
                forceMount
              >
                <motion.div
                  variants={shouldAnimate ? contentVariants : undefined}
                  initial={shouldAnimate ? "hidden" : undefined}
                  animate={shouldAnimate ? "visible" : undefined}
                  exit={shouldAnimate ? "exit" : undefined}
                  className={cn(
                    "z-50 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-surface-dark",
                    sizeStyles[size],
                    className
                  )}
                >
                  {items.map((entry, index) => {
                    if (isSeparator(entry)) {
                      return (
                        <RadixDropdownMenu.Separator
                          key={`sep-${index}`}
                          className="my-1 h-px bg-gray-200 dark:bg-gray-700"
                        />
                      );
                    }

                    const item = entry;
                    const ItemWrapper = shouldAnimate ? motion.div : "div";
                    const itemMotionProps = shouldAnimate
                      ? { variants: itemVariants }
                      : {};

                    return (
                      <ItemWrapper key={`item-${index}`} {...itemMotionProps}>
                        <RadixDropdownMenu.Item
                          disabled={item.disabled}
                          onSelect={item.onClick}
                          className={cn(
                            "flex cursor-pointer select-none items-center gap-2 rounded-md outline-none transition-colors",
                            "text-gray-700 dark:text-gray-200",
                            "hover:bg-gray-100 dark:hover:bg-white/10",
                            "focus-visible:bg-gray-100 dark:focus-visible:bg-white/10",
                            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                            itemSizeStyles[size]
                          )}
                        >
                          {item.icon && (
                            <span
                              className="shrink-0 text-gray-500 dark:text-gray-400"
                              aria-hidden="true"
                            >
                              {item.icon}
                            </span>
                          )}
                          <span>{item.label}</span>
                        </RadixDropdownMenu.Item>
                      </ItemWrapper>
                    );
                  })}
                </motion.div>
              </RadixDropdownMenu.Content>
            </RadixDropdownMenu.Portal>
          )}
        </AnimatePresence>
      </RadixDropdownMenu.Root>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

export {
  DropdownMenu,
  type DropdownMenuProps,
  type DropdownMenuItem,
  type DropdownMenuSeparator,
  type DropdownMenuEntry,
};
