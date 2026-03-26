"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  componentConfigs,
  getComponentsByCategory,
  getCategories,
} from "@/data/componentConfig";
import { useDebouncedValue, useKeyboardShortcut } from "@/lib/hooks";

interface NavigationSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function NavigationSidebar({
  open,
  onClose,
}: NavigationSidebarProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  const focusSearch = useCallback(() => {
    searchInputRef.current?.focus();
  }, []);

  useKeyboardShortcut("j", focusSearch, true);

  const categories = getCategories();

  const filteredByCategory = (category: string) => {
    const components = getComponentsByCategory(
      category as "Basic" | "Input" | "Feedback" | "Layout" | "Navigation"
    );
    if (!debouncedQuery.trim()) return components;
    const q = debouncedQuery.toLowerCase();
    return components.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  };

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const hasResults = categories.some(
    (cat) => filteredByCategory(cat).length > 0
  );

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="p-4">
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2",
            "bg-neutral-50 border-neutral-200",
            "dark:bg-neutral-900 dark:border-neutral-700",
            "focus-within:ring-2 focus-within:ring-violet-500/40 focus-within:border-violet-500",
            "transition-all"
          )}
        >
          <Search className="h-4 w-4 shrink-0 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400",
              "text-neutral-900 dark:text-neutral-100"
            )}
          />
          <kbd
            className={cn(
              "hidden sm:inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-medium",
              "border-neutral-300 text-neutral-500 bg-white",
              "dark:border-neutral-600 dark:text-neutral-400 dark:bg-neutral-800"
            )}
          >
            ⌘J
          </kbd>
        </div>
      </div>

      {/* Component list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Components">
        {!hasResults && (
          <p className="px-3 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
            No components found.
          </p>
        )}

        {categories.map((category, catIdx) => {
          const components = filteredByCategory(category);
          if (components.length === 0) return null;
          const isCollapsed = collapsedCategories[category];

          return (
            <div key={category} className="mb-1">
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider",
                  "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100",
                  "dark:text-neutral-400 dark:hover:text-neutral-200 dark:hover:bg-neutral-800",
                  "transition-colors"
                )}
              >
                {category}
                <motion.span
                  animate={{ rotate: isCollapsed ? -90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {components.map((component, idx) => {
                      const href = `/components/${component.id}`;
                      const isActive = pathname === href;

                      return (
                        <motion.li
                          key={component.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: idx * 0.03,
                            duration: 0.2,
                          }}
                        >
                          <Link
                            href={href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center rounded-md px-3 py-1.5 text-sm transition-colors",
                              isActive
                                ? "border-l-2 border-violet-500 bg-violet-50 text-violet-700 font-medium dark:bg-violet-500/10 dark:text-violet-400"
                                : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                            )}
                          >
                            {component.name}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex fixed top-16 left-0 bottom-0 flex-col",
          "w-[280px] border-r overflow-y-auto",
          "bg-white border-neutral-200",
          "dark:bg-neutral-950 dark:border-neutral-800"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "fixed top-16 left-0 bottom-0 z-50 flex flex-col",
                "w-[280px] border-r overflow-y-auto",
                "bg-white border-neutral-200",
                "dark:bg-neutral-950 dark:border-neutral-800",
                "md:hidden"
              )}
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
