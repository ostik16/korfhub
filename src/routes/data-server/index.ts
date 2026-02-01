import { create as team_create } from "./team/create";
import { list as team_list } from "./team/list";
import { id as team_id } from "./team/:id";

export const routes = {
  [team_create.url_path]: team_create.POST,
  [team_list.url_path]: team_list.POST,
  [team_id.url_path]: team_id.POST,
};
