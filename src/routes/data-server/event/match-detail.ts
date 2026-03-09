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
          t.color_1 AS team_color_1,
          t.color_2 AS team_color_2,
          t.logo AS team_logo,
          p1.id AS player_1_id,
          p1.name AS player_1_name,
          p1.number AS player_1_number,
          p2.id AS player_2_id,
          p2.name AS player_2_name,
          p2.number AS player_2_number
      FROM events e
      LEFT JOIN teams t ON e.team = t.id
      LEFT JOIN players p1 ON e.player_1 = p1.id
      LEFT JOIN players p2 ON e.player_2 = p2.id
      WHERE e.match = $match
      ORDER BY e.match_time DESC LIMIT $limit OFFSET $offset
      `,
      );

      const events = q.all(query_object).map((e) => prepare_event_response(e));

      return Response.json(events, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
