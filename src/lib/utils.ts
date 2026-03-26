import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colorMap = {
  primary: "bg-primary text-white",
  success: "bg-success text-white",
  error: "bg-error text-white",
  warning: "bg-warning text-white",
} as const;

export type ColorVariant = keyof typeof colorMap;
