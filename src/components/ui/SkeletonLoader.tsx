"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "line" | "card" | "avatar" | "text";

interface SkeletonLoaderProps {
  variant?: SkeletonVariant;
  animated?: boolean;
  count?: number;
  className?: string;
}

const shimmerClass =
  "bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer dark:from-gray-700 dark:via-gray-600 dark:to-gray-700";

const staticClass = "bg-gray-200 dark:bg-gray-700";

function SkeletonLine({
  animated,
  className,
}: {
  animated: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-4 w-full rounded",
        animated ? shimmerClass : staticClass,
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  );
}

function SkeletonCard({
  animated,
  className,
}: {
  animated: boolean;
  className?: string;
}) {
  const base = animated ? shimmerClass : staticClass;

  return (
    <div
      className={cn("w-full rounded-lg overflow-hidden", className)}
      role="presentation"
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className={cn("h-32 w-full", base)} />
      {/* Body */}
      <div className="space-y-3 p-4">
        {/* Title */}
        <div className={cn("h-4 w-3/4 rounded", base)} />
        {/* Description lines */}
        <div className={cn("h-3 w-full rounded", base)} />
        <div className={cn("h-3 w-5/6 rounded", base)} />
      </div>
    </div>
  );
}

function SkeletonAvatar({
  animated,
  className,
}: {
  animated: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "h-12 w-12 rounded-full",
        animated ? shimmerClass : staticClass,
        className
      )}
      role="presentation"
      aria-hidden="true"
    />
  );
}

function SkeletonText({
  animated,
  className,
}: {
  animated: boolean;
  className?: string;
}) {
  const base = animated ? shimmerClass : staticClass;
  const widths = ["w-full", "w-11/12", "w-4/5", "w-9/12"];

  return (
    <div
      className={cn("space-y-2.5", className)}
      role="presentation"
      aria-hidden="true"
    >
      {widths.map((w, i) => (
        <div key={i} className={cn("h-3 rounded", w, base)} />
      ))}
    </div>
  );
}

const variantMap = {
  line: SkeletonLine,
  card: SkeletonCard,
  avatar: SkeletonAvatar,
  text: SkeletonText,
} as const;

const SkeletonLoader = forwardRef<HTMLDivElement, SkeletonLoaderProps>(
  ({ variant = "line", animated = true, count = 1, className }, ref) => {
    const clampedCount = Math.min(Math.max(count, 1), 5);
    const Component = variantMap[variant];

    return (
      <div
        ref={ref}
        className={cn("space-y-3", className)}
        role="status"
        aria-label="Loading content"
        aria-busy="true"
      >
        <span className="sr-only">Loading...</span>
        {Array.from({ length: clampedCount }, (_, i) => (
          <Component key={i} animated={animated} />
        ))}
      </div>
    );
  }
);

SkeletonLoader.displayName = "SkeletonLoader";

export { SkeletonLoader, type SkeletonLoaderProps, type SkeletonVariant };
