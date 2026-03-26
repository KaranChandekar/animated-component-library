"use client";

import React, { forwardRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SeparatorType = "slash" | "chevron" | "dot";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: SeparatorType;
  animated?: boolean;
  maxItems?: number;
  className?: string;
}

const separatorMap: Record<SeparatorType, React.ReactNode> = {
  slash: <span aria-hidden="true">/</span>,
  chevron: <ChevronRight className="h-4 w-4" aria-hidden="true" />,
  dot: <span aria-hidden="true">&bull;</span>,
};

function getVisibleItems(items: BreadcrumbItem[], maxItems: number) {
  if (items.length <= maxItems) {
    return items.map((item, i) => ({ item, originalIndex: i, isEllipsis: false }));
  }

  const tailCount = maxItems - 1;
  const result: { item: BreadcrumbItem; originalIndex: number; isEllipsis: boolean }[] = [];

  result.push({ item: items[0], originalIndex: 0, isEllipsis: false });
  result.push({ item: { label: "..." }, originalIndex: -1, isEllipsis: true });

  for (let i = items.length - tailCount; i < items.length; i++) {
    result.push({ item: items[i], originalIndex: i, isEllipsis: false });
  }

  return result;
}

const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, separator = "slash", animated = true, maxItems = 5, className }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const visibleItems = getVisibleItems(items, maxItems);

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn("flex", className)}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          {visibleItems.map(({ item, originalIndex, isEllipsis }, idx) => {
            const isLast = idx === visibleItems.length - 1;
            const key = isEllipsis ? "ellipsis" : `${originalIndex}-${item.label}`;

            return (
              <React.Fragment key={key}>
                <motion.li
                  className="flex items-center"
                  initial={shouldAnimate ? { opacity: 0, x: -12 } : undefined}
                  animate={shouldAnimate ? { opacity: 1, x: 0 } : undefined}
                  transition={
                    shouldAnimate
                      ? { delay: idx * 0.08, type: "spring", stiffness: 300, damping: 24 }
                      : undefined
                  }
                >
                  {isEllipsis ? (
                    <span
                      className="text-sm text-gray-400 dark:text-gray-500 px-1 select-none"
                      aria-hidden="true"
                    >
                      &hellip;
                    </span>
                  ) : isLast ? (
                    <span
                      className="text-sm font-medium text-gray-900 dark:text-gray-100"
                      aria-current="page"
                    >
                      {item.label}
                    </span>
                  ) : item.href ? (
                    <a
                      href={item.href}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </span>
                  )}
                </motion.li>

                {!isLast && (
                  <motion.li
                    aria-hidden="true"
                    className="flex items-center text-gray-400 dark:text-gray-500"
                    initial={shouldAnimate ? { opacity: 0 } : undefined}
                    animate={shouldAnimate ? { opacity: 1 } : undefined}
                    transition={
                      shouldAnimate ? { delay: idx * 0.08 + 0.04 } : undefined
                    }
                  >
                    {separatorMap[separator]}
                  </motion.li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

export { Breadcrumb, type BreadcrumbProps, type BreadcrumbItem };
