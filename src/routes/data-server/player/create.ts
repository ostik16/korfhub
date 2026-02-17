import { type BunRequest } from "bun";
import { CreatePlayerRequestSchema, type Endpoint } from "../types";
import { db } from "@/index";
import { handle_error, prepare_player_response, sanitize_slug } from "../utils";

const url_path = "/api/v1/player/create";
type path = "/api/v1/player/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = CreatePlayerRequestSchema.parse(json);

      const slug = sanitize_slug(payload.name);

      const query_object = {
        id: null,
        slug,
        name: payload.name,
        number: payload.number ?? null,
        birthday: payload.birthday ?? null,
        default_team_id: payload.default_team_id ?? null,
      };

      const { lastInsertRowid } = db
        .query(
          "INSERT INTO players VALUES ($id, $slug, $name, $number, $birthday, $default_team_id)",
        )
        .run(query_object);

      const player = prepare_player_response(
        db.query("SELECT * FROM players WHERE id=?").get(lastInsertRowid),
      );

      return Response.json(player, { status: 201 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
