import type { SSRoute } from "./types";

const set: SSRoute<{ name: string }> = {
  ws_message_type: "period_set",
  handler(payload, state) {
    const period = payload.name;

    return {
      ...state,
      period,
    };
  },
};

const limit: SSRoute<{ time: number }> = {
  ws_message_type: "period_limit",
  handler(payload, state) {
    const period_duration = Number(payload.time);

    if (isNaN(period_duration)) {
      return state;
    }

    return {
      ...state,
      period_duration,
    };
  },
};

export const period = {
  set,
  limit,
};
