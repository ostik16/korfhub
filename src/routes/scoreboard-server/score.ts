import type { SSRoute, SSState } from "./types";

const home: SSRoute<{ score: number }> = {
  ws_message_type: "score_home",
  handler(payload, state) {
    const score = Number(payload.score);

    if (isNaN(score)) {
      return state;
    }

    const home_score = Math.max(state.home_score + score, 0);

    return { ...state, home_score } as SSState;
  },
};

const away: SSRoute<{ score: number }> = {
  ws_message_type: "score_away",
  handler(payload, state) {
    const score = Number(payload.score);

    if (isNaN(score)) {
      return state;
    }

    const away_score = Math.max(state.away_score + score, 0);

    return { ...state, away_score } as SSState;
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
