import type { BunRequest } from "bun";
import {
  CreateMatchRequestSchema,
  type Endpoint,
  type Match,
  type Team,
} from "../types";
import { db } from "@/index";
import { handle_error } from "../utils";

const url_path = "/api/v1/match/create";
type path = "/api/v1/match/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = CreateMatchRequestSchema.parse(json);
      const { home_team_id, away_team_id, date } = payload;

      const team_query = db.query<Team<string> | null, string>(
        "SELECT * FROM teams WHERE id=?",
      );
      const home_team = team_query.get(home_team_id);
      const away_team = team_query.get(away_team_id);

      if (home_team === null || away_team === null) {
        return Response.error();
      }

      const res = db
        .query<{ ct: number }, null>(`SELECT COUNT(*) as ct FROM matches`)
        .get(null);
      const match_number = (res?.ct ?? 1) + 1;

      const formatted_date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      const slug = `${formatted_date}-${home_team.short_name}-${away_team.short_name}-${match_number}`;

      const query_object = {
        ...payload,
        id: null,
        slug,
        date: date.toISOString(),
      };

      const { lastInsertRowid } = db
        .query(
          "INSERT INTO matches VALUES ($id, $slug, $home_team_id, $away_team_id, $date)",
        )
        .run(query_object);

      const match = db
        .query<Match, number>("SELECT * FROM matches WHERE id=?")
        .get(lastInsertRowid as number);

      return Response.json(match, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};

// Object.defineProperty()
