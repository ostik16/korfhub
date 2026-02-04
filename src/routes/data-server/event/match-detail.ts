import { db } from "@/index";
import type { BunRequest } from "bun";
import { ListMatchEventsRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_event_response } from "../utils";

const url_path = "/api/v1/event/match-detail";
type path = "/api/v1/event/match-detail";

export const match_detail: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = ListMatchEventsRequestSchema.parse(json);

      const query_object = {
        match: payload.match,
        offset: (payload.page - 1) * payload.items_per_page,
        limit: payload.items_per_page,
      };

      const q = db.query(
        `
      SELECT
          e.id,
          e.match,
          e.team,
          e.player_1,
          e.player_2,
          e.type,
          e.score_type,
          e.card_type,
          e.note,
          e.match_time,
          e.date,
          t.id AS team_id,
          t.slug AS team_slug,
          t.name AS team_name,
          t.short_name AS team_short_name,
          t.colors AS team_colors,
          t.logo AS team_logo
      FROM events e
      LEFT JOIN teams t ON e.team = t.id
      WHERE e.match = $match
      ORDER BY e.match_time ASC LIMIT $limit OFFSET $offset
      `,
      );

      const events = q.all(query_object).map((e) => prepare_event_response(e));

      return Response.json(events, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
