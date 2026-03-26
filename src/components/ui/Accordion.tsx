"use client";

import React, { forwardRef } from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  value: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface AccordionSingleProps {
  type?: "single";
  collapsible?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

interface AccordionMultipleProps {
  type: "multiple";
  collapsible?: boolean;
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
}

type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  items: AccordionItem[];
  animated?: boolean;
  className?: string;
};

const AccordionContent = forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    animated: boolean;
    className?: string;
    forceMount?: true;
  }
>(({ children, animated, className, ...props }, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  if (!shouldAnimate) {
    return (
      <RadixAccordion.Content
        ref={ref}
        className={cn(
          "overflow-hidden text-sm text-gray-600 dark:text-gray-300",
          className
        )}
        {...props}
      >
        <div className="pb-4 pt-0 px-4">{children}</div>
      </RadixAccordion.Content>
    );
  }

  return (
    <RadixAccordion.Content
      ref={ref}
      className="overflow-hidden"
      {...props}
      asChild
      forceMount
    >
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: "auto",
          opacity: 1,
          transition: {
            height: { type: "spring", stiffness: 500, damping: 35 },
            opacity: { duration: 0.2, delay: 0.05 },
          },
        }}
        exit={{
          height: 0,
          opacity: 0,
          transition: {
            height: { type: "spring", stiffness: 500, damping: 35 },
            opacity: { duration: 0.15 },
          },
        }}
        className="text-sm text-gray-600 dark:text-gray-300"
      >
        <div className="pb-4 pt-0 px-4">{children}</div>
      </motion.div>
    </RadixAccordion.Content>
  );
});

AccordionContent.displayName = "AccordionContent";

const AccordionItemComponent = forwardRef<
  HTMLDivElement,
  {
    item: AccordionItem;
    animated: boolean;
    index: number;
  }
>(({ item, animated, index }, ref) => {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.05 },
    },
  };

  const Wrapper = shouldAnimate ? motion.div : "div";
  const wrapperProps = shouldAnimate
    ? {
        variants: itemVariants,
        initial: "hidden",
        animate: "visible",
      }
    : {};

  return (
    <Wrapper {...wrapperProps}>
      <RadixAccordion.Item
        ref={ref}
        value={item.value}
        disabled={item.disabled}
        className="border-b border-gray-200 dark:border-gray-700"
      >
        <RadixAccordion.Header className="flex">
          <RadixAccordion.Trigger
            className={cn(
              "group flex flex-1 items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset dark:text-white dark:hover:bg-white/5",
              item.disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {item.title}
            <motion.div
              className="shrink-0 ml-2"
              animate={{}}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <ChevronDown
                className="h-4 w-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-gray-400"
                aria-hidden="true"
              />
            </motion.div>
          </RadixAccordion.Trigger>
        </RadixAccordion.Header>

        <AnimatePresence initial={false}>
          <AccordionContent animated={animated}>
            {item.content}
          </AccordionContent>
        </AnimatePresence>
      </RadixAccordion.Item>
    </Wrapper>
  );
});

AccordionItemComponent.displayName = "AccordionItemComponent";

const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, animated = true, className, ...props }, ref) => {
    const rootProps =
      props.type === "multiple"
        ? {
            type: "multiple" as const,
            defaultValue: props.defaultValue,
            value: props.value,
            onValueChange: props.onValueChange,
          }
        : {
            type: "single" as const,
            collapsible: props.collapsible ?? true,
            defaultValue: props.defaultValue,
            value: props.value,
            onValueChange: props.onValueChange,
          };

    return (
      <RadixAccordion.Root
        ref={ref}
        className={cn(
          "rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-surface-dark",
          className
        )}
        {...rootProps}
      >
        {items.map((item, index) => (
          <AccordionItemComponent
            key={item.value}
            item={item}
            animated={animated}
            index={index}
          />
        ))}
      </RadixAccordion.Root>
    );
  }
);

Accordion.displayName = "Accordion";

export { Accordion, type AccordionProps, type AccordionItem };
