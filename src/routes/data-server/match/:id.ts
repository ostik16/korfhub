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
  // async PUT(req: BunRequest<path>) {
  //   try {
  //     const id = req.params.id;
  //     const team = db
  //       .query<Team<string> | null, string>("SELECT * FROM teams WHERE id=?")
  //       .get(id);
  //     const json = await req.json();
  //     const payload = UpdateTeamRequestSchema.parse(json);

  //     if (team === null) {
  //       return Response.error();
  //     }

  //     const query_object = {
  //       id,
  //       name: payload.name ?? team.name,
  //       short_name: payload.short_name ?? team.short_name,
  //       logo: payload.logo ?? team.logo,
  //       colors: payload.colors ? JSON.stringify(payload.colors) : team.colors,
  //     };

  //     db.query(
  //       `UPDATE teams
  //         SET name=$name,
  //           short_name=$short_name,
  //           logo=$logo,
  //           colors=$colors
  //         WHERE id=$id`,
  //     ).run(query_object);

  //     const updated_team = prepare_team_response(
  //       db
  //         .query<Team<string> | null, string>("SELECT * FROM teams WHERE id=?")
  //         .get(id),
  //     );

  //     return Response.json(updated_team, { status: 200 });
  //   } catch (e) {
  //     return handle_error(e);
  //   }
  // },
};
