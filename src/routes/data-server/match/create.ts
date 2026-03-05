import type { BunRequest } from "bun";
import {
  CreateMatchRequestSchema,
  ReadMatchResponseSchema,
  type Endpoint,
  type Match,
  type Team,
} from "../types";
import { db } from "@/index";
import { handle_error, prepare_match_response } from "../utils";

const url_path = "/api/v1/match/create";
type path = "/api/v1/match/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const {
        home_team_id,
        away_team_id,
        home_team_roster_id,
        away_team_roster_id,
        date: dateString,
        period_duration,
        period_count,
        allowed_timeouts,
        allowed_substitutions,
      } = json;

      const date = dateString ? new Date(dateString) : new Date();

      const team_query = db.query<Team<string> | null, string>(
        "SELECT * FROM teams WHERE id=?",
      );
      const home_team = team_query.get(home_team_id);
      const away_team = team_query.get(away_team_id);

      if (home_team === null || away_team === null) {
        return Response.error();
      }

      const count_res = db
        .query<{ ct: number }, null>(`SELECT COUNT(*) as ct FROM matches`)
        .get(null);
      const match_number = (count_res?.ct ?? 0) + 1;

      const formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const slug = `${formatted_date}-${home_team.short_name}-${away_team.short_name}-${match_number}`;

      const query_object = {
        id: null,
        slug,
        home_team_id,
        away_team_id,
        home_team_roster_id: home_team_roster_id ?? null,
        away_team_roster_id: away_team_roster_id ?? null,
        date: date.toISOString(),
        period_duration: period_duration ?? 600,
        period_count: period_count ?? 2,
        allowed_timeouts: allowed_timeouts ?? 2,
        allowed_substitutions: allowed_substitutions ?? 999,
        completed: 0,
      };

      const { lastInsertRowid } = db
        .query(
          `INSERT INTO matches
            VALUES (
              $id,
              $slug,
              $home_team_id,
              $away_team_id,
              $home_team_roster_id,
              $away_team_roster_id,
              $date,
              $period_duration,
              $period_count,
              $allowed_timeouts,
              $allowed_substitutions,
              $completed
            )`,
        )
        .run(query_object);

      const match_query = db
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
        .get(lastInsertRowid as number);

      const res = ReadMatchResponseSchema.parse(match_query);
      const match = prepare_match_response(res);

      return Response.json(match, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};

// Object.defineProperty()
