import type { BunRequest } from "bun";
import { handle_error, prepare_team_response } from "../utils";
import { db } from "@/index";
import { UpdateTeamRequestSchema, type Endpoint, type Team } from "../types";

const url_path = "/api/v1/team/:id";
type path = "/api/v1/team/:id";

export const id: Endpoint = {
  url_path,
  async GET(req: BunRequest<path>) {
    try {
      const id = req.params.id;

      const team = prepare_team_response(
        db
          .query<Team<string> | null, string>("SELECT * FROM teams WHERE id=?")
          .get(id),
      );

      if (team === null) {
        return Response.error();
      }

      return Response.json(team, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
  async PUT(req: BunRequest<path>) {
    try {
      const id = req.params.id;
      const team = prepare_team_response(
        db.query<Team | null, string>("SELECT * FROM teams WHERE id=?").get(id),
      );
      const json = await req.json();
      const payload = UpdateTeamRequestSchema.parse(json);

      if (team === null) {
        return Response.error();
      }

      const query_object = {
        id,
        name: payload.name ?? team.name,
        short_name: payload.short_name ?? team.short_name,
        logo: payload.logo ?? team.logo,
        league: payload.league ?? team.league,
        roster: payload.roster ?? team.roster?.id ?? null,
        color_1: payload.color_1 ?? team.colors[0] ?? null,
        color_2: payload.color_2 ?? team.colors[1] ?? null,
      };

      db.query(
        `UPDATE teams
          SET name=$name,
            short_name=$short_name,
            logo=$logo,
            league=$league,
            roster=$roster,
            color_1=$color_1,
            color_2=$color_2
          WHERE id=$id`,
      ).run(query_object);

      const updated_team = prepare_team_response(
        db
          .query<Team<string> | null, string>("SELECT * FROM teams WHERE id=?")
          .get(id),
      );

      return Response.json(updated_team, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
