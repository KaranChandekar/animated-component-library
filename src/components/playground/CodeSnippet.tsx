"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";
import { cn } from "@/lib/utils";
import { getComponentById } from "@/data/componentConfig";
import { useCopyToClipboard } from "@/lib/hooks";

type TabKey = "usage" | "component" | "types";

const tabs: { key: TabKey; label: string }[] = [
  { key: "usage", label: "Usage" },
  { key: "component", label: "Component" },
  { key: "types", label: "Types" },
];

interface CodeSnippetProps {
  componentId: string;
}

export function CodeSnippet({ componentId }: CodeSnippetProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("usage");
  const [highlightedHtml, setHighlightedHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { copied, copy } = useCopyToClipboard();

  const config = getComponentById(componentId);

  const getCodeForTab = useCallback(
    (tab: TabKey): string => {
      if (!config) return "";
      switch (tab) {
        case "usage":
          return config.usage;
        case "component":
          return config.componentCode;
        case "types":
          return config.typesCode;
      }
    },
    [config]
  );

  useEffect(() => {
    let cancelled = false;
    const code = getCodeForTab(activeTab);

    if (!code) {
      setHighlightedHtml("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const isDark =
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark");

    codeToHtml(code, {
      lang: "tsx",
      theme: isDark ? "github-dark" : "github-light",
    })
      .then((html) => {
        if (!cancelled) {
          setHighlightedHtml(html);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHighlightedHtml(
            `<pre class="p-4 text-sm"><code>${escapeHtml(code)}</code></pre>`
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, getCodeForTab]);

  const handleCopy = () => {
    const code = getCodeForTab(activeTab);
    if (code) copy(code);
  };

  if (!config) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950">
        No code available for &ldquo;{componentId}&rdquo;
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {/* Header with tabs and copy button */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
        {/* Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative px-3 py-3 text-xs font-medium transition-colors",
                activeTab === tab.key
                  ? "text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              )}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
            copied
              ? "text-emerald-600"
              : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code area */}
      <div className="max-h-[400px] overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-blue-600" />
          </div>
        ) : (
          <div
            className="[&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!bg-transparent [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:text-[13px]"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        )}
      </div>
    </div>
  );
}

/** Simple HTML entity escaping for fallback rendering */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
