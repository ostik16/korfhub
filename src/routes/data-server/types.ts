import z from "zod";
import type { BunRequest } from "bun";

export const PaginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  items_per_page: z.number().min(1).max(100).optional().default(10),
});

export const PlayerId = z.number().brand<"Player">();

export const TeamIdSchema = z.number().brand<"Team">();
export const TeamSchema = z.object({
  id: TeamIdSchema,
  slug: z.string(),
  name: z.string(),
  short_name: z.string(),
  colors: z.array(z.string()).max(2).or(z.string()),
  logo: z.string().nullable(),
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

export const MatchIdSchema = z.number().brand<"Match">();
export const MatchSchema = z.object({
  id: MatchIdSchema,
  slug: z.string(),
  date: z.date(),
  home_team: TeamSchema,
  away_team: TeamSchema,
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

export const EventIdSchema = z.number().brand<"Event">();
export const EventTypeSchema = z.union([
  z.literal("score"),
  z.literal("timeout"),
  z.literal("substitution"),
  z.literal("card"),
]);
export const ScoreTypeSchema = z.union([
  z.literal("close"),
  z.literal("medium"),
  z.literal("long"),
  z.literal("runnin-in"),
  z.literal("penalty"),
  z.literal("free-throw"),
]);
export const EventTypeDefinitionSchema = z.xor([
  z.object({
    type: z.literal("score"),
    team: TeamIdSchema,
    player: PlayerId,
    assist: PlayerId,
    score_type: ScoreTypeSchema,
  }),
  z.object({ type: z.literal("timeout"), team: TeamIdSchema }),
  z.object({
    type: z.literal("substitution"),
    team: TeamIdSchema,
    in: PlayerId,
    out: PlayerId,
  }),
  z.object({ type: z.literal("card"), team: TeamIdSchema, player: PlayerId }),
  z.object({ type: z.literal("time"), note: z.string() }), // used of halftime, end, gg
  z.object({ type: z.literal("note"), note: z.string() }),
]);
export const EventSchema = z.object({
  id: EventIdSchema,
  match: MatchIdSchema,
  team: TeamIdSchema,
  type: EventTypeSchema,
  meta: EventTypeDefinitionSchema.optional(),
  match_time: z.number(),
  date: z.date(),
});
export const CreateEventRequestSchema = z.object({
  match: MatchIdSchema,
  team: TeamIdSchema,
  type: EventTypeSchema,
  match_time: z.number(),
});

export type Team<T = string[]> = Omit<z.infer<typeof TeamSchema>, "colors"> & {
  colors: T;
};
export type Match = z.infer<typeof MatchSchema>;
export type MatchId = z.infer<typeof MatchIdSchema>;

export type Endpoint = {
  readonly url_path: string;
  POST?: (req: BunRequest<any>) => Promise<Response>;
  PUT?: (req: BunRequest<any>) => Promise<Response>;
  GET?: (req: BunRequest<any>) => Promise<Response>;
};
