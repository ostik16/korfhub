import type { BunRequest } from "bun";
import { handle_error, prepare_roster_response } from "../utils";
import { db } from "@/index";
import { UpdateRosterRequestSchema, type Endpoint } from "../types";

const url_path = "/api/v1/roster/:id";
type path = "/api/v1/roster/:id";

export const id: Endpoint = {
  url_path,
  async GET(req: BunRequest<path>) {
    try {
      const id = req.params.id;

      const roster = prepare_roster_response(
        db.query("SELECT * FROM rosters WHERE id=?").get(id),
      );

      if (roster === null) {
        return Response.error();
      }

      return Response.json(roster, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async PUT(req: BunRequest<path>) {
    try {
      const id = req.params.id;
      const roster = prepare_roster_response(
        db.query("SELECT * FROM rosters WHERE id=?").get(id),
      );
      const json = await req.json();
      const payload = UpdateRosterRequestSchema.parse(json);

      if (roster === null) {
        return Response.error();
      }

      const query_object = {
        id,
        name: payload.name ?? roster.name,
        player_1: payload.player_1 !== undefined ? payload.player_1 : roster.player_1,
        player_2: payload.player_2 !== undefined ? payload.player_2 : roster.player_2,
        player_3: payload.player_3 !== undefined ? payload.player_3 : roster.player_3,
        player_4: payload.player_4 !== undefined ? payload.player_4 : roster.player_4,
        player_5: payload.player_5 !== undefined ? payload.player_5 : roster.player_5,
        player_6: payload.player_6 !== undefined ? payload.player_6 : roster.player_6,
        player_7: payload.player_7 !== undefined ? payload.player_7 : roster.player_7,
        player_8: payload.player_8 !== undefined ? payload.player_8 : roster.player_8,
        player_9: payload.player_9 !== undefined ? payload.player_9 : roster.player_9,
        player_10: payload.player_10 !== undefined ? payload.player_10 : roster.player_10,
        player_11: payload.player_11 !== undefined ? payload.player_11 : roster.player_11,
        player_12: payload.player_12 !== undefined ? payload.player_12 : roster.player_12,
        player_13: payload.player_13 !== undefined ? payload.player_13 : roster.player_13,
        player_14: payload.player_14 !== undefined ? payload.player_14 : roster.player_14,
        player_15: payload.player_15 !== undefined ? payload.player_15 : roster.player_15,
        player_16: payload.player_16 !== undefined ? payload.player_16 : roster.player_16,
      };

      db.query(
        `UPDATE rosters
          SET name=$name,
            player_1=$player_1,
            player_2=$player_2,
            player_3=$player_3,
            player_4=$player_4,
            player_5=$player_5,
            player_6=$player_6,
            player_7=$player_7,
            player_8=$player_8,
            player_9=$player_9,
            player_10=$player_10,
            player_11=$player_11,
            player_12=$player_12,
            player_13=$player_13,
            player_14=$player_14,
            player_15=$player_15,
            player_16=$player_16
          WHERE id=$id`,
      ).run(query_object);

      const updated_roster = prepare_roster_response(
        db.query("SELECT * FROM rosters WHERE id=?").get(id),
      );

      return Response.json(updated_roster, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
