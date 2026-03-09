import type { BunRequest } from "bun";
import { handle_error, prepare_match_response } from "../utils";
import { db } from "@/index";
import { ReadMatchResponseSchema, type Endpoint } from "../types";

const url_path = "/api/v1/match/:id";
type path = "/api/v1/match/:id";

export const id: Endpoint = {
  url_path,
  async GET(req: BunRequest<path>) {
    try {
      const id = req.params.id;

      const query = db
        .query(
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
        WHERE m.id=?
        `,
        )
        .get(id);

      if (query === null) {
        return Response.error();
      }

      const res = ReadMatchResponseSchema.parse(query);

      const match = prepare_match_response(res);
      if (match === null) {
        return Response.error();
      }

      // console.log(match);
      // const team_query = db.query<Match, number>("SELECT * FROM teams WHERE id=?")
      // const home_team = team_query.get(match.)

      return Response.json(match, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async PUT(req: BunRequest<path>) {
    try {
      const id = req.params.id;
      const json = await req.json();

      const current_match = db
        .query<any, string>(
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
            m.home_team_id,
            m.away_team_id,
            m.home_team_roster_id,
            m.away_team_roster_id
        FROM matches m
        WHERE m.id=?
        `,
        )
        .get(id);

      if (current_match === null || current_match === undefined) {
        return Response.json({ error: "Match not found" }, { status: 404 });
      }

      const query_object = {
        id,
        home_team_id: json.home_team_id ?? current_match.home_team_id,
        away_team_id: json.away_team_id ?? current_match.away_team_id,
        home_team_roster_id:
          json.home_team_roster_id !== undefined
            ? json.home_team_roster_id
            : current_match.home_team_roster_id,
        away_team_roster_id:
          json.away_team_roster_id !== undefined
            ? json.away_team_roster_id
            : current_match.away_team_roster_id,
        date: json.date ?? current_match.date,
        period_duration: json.period_duration ?? current_match.period_duration,
        period_count: json.period_count ?? current_match.period_count,
        allowed_timeouts:
          json.allowed_timeouts !== undefined
            ? json.allowed_timeouts
            : current_match.allowed_timeouts,
        allowed_substitutions:
          json.allowed_substitutions !== undefined
            ? json.allowed_substitutions
            : current_match.allowed_substitutions,
        completed:
          json.completed !== undefined
            ? json.completed
            : current_match.completed,
      };

      db.query(
        `UPDATE matches
          SET home_team_id=$home_team_id,
            away_team_id=$away_team_id,
            home_team_roster_id=$home_team_roster_id,
            away_team_roster_id=$away_team_roster_id,
            date=$date,
            period_duration=$period_duration,
            period_count=$period_count,
            allowed_timeouts=$allowed_timeouts,
            allowed_substitutions=$allowed_substitutions,
            completed=$completed
          WHERE id=$id`,
      ).run(query_object);

      const updated_query = db
        .query(
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
        WHERE m.id=?
        `,
        )
        .get(id);

      const res = ReadMatchResponseSchema.parse(updated_query);
      const match = prepare_match_response(res);

      return Response.json(match, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async DELETE(req: BunRequest<path>) {
    try {
      const id = req.params.id;

      const match = db.query("SELECT * FROM matches WHERE id=?").get(id);

      if (match === null) {
        return Response.json({ error: "Match not found" }, { status: 404 });
      }

      db.query("DELETE FROM matches WHERE id=?").run(id);

      return Response.json({ success: true }, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
