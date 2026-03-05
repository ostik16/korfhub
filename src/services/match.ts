import z from "zod";
import {
  CreateMatchRequestSchema,
  ListMatchesRequestSchema,
  MatchIdSchema,
  type Match,
} from "@/routes/data-server/types";

export const listMatches = async (
  payload: Partial<{
    page: number;
    items_per_page: number;
  }> = {},
): Promise<Match[]> => {
  const body = JSON.stringify({
    page: payload.page ?? 1,
    items_per_page: payload.items_per_page ?? 100,
  });

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/match/list`,
    { method: "POST", body },
  );

  const res = await request.json();
  const formatted: Match[] = res.map((m: any) => ({
    ...m,
    date: new Date(m.date),
  }));
  return formatted as Match[];
};

export const getMatch = async (
  id: z.infer<typeof MatchIdSchema>,
): Promise<Match | null> => {
  try {
    const request = await fetch(
      `http://${window.location.hostname}:3000/api/v1/match/${id}`,
      { method: "GET" },
    );

    if (!request.ok) {
      return null;
    }

    const res = await request.json();
    return {
      ...res,
      date: new Date(res.date),
    };
  } catch {
    return null;
  }
};

export const createMatch = async (payload: {
  home_team_id: string;
  away_team_id: string;
  home_team_roster_id?: number | null;
  away_team_roster_id?: number | null;
  date?: Date;
  period_duration?: number;
  period_count?: number;
  allowed_timeouts?: number;
  allowed_substitutions?: number;
}): Promise<Match> => {
  const sanitizedPayload = {
    home_team_id: payload.home_team_id,
    away_team_id: payload.away_team_id,
    home_team_roster_id: payload.home_team_roster_id ?? null,
    away_team_roster_id: payload.away_team_roster_id ?? null,
    date: payload.date?.toISOString() ?? new Date().toISOString(),
    period_duration: payload.period_duration ?? 600,
    period_count: payload.period_count ?? 2,
    allowed_timeouts: payload.allowed_timeouts ?? 2,
    allowed_substitutions: payload.allowed_substitutions ?? 999,
  };

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/match/create`,
    { method: "POST", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to create match:", errorText);
    throw new Error(`Failed to create match: ${request.statusText}`);
  }

  const res = await request.json();
  return {
    ...res,
    date: new Date(res.date),
  };
};

export const updateMatch = async (
  id: z.infer<typeof MatchIdSchema>,
  payload: Partial<{
    home_team_id: number;
    away_team_id: number;
    home_team_roster_id: number | null;
    away_team_roster_id: number | null;
    date: Date;
    period_duration: number;
    period_count: number;
    allowed_timeouts: number;
    allowed_substitutions: number;
    completed: boolean;
  }>,
): Promise<Match> => {
  const sanitizedPayload: Record<string, any> = {};

  if (payload.home_team_id !== undefined) {
    sanitizedPayload.home_team_id = payload.home_team_id;
  }
  if (payload.away_team_id !== undefined) {
    sanitizedPayload.away_team_id = payload.away_team_id;
  }
  if (payload.home_team_roster_id !== undefined) {
    sanitizedPayload.home_team_roster_id = payload.home_team_roster_id;
  }
  if (payload.away_team_roster_id !== undefined) {
    sanitizedPayload.away_team_roster_id = payload.away_team_roster_id;
  }
  if (payload.date !== undefined) {
    sanitizedPayload.date = payload.date.toISOString();
  }
  if (payload.period_duration !== undefined) {
    sanitizedPayload.period_duration = payload.period_duration;
  }
  if (payload.period_count !== undefined) {
    sanitizedPayload.period_count = payload.period_count;
  }
  if (payload.allowed_timeouts !== undefined) {
    sanitizedPayload.allowed_timeouts = payload.allowed_timeouts;
  }
  if (payload.allowed_substitutions !== undefined) {
    sanitizedPayload.allowed_substitutions = payload.allowed_substitutions;
  }
  if (payload.completed !== undefined) {
    sanitizedPayload.completed = payload.completed ? 1 : 0;
  }

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/match/${id}`,
    { method: "PUT", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to update match:", errorText);
    throw new Error(`Failed to update match: ${request.statusText}`);
  }

  const res = await request.json();
  return {
    ...res,
    date: new Date(res.date),
  };
};

export const deleteMatch = async (
  id: z.infer<typeof MatchIdSchema>,
): Promise<void> => {
  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/match/${id}`,
    { method: "DELETE" },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to delete match:", errorText);
    throw new Error(`Failed to delete match: ${request.statusText}`);
  }
};
