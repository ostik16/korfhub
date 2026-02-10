import { db } from "@/index";
import type { BunRequest } from "bun";
import {
  ListMatchesRequestSchema,
  ReadMatchResponseSchema,
  type Endpoint,
} from "../types";
import {
  handle_error,
  prepare_match_response,
  prepare_team_response,
} from "../utils";

const url_path = "/api/v1/match/list";
type path = "/api/v1/match/list";

export const list: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = req.body ? await req.json() : {};
      const payload = ListMatchesRequestSchema.parse(json);

      const query_object = {
        offset: (payload.page - 1) * payload.items_per_page,
        limit: payload.items_per_page,
      };

      const q = db.query(
        `
      SELECT
          m.id,
          m.date,
          m.slug,
          home.id AS home_team_id,
          home.slug AS home_team_slug,
          home.name AS home_team_name,
          home.short_name AS home_team_short_name,
          home.color_1 AS home_team_color_1,
          home.color_2 AS home_team_color_2,
          home.logo AS home_team_logo,
          away.id AS away_team_id,
          away.slug AS away_team_slug,
          away.name AS away_team_name,
          away.short_name AS away_team_short_name,
          away.color_1 AS away_team_color_1,
          away.color_2 AS away_team_color_2,
          away.logo AS away_team_logo
      FROM matches m
      LEFT JOIN teams home ON m.home_team_id = home.id
      LEFT JOIN teams away ON m.away_team_id = away.id
      ORDER BY m.id ASC LIMIT $limit OFFSET $offset
      `,
      );

      const teams = q.all(query_object).map((m) => prepare_match_response(m));

      return Response.json(teams, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
