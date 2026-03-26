export type PropType = "boolean" | "number" | "string" | "select";

export type Category = "Basic" | "Input" | "Feedback" | "Layout" | "Navigation";

export interface PropDefinition {
  name: string;
  type: PropType;
  defaultValue: string | number | boolean;
  options?: string[];
  min?: number;
  max?: number;
}

export interface ComponentConfig {
  id: string;
  name: string;
  description: string;
  category: Category;
  props: PropDefinition[];
  usage: string;
  componentCode: string;
  typesCode: string;
}

export const componentConfigs: ComponentConfig[] = [
  // ─── 1. MagneticButton ──────────────────────────────────────────────
  {
    id: "magnetic-button",
    name: "MagneticButton",
    description:
      "A button that magnetically attracts toward the cursor when hovered, creating a playful and interactive feel.",
    category: "Basic",
    props: [
      {
        name: "variant",
        type: "select",
        defaultValue: "filled",
        options: ["filled", "outline", "icon"],
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "magnetRadius",
        type: "number",
        defaultValue: 50,
        min: 10,
        max: 100,
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
      },
    ],
    usage: `import { MagneticButton } from "@/components/ui/MagneticButton";

export default function Example() {
  return (
    <MagneticButton
      variant="filled"
      size="md"
      magnetRadius={50}
      onClick={() => console.log("clicked")}
    >
      Hover me
    </MagneticButton>
  );
}`,
    componentCode: `"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: ReactNode;
  variant?: "filled" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  magnetRadius?: number;
  disabled?: boolean;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  variant = "filled",
  size = "md",
  magnetRadius = 50,
  disabled = false,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: MouseEvent) => {
    if (disabled) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * (magnetRadius / 100);
    const y = (clientY - (top + height / 2)) * (magnetRadius / 100);
    setPosition({ x, y });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  // ... render with motion.button using position transform
}`,
    typesCode: `export interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "filled" | "outline" | "icon";
  size?: "sm" | "md" | "lg";
  magnetRadius?: number;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}`,
  },

  // ─── 2. SpringModal ─────────────────────────────────────────────────
  {
    id: "spring-modal",
    name: "SpringModal",
    description:
      "A modal dialog with spring-based open/close animations and an optional blurred backdrop.",
    category: "Feedback",
    props: [
      {
        name: "open",
        type: "boolean",
        defaultValue: false,
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "blurBackdrop",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { SpringModal } from "@/components/ui/SpringModal";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <SpringModal open={open} onClose={() => setOpen(false)} size="md" blurBackdrop>
        <h2>Modal Title</h2>
        <p>This is a spring-animated modal.</p>
      </SpringModal>
    </>
  );
}`,
    componentCode: `"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface SpringModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  blurBackdrop?: boolean;
}

export function SpringModal({
  open,
  onClose,
  children,
  size = "md",
  blurBackdrop = true,
}: SpringModalProps) {
  const sizeClasses = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className={\`absolute inset-0 bg-black/50 \${blurBackdrop ? "backdrop-blur-sm" : ""}\`}
            onClick={onClose}
          />
          <motion.div
            className={\`relative bg-white rounded-xl p-6 \${sizeClasses[size]}\`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}`,
    typesCode: `export interface SpringModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  blurBackdrop?: boolean;
  className?: string;
}`,
  },

  // ─── 3. ToastNotification ───────────────────────────────────────────
  {
    id: "toast-notification",
    name: "ToastNotification",
    description:
      "Animated toast notifications that slide in from a chosen corner with swipe-to-dismiss support.",
    category: "Feedback",
    props: [
      {
        name: "variant",
        type: "select",
        defaultValue: "success",
        options: ["success", "error", "warning", "info"],
      },
      {
        name: "position",
        type: "select",
        defaultValue: "top-right",
        options: ["top-right", "top-left", "bottom-right", "bottom-left"],
      },
      {
        name: "duration",
        type: "number",
        defaultValue: 5000,
        min: 1000,
        max: 10000,
      },
      {
        name: "swipeToDismiss",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { ToastNotification } from "@/components/ui/ToastNotification";

export default function Example() {
  return (
    <ToastNotification
      variant="success"
      position="top-right"
      duration={5000}
      swipeToDismiss
      onDismiss={() => console.log("dismissed")}
    >
      Changes saved successfully!
    </ToastNotification>
  );
}`,
    componentCode: `"use client";

import { useEffect, type ReactNode } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";

interface ToastNotificationProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  duration?: number;
  swipeToDismiss?: boolean;
  onDismiss?: () => void;
}

export function ToastNotification({
  children,
  variant = "success",
  position = "top-right",
  duration = 5000,
  swipeToDismiss = true,
  onDismiss,
}: ToastNotificationProps) {
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => onDismiss?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (swipeToDismiss && Math.abs(info.offset.x) > 100) {
      onDismiss?.();
    }
  };

  // ... render with motion.div, drag="x", position styles, variant colors
}`,
    typesCode: `export interface ToastNotificationProps {
  children: React.ReactNode;
  variant?: "success" | "error" | "warning" | "info";
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  duration?: number;
  swipeToDismiss?: boolean;
  onDismiss?: () => void;
  className?: string;
}`,
  },

  // ─── 4. Accordion ──────────────────────────────────────────────────
  {
    id: "accordion",
    name: "Accordion",
    description:
      "Expandable content sections with smooth height animation. Supports single or multiple open panels.",
    category: "Layout",
    props: [
      {
        name: "type",
        type: "select",
        defaultValue: "single",
        options: ["single", "multiple"],
      },
      {
        name: "collapsible",
        type: "boolean",
        defaultValue: true,
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { Accordion, AccordionItem } from "@/components/ui/Accordion";

export default function Example() {
  return (
    <Accordion type="single" collapsible animated>
      <AccordionItem value="item-1" title="Section One">
        Content for section one goes here.
      </AccordionItem>
      <AccordionItem value="item-2" title="Section Two">
        Content for section two goes here.
      </AccordionItem>
      <AccordionItem value="item-3" title="Section Three">
        Content for section three goes here.
      </AccordionItem>
    </Accordion>
  );
}`,
    componentCode: `"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AccordionProps {
  children: ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  animated?: boolean;
}

export function Accordion({
  children,
  type = "single",
  collapsible = true,
  animated = true,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (value: string) => {
    if (type === "single") {
      setOpenItems((prev) =>
        prev.includes(value) ? (collapsible ? [] : prev) : [value]
      );
    } else {
      setOpenItems((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  // ... render children with context providing openItems and toggle
}`,
    typesCode: `export interface AccordionProps {
  children: React.ReactNode;
  type?: "single" | "multiple";
  collapsible?: boolean;
  animated?: boolean;
  className?: string;
}

export interface AccordionItemProps {
  value: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}`,
  },

  // ─── 5. Tabs ────────────────────────────────────────────────────────
  {
    id: "tabs",
    name: "Tabs",
    description:
      "Animated tabbed navigation with a sliding active indicator and smooth content transitions.",
    category: "Navigation",
    props: [
      {
        name: "variant",
        type: "select",
        defaultValue: "underline",
        options: ["underline", "pills", "enclosed"],
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@/components/ui/Tabs";

export default function Example() {
  return (
    <Tabs variant="underline" size="md" animated>
      <TabList>
        <Tab>Overview</Tab>
        <Tab>Features</Tab>
        <Tab>Pricing</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Overview content here.</TabPanel>
        <TabPanel>Features content here.</TabPanel>
        <TabPanel>Pricing content here.</TabPanel>
      </TabPanels>
    </Tabs>
  );
}`,
    componentCode: `"use client";

import { useState, useRef, type ReactNode } from "react";
import { motion } from "framer-motion";

interface TabsProps {
  children: ReactNode;
  variant?: "underline" | "pills" | "enclosed";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  defaultIndex?: number;
}

export function Tabs({
  children,
  variant = "underline",
  size = "md",
  animated = true,
  defaultIndex = 0,
}: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ... render TabList with layoutId-based sliding indicator
  // ... render TabPanels with AnimatePresence transitions
}`,
    typesCode: `export interface TabsProps {
  children: React.ReactNode;
  variant?: "underline" | "pills" | "enclosed";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export interface TabProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}`,
  },

  // ─── 6. DropdownMenu ────────────────────────────────────────────────
  {
    id: "dropdown-menu",
    name: "DropdownMenu",
    description:
      "An animated dropdown menu with staggered item entry and configurable alignment.",
    category: "Input",
    props: [
      {
        name: "align",
        type: "select",
        defaultValue: "start",
        options: ["start", "center", "end"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
    ],
    usage: `import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/DropdownMenu";

export default function Example() {
  return (
    <DropdownMenu align="start" animated size="md">
      <DropdownTrigger>
        <button>Options</button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownItem onClick={() => console.log("edit")}>Edit</DropdownItem>
        <DropdownItem onClick={() => console.log("duplicate")}>Duplicate</DropdownItem>
        <DropdownItem onClick={() => console.log("delete")} variant="danger">
          Delete
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
}`,
    componentCode: `"use client";

import { useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DropdownMenuProps {
  children: ReactNode;
  align?: "start" | "center" | "end";
  animated?: boolean;
  size?: "sm" | "md" | "lg";
}

export function DropdownMenu({
  children,
  align = "start",
  animated = true,
  size = "md",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // ... click-outside handling, keyboard navigation
  // ... render trigger and AnimatePresence content with staggerChildren
}`,
    typesCode: `export interface DropdownMenuProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  disabled?: boolean;
  className?: string;
}`,
  },

  // ─── 7. Tooltip ─────────────────────────────────────────────────────
  {
    id: "tooltip",
    name: "Tooltip",
    description:
      "A lightweight animated tooltip that appears on hover with configurable placement and delay.",
    category: "Feedback",
    props: [
      {
        name: "side",
        type: "select",
        defaultValue: "top",
        options: ["top", "right", "bottom", "left"],
      },
      {
        name: "delay",
        type: "number",
        defaultValue: 200,
        min: 0,
        max: 1000,
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { Tooltip } from "@/components/ui/Tooltip";

export default function Example() {
  return (
    <Tooltip content="This is a tooltip" side="top" delay={200} animated>
      <button>Hover me</button>
    </Tooltip>
  );
}`,
    componentCode: `"use client";

import { useState, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface TooltipProps {
  children: ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  animated?: boolean;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 200,
  animated = true,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), delay);
  };
  const hide = () => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  // ... render children wrapper with onMouseEnter/Leave
  // ... AnimatePresence portal with positioned tooltip
}`,
    typesCode: `export interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  animated?: boolean;
  className?: string;
}`,
  },

  // ─── 8. ToggleSwitch ───────────────────────────────────────────────
  {
    id: "toggle-switch",
    name: "ToggleSwitch",
    description:
      "A smooth toggle switch with spring animation and optional color variants.",
    category: "Input",
    props: [
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
      },
      {
        name: "color",
        type: "select",
        defaultValue: "primary",
        options: ["primary", "success", "error"],
      },
    ],
    usage: `import { ToggleSwitch } from "@/components/ui/ToggleSwitch";
import { useState } from "react";

export default function Example() {
  const [enabled, setEnabled] = useState(false);

  return (
    <ToggleSwitch
      checked={enabled}
      onChange={setEnabled}
      size="md"
      color="primary"
    />
  );
}`,
    componentCode: `"use client";

import { motion } from "framer-motion";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  color?: "primary" | "success" | "error";
}

export function ToggleSwitch({
  checked,
  onChange,
  size = "md",
  disabled = false,
  color = "primary",
}: ToggleSwitchProps) {
  const sizes = { sm: "w-8 h-4", md: "w-11 h-6", lg: "w-14 h-7" };
  const thumbSizes = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-6 h-6" };

  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={sizes[size]}
    >
      <motion.span
        className={thumbSizes[size]}
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}`,
    typesCode: `export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  color?: "primary" | "success" | "error";
  className?: string;
}`,
  },

  // ─── 9. SkeletonLoader ─────────────────────────────────────────────
  {
    id: "skeleton-loader",
    name: "SkeletonLoader",
    description:
      "Animated placeholder skeletons for loading states, available in multiple shape variants.",
    category: "Feedback",
    props: [
      {
        name: "variant",
        type: "select",
        defaultValue: "line",
        options: ["line", "card", "avatar", "text"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
      {
        name: "count",
        type: "number",
        defaultValue: 1,
        min: 1,
        max: 5,
      },
    ],
    usage: `import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

export default function Example() {
  return (
    <div className="space-y-4">
      <SkeletonLoader variant="avatar" />
      <SkeletonLoader variant="line" count={3} animated />
      <SkeletonLoader variant="card" />
    </div>
  );
}`,
    componentCode: `"use client";

import { motion } from "framer-motion";

interface SkeletonLoaderProps {
  variant?: "line" | "card" | "avatar" | "text";
  animated?: boolean;
  count?: number;
}

export function SkeletonLoader({
  variant = "line",
  animated = true,
  count = 1,
}: SkeletonLoaderProps) {
  const variants = {
    line: "h-4 w-full rounded",
    card: "h-32 w-full rounded-lg",
    avatar: "h-12 w-12 rounded-full",
    text: "h-3 w-3/4 rounded",
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className={\`bg-gray-200 \${variants[variant]}\`}
          animate={animated ? { opacity: [0.5, 1, 0.5] } : undefined}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}`,
    typesCode: `export interface SkeletonLoaderProps {
  variant?: "line" | "card" | "avatar" | "text";
  animated?: boolean;
  count?: number;
  className?: string;
}`,
  },

  // ─── 10. Card3DTilt ─────────────────────────────────────────────────
  {
    id: "card-3d-tilt",
    name: "Card3DTilt",
    description:
      "A card that tilts in 3D space following the mouse cursor, with an optional glare overlay effect.",
    category: "Layout",
    props: [
      {
        name: "intensity",
        type: "number",
        defaultValue: 15,
        min: 5,
        max: 30,
      },
      {
        name: "glare",
        type: "boolean",
        defaultValue: true,
      },
      {
        name: "scale",
        type: "number",
        defaultValue: 1.05,
        min: 1,
        max: 1.1,
      },
    ],
    usage: `import { Card3DTilt } from "@/components/ui/Card3DTilt";

export default function Example() {
  return (
    <Card3DTilt intensity={15} glare scale={1.05}>
      <div className="p-6">
        <h3 className="text-lg font-bold">3D Card</h3>
        <p>Move your mouse over this card to see the tilt effect.</p>
      </div>
    </Card3DTilt>
  );
}`,
    componentCode: `"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Card3DTiltProps {
  children: ReactNode;
  intensity?: number;
  glare?: boolean;
  scale?: number;
}

export function Card3DTilt({
  children,
  intensity = 15,
  glare = true,
  scale = 1.05,
}: Card3DTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * intensity);
    rotateY.set(x * intensity);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // ... render with motion.div, perspective, rotateX/Y, optional glare overlay
}`,
    typesCode: `export interface Card3DTiltProps {
  children: React.ReactNode;
  intensity?: number;
  glare?: boolean;
  scale?: number;
  className?: string;
}`,
  },

  // ─── 11. Drawer ─────────────────────────────────────────────────────
  {
    id: "drawer",
    name: "Drawer",
    description:
      "A slide-out panel that appears from any edge of the screen with smooth spring animation.",
    category: "Layout",
    props: [
      {
        name: "side",
        type: "select",
        defaultValue: "right",
        options: ["left", "right", "top", "bottom"],
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg", "full"],
      },
      {
        name: "overlay",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { Drawer } from "@/components/ui/Drawer";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Drawer</button>
      <Drawer open={open} onClose={() => setOpen(false)} side="right" size="md" overlay>
        <h2 className="text-lg font-bold">Drawer Content</h2>
        <p>This slides in from the right.</p>
      </Drawer>
    </>
  );
}`,
    componentCode: `"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  overlay?: boolean;
}

export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  size = "md",
  overlay = true,
}: DrawerProps) {
  const slideFrom = {
    left: { x: "-100%" },
    right: { x: "100%" },
    top: { y: "-100%" },
    bottom: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {overlay && (
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
          )}
          <motion.div
            className="fixed z-50 bg-white shadow-xl"
            initial={slideFrom[side]}
            animate={{ x: 0, y: 0 }}
            exit={slideFrom[side]}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}`,
    typesCode: `export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "full";
  overlay?: boolean;
  className?: string;
}`,
  },

  // ─── 12. ProgressBar ────────────────────────────────────────────────
  {
    id: "progress-bar",
    name: "ProgressBar",
    description:
      "An animated progress bar with spring transitions, striped and indeterminate variants.",
    category: "Feedback",
    props: [
      {
        name: "value",
        type: "number",
        defaultValue: 60,
        min: 0,
        max: 100,
      },
      {
        name: "variant",
        type: "select",
        defaultValue: "default",
        options: ["default", "striped", "indeterminate"],
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "color",
        type: "select",
        defaultValue: "primary",
        options: ["primary", "success", "error", "warning"],
      },
    ],
    usage: `import { ProgressBar } from "@/components/ui/ProgressBar";

export default function Example() {
  return (
    <ProgressBar
      value={60}
      variant="default"
      size="md"
      color="primary"
    />
  );
}`,
    componentCode: `"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value?: number;
  variant?: "default" | "striped" | "indeterminate";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "error" | "warning";
}

export function ProgressBar({
  value = 60,
  variant = "default",
  size = "md",
  color = "primary",
}: ProgressBarProps) {
  const heights = { sm: "h-1", md: "h-2", lg: "h-4" };
  const colors = {
    primary: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className={\`w-full bg-gray-200 rounded-full overflow-hidden \${heights[size]}\`}>
      <motion.div
        className={\`h-full \${colors[color]} rounded-full\`}
        initial={{ width: 0 }}
        animate={{ width: variant === "indeterminate" ? "100%" : \`\${value}%\` }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
    </div>
  );
}`,
    typesCode: `export interface ProgressBarProps {
  value?: number;
  variant?: "default" | "striped" | "indeterminate";
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "error" | "warning";
  className?: string;
}`,
  },

  // ─── 13. Badge ──────────────────────────────────────────────────────
  {
    id: "badge",
    name: "Badge",
    description:
      "Animated badges with enter/exit transitions and an optional removable close button.",
    category: "Basic",
    props: [
      {
        name: "variant",
        type: "select",
        defaultValue: "solid",
        options: ["solid", "outline", "subtle"],
      },
      {
        name: "color",
        type: "select",
        defaultValue: "primary",
        options: ["primary", "success", "error", "warning"],
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "removable",
        type: "boolean",
        defaultValue: false,
      },
    ],
    usage: `import { Badge } from "@/components/ui/Badge";

export default function Example() {
  return (
    <div className="flex gap-2">
      <Badge variant="solid" color="primary">New</Badge>
      <Badge variant="outline" color="success">Active</Badge>
      <Badge variant="subtle" color="warning" removable onRemove={() => {}}>
        Pending
      </Badge>
    </div>
  );
}`,
    componentCode: `"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface BadgeProps {
  children: ReactNode;
  variant?: "solid" | "outline" | "subtle";
  color?: "primary" | "success" | "error" | "warning";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
}

export function Badge({
  children,
  variant = "solid",
  color = "primary",
  size = "md",
  removable = false,
  onRemove,
}: BadgeProps) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className="inline-flex items-center gap-1 rounded-full font-medium"
    >
      {children}
      {removable && (
        <button onClick={onRemove} className="ml-1">&times;</button>
      )}
    </motion.span>
  );
}`,
    typesCode: `export interface BadgeProps {
  children: React.ReactNode;
  variant?: "solid" | "outline" | "subtle";
  color?: "primary" | "success" | "error" | "warning";
  size?: "sm" | "md" | "lg";
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}`,
  },

  // ─── 14. AvatarGroup ────────────────────────────────────────────────
  {
    id: "avatar-group",
    name: "AvatarGroup",
    description:
      "A stacked group of avatar images with overflow count and staggered entrance animation.",
    category: "Basic",
    props: [
      {
        name: "max",
        type: "number",
        defaultValue: 4,
        min: 1,
        max: 10,
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "spacing",
        type: "select",
        defaultValue: "normal",
        options: ["tight", "normal", "loose"],
      },
    ],
    usage: `import { AvatarGroup, Avatar } from "@/components/ui/AvatarGroup";

export default function Example() {
  const users = [
    { name: "Alice", src: "/avatars/alice.jpg" },
    { name: "Bob", src: "/avatars/bob.jpg" },
    { name: "Charlie", src: "/avatars/charlie.jpg" },
    { name: "Diana", src: "/avatars/diana.jpg" },
    { name: "Eve", src: "/avatars/eve.jpg" },
  ];

  return (
    <AvatarGroup max={4} size="md" spacing="normal">
      {users.map((user) => (
        <Avatar key={user.name} name={user.name} src={user.src} />
      ))}
    </AvatarGroup>
  );
}`,
    componentCode: `"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface AvatarGroupProps {
  children: ReactNode;
  max?: number;
  size?: "sm" | "md" | "lg";
  spacing?: "tight" | "normal" | "loose";
}

export function AvatarGroup({
  children,
  max = 4,
  size = "md",
  spacing = "normal",
}: AvatarGroupProps) {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const margins = { tight: "-ml-3", normal: "-ml-2", loose: "-ml-1" };

  // ... slice children to max, render overflow "+N" indicator
  // ... stagger animation for each avatar entrance
}

interface AvatarProps {
  name: string;
  src?: string;
}

export function Avatar({ name, src }: AvatarProps) {
  // ... render img with fallback initials
}`,
    typesCode: `export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: "sm" | "md" | "lg";
  spacing?: "tight" | "normal" | "loose";
  className?: string;
}

export interface AvatarProps {
  name: string;
  src?: string;
  className?: string;
}`,
  },

  // ─── 15. CommandPalette ─────────────────────────────────────────────
  {
    id: "command-palette",
    name: "CommandPalette",
    description:
      "A searchable command palette overlay activated by a keyboard shortcut, with fuzzy filtering.",
    category: "Navigation",
    props: [
      {
        name: "placeholder",
        type: "string",
        defaultValue: "Type a command...",
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { CommandPalette, CommandItem } from "@/components/ui/CommandPalette";
import { useState } from "react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Commands (Cmd+K)</button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        placeholder="Type a command..."
        animated
      >
        <CommandItem onSelect={() => console.log("new-file")}>New File</CommandItem>
        <CommandItem onSelect={() => console.log("search")}>Search</CommandItem>
        <CommandItem onSelect={() => console.log("settings")}>Settings</CommandItem>
      </CommandPalette>
    </>
  );
}`,
    componentCode: `"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  placeholder?: string;
  animated?: boolean;
}

export function CommandPalette({
  open,
  onClose,
  children,
  placeholder = "Type a command...",
  animated = true,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // toggle open
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // ... render backdrop, search input, filtered results list
}`,
    typesCode: `export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  placeholder?: string;
  animated?: boolean;
  className?: string;
}

export interface CommandItemProps {
  children: React.ReactNode;
  onSelect: () => void;
  icon?: React.ReactNode;
  shortcut?: string;
  className?: string;
}`,
  },

  // ─── 16. Breadcrumb ─────────────────────────────────────────────────
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    description:
      "Animated breadcrumb navigation with configurable separators and automatic truncation.",
    category: "Navigation",
    props: [
      {
        name: "separator",
        type: "select",
        defaultValue: "slash",
        options: ["slash", "chevron", "dot"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
      {
        name: "maxItems",
        type: "number",
        defaultValue: 5,
        min: 2,
        max: 10,
      },
    ],
    usage: `import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb";

export default function Example() {
  return (
    <Breadcrumb separator="chevron" animated maxItems={5}>
      <BreadcrumbItem href="/">Home</BreadcrumbItem>
      <BreadcrumbItem href="/products">Products</BreadcrumbItem>
      <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
      <BreadcrumbItem active>Headphones</BreadcrumbItem>
    </Breadcrumb>
  );
}`,
    componentCode: `"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface BreadcrumbProps {
  children: ReactNode;
  separator?: "slash" | "chevron" | "dot";
  animated?: boolean;
  maxItems?: number;
}

export function Breadcrumb({
  children,
  separator = "slash",
  animated = true,
  maxItems = 5,
}: BreadcrumbProps) {
  const separators = { slash: "/", chevron: "\u203A", dot: "\u00B7" };

  // ... truncate items if exceeding maxItems, show ellipsis
  // ... render each item with stagger animation and separator between
}

interface BreadcrumbItemProps {
  children: ReactNode;
  href?: string;
  active?: boolean;
}

export function BreadcrumbItem({ children, href, active }: BreadcrumbItemProps) {
  // ... render link or span based on active state
}`,
    typesCode: `export interface BreadcrumbProps {
  children: React.ReactNode;
  separator?: "slash" | "chevron" | "dot";
  animated?: boolean;
  maxItems?: number;
  className?: string;
}

export interface BreadcrumbItemProps {
  children: React.ReactNode;
  href?: string;
  active?: boolean;
  className?: string;
}`,
  },

  // ─── 17. Stepper ────────────────────────────────────────────────────
  {
    id: "stepper",
    name: "Stepper",
    description:
      "A multi-step progress indicator with animated transitions between steps.",
    category: "Navigation",
    props: [
      {
        name: "activeStep",
        type: "number",
        defaultValue: 1,
        min: 0,
        max: 4,
      },
      {
        name: "orientation",
        type: "select",
        defaultValue: "horizontal",
        options: ["horizontal", "vertical"],
      },
      {
        name: "animated",
        type: "boolean",
        defaultValue: true,
      },
    ],
    usage: `import { Stepper, Step } from "@/components/ui/Stepper";

export default function Example() {
  return (
    <Stepper activeStep={1} orientation="horizontal" animated>
      <Step title="Account" description="Create your account" />
      <Step title="Profile" description="Set up your profile" />
      <Step title="Settings" description="Configure preferences" />
      <Step title="Complete" description="All done!" />
    </Stepper>
  );
}`,
    componentCode: `"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

interface StepperProps {
  children: ReactNode;
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
}

export function Stepper({
  children,
  activeStep = 1,
  orientation = "horizontal",
  animated = true,
}: StepperProps) {
  // ... render steps with connecting lines
  // ... animate completed steps with checkmark, active with pulse
  // ... orientation determines flex direction
}

interface StepProps {
  title: string;
  description?: string;
}

export function Step({ title, description }: StepProps) {
  // ... render step circle, title, and description
}`,
    typesCode: `export interface StepperProps {
  children: React.ReactNode;
  activeStep?: number;
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
  className?: string;
}

export interface StepProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}`,
  },

  // ─── 18. RatingStars ────────────────────────────────────────────────
  {
    id: "rating-stars",
    name: "RatingStars",
    description:
      "Interactive star rating component with hover preview and spring-animated selection.",
    category: "Input",
    props: [
      {
        name: "value",
        type: "number",
        defaultValue: 3,
        min: 0,
        max: 5,
      },
      {
        name: "size",
        type: "select",
        defaultValue: "md",
        options: ["sm", "md", "lg"],
      },
      {
        name: "color",
        type: "select",
        defaultValue: "warning",
        options: ["primary", "warning"],
      },
      {
        name: "count",
        type: "number",
        defaultValue: 5,
        min: 3,
        max: 10,
      },
    ],
    usage: `import { RatingStars } from "@/components/ui/RatingStars";
import { useState } from "react";

export default function Example() {
  const [rating, setRating] = useState(3);

  return (
    <RatingStars
      value={rating}
      onChange={setRating}
      size="md"
      color="warning"
      count={5}
    />
  );
}`,
    componentCode: `"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface RatingStarsProps {
  value?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "warning";
  count?: number;
}

export function RatingStars({
  value = 3,
  onChange,
  size = "md",
  color = "warning",
  count = 5,
}: RatingStarsProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange?.(i + 1)}
          className={sizes[size]}
        >
          <StarIcon filled={i < (hovered !== null ? hovered + 1 : value)} />
        </motion.button>
      ))}
    </div>
  );
}`,
    typesCode: `export interface RatingStarsProps {
  value?: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "warning";
  count?: number;
  readOnly?: boolean;
  className?: string;
}`,
  },

  // ─── 19. Pagination ─────────────────────────────────────────────────
  {
    id: "pagination",
    name: "Pagination",
    description:
      "Animated page navigation with sliding active indicator and smart ellipsis truncation.",
    category: "Navigation",
    props: [
      {
        name: "totalPages",
        type: "number",
        defaultValue: 10,
        min: 1,
        max: 20,
      },
      {
        name: "currentPage",
        type: "number",
        defaultValue: 1,
        min: 1,
        max: 20,
      },
      {
        name: "siblingCount",
        type: "number",
        defaultValue: 1,
        min: 0,
        max: 3,
      },
    ],
    usage: `import { Pagination } from "@/components/ui/Pagination";
