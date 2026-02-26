import { db } from "@/index";
import type { BunRequest } from "bun";
import { ListStatisticsRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_statistic_response } from "../utils";

const url_path = "/api/v1/statistics/list";
type path = "/api/v1/statistics/list";

export const list: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = ListStatisticsRequestSchema.parse(json);
      const query: string[] = [];
      const params: Record<string, any> = {
        offset: (payload.page - 1) * payload.items_per_page,
        limit: payload.items_per_page,
      };
      if (payload.match) {
        query.push("match = $match");
        params.match = payload.match;
      }
      if (payload.player) {
        query.push("player = $player");
        params.player = payload.player;
      }
      const where = query.length ? `WHERE ${query.join(" AND ")}` : "";
      const q = db.query(
        `SELECT * FROM statistics ${where} ORDER BY id ASC LIMIT $limit OFFSET $offset`
      );
      const stats = q.all(params).map(prepare_statistic_response);
      return Response.json(stats, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
