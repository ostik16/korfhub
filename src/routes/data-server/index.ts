import { create as team_create } from "./team/create";
import { list as team_list } from "./team/list";
import { id as team_id } from "./team/:id";
import { create as match_create } from "./match/create";
import { id as match_id } from "./match/:id";
import { list as match_list } from "./match/list";

export const routes = {
  [team_create.url_path]: team_create,
  [team_list.url_path]: team_list,
  [team_id.url_path]: team_id,

  [match_create.url_path]: match_create,
  [match_id.url_path]: match_id,
  [match_list.url_path]: match_list,
};
