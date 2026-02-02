import z from "zod";
import type { BunRequest } from "bun";

export const PaginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  items_per_page: z.number().min(1).max(100).optional().default(10),
});

export const CreateTeamRequestSchema = z.object({
  name: z.string(),
  short_name: z.string().max(3),
  colors: z.array(z.string()).max(2),
  logo: z.string().nullable(),
});
export const UpdateTeamRequestSchema = z.object({
  name: z.string().optional(),
  short_name: z.string().max(3).optional(),
  colors: z.array(z.string()).max(2).optional(),
  logo: z.string().nullable().optional(),
});
export const ListTeamsRequestSchema = z.object({
  ...PaginationSchema.shape,
});

export const CreateMatchRequestSchema = z.object({
  home_team_id: z.string(),
  away_team_id: z.string(),
  date: z.date().optional().default(new Date()),
});
export const ReadMatchResponseSchema = z.object({
  id: z.number(),
  slug: z.string(),
  home_team_id: z.number(),
  home_team_slug: z.string(),
  home_team_name: z.string(),
  home_team_short_name: z.string(),
  home_team_colors: z.string(),
  home_team_logo: z.string().nullable(),
  away_team_id: z.number(),
  away_team_slug: z.string(),
  away_team_name: z.string(),
  away_team_short_name: z.string(),
  away_team_colors: z.string(),
  away_team_logo: z.string().nullable(),
  date: z.string().transform((v) => new Date(v)),
});
export const ListMatchesRequestSchema = z.object({
  ...PaginationSchema.shape,
});

export const TeamSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  short_name: z.string(),
  colors: z.array(z.string()).max(2).or(z.string()),
  logo: z.string().nullable(),
});

export const MatchSchema = z.object({
  id: z.number(),
  slug: z.string(),
  date: z.date(),
  home_team: TeamSchema,
  away_team: TeamSchema,
});

export type Team<T = string[]> = Omit<z.infer<typeof TeamSchema>, "colors"> & {
  colors: T;
};
export type Match = z.infer<typeof MatchSchema>;

export type Endpoint = {
  readonly url_path: string;
  POST?: (req: BunRequest<any>) => Promise<Response>;
  PUT?: (req: BunRequest<any>) => Promise<Response>;
  GET?: (req: BunRequest<any>) => Promise<Response>;
};
