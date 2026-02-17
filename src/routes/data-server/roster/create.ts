import { type BunRequest } from "bun";
import { CreateRosterRequestSchema, type Endpoint } from "../types";
import { db } from "@/index";
import { handle_error, prepare_roster_response } from "../utils";

const url_path = "/api/v1/roster/create";
type path = "/api/v1/roster/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = CreateRosterRequestSchema.parse(json);

      const query_object = {
        id: null,
        name: payload.name,
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

      const { lastInsertRowid } = db
        .query(
          "INSERT INTO rosters VALUES ($id, $name, $player_1, $player_2, $player_3, $player_4, $player_5, $player_6, $player_7, $player_8, $player_9, $player_10, $player_11, $player_12, $player_13, $player_14, $player_15, $player_16)",
        )
        .run(query_object);

      const roster = prepare_roster_response(
        db.query("SELECT * FROM rosters WHERE id=?").get(lastInsertRowid),
      );

      return Response.json(roster, { status: 201 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
