import z from "zod";
import {
  CreateRosterRequestSchema,
  ListRostersRequestSchema,
  UpdateRosterRequestSchema,
  PlayerId,
  type Roster,
  type RosterId,
} from "@/routes/data-server/types";

export const listRosters = async (
  payload: Partial<{
    page: number;
    items_per_page: number;
  }> = {},
): Promise<Roster[]> => {
  const body = JSON.stringify({
    page: payload.page ?? 1,
    items_per_page: payload.items_per_page ?? 100,
  });

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/roster/list`,
    { method: "POST", body },
  );

  const res = await request.json();
  return res;
};

export const getRoster = async (
  id: z.infer<typeof RosterId>,
): Promise<Roster | null> => {
  try {
    const request = await fetch(
      `http://${window.location.hostname}:3000/api/v1/roster/${id}`,
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

export const createRoster = async (
  payload: Partial<{
    name: string;
    team_id: number | null;
    category: string | null;
    player_1: number;
    player_2: number;
    player_3: number;
    player_4: number;
    player_5: number;
    player_6: number;
    player_7: number;
    player_8: number;
    player_9: number | null;
    player_10: number | null;
    player_11: number | null;
    player_12: number | null;
    player_13: number | null;
    player_14: number | null;
    player_15: number | null;
    player_16: number | null;
  }>,
): Promise<Roster> => {
  const sanitizedPayload = {
    name: payload.name,
    team_id: payload.team_id ?? null,
    category: payload.category ?? null,
    player_1: payload.player_1,
    player_2: payload.player_2,
    player_3: payload.player_3,
    player_4: payload.player_4,
    player_5: payload.player_5,
    player_6: payload.player_6,
    player_7: payload.player_7,
    player_8: payload.player_8,
    player_9: payload.player_9 ?? null,
    player_10: payload.player_10 ?? null,
    player_11: payload.player_11 ?? null,
    player_12: payload.player_12 ?? null,
    player_13: payload.player_13 ?? null,
    player_14: payload.player_14 ?? null,
    player_15: payload.player_15 ?? null,
    player_16: payload.player_16 ?? null,
  };

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/roster/create`,
    { method: "POST", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to create roster:", errorText);
    throw new Error(`Failed to create roster: ${request.statusText}`);
  }

  const res = await request.json();
  return res;
};

export const updateRoster = async (
  id: z.infer<typeof RosterId>,
  payload: Partial<{
    name: string;
    team_id: number | null;
    category: string | null;
    player_1: number;
    player_2: number;
    player_3: number;
    player_4: number;
    player_5: number;
    player_6: number;
    player_7: number;
    player_8: number;
    player_9: number | null;
    player_10: number | null;
    player_11: number | null;
    player_12: number | null;
    player_13: number | null;
    player_14: number | null;
    player_15: number | null;
    player_16: number | null;
  }>,
): Promise<Roster> => {
  const sanitizedPayload: Record<string, any> = {};

  if (payload.name !== undefined) {
    sanitizedPayload.name = payload.name;
  }
  if (payload.team_id !== undefined) {
    sanitizedPayload.team_id = payload.team_id;
  }
  if (payload.category !== undefined) {
    sanitizedPayload.category = payload.category;
  }
  if (payload.player_1 !== undefined) {
    sanitizedPayload.player_1 = payload.player_1;
  }
  if (payload.player_2 !== undefined) {
    sanitizedPayload.player_2 = payload.player_2;
  }
  if (payload.player_3 !== undefined) {
    sanitizedPayload.player_3 = payload.player_3;
  }
  if (payload.player_4 !== undefined) {
    sanitizedPayload.player_4 = payload.player_4;
  }
  if (payload.player_5 !== undefined) {
    sanitizedPayload.player_5 = payload.player_5;
  }
  if (payload.player_6 !== undefined) {
    sanitizedPayload.player_6 = payload.player_6;
  }
  if (payload.player_7 !== undefined) {
    sanitizedPayload.player_7 = payload.player_7;
  }
  if (payload.player_8 !== undefined) {
    sanitizedPayload.player_8 = payload.player_8;
  }
  if (payload.player_9 !== undefined) {
    sanitizedPayload.player_9 = payload.player_9;
  }
  if (payload.player_10 !== undefined) {
    sanitizedPayload.player_10 = payload.player_10;
  }
  if (payload.player_11 !== undefined) {
    sanitizedPayload.player_11 = payload.player_11;
  }
  if (payload.player_12 !== undefined) {
    sanitizedPayload.player_12 = payload.player_12;
  }
  if (payload.player_13 !== undefined) {
    sanitizedPayload.player_13 = payload.player_13;
  }
  if (payload.player_14 !== undefined) {
    sanitizedPayload.player_14 = payload.player_14;
  }
  if (payload.player_15 !== undefined) {
    sanitizedPayload.player_15 = payload.player_15;
  }
  if (payload.player_16 !== undefined) {
    sanitizedPayload.player_16 = payload.player_16;
  }

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/roster/${id}`,
    { method: "PUT", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to update roster:", errorText);
    throw new Error(`Failed to update roster: ${request.statusText}`);
  }

  const res = await request.json();
  return res;
};
