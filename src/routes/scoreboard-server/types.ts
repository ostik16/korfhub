import z from "zod";
import type { MatchId, Team } from "../data-server/types";

export const PeriodTypeSchema = z.enum([
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "H1",
  "H2",
  "GG",
]);

export type PeriodType = z.infer<typeof PeriodTypeSchema>;

export type SSState = {
  id: MatchId | null;
  period: number;
  period_count: number;
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
