"use client";

import React, { forwardRef, useState } from "react";
import * as RadixTabs from "@radix-ui/react-tabs";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  LayoutGroup,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  variant?: "underline" | "pills" | "enclosed";
  size?: "sm" | "md" | "lg";
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  animated?: boolean;
  className?: string;
  id?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "text-xs px-2.5 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

const variantListClasses: Record<string, string> = {
  underline: "border-b border-gray-200 dark:border-gray-700 gap-0",
  pills: "bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1",
  enclosed:
    "border-b border-gray-200 dark:border-gray-700 gap-0",
};

const variantTriggerClasses: Record<string, string> = {
  underline:
    "relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 data-[state=active]:text-primary border-b-2 border-transparent -mb-px transition-colors",
  pills:
    "relative rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white data-[state=active]:text-gray-900 dark:data-[state=active]:text-white transition-colors",
  enclosed:
    "relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white border border-transparent data-[state=active]:border-gray-200 data-[state=active]:border-b-white dark:data-[state=active]:border-gray-700 dark:data-[state=active]:border-b-surface-dark rounded-t-md -mb-px transition-colors",
};

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      variant = "underline",
      size = "md",
      tabs,
      defaultValue,
      value,
      onValueChange,
      animated = true,
      className,
      id,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;
    const [internalValue, setInternalValue] = useState(
      defaultValue ?? tabs[0]?.value ?? ""
    );
    const activeValue = value ?? internalValue;

    const handleValueChange = (val: string) => {
      setInternalValue(val);
      onValueChange?.(val);
    };

    const layoutId = id ?? "tabs-indicator";

    return (
      <RadixTabs.Root
        ref={ref}
        value={activeValue}
        onValueChange={handleValueChange}
        className={cn("w-full", className)}
      >
        <LayoutGroup id={layoutId}>
          <RadixTabs.List
            className={cn(
              "flex",
              variantListClasses[variant]
            )}
            aria-label="Tabs"
          >
            {tabs.map((tab) => (
              <RadixTabs.Trigger
                key={tab.value}
                value={tab.value}
                disabled={tab.disabled}
                className={cn(
                  "inline-flex items-center justify-center font-medium whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
                  sizeClasses[size],
                  variantTriggerClasses[variant]
                )}
              >
                <span className="relative z-10">{tab.label}</span>

                {shouldAnimate && activeValue === tab.value && (
                  <>
                    {variant === "underline" && (
                      <motion.div
                        layoutId={`${layoutId}-indicator`}
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                    {variant === "pills" && (
                      <motion.div
                        layoutId={`${layoutId}-indicator`}
                        className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-700"
                        style={{ zIndex: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                    {variant === "enclosed" && (
                      <motion.div
                        layoutId={`${layoutId}-indicator`}
                        className="absolute inset-0 rounded-t-md border border-gray-200 border-b-white bg-white dark:border-gray-700 dark:border-b-surface-dark dark:bg-surface-dark"
                        style={{ zIndex: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                        }}
                      />
                    )}
                  </>
                )}

                {!shouldAnimate && activeValue === tab.value && (
                  <>
                    {variant === "underline" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                    {variant === "pills" && (
                      <div
                        className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-gray-700"
                        style={{ zIndex: 0 }}
                      />
                    )}
                    {variant === "enclosed" && (
                      <div
                        className="absolute inset-0 rounded-t-md border border-gray-200 border-b-white bg-white dark:border-gray-700 dark:border-b-surface-dark dark:bg-surface-dark"
                        style={{ zIndex: 0 }}
                      />
                    )}
                  </>
                )}
              </RadixTabs.Trigger>
            ))}
          </RadixTabs.List>
        </LayoutGroup>

        <div className="mt-4">
          <AnimatePresence mode="wait">
            {tabs.map(
              (tab) =>
                activeValue === tab.value && (
                  <RadixTabs.Content
                    key={tab.value}
                    value={tab.value}
                    forceMount
                    asChild
                  >
                    {shouldAnimate ? (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="focus-visible:outline-none"
                      >
                        {tab.content}
                      </motion.div>
                    ) : (
                      <div className="focus-visible:outline-none">
                        {tab.content}
                      </div>
                    )}
                  </RadixTabs.Content>
                )
            )}
          </AnimatePresence>
        </div>
      </RadixTabs.Root>
    );
  }
);

Tabs.displayName = "Tabs";

export { Tabs, type TabsProps, type TabItem };
