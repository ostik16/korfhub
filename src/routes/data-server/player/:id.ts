import type { BunRequest } from "bun";
import { handle_error, prepare_player_response } from "../utils";
import { db } from "@/index";
import { UpdatePlayerRequestSchema, type Endpoint } from "../types";

const url_path = "/api/v1/player/:id";
type path = "/api/v1/player/:id";

export const id: Endpoint = {
  url_path,
  async GET(req: BunRequest<path>) {
    try {
      const id = req.params.id;

      const player = prepare_player_response(
        db.query("SELECT * FROM players WHERE id=?").get(id),
      );

      if (player === null) {
        return Response.error();
      }

      return Response.json(player, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async PUT(req: BunRequest<path>) {
    try {
      const id = req.params.id;
      const player = prepare_player_response(
        db.query("SELECT * FROM players WHERE id=?").get(id),
      );
      const json = await req.json();
      const payload = UpdatePlayerRequestSchema.parse(json);

      if (player === null) {
        return Response.error();
      }

      const query_object = {
        id,
        name: payload.name ?? player.name,
        number: payload.number !== undefined ? payload.number : player.number,
        birthday:
          payload.birthday !== undefined ? payload.birthday : player.birthday,
        default_team_id:
          payload.default_team_id !== undefined
            ? payload.default_team_id
            : player.default_team_id,
      };

      db.query(
        `UPDATE players
          SET name=$name,
            number=$number,
            birthday=$birthday,
            default_team_id=$default_team_id
          WHERE id=$id`,
      ).run(query_object);

      const updated_player = prepare_player_response(
        db.query("SELECT * FROM players WHERE id=?").get(id),
      );

      return Response.json(updated_player, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
