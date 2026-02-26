import z from "zod";
import type { Match, Team, Event, Player } from "./types";

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

  // handle roster

  return {
    ...team,
    colors: [team.color_1, team.color_2],
    color_1: undefined,
    color_2: undefined,
    roster: null,
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

  const match_info = {
    period_duration: match.period_duration,
    period_count: match.period_count,
    allowed_timeouts: match.allowed_timeouts,
    allowed_substitutions: match.allowed_substitutions,
  };

  return {
    id: match.id,
    slug: match.slug,
    date: new Date(match.date),
    home_team_roster,
    away_team_roster,
    home_team,
    away_team,
    match_info,
    completed: match.completed,
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

export const prepare_player_response = (player: any): Player | null => {
  if (player === null) return null;

  return {
    id: player.id,
    slug: player.slug,
    name: player.name,
    number: player.number ?? null,
    birthday: player.birthday ?? null,
    picture: player.picutre ?? null,
    // default_team_id: player.default_team_id ?? null,
  };
};

export const prepare_roster_response = (roster: any) => {
  if (roster === null) return null;

  return {
    id: roster.id,
    name: roster.name,
    player_1: roster.player_1,
    player_2: roster.player_2,
    player_3: roster.player_3,
    player_4: roster.player_4,
    player_5: roster.player_5,
    player_6: roster.player_6,
    player_7: roster.player_7,
    player_8: roster.player_8,
    player_9: roster.player_9 ?? null,
    player_10: roster.player_10 ?? null,
    player_11: roster.player_11 ?? null,
    player_12: roster.player_12 ?? null,
    player_13: roster.player_13 ?? null,
    player_14: roster.player_14 ?? null,
    player_15: roster.player_15 ?? null,
    player_16: roster.player_16 ?? null,
  };
};

export const prepare_statistic_response = (stat: any) => {
  if (stat === null) return null;
  return {
    id: stat.id,
    match: stat.match,
    player: stat.player,
    shots_total: stat.shots_total ?? 0,
    shots_scored: stat.shots_scored ?? 0,
    assists: stat.assists ?? 0,
    offensive_rebound: stat.offensive_rebound ?? 0,
    offensive_rebound_lost: stat.offensive_rebound_lost ?? 0,
    defensive_rebound: stat.defensive_rebound ?? 0,
    defensive_rebound_lost: stat.defensive_rebound_lost ?? 0,
    gain: stat.gain ?? 0,
    lost: stat.lost ?? 0,
  };
};
