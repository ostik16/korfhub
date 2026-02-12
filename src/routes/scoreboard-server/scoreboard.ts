import type { SSRoute } from "./types";

const set: SSRoute<{ scoreboard_visible: boolean }> = {
  ws_message_type: "scoreaboard_set",
  handler(payload, state) {
    const scoreboard_visible = payload.scoreboard_visible;

    return {
      ...state,
      scoreboard_visible,
    };
  },
};

export const scoreboard = {
  set,
};
