import { calculate_remaining_time, format } from "@/lib/utils";
import type { SSRoute, SSState } from "./types";
import type { Event, Match, MatchId } from "../data-server/types";

const set: SSRoute<{ id: number }> = {
  ws_message_type: "match_set",
  async asyncHandler(payload, state) {
    try {
      const id = Number(payload.id) as MatchId;

      if (isNaN(id)) {
        return state;
      }

      const match_req = await fetch(
        process.env.DATASERVICE_URL + "/api/v1/match/" + id,
      );
      const match: Match = await match_req.json();

      const events_req = await fetch(
        process.env.DATASERVICE_URL + "/api/v1/event/match-detail",
        {
          method: "POST",
          body: JSON.stringify({
            match: id,
          }),
        },
      );
      const events: Event[] = await events_req.json();

      let home_score = 0;
      let away_score = 0;
      let time_remaining = state.period_duration;
      let period = 1;

      const home_team_id = match.home_team.id;
      const away_team_id = match.away_team.id;

      events.forEach((event, index) => {
        if (index === 0) {
          // this should be latest event by game time
          period = Math.ceil(event.match_time / state.period_duration);
          time_remaining =
            state.period_duration - (event.match_time % state.period_duration);
        }

        if (event.type !== "score") {
          return;
        }

        if (event.team?.id === home_team_id) {
          home_score++;
        }
        if (event.team?.id === away_team_id) {
          away_score++;
        }
      });

      return {
        ...state,
        ...match,
        home_score,
        away_score,
        period,
        time_remaining,
        id,
      };
    } catch {
      return state;
    }
  },
};

const info: SSRoute<null> = {
  ws_message_type: "match_info",
  handler(payload, state) {
    const time_remaining = calculate_remaining_time(state, 1);

    const minutes = Math.floor(time_remaining / 60);
    const seconds = Math.floor(time_remaining % 60);

    let time_remaining_formatted = "";

    if (minutes < 1) {
      time_remaining_formatted = time_remaining
        .toFixed(1)
        .padStart(time_remaining < 10 ? 4 : 3, "0");
    } else {
      time_remaining_formatted = `${format(minutes)}:${format(seconds)}`;
    }

    return {
      ...state,
      time_remaining,
      time_remaining_formatted,
    };
  },
};

export const match = {
  set,
  info,
};
