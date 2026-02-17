import { db } from "@/index";
import type { BunRequest } from "bun";
import { ListRostersRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_roster_response } from "../utils";

const url_path = "/api/v1/roster/list";
type path = "/api/v1/roster/list";

export const list: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = ListRostersRequestSchema.parse(json);

      const query_object = {
        offset: (payload.page - 1) * payload.items_per_page,
        limit: payload.items_per_page,
      };

      const q = db.query(
        "SELECT * FROM rosters ORDER BY name ASC LIMIT $limit OFFSET $offset",
      );

      const rosters = q.all(query_object).map((r) => prepare_roster_response(r));

      return Response.json(rosters, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
