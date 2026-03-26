"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropDefinition } from "@/data/componentConfig";

interface PropEditorProps {
  propDefs: PropDefinition[];
  values: Record<string, unknown>;
  onChange: (propName: string, value: unknown) => void;
}

export function PropEditor({ propDefs, values, onChange }: PropEditorProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Props
        </h3>
        <button
          onClick={() => {
            propDefs.forEach((def) => onChange(def.name, def.defaultValue));
          }}
          className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          Reset All
        </button>
      </div>

      {/* Prop list */}
      <div className="max-h-[420px] overflow-y-auto p-2">
        <div className="space-y-1">
          {propDefs.map((def) => (
            <PropRow
              key={def.name}
              def={def}
              value={values[def.name] ?? def.defaultValue}
              onChange={(value) => onChange(def.name, value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PropRowProps {
  def: PropDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

function PropRow({ def, value, onChange }: PropRowProps) {
  const isDefault = value === def.defaultValue;

  return (
    <div className="group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
      {/* Label */}
      <div className="flex min-w-0 shrink-0 items-center gap-2">
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {def.name}
        </span>
        {!isDefault && (
          <button
            onClick={() => onChange(def.defaultValue)}
            title="Reset to default"
            className="inline-flex h-4 w-4 items-center justify-center rounded text-neutral-400 opacity-0 transition-opacity hover:text-neutral-600 group-hover:opacity-100 dark:hover:text-neutral-200"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Control */}
      <div className="flex shrink-0 items-center gap-2">
        {def.type === "boolean" && (
          <BooleanControl
            value={value as boolean}
            onChange={onChange}
          />
        )}
        {def.type === "number" && (
          <NumberControl
            value={value as number}
            min={def.min}
            max={def.max}
            onChange={onChange}
          />
        )}
        {def.type === "string" && (
          <StringControl
            value={value as string}
            onChange={onChange}
          />
        )}
        {def.type === "select" && (
          <SelectControl
            value={value as string}
            options={def.options ?? []}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Boolean Toggle ──────────────────────────────────────────────────── */

function BooleanControl({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors",
        value
          ? "bg-blue-600"
          : "bg-neutral-300 dark:bg-neutral-700"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform",
          value ? "translate-x-[18px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}

/* ─── Number Slider ───────────────────────────────────────────────────── */

function NumberControl({
  value,
  min = 0,
  max = 100,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  const step = max - min <= 1 ? 0.01 : 1;

  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-neutral-200 accent-blue-600 dark:bg-neutral-700"
      />
      <span className="min-w-[2.5rem] text-right font-mono text-xs text-neutral-500">
        {step < 1 ? value.toFixed(2) : value}
      </span>
    </div>
  );
}

/* ─── String Input ────────────────────────────────────────────────────── */

function StringControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-36 rounded-md border border-neutral-200 bg-transparent px-2 text-xs text-neutral-900 outline-none transition-colors focus:border-blue-500 dark:border-neutral-700 dark:text-neutral-100"
    />
  );
}

/* ─── Select Dropdown ─────────────────────────────────────────────────── */

function SelectControl({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 rounded-md border border-neutral-200 bg-transparent px-2 pr-6 text-xs text-neutral-900 outline-none transition-colors focus:border-blue-500 dark:border-neutral-700 dark:text-neutral-100"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
