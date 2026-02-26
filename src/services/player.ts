import z from "zod";
import {
  CreatePlayerRequestSchema,
  ListPlayersRequestSchema,
  UpdatePlayerRequestSchema,
  PlayerId,
  type Player,
} from "@/routes/data-server/types";

export const listPlayers = async (
  payload: Partial<{
    page: number;
    items_per_page: number;
  }> = {},
): Promise<Player[]> => {
  const body = JSON.stringify({
    page: payload.page ?? 1,
    items_per_page: payload.items_per_page ?? 100,
  });

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/player/list`,
    { method: "POST", body },
  );

  const res = await request.json();
  return res;
};

export const getPlayer = async (
  id: z.infer<typeof PlayerId>,
): Promise<Player | null> => {
  try {
    const request = await fetch(
      `http://${window.location.hostname}:3000/api/v1/player/${id}`,
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

export const createPlayer = async (
  payload: Partial<{
    name: string;
    number: number | null;
    birthday: string | null;
    default_team_id: number | null;
  }>,
): Promise<Player> => {
  const sanitizedPayload = {
    name: payload.name,
    number:
      payload.number === null || payload.number === undefined
        ? null
        : Number(payload.number),
    birthday:
      payload.birthday === null || payload.birthday === ""
        ? null
        : payload.birthday,
    default_team_id:
      payload.default_team_id === null || payload.default_team_id === undefined
        ? null
        : Number(payload.default_team_id),
  };

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/player/create`,
    { method: "POST", body },
  );

  const res = await request.json();
  return res;
};

export const updatePlayer = async (
  id: z.infer<typeof PlayerId>,
  payload: Partial<{
    name: string;
    number: number | null;
    birthday: string | null;
    default_team_id: number | null;
    picture: string | null;
  }>,
): Promise<Player> => {
  const sanitizedPayload: Record<string, any> = {};

  if (payload.name !== undefined) {
    sanitizedPayload.name = payload.name;
  }
  if (payload.number !== undefined) {
    sanitizedPayload.number =
      payload.number === null || payload.number === 0
        ? null
        : Number(payload.number);
  }
  if (payload.birthday !== undefined) {
    sanitizedPayload.birthday =
      payload.birthday === null || payload.birthday === ""
        ? null
        : payload.birthday;
  }
  if (payload.default_team_id !== undefined) {
    sanitizedPayload.default_team_id =
      payload.default_team_id === null || payload.default_team_id === 0
        ? null
        : Number(payload.default_team_id);
  }
  if (payload.picture !== undefined) {
    sanitizedPayload.picture = payload.picture;
  }

  const body = JSON.stringify(sanitizedPayload);

  const request = await fetch(
    `http://${window.location.hostname}:3000/api/v1/player/${id}`,
    { method: "PUT", body },
  );

  if (!request.ok) {
    const errorText = await request.text();
    console.error("Failed to update player:", errorText);
    throw new Error(`Failed to update player: ${request.statusText}`);
  }

  const res = await request.json();
  return res;
};
