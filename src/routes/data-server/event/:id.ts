import type { BunRequest } from "bun";
import {
  CreateEventRequestSchema,
  ReadMatchResponseSchema,
  UpdateEventRequestSchema,
  type Endpoint,
  type Event,
  type Match,
  type MatchId,
  type ReadEvent,
  type Team,
} from "../types";
import { db } from "@/index";
import { handle_error } from "../utils";

const url_path = "/api/v1/event/:id";
type path = "/api/v1/event/:id";

export const id: Endpoint = {
  url_path,
  async PUT(req: BunRequest<path>) {
    try {
      const id = Number(req.params.id);
      const json = await req.json();
      const payload = UpdateEventRequestSchema.parse(json);

      const event_query = db.query<ReadEvent, number>(
        "SELECT * FROM events WHERE id=?",
      );

      const event = event_query.get(id);

      if (event === null) {
        return Response.error();
      }

      const query_object = {
        ...event,
        ...payload,
      };

      db.query(
        `UPDATE events
          SET player_1=$player_1,
            player_2=$player_2,
            score_type=$score_type,
            card_type=$card_type,
            note=$note
          WHERE id=$id`,
      ).run(query_object);

      const updated = event_query.get(id);

      return Response.json(updated, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async DELETE(req: BunRequest<path>) {
    try {
      const id = Number(req.params.id);

      const delete_query = db.query<ReadEvent, number>(
        "DELETE FROM events WHERE id=?",
      );

      delete_query.get(id);

      return Response.json(null, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
