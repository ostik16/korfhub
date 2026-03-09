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
          m.period_duration,
          m.period_count,
          m.allowed_timeouts,
          m.allowed_substitutions,
          m.completed,
          m.home_team_roster_id,
          m.away_team_roster_id,
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
          away.logo AS away_team_logo,
          home_roster.id AS home_roster_id,
          home_roster.name AS home_roster_name,
          home_roster.team_id AS home_roster_team_id,
          home_roster.category AS home_roster_category,
          home_roster.player_1 AS home_roster_player_1,
          home_roster.player_2 AS home_roster_player_2,
          home_roster.player_3 AS home_roster_player_3,
          home_roster.player_4 AS home_roster_player_4,
          home_roster.player_5 AS home_roster_player_5,
          home_roster.player_6 AS home_roster_player_6,
          home_roster.player_7 AS home_roster_player_7,
          home_roster.player_8 AS home_roster_player_8,
          home_roster.player_9 AS home_roster_player_9,
          home_roster.player_10 AS home_roster_player_10,
          home_roster.player_11 AS home_roster_player_11,
          home_roster.player_12 AS home_roster_player_12,
          home_roster.player_13 AS home_roster_player_13,
          home_roster.player_14 AS home_roster_player_14,
          home_roster.player_15 AS home_roster_player_15,
          home_roster.player_16 AS home_roster_player_16,
          away_roster.id AS away_roster_id,
          away_roster.name AS away_roster_name,
          away_roster.team_id AS away_roster_team_id,
          away_roster.category AS away_roster_category,
          away_roster.player_1 AS away_roster_player_1,
          away_roster.player_2 AS away_roster_player_2,
          away_roster.player_3 AS away_roster_player_3,
          away_roster.player_4 AS away_roster_player_4,
          away_roster.player_5 AS away_roster_player_5,
          away_roster.player_6 AS away_roster_player_6,
          away_roster.player_7 AS away_roster_player_7,
          away_roster.player_8 AS away_roster_player_8,
          away_roster.player_9 AS away_roster_player_9,
          away_roster.player_10 AS away_roster_player_10,
          away_roster.player_11 AS away_roster_player_11,
          away_roster.player_12 AS away_roster_player_12,
          away_roster.player_13 AS away_roster_player_13,
          away_roster.player_14 AS away_roster_player_14,
          away_roster.player_15 AS away_roster_player_15,
          away_roster.player_16 AS away_roster_player_16
      FROM matches m
      LEFT JOIN teams home ON m.home_team_id = home.id
      LEFT JOIN teams away ON m.away_team_id = away.id
      LEFT JOIN rosters home_roster ON m.home_team_roster_id = home_roster.id
      LEFT JOIN rosters away_roster ON m.away_team_roster_id = away_roster.id
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
