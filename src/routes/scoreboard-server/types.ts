export type SSState = {
  matchId: number | null;
  period: string;
  period_duration: number;
  score_home: number;
  score_away: number;
  time_remaining: number;
  time_remaining_formatted: string;
  time_started_at: number | null;
};

export type SSRoute<T> = {
  ws_message_type: string;
  handler: (payload: T, state: SSState) => SSState;
};
