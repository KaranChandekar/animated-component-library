"use client";

import React, {
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Command {
  id: string;
  label: string;
  icon?: React.ReactNode;
  action: () => void;
  category?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commands: Command[];
  placeholder?: string;
  animated?: boolean;
  className?: string;
}

function fuzzyMatch(
  query: string,
  text: string
): { matches: boolean; indices: number[] } {
  const lowerQuery = query.toLowerCase();
  const lowerText = text.toLowerCase();
  const indices: number[] = [];
  let queryIdx = 0;

  for (let i = 0; i < lowerText.length && queryIdx < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIdx]) {
      indices.push(i);
      queryIdx++;
    }
  }

  return {
    matches: queryIdx === lowerQuery.length,
    indices,
  };
}

function HighlightedText({
  text,
  indices,
}: {
  text: string;
  indices: number[];
}) {
  if (indices.length === 0) return <>{text}</>;

  const indexSet = new Set(indices);
  const chars = text.split("");

  return (
    <>
      {chars.map((char, i) =>
        indexSet.has(i) ? (
          <mark
            key={i}
            className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-sm"
          >
            {char}
          </mark>
        ) : (
          <span key={i}>{char}</span>
        )
      )}
    </>
  );
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -4 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.02, duration: 0.15 },
  }),
};

const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onOpenChange,
      commands,
      placeholder = "Type a command or search...",
      animated = true,
      className,
    },
    ref
  ) => {
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const shouldAnimate = animated && !prefersReducedMotion;

    const filteredResults = useMemo(() => {
      if (!query.trim()) {
        return commands.map((cmd) => ({ command: cmd, indices: [] as number[] }));
      }

      return commands
        .map((cmd) => {
          const result = fuzzyMatch(query, cmd.label);
          return { command: cmd, indices: result.indices, matches: result.matches };
        })
        .filter((r) => r.matches);
    }, [query, commands]);

    const groupedResults = useMemo(() => {
      const groups = new Map<string, typeof filteredResults>();

      for (const item of filteredResults) {
        const category = item.command.category || "Commands";
        if (!groups.has(category)) {
          groups.set(category, []);
        }
        groups.get(category)!.push(item);
      }

      return groups;
    }, [filteredResults]);

    const flatResults = useMemo(
      () => filteredResults.map((r) => r.command),
      [filteredResults]
    );

    useEffect(() => {
      setActiveIndex(0);
    }, [query]);

    useEffect(() => {
      if (open) {
        setQuery("");
        setActiveIndex(0);
      }
    }, [open]);

    const executeCommand = useCallback(
      (command: Command) => {
        onOpenChange(false);
        command.action();
      },
      [onOpenChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setActiveIndex((prev) =>
              prev < flatResults.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setActiveIndex((prev) =>
              prev > 0 ? prev - 1 : flatResults.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (flatResults[activeIndex]) {
              executeCommand(flatResults[activeIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            onOpenChange(false);
            break;
        }
      },
      [flatResults, activeIndex, executeCommand, onOpenChange]
    );

    useEffect(() => {
      const activeElement = listRef.current?.querySelector(
        `[data-index="${activeIndex}"]`
      );
      activeElement?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    let globalIndex = 0;

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                  variants={backdropVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              <Dialog.Content
                asChild
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  inputRef.current?.focus();
                }}
              >
                <motion.div
                  ref={ref}
                  className={cn(
                    "fixed left-1/2 top-[20%] z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-surface-dark",
                    className
                  )}
                  variants={shouldAnimate ? panelVariants : reducedMotionVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Command palette"
                  onKeyDown={handleKeyDown}
                >
                  <Dialog.Title className="sr-only">Command Palette</Dialog.Title>

                  <div className="flex items-center border-b border-gray-200 px-4 dark:border-white/10">
                    <Search className="mr-3 h-4 w-4 shrink-0 text-gray-400" />
                    <input
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={placeholder}
                      className="h-12 w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
                      aria-label="Search commands"
                      aria-activedescendant={
                        flatResults[activeIndex]
                          ? `cmd-${flatResults[activeIndex].id}`
                          : undefined
                      }
                      role="combobox"
                      aria-expanded="true"
                      aria-controls="command-list"
                      aria-autocomplete="list"
                    />
                    <kbd className="hidden shrink-0 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-block dark:border-white/10">
                      ESC
                    </kbd>
                  </div>

                  <div
                    ref={listRef}
                    id="command-list"
                    role="listbox"
                    className="max-h-72 overflow-y-auto p-2"
                  >
                    {filteredResults.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                        No results found for &quot;{query}&quot;
                      </div>
                    ) : (
                      Array.from(groupedResults.entries()).map(
                        ([category, items]) => (
                          <div key={category} role="group" aria-label={category}>
                            <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                              {category}
                            </div>
                            {items.map((item) => {
                              const currentIndex = globalIndex++;
                              const isActive = currentIndex === activeIndex;

                              return (
                                <motion.button
                                  key={item.command.id}
                                  id={`cmd-${item.command.id}`}
                                  data-index={currentIndex}
                                  role="option"
                                  aria-selected={isActive}
                                  className={cn(
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                                    isActive
                                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                                  )}
                                  onClick={() => executeCommand(item.command)}
                                  onMouseEnter={() => setActiveIndex(currentIndex)}
                                  variants={shouldAnimate ? itemVariants : undefined}
                                  initial={shouldAnimate ? "hidden" : undefined}
                                  animate={shouldAnimate ? "visible" : undefined}
                                  custom={currentIndex}
                                >
                                  {item.command.icon && (
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400 dark:text-gray-500">
                                      {item.command.icon}
                                    </span>
                                  )}
                                  <span className="flex-1 truncate">
                                    <HighlightedText
                                      text={item.command.label}
                                      indices={item.indices}
                                    />
                                  </span>
                                  {isActive && (
                                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        )
                      )
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2 text-xs text-gray-400 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <kbd className="rounded border border-gray-200 px-1 py-0.5 text-[10px] dark:border-white/10">
                          &uarr;
                        </kbd>
                        <kbd className="rounded border border-gray-200 px-1 py-0.5 text-[10px] dark:border-white/10">
                          &darr;
                        </kbd>
                        navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="rounded border border-gray-200 px-1 py-0.5 text-[10px] dark:border-white/10">
                          &crarr;
                        </kbd>
                        select
                      </span>
                    </div>
                    <span>{flatResults.length} results</span>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    );
  }
);

CommandPalette.displayName = "CommandPalette";

export { CommandPalette, type CommandPaletteProps, type Command };
