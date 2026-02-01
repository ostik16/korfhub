import z from "zod";
import type { Team } from "./types";

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

export const prepare_team_response = (team: any): Team | null => {
  if (team === null) return null;
  return { ...team, colors: JSON.parse(team.colors) };
};

export const handle_error = (e: any) => {
  console.error(e);
  if (e instanceof z.ZodError) {
    return Response.json({ ...e.issues }, { status: 400 });
  }
  return Response.error();
};
