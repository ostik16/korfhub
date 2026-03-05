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
            home.id AS home_team_id,
            home.slug AS home_team_slug,
            home.name AS home_team_name,
            home.short_name AS home_team_short_name,
            home.color_1 AS home_team_color_1,
            home.color_2 AS home_team_color_2,
            home.logo AS home_team_logo,
            home.roster AS home_team_roster,
            away.id AS away_team_id,
            away.slug AS away_team_slug,
            away.name AS away_team_name,
            away.short_name AS away_team_short_name,
            away.color_1 AS away_team_color_1,
            away.color_2 AS away_team_color_2,
            away.logo AS away_team_logo,
            away.roster AS away_team_roster
        FROM matches m
        LEFT JOIN teams home ON m.home_team_id = home.id
        LEFT JOIN teams away ON m.away_team_id = away.id
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
            home.id AS home_team_id,
            home.slug AS home_team_slug,
            home.name AS home_team_name,
            home.short_name AS home_team_short_name,
            home.color_1 AS home_team_color_1,
            home.color_2 AS home_team_color_2,
            home.logo AS home_team_logo,
            home.roster AS home_team_roster,
            away.id AS away_team_id,
            away.slug AS away_team_slug,
            away.name AS away_team_name,
            away.short_name AS away_team_short_name,
            away.color_1 AS away_team_color_1,
            away.color_2 AS away_team_color_2,
            away.logo AS away_team_logo,
            away.roster AS away_team_roster
        FROM matches m
        LEFT JOIN teams home ON m.home_team_id = home.id
        LEFT JOIN teams away ON m.away_team_id = away.id
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
