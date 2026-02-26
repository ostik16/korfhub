import { db } from "@/index";
import type { BunRequest } from "bun";
import { UpdateStatisticRequestSchema, type Endpoint } from "../types";
import { handle_error, prepare_statistic_response } from "../utils";

const url_path = "/api/v1/statistics/:id";
type path = "/api/v1/statistics/:id";

export const id: Endpoint = {
  url_path,
  async GET(req: BunRequest<path>) {
    try {
      const id = req.params.id;
      const stat = prepare_statistic_response(
        db.query("SELECT * FROM statistics WHERE id=?").get(id)
      );
      if (!stat) return Response.error();
      return Response.json(stat, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async PUT(req: BunRequest<path>) {
    try {
      const id = req.params.id;
      const stat = db.query("SELECT * FROM statistics WHERE id=?").get(id);
      if (!stat) return Response.error();
      const json = await req.json();
      const payload = UpdateStatisticRequestSchema.parse(json);
      const update = {
        ...stat,
        ...payload,
      };
      db.query(
        `UPDATE statistics SET
          shots_total=$shots_total,
          shots_scored=$shots_scored,
          assists=$assists,
          offensive_rebound=$offensive_rebound,
          offensive_rebound_lost=$offensive_rebound_lost,
          defensive_rebound=$defensive_rebound,
          defensive_rebound_lost=$defensive_rebound_lost,
          gain=$gain,
          lost=$lost
        WHERE id=$id`
      ).run({ ...update, id });
      const updated = prepare_statistic_response(
        db.query("SELECT * FROM statistics WHERE id=?").get(id)
      );
      return Response.json(updated, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
