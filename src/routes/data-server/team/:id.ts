import type { BunRequest } from "bun";
import { handle_error, prepare_team_response } from "../utils";
import { db } from "@/index";

const url_path = "/api/v1/team/:id";
type path = "/api/v1/team/:id";

export const id = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const id = req.params.id;

      const q = db.query("SELECT * FROM teams WHERE id=?");

      const team = prepare_team_response(q.get(id));

      return Response.json(team, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
