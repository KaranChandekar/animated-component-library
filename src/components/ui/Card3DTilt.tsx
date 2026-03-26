"use client";

import React, { forwardRef, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface Card3DTiltProps {
  children: React.ReactNode;
  intensity?: number;
  glare?: boolean;
  scale?: number;
  className?: string;
}

const springConfig = { stiffness: 300, damping: 20, mass: 0.5 };

const Card3DTilt = forwardRef<HTMLDivElement, Card3DTiltProps>(
  (
    { children, intensity = 15, glare = true, scale = 1.05, className },
    ref
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const cardRef = (ref as React.RefObject<HTMLDivElement>) || internalRef;
    const prefersReducedMotion = useReducedMotion();

    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);
    const motionScale = useMotionValue(1);

    const springRotateX = useSpring(rotateX, springConfig);
    const springRotateY = useSpring(rotateY, springConfig);
    const springScale = useSpring(motionScale, springConfig);

    const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion) return;

        const el =
          (cardRef as React.RefObject<HTMLDivElement>).current ??
          internalRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;

        const percentX = mouseX / (rect.width / 2);
        const percentY = mouseY / (rect.height / 2);

        rotateX.set(-percentY * intensity);
        rotateY.set(percentX * intensity);

        if (glare) {
          const glareX = ((e.clientX - rect.left) / rect.width) * 100;
          const glareY = ((e.clientY - rect.top) / rect.height) * 100;
          setGlarePosition({ x: glareX, y: glareY });
        }
      },
      [intensity, glare, prefersReducedMotion, rotateX, rotateY, cardRef]
    );

    const handleMouseEnter = useCallback(() => {
      if (prefersReducedMotion) return;
      setIsHovered(true);
      motionScale.set(scale);
    }, [scale, prefersReducedMotion, motionScale]);

    const handleMouseLeave = useCallback(() => {
      if (prefersReducedMotion) return;
      setIsHovered(false);
      rotateX.set(0);
      rotateY.set(0);
      motionScale.set(1);
    }, [prefersReducedMotion, rotateX, rotateY, motionScale]);

    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springScale,
          transformStyle: "preserve-3d",
          perspective: 1000,
          willChange: "transform",
        }}
        className={cn(
          "relative rounded-xl border border-gray-200 bg-white shadow-md transition-shadow duration-300 dark:border-gray-700 dark:bg-surface-dark",
          isHovered && "shadow-xl",
          className
        )}
      >
        {children}

        {/* Glare overlay */}
        {glare && (
          <div
            className="pointer-events-none absolute inset-0 z-10 overflow-hidden rounded-xl"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 transition-opacity duration-200"
              style={{
                opacity: isHovered ? 0.15 : 0,
                background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`,
              }}
            />
          </div>
        )}
      </motion.div>
    );
  }
);

Card3DTilt.displayName = "Card3DTilt";

export { Card3DTilt, type Card3DTiltProps };
