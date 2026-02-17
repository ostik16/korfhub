import { db } from "@/index";
import type { BunRequest } from "bun";
import { ListPlayersRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_player_response } from "../utils";

const url_path = "/api/v1/player/list";
type path = "/api/v1/player/list";

export const list: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = ListPlayersRequestSchema.parse(json);

      const query_object = {
        offset: (payload.page - 1) * payload.items_per_page,
        limit: payload.items_per_page,
      };

      const q = db.query(
        "SELECT * FROM players ORDER BY name ASC LIMIT $limit OFFSET $offset",
      );

      const players = q.all(query_object).map((p) => prepare_player_response(p));

      return Response.json(players, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
