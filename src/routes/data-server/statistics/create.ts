import { db } from "@/index";
import type { BunRequest } from "bun";
import { CreateStatisticRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_statistic_response } from "../utils";

const url_path = "/api/v1/statistics/create";
type path = "/api/v1/statistics/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = CreateStatisticRequestSchema.parse(json);

      // Insert a new statistic row for the player in the match
      const query_object = {
        match: payload.match,
        player: payload.player,
        shots_total: 0,
        shots_scored: 0,
        assists: 0,
        offensive_rebound: 0,
        offensive_rebound_lost: 0,
        defensive_rebound: 0,
        defensive_rebound_lost: 0,
        gain: 0,
        lost: 0,
      };
      const { lastInsertRowid } = db
        .query(
          `INSERT INTO statistics (match, player, shots_total, shots_scored, assists, offensive_rebound, offensive_rebound_lost, defensive_rebound, defensive_rebound_lost, gain, lost)
           VALUES ($match, $player, $shots_total, $shots_scored, $assists, $offensive_rebound, $offensive_rebound_lost, $defensive_rebound, $defensive_rebound_lost, $gain, $lost)`
        )
        .run(query_object);

      const stat = prepare_statistic_response(
        db.query("SELECT * FROM statistics WHERE id=?").get(lastInsertRowid)
      );
      return Response.json(stat, { status: 201 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
