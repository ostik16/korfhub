import type { Team } from "../data-server/types";

export type SSState = {
  id: number | null;
  period: string;
  period_duration: number;
  home_team: Team;
  home_score: number;
  away_team: Team;
  away_score: number;
  time_remaining: number;
  time_remaining_formatted: string;
  time_started_at: number | null;
};

export type SSRoute<T> = {
  ws_message_type: string;
} & (
  | {
      handler: (payload: T, state: SSState) => SSState;
    }
  | {
      asyncHandler: (payload: T, state: SSState) => Promise<SSState>;
    }
);
