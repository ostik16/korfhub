export type SSState = {
  matchId: number | null;
  period: string;
  period_duration: number;
  home_score: number;
  home_name: string;
  home_logo: string | null;
  home_colors: string[];
  away_score: number;
  away_name: string;
  away_logo: string | null;
  away_colors: string[];
  time_remaining: number;
  time_remaining_formatted: string;
  time_started_at: number | null;
};

export type SSRoute<T> = {
  ws_message_type: string;
  handler: (payload: T, state: SSState) => SSState;
};
