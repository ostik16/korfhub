import type { SSRoute, SSState } from "./types";

const home: SSRoute<{ score: number }> = {
  ws_message_type: "score_home",
  handler(payload, state) {
    const score = Number(payload.score);

    if (isNaN(score)) {
      return state;
    }

    const score_home = Math.max(state.score_home + score, 0);

    return { ...state, score_home } as SSState;
  },
};

const away: SSRoute<{ score: number }> = {
  ws_message_type: "score_away",
  handler(payload, state) {
    const score = Number(payload.score);

    if (isNaN(score)) {
      return state;
    }

    const score_away = Math.max(state.score_away + score, 0);

    return { ...state, score_away } as SSState;
  },
};

const reset: SSRoute<null> = {
  ws_message_type: "score_reset",
  handler(payload, state) {
    return { ...state, score_home: 0, score_away: 0 } as SSState;
  },
};

export const score = {
  home,
  away,
  reset,
};
