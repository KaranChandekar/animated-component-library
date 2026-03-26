"use client";

import React, { forwardRef, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type SpringOptions,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  variant?: "filled" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  magnetRadius?: number;
  springConfig?: SpringOptions;
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: boolean | "dialog" | "menu" | "listbox" | "tree" | "grid";
  id?: string;
  tabIndex?: number;
}

const variantClasses: Record<string, string> = {
  filled:
    "bg-primary text-white hover:bg-primary-600 shadow-md hover:shadow-lg",
  outline:
    "border-2 border-primary text-primary hover:bg-primary-50 dark:hover:bg-primary-900/20",
  icon: "bg-transparent p-2 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30",
};

const sizeClasses: Record<string, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-base",
  lg: "px-7 py-3.5 text-lg",
};

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  (
    {
      variant = "filled",
      size = "md",
      magnetRadius = 50,
      springConfig,
      className,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);

    const spring: SpringOptions = springConfig ?? {
      stiffness: 150,
      damping: 15,
      mass: 0.1,
    };

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, spring);
    const springY = useSpring(y, spring);

    const scale = useMotionValue(1);
    const springScale = useSpring(scale, { stiffness: 300, damping: 20 });

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion) return;

        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < magnetRadius) {
          const factor = 1 - distance / magnetRadius;
          x.set(distX * factor * 0.4);
          y.set(distY * factor * 0.4);
        }
      },
      [magnetRadius, prefersReducedMotion, x, y]
    );

    const handleMouseLeave = useCallback(() => {
      x.set(0);
      y.set(0);
    }, [x, y]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!prefersReducedMotion) {
          scale.set(0.92);
          setTimeout(() => scale.set(1), 120);
        }
        onClick?.(e);
      },
      [onClick, prefersReducedMotion, scale]
    );

    const appliedSizeClasses = variant === "icon" ? "" : sizeClasses[size];

    return (
      <div
        ref={containerRef}
        className="inline-block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            variantClasses[variant],
            appliedSizeClasses,
            className
          )}
          style={{
            x: prefersReducedMotion ? 0 : springX,
            y: prefersReducedMotion ? 0 : springY,
            scale: prefersReducedMotion ? 1 : springScale,
          }}
          onClick={handleClick}
          disabled={props.disabled}
          type={props.type ?? "button"}
          aria-label={props["aria-label"]}
          aria-describedby={props["aria-describedby"]}
          aria-expanded={props["aria-expanded"]}
          aria-controls={props["aria-controls"]}
          aria-haspopup={props["aria-haspopup"]}
          id={props.id}
          tabIndex={props.tabIndex}
        >
          {children}
        </motion.button>
      </div>
    );
  }
);

MagneticButton.displayName = "MagneticButton";

export { MagneticButton, type MagneticButtonProps };
