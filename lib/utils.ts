import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge for conditional and deduplicated Tailwind classes.
 * @param inputs - List of class values (strings, arrays, objects)
 * @returns A single merged className string
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Checks if required Supabase environment variables are set.
 * Used for tutorial and setup steps.
 */
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
