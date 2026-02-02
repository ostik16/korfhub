import { type BunRequest } from "bun";
import { CreateTeamRequestSchema, type Endpoint } from "../types";
import { db } from "@/index";
import { handle_error, prepare_team_response, sanitize_slug } from "../utils";

const url_path = "/api/v1/team/create";
type path = "/api/v1/team/create";

export const create: Endpoint = {
  url_path,
  async POST(req: BunRequest<path>) {
    try {
      const json = await req.json();
      const payload = CreateTeamRequestSchema.parse(json);

      const slug = sanitize_slug(payload.name);

      // CHECK FOR SLUG UNIQUENES AND GENERATE UNIQUE ONE
      //
      // let unique_slug = initial_slug;
      // let index = 1;
      // console.log(
      //   unique_slug,
      //   db.query("SELECT slug FROM teams").get(unique_slug).slug,
      // );
      // while (db.query("SELECT slug FROM teams").get(unique_slug)) {
      //   unique_slug = `${initial_slug}-${index}`;
      // }

      const query_object = {
        id: null,
        slug,
        name: payload.name,
        short_name: payload.short_name,
        logo: payload.logo,
        colors: JSON.stringify(payload.colors),
      };

      const { lastInsertRowid } = db
        .query(
          "INSERT INTO teams VALUES ($id, $slug, $name, $short_name, $logo, $colors)",
        )
        .run(query_object);

      const team = prepare_team_response(
        db.query("SELECT * FROM teams WHERE id=?").get(lastInsertRowid),
      );

      return Response.json(team, { status: 200 });
    } catch (e) {
      return handle_error(e);
    }
  },
};
