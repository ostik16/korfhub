import { calculate_remaining_time, format } from "@/lib/utils";
import type { SSRoute, SSState } from "./types";
import { id as match_id } from "@/routes/data-server/match/:id";
import type { Match } from "../data-server/types";

const set: SSRoute<{ id: number }> = {
  ws_message_type: "match_set",
  async asyncHandler(payload, state) {
    try {
      const id = Number(payload.id);

      if (isNaN(id)) {
        return state;
      }

      const res = await fetch(
        process.env.DATASERVICE_URL + "/api/v1/match/" + id,
      );
      const match = await res.json();

      return {
        ...state,
        ...match,
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
