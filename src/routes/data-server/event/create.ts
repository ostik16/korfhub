import type { BunRequest } from "bun";
import {
  CreateEventRequestSchema,
  ReadMatchResponseSchema,
  type Endpoint,
  type Match,
  type MatchId,
  type Team,
} from "../types";
import { db } from "@/index";
import { handle_error } from "../utils";

const url_path = "/api/v1/event/create";
type path = "/api/v1/event/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = CreateEventRequestSchema.parse(json);
      const { match, team } = payload;

      // check if match exists
      const match_query = db.query<any, MatchId>(
        "SELECT * FROM matches WHERE id=?",
      );

      const m = match_query.get(match);

      if (m === null) {
        return Response.error();
      }

      // check if team in match
      if (Number(m.home_team_id) !== team && Number(m.away_team_id) !== team) {
        return Response.error();
      }

      const query_object = {
        ...payload,
        id: null,
        date: new Date().toISOString(),
      };

      const { lastInsertRowid } = db
        .query(
          "INSERT INTO events VALUES ($id, $match, $team, $type, $match_time, $date)",
        )
        .run(query_object);

      const event = db
        .query<Match, number>("SELECT * FROM events WHERE id=?")
        .get(lastInsertRowid as number);

      return Response.json(event, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
