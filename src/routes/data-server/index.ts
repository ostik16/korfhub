import { create as team_create } from "./team/create";
import { list as team_list } from "./team/list";
import { id as team_id } from "./team/:id";
import { create as match_create } from "./match/create";
import { id as match_id } from "./match/:id";
import { list as match_list } from "./match/list";
import { create as event_create } from "./event/create";
import { match_detail as event_match_detail } from "./event/match-detail";
import { id as event_id } from "./event/:id";

export const routes = {
  [team_create.url_path]: team_create,
  [team_list.url_path]: team_list,
  [team_id.url_path]: team_id,

  [match_create.url_path]: match_create,
  [match_id.url_path]: match_id,
  [match_list.url_path]: match_list,

  [event_create.url_path]: event_create,
  [event_match_detail.url_path]: event_match_detail,
  [event_id.url_path]: event_id,
};
