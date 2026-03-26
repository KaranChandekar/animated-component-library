"use client";

import React, { forwardRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function generatePages(
  totalPages: number,
  currentPage: number,
  siblingCount: number
): (number | "ellipsis-start" | "ellipsis-end")[] {
  const pages: (number | "ellipsis-start" | "ellipsis-end")[] = [];

  if (totalPages <= (siblingCount * 2 + 5)) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  const leftSiblingStart = Math.max(currentPage - siblingCount, 2);
  const rightSiblingEnd = Math.min(currentPage + siblingCount, totalPages - 1);

  const showLeftEllipsis = leftSiblingStart > 2;
  const showRightEllipsis = rightSiblingEnd < totalPages - 1;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis-start");
  } else {
    for (let i = 2; i < leftSiblingStart; i++) pages.push(i);
  }

  for (let i = leftSiblingStart; i <= rightSiblingEnd; i++) {
    pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("ellipsis-end");
  } else {
    for (let i = rightSiblingEnd + 1; i < totalPages; i++) pages.push(i);
  }

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  ({ totalPages, currentPage, onChange, siblingCount = 1, className }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = !prefersReducedMotion;

    const pages = generatePages(totalPages, currentPage, siblingCount);

    const isFirstPage = currentPage <= 1;
    const isLastPage = currentPage >= totalPages;

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft" && !isFirstPage) {
          e.preventDefault();
          onChange(currentPage - 1);
        } else if (e.key === "ArrowRight" && !isLastPage) {
          e.preventDefault();
          onChange(currentPage + 1);
        }
      },
      [currentPage, isFirstPage, isLastPage, onChange]
    );

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("flex items-center justify-center", className)}
        onKeyDown={handleKeyDown}
      >
        <ul className="flex items-center gap-1">
          {/* Previous button */}
          <li>
            <button
              type="button"
              onClick={() => !isFirstPage && onChange(currentPage - 1)}
              disabled={isFirstPage}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isFirstPage
                  ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>

          {/* Page numbers */}
          <AnimatePresence mode="popLayout">
            {pages.map((page) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <li key={page}>
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none"
                      aria-hidden="true"
                    >
                      &hellip;
                    </span>
                  </li>
                );
              }

              const isActive = page === currentPage;

              return (
                <li key={page}>
                  <motion.button
                    type="button"
                    onClick={() => onChange(page)}
                    className={cn(
                      "relative inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    aria-label={`Page ${page}`}
                    aria-current={isActive ? "page" : undefined}
                    layout={shouldAnimate}
                    initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : undefined}
                    animate={shouldAnimate ? { opacity: 1, scale: 1 } : undefined}
                    exit={shouldAnimate ? { opacity: 0, scale: 0.8 } : undefined}
                    transition={
                      shouldAnimate
                        ? { type: "spring", stiffness: 350, damping: 25 }
                        : undefined
                    }
                  >
                    {/* Active background indicator */}
                    {isActive && (
                      <motion.span
                        className="absolute inset-0 rounded-md bg-blue-600"
                        layoutId={shouldAnimate ? "active-page" : undefined}
                        transition={
                          shouldAnimate
                            ? { type: "spring", stiffness: 350, damping: 30 }
                            : undefined
                        }
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{page}</span>
                  </motion.button>
                </li>
              );
            })}
          </AnimatePresence>

          {/* Next button */}
          <li>
            <button
              type="button"
              onClick={() => !isLastPage && onChange(currentPage + 1)}
              disabled={isLastPage}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                isLastPage
                  ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </li>
        </ul>
      </nav>
    );
  }
);

Pagination.displayName = "Pagination";

export { Pagination, type PaginationProps };
