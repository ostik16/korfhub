import z from "zod";
import type { Match, Team } from "./types";

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
  return { ...team, colors: JSON.parse(team.colors) };
};

export const prepare_match_response = (match: any): Match | null => {
  const home_team = prepare_team_response({
    id: match.home_team_id,
    slug: match.home_team_slug,
    name: match.home_team_name,
    short_name: match.home_team_short_name,
    colors: match.home_team_colors,
    logo: match.home_team_logo,
  });
  const away_team = prepare_team_response({
    id: match.away_team_id,
    slug: match.away_team_slug,
    name: match.away_team_name,
    short_name: match.away_team_short_name,
    colors: match.away_team_colors,
    logo: match.away_team_logo,
  });

  if (home_team === null || away_team === null) {
    return null;
  }

  return {
    id: match.id,
    slug: match.slug,
    date: match.date,
    home_team,
    away_team,
  };
};
