import { calculate_remaining_time } from "@/lib/utils";
import type { SSState, SSRoute } from "./types";

const start: SSRoute<null> = {
  ws_message_type: "time_start",
  handler(payload, state) {
    if (state.time_started_at !== null) {
      return state;
    }

    if (state.time_remaining <= 0) {
      // just to be safe
      return { ...state, time_started_at: null };
    }

    const time_started_at = Date.now();

    return { ...state, time_started_at } as SSState;
  },
};

const stop: SSRoute<null> = {
  ws_message_type: "time_stop",
  handler(payload, state) {
    const time_remaining = calculate_remaining_time(state);

    return { ...state, time_remaining, time_started_at: null } as SSState;
  },
};

const reset: SSRoute<null> = {
  ws_message_type: "time_reset",
  handler(payload, state) {
    return {
      ...state,
      time_remaining: state.period_duration,
      time_started_at: null,
    };
  },
};

const set: SSRoute<{ time: number }> = {
  ws_message_type: "time_set",
  handler(payload, state) {
    const time = Number(payload.time);

    if (isNaN(time)) {
      return state;
    }

    const time_remaining = Math.max(time, 0);

    return {
      ...state,
      time_remaining,
      time_started_at: null,
    };
  },
};

const adjust: SSRoute<{ time: number }> = {
  ws_message_type: "time_adjust",
  handler(payload, state) {
    const time = Number(payload.time);

    if (isNaN(time)) {
      return state;
    }

    const time_remaining = Math.max(state.time_remaining + time, 0);

    return {
      ...state,
      time_remaining,
      time_started_at: null,
    };
  },
};

export const time = {
  start,
  stop,
  reset,
  set,
  adjust,
};
