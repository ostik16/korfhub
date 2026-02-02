import { db } from "@/index";
import type { BunRequest } from "bun";
import { ListTeamsRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_team_response } from "../utils";

const url_path = "/api/v1/team/list";
type path = "/api/v1/team/list";

export const list: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = ListTeamsRequestSchema.parse(json);

      const query_object = {
        offset: (payload.page - 1) * payload.items_per_page,
        limit: payload.items_per_page,
      };

      const q = db.query(
        "SELECT * FROM teams ORDER BY name ASC LIMIT $limit OFFSET $offset",
      );

      const teams = q.all(query_object).map((t) => prepare_team_response(t));

      return Response.json(teams, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
