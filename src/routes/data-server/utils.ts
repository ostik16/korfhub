import z from "zod";
import type { Match, Team, Event } from "./types";

export const sanitize_slug = (str: string) => {
  return (
    str
      // 1. Split accented characters into their base + accent (e.g., "ě" becomes "e" + "ˇ")
      .normalize("NFD")
      // 2. Remove the accents (the diacritical marks range)
      .replace(/[\u0300-\u036f]/g, "")
      // 3. Convert to lowercase (standard for slugs)
      .toLowerCase()
      // 4. Remove any character that is NOT a letter, number, space, or hyphen
      .replace(/[^a-z0-9\s-]/g, "")
      // 5. Trim whitespace from the start and end
      .trim()
      // 6. Replace any sequence of spaces or hyphens with a single hyphen
      .replace(/[\s-]+/g, "-")
  );
};

export const handle_error = (e: any) => {
  console.error(e);
  if (e instanceof z.ZodError) {
    return Response.json({ ...e.issues }, { status: 400 });
  }
  return Response.error();
};

export const prepare_team_response = (team: any): Team | null => {
  if (team === null) return null;
  return {
    ...team,
    colors: [team.color_1, team.color_2],
    color_1: undefined,
    color_2: undefined,
  };
};

export const prepare_match_response = (match: any): Match | null => {
  const home_team = prepare_team_response({
    id: match.home_team_id,
    slug: match.home_team_slug,
    name: match.home_team_name,
    short_name: match.home_team_short_name,
    color_1: match.home_team_color_1,
    color_2: match.home_team_color_2,
    logo: match.home_team_logo,
  });
  const away_team = prepare_team_response({
    id: match.away_team_id,
    slug: match.away_team_slug,
    name: match.away_team_name,
    short_name: match.away_team_short_name,
    color_1: match.away_team_color_1,
    color_2: match.away_team_color_2,
    logo: match.away_team_logo,
  });

  if (home_team === null || away_team === null) {
    return null;
  }

  const home_team_roster = match.home_team_roster
    ? JSON.parse(match.home_team_roster)
    : null;
  const away_team_roster = match.away_team_roster
    ? JSON.parse(match.away_team_roster)
    : null;

  return {
    id: match.id,
    slug: match.slug,
    date: new Date(match.date),
    home_team_roster,
    away_team_roster,
    home_team,
    away_team,
  };
};

export const prepare_event_response = (event: any): Event | null => {
  const team = prepare_team_response({
    id: event.team_id,
    slug: event.team_slug,
    name: event.team_name,
    short_name: event.team_short_name,
    color_1: event.team_color_1,
    color_2: event.team_color_2,
    logo: event.team_logo,
  });

  if (team === null) {
    return null;
  }

  return {
    id: event.id,
    match: event.match,
    team,
    player_1: null,
    player_2: null,
    score_type: event.score_type,
    card_type: null,
    note: null,
    type: event.type,
    date: event.date,
    match_time: event.match_time,
  };
};
