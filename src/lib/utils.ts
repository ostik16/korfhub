import type { SSState } from "@/routes/scoreboard-server/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const format = (num: number | undefined) => String(num).padStart(2, "0");

export const calculate_remaining_time = (
  time_started_at: number | null,
  time_remaining: number,
  toFixed = 2,
) => {
  if (!time_started_at) {
    return Number(time_remaining.toFixed(toFixed));
  }

  const start = time_started_at;
  const end = Date.now();
  const diff = (end - start) / 1000; // with .1s precision
  const calculated_time = Number(
    Number(time_remaining - diff).toFixed(toFixed),
  );

  return Math.max(calculated_time, 0); // do not go bellow 0
};

export const calculate_match_time = (state: SSState) => {
  const elapsed = (
    state.period_duration -
    state.time_remaining +
    state.period_duration * (state.period - 1)
  ).toFixed(1);

  return Number(elapsed);
};
