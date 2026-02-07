import type { SSRoute, SSState } from "./types";

const home: SSRoute<{ score: number }> = {
  ws_message_type: "score_home",
  async asyncHandler(payload, state) {
    const score = Number(payload.score);

    if (isNaN(score)) {
      return state;
    }

    if (score > 0) {
      const elapsed_time = (
        state.period_duration -
        state.time_remaining +
        state.period_duration * (state.period - 1)
      ).toFixed(1);

      const event_info = JSON.stringify({
        match: state.id,
        team: state.home_team.id,
        match_time: Number(elapsed_time),
        type: "score",
      });

      await fetch(process.env.DATASERVICE_URL + "/api/v1/event/create", {
        method: "POST",
        body: event_info,
      });
    }

    const home_score = Math.max(state.home_score + score, 0);

    return { ...state, home_score } as SSState;
  },
};

const away: SSRoute<{ score: number }> = {
  ws_message_type: "score_away",
  async asyncHandler(payload, state) {
    const score = Number(payload.score);

    if (isNaN(score)) {
      return state;
    }

    if (score > 0) {
      const elapsed_time = (
        state.period_duration -
        state.time_remaining +
        state.period_duration * (state.period - 1)
      ).toFixed(1);

      const event_info = JSON.stringify({
        match: state.id,
        team: state.away_team.id,
        match_time: Number(elapsed_time),
        type: "score",
      });

      await fetch(process.env.DATASERVICE_URL + "/api/v1/event/create", {
        method: "POST",
        body: event_info,
      });
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
