import z from "zod";
import {
  CreateTeamRequestSchema,
  ListTeamsRequestSchema,
  UpdateTeamRequestSchema,
  TeamIdSchema,
  type Team,
} from "@/routes/data-server/types";

export const listTeams = async (
  payload: Partial<{
    page: number;
    items_per_page: number;
  }> = {},
): Promise<Team[]> => {
  const body = JSON.stringify({
    page: payload.page ?? 1,
    items_per_page: payload.items_per_page ?? 100,
  });

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/team/list`,
    { method: "POST", body },
  );

  const res = await request.json();
  return res;
};

export const getTeam = async (
  id: z.infer<typeof TeamIdSchema>,
): Promise<Team | null> => {
  try {
    const request = await fetch(
      `http://${window.location.hostname}:3000/api/v1/team/${id}`,
      { method: "GET" },
    );

    if (!request.ok) {
      return null;
    }

    const res = await request.json();
    return res;
  } catch {
    return null;
  }
};

export const createTeam = async (payload: {
  name: string;
  short_name: string;
  colors: string[];
  league: string;
  logo: string | null;
}): Promise<Team> => {
  const sanitizedPayload = {
    name: payload.name,
    short_name: payload.short_name,
    colors: payload.colors,
    league: payload.league,
    logo: payload.logo === "" ? null : payload.logo,
  };

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/team/create`,
    { method: "POST", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to create team:", errorText);
    throw new Error(`Failed to create team: ${request.statusText}`);
  }

  const res = await request.json();
  return res;
};

export const updateTeam = async (
  id: z.infer<typeof TeamIdSchema>,
  payload: Partial<{
    name: string;
    short_name: string;
    logo: string | null;
    league: string;
    roster: number;
    color_1: string;
    color_2: string;
  }>,
): Promise<Team> => {
  const sanitizedPayload: Record<string, any> = {};

  if (payload.name !== undefined) {
    sanitizedPayload.name = payload.name;
  }
  if (payload.short_name !== undefined) {
    sanitizedPayload.short_name = payload.short_name;
  }
  if (payload.logo !== undefined) {
    sanitizedPayload.logo = payload.logo === "" ? null : payload.logo;
  }
  if (payload.league !== undefined) {
    sanitizedPayload.league = payload.league;
  }
  if (payload.roster !== undefined) {
    sanitizedPayload.roster = payload.roster === 0 ? null : payload.roster;
  }
  if (payload.color_1 !== undefined) {
    sanitizedPayload.color_1 = payload.color_1;
  }
  if (payload.color_2 !== undefined) {
    sanitizedPayload.color_2 = payload.color_2;
  }

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/team/${id}`,
    { method: "PUT", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to update team:", errorText);
    throw new Error(`Failed to update team: ${request.statusText}`);
  }

  const res = await request.json();
  return res;
};

export const deleteTeam = async (
  id: z.infer<typeof TeamIdSchema>,
): Promise<void> => {
  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/team/${id}`,
    { method: "DELETE" },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to delete team:", errorText);
    throw new Error(`Failed to delete team: ${request.statusText}`);
  }
};
