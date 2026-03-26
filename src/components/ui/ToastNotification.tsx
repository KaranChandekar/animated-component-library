"use client";

import React, {
  forwardRef,
  createContext,
  useContext,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info";

type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
  swipeToDismiss?: boolean;
}

interface ToastProps extends ToastData {
  onDismiss: (id: string) => void;
}

interface ToastContextValue {
  addToast: (
    toast: Omit<ToastData, "id"> & { id?: string }
  ) => string;
}

interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<
  ToastVariant,
  { icon: React.ElementType; className: string; progressColor: string }
> = {
  success: {
    icon: CheckCircle,
    className:
      "border-emerald-200 bg-white dark:bg-surface-dark dark:border-emerald-800",
    progressColor: "bg-emerald-500",
  },
  error: {
    icon: XCircle,
    className:
      "border-red-200 bg-white dark:bg-surface-dark dark:border-red-800",
    progressColor: "bg-red-500",
  },
  warning: {
    icon: AlertTriangle,
    className:
      "border-amber-200 bg-white dark:bg-surface-dark dark:border-amber-800",
    progressColor: "bg-amber-500",
  },
  info: {
    icon: Info,
    className:
      "border-blue-200 bg-white dark:bg-surface-dark dark:border-blue-800",
    progressColor: "bg-blue-500",
  },
};

const iconColorMap: Record<ToastVariant, string> = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-blue-500",
};

const positionClasses: Record<ToastPosition, string> = {
  "top-right": "top-4 right-4 items-end",
  "top-left": "top-4 left-4 items-start",
  "bottom-right": "bottom-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start",
  "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

function getSlideDirection(position: ToastPosition) {
  if (position.includes("right")) return { x: "100%" };
  if (position.includes("left")) return { x: "-100%" };
  if (position.includes("top")) return { y: "-100%" };
  return { y: "100%" };
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      id,
      variant,
      title,
      description,
      duration = 5000,
      swipeToDismiss = true,
      onDismiss,
    },
    ref
  ) => {
    const prefersReducedMotion = useReducedMotion();
    const config = variantConfig[variant];
    const IconComponent = config.icon;
    const [progress, setProgress] = useState(100);
    const startTimeRef = useRef(Date.now());
    const rafRef = useRef<number>(undefined);
    const [isPaused, setIsPaused] = useState(false);
    const remainingRef = useRef(duration);

    useEffect(() => {
      if (duration <= 0) return;

      const tick = () => {
        if (isPaused) return;

        const elapsed = Date.now() - startTimeRef.current;
        const remaining = remainingRef.current - elapsed;
        const pct = Math.max(0, (remaining / duration) * 100);
        setProgress(pct);

        if (remaining <= 0) {
          onDismiss(id);
          return;
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      startTimeRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [duration, id, onDismiss, isPaused]);

    const handlePause = useCallback(() => {
      setIsPaused(true);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingRef.current = remainingRef.current - elapsed;
    }, []);

    const handleResume = useCallback(() => {
      startTimeRef.current = Date.now();
      setIsPaused(false);
    }, []);

    const handleDragEnd = useCallback(
      (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (Math.abs(info.offset.x) > 100 || Math.abs(info.velocity.x) > 500) {
          onDismiss(id);
        }
      },
      [id, onDismiss]
    );

    return (
      <motion.div
        ref={ref}
        layout
        initial={
          prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: "100%" }
        }
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        exit={
          prefersReducedMotion
            ? { opacity: 0, transition: { duration: 0.1 } }
            : { opacity: 0, x: "100%", transition: { duration: 0.2 } }
        }
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        drag={swipeToDismiss && !prefersReducedMotion ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        className={cn(
          "pointer-events-auto relative w-80 overflow-hidden rounded-lg border shadow-lg",
          config.className
        )}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="flex items-start gap-3 p-4">
          <IconComponent
            className={cn("mt-0.5 h-5 w-5 shrink-0", iconColorMap[variant])}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </p>
            {description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={() => onDismiss(id)}
            className="shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {duration > 0 && (
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800">
            <motion.div
              className={cn("h-full", config.progressColor)}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0 }}
            />
          </div>
        )}
      </motion.div>
    );
  }
);

Toast.displayName = "Toast";

let toastCounter = 0;

function ToastProvider({
  children,
  position = "top-right",
  maxToasts = 5,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastData, "id"> & { id?: string }): string => {
      const id = toast.id ?? `toast-${++toastCounter}`;
      const newToast: ToastData = {
        ...toast,
        id,
        duration: toast.duration ?? 5000,
        swipeToDismiss: toast.swipeToDismiss ?? true,
      };

      setToasts((prev) => {
        const next = [...prev, newToast];
        return next.length > maxToasts ? next.slice(-maxToasts) : next;
      });

      return id;
    },
    [maxToasts]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const slideDir = getSlideDirection(position);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className={cn(
          "fixed z-[100] flex flex-col gap-2 pointer-events-none",
          positionClasses[position]
        )}
        aria-label="Notifications"
        role="region"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              {...toast}
              onDismiss={dismissToast}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = "ToastProvider";

function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export {
  ToastProvider,
  useToast,
  Toast,
  type ToastData,
  type ToastProps,
  type ToastVariant,
  type ToastPosition,
  type ToastProviderProps,
};