import { useState } from "react";

export default function Example() {
  const [page, setPage] = useState(1);

  return (
    <Pagination
      totalPages={10}
      currentPage={page}
      onPageChange={setPage}
      siblingCount={1}
    />
  );
}`,
    componentCode: `"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  totalPages,
  currentPage,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const range = useMemo(() => {
    const total = siblingCount * 2 + 5;
    if (total >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    // ... compute range with ellipsis
    return [];
  }, [totalPages, currentPage, siblingCount]);

  return (
    <nav className="flex items-center gap-1">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </button>
      {range.map((page, i) => (
        <motion.button
          key={i}
          onClick={() => typeof page === "number" && onPageChange(page)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {page}
        </motion.button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </nav>
  );
}`,
    typesCode: `export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}`,
  },

  // ─── 20. FileUpload ─────────────────────────────────────────────────
  {
    id: "file-upload",
    name: "FileUpload",
    description:
      "A drag-and-drop file upload zone with animated feedback, progress indication, and file type validation.",
    category: "Input",
    props: [
      {
        name: "accept",
        type: "string",
        defaultValue: "image/*",
      },
      {
        name: "multiple",
        type: "boolean",
        defaultValue: false,
      },
      {
        name: "maxSize",
        type: "number",
        defaultValue: 10,
        min: 1,
        max: 50,
      },
      {
        name: "disabled",
        type: "boolean",
        defaultValue: false,
      },
    ],
    usage: `import { FileUpload } from "@/components/ui/FileUpload";

export default function Example() {
  return (
    <FileUpload
      accept="image/*"
      multiple={false}
      maxSize={10}
      onUpload={(files) => console.log("Uploaded:", files)}
    />
  );
}`,
    componentCode: `"use client";

import { useState, useRef, type DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  onUpload?: (files: File[]) => void;
}

export function FileUpload({
  accept = "image/*",
  multiple = false,
  maxSize = 10,
  disabled = false,
  onUpload,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.size <= maxSize * 1024 * 1024
    );
    const selected = multiple ? dropped : dropped.slice(0, 1);
    setFiles(selected);
    onUpload?.(selected);
  };

  // ... render drop zone with motion.div, drag state styling
  // ... file list with AnimatePresence for add/remove animations
}`,
    typesCode: `export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  onUpload?: (files: File[]) => void;
  className?: string;
}`,
  },
];

/**
 * Look up a single component configuration by its kebab-case id.
 */
export function getComponentById(id: string): ComponentConfig | undefined {
  return componentConfigs.find((c) => c.id === id);
}

/**
 * Look up a single component configuration by its PascalCase display name.
 */
export function getComponentByName(name: string): ComponentConfig | undefined {
  return componentConfigs.find((c) => c.name === name);
}

/**
 * Return all components belonging to a given category.
 */
export function getComponentsByCategory(category: Category): ComponentConfig[] {
  return componentConfigs.filter((c) => c.category === category);
}

/**
 * Return an array of all unique categories present in the config.
 */
export function getCategories(): Category[] {
  return [...new Set(componentConfigs.map((c) => c.category))];
}
