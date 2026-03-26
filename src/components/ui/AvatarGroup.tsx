"use client";

import React, { forwardRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AvatarData {
  src?: string;
  name: string;
  color?: string;
}

type AvatarSize = "sm" | "md" | "lg";
type AvatarSpacing = "tight" | "normal" | "loose";

interface AvatarGroupProps {
  avatars: AvatarData[];
  max?: number;
  size?: AvatarSize;
  spacing?: AvatarSpacing;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const spacingClasses: Record<AvatarSpacing, string> = {
  tight: "-space-x-3",
  normal: "-space-x-2",
  loose: "-space-x-1",
};

const expandedSpacingClasses: Record<AvatarSpacing, string> = {
  tight: "space-x-0.5",
  normal: "space-x-1",
  loose: "space-x-1.5",
};

const fallbackColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getFallbackColor(name: string, customColor?: string): string {
  if (customColor) return customColor;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return fallbackColors[Math.abs(hash) % fallbackColors.length];
}

interface SingleAvatarProps {
  avatar: AvatarData;
  size: AvatarSize;
  index: number;
}

const SingleAvatar = forwardRef<HTMLDivElement, SingleAvatarProps>(
  ({ avatar, size, index }, ref) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [imgError, setImgError] = useState(false);
    const showFallback = !avatar.src || imgError;

    return (
      <div
        ref={ref}
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ zIndex: index }}
      >
        <div
          className={cn(
            "relative flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 overflow-hidden",
            sizeClasses[size],
            showFallback && getFallbackColor(avatar.name, avatar.color)
          )}
          role="img"
          aria-label={avatar.name}
        >
          {showFallback ? (
            <span className="font-medium text-white select-none">
              {getInitials(avatar.name)}
            </span>
          ) : (
            <img
              src={avatar.src}
              alt={avatar.name}
              className="h-full w-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-gray-700"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              role="tooltip"
            >
              {avatar.name}
              <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SingleAvatar.displayName = "SingleAvatar";

const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ avatars, max = 4, size = "md", spacing = "normal", className }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const visibleAvatars = isExpanded ? avatars : avatars.slice(0, max);
    const overflowCount = avatars.length - max;
    const hasOverflow = overflowCount > 0;

    return (
      <motion.div
        ref={ref}
        className={cn(
          "flex items-center",
          isExpanded ? expandedSpacingClasses[spacing] : spacingClasses[spacing],
          className
        )}
        onHoverStart={() => setIsExpanded(true)}
        onHoverEnd={() => setIsExpanded(false)}
        layout={!prefersReducedMotion}
        role="group"
        aria-label={`Avatar group of ${avatars.length} people`}
      >
        <AnimatePresence mode="popLayout">
          {visibleAvatars.map((avatar, index) => (
            <motion.div
              key={avatar.name}
              layout={!prefersReducedMotion}
              initial={
                index >= max && !prefersReducedMotion
                  ? { opacity: 0, scale: 0.6 }
                  : undefined
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={
                !prefersReducedMotion
                  ? { opacity: 0, scale: 0.6, transition: { duration: 0.15 } }
                  : undefined
              }
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <SingleAvatar avatar={avatar} size={size} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>

        {hasOverflow && !isExpanded && (
          <motion.div
            className={cn(
              "relative flex items-center justify-center rounded-full bg-gray-200 ring-2 ring-white dark:bg-gray-600 dark:ring-gray-900",
              sizeClasses[size]
            )}
            layout={!prefersReducedMotion}
            style={{ zIndex: max }}
            aria-label={`${overflowCount} more avatars`}
          >
            <span className="font-medium text-gray-600 dark:text-gray-300 select-none">
              +{overflowCount}
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

AvatarGroup.displayName = "AvatarGroup";

export { AvatarGroup, type AvatarGroupProps, type AvatarData };
