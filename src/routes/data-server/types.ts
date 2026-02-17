import z from "zod";
import type { BunRequest } from "bun";

export const PaginationSchema = z.object({
  page: z.number().min(1).optional().default(1),
  items_per_page: z.number().min(1).optional().default(100),
});

export const PlayerId = z.number().brand<"Player">();
export const RosterId = z.number().brand<"Roster">();
export const TeamIdSchema = z.number().brand<"Team">();

export const PlayerSchema = z.object({
  id: PlayerId,
  slug: z.string(),
  name: z.string(),
  number: z.number().nullable(),
  picture: z.string().nullable(),
});

export const RosterSchema = z.object({
  id: RosterId,
  name: z.string(),
  player_1: PlayerId,
  player_2: PlayerId,
  player_3: PlayerId,
  player_4: PlayerId,
  player_5: PlayerId,
  player_6: PlayerId,
  player_7: PlayerId,
  player_8: PlayerId,
  player_9: PlayerId.nullable(),
  player_10: PlayerId.nullable(),
  player_11: PlayerId.nullable(),
  player_12: PlayerId.nullable(),
  player_13: PlayerId.nullable(),
  player_14: PlayerId.nullable(),
  player_15: PlayerId.nullable(),
  player_16: PlayerId.nullable(),
});

export const TeamSchema = z.object({
  id: TeamIdSchema,
  slug: z.string(),
  name: z.string(),
  short_name: z.string(),
  colors: z.array(z.string()).max(2),
  logo: z.string().nullable(),
  league: z.string(),
  roster: RosterSchema.nullable(),
});
export const CreateTeamRequestSchema = z.object({
  name: z.string(),
  short_name: z.string().max(3),
  colors: z.array(z.string()).max(2),
  league: z.string(),
  logo: z.string().nullable(),
});
export const UpdateTeamRequestSchema = z.object({
  name: z.string().optional(),
  short_name: z.string().max(3).optional(),
  logo: z.string().nullable().optional(),
  league: z.string().optional(),
  roster: RosterId.optional(),
  color_1: z.string().optional(),
  color_2: z.string().optional(),
});
export const ListTeamsRequestSchema = z.object({
  ...PaginationSchema.shape,
});

export const CreatePlayerRequestSchema = z.object({
  name: z.string(),
  number: z.number().int().positive().nullable().optional(),
  birthday: z.string().optional().nullable(),
  default_team_id: z.number().int().positive().nullable().optional(),
});

export const UpdatePlayerRequestSchema = z.object({
  name: z.string().optional(),
  number: z.number().int().positive().nullable().optional(),
  birthday: z.string().optional().nullable(),
  default_team_id: z.number().int().positive().nullable().optional(),
  picture: z.string().optional().nullable(),
});

export const ListPlayersRequestSchema = z.object({
  ...PaginationSchema.shape,
});

export const CreateRosterRequestSchema = z.object({
  name: z.string(),
  player_1: PlayerId,
  player_2: PlayerId,
  player_3: PlayerId,
  player_4: PlayerId,
  player_5: PlayerId,
  player_6: PlayerId,
  player_7: PlayerId,
  player_8: PlayerId,
  player_9: PlayerId.optional().nullable(),
  player_10: PlayerId.optional().nullable(),
  player_11: PlayerId.optional().nullable(),
  player_12: PlayerId.optional().nullable(),
  player_13: PlayerId.optional().nullable(),
  player_14: PlayerId.optional().nullable(),
  player_15: PlayerId.optional().nullable(),
  player_16: PlayerId.optional().nullable(),
});

export const UpdateRosterRequestSchema = z.object({
  name: z.string().optional(),
  player_1: PlayerId.optional(),
  player_2: PlayerId.optional(),
  player_3: PlayerId.optional(),
  player_4: PlayerId.optional(),
  player_5: PlayerId.optional(),
  player_6: PlayerId.optional(),
  player_7: PlayerId.optional(),
  player_8: PlayerId.optional(),
  player_9: PlayerId.optional().nullable(),
  player_10: PlayerId.optional().nullable(),
  player_11: PlayerId.optional().nullable(),
  player_12: PlayerId.optional().nullable(),
  player_13: PlayerId.optional().nullable(),
  player_14: PlayerId.optional().nullable(),
  player_15: PlayerId.optional().nullable(),
  player_16: PlayerId.optional().nullable(),
});

export const ListRostersRequestSchema = z.object({
  ...PaginationSchema.shape,
});

export const MatchIdSchema = z.number().brand<"Match">();
export const MatchSchema = z.object({
  id: MatchIdSchema,
  slug: z.string(),
  date: z.date(),
  home_team: TeamSchema,
  home_team_roster: RosterSchema,
  away_team: TeamSchema,
  away_team_roster: RosterSchema,
  match_info: z.object({
    period_duration: z.number(),
    period_count: z.number(),
    allowed_timeouts: z.number(),
    allowed_substitutions: z.number(),
  }),
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
  home_team_color_1: z.string(),
  home_team_color_2: z.string(),
  home_team_roster: z.string().nullable(),
  home_team_logo: z.string().nullable(),
  away_team_id: z.number(),
  away_team_slug: z.string(),
  away_team_name: z.string(),
  away_team_short_name: z.string(),
  away_team_color_1: z.string(),
  away_team_color_2: z.string(),
  away_team_roster: z.string().nullable(),
  away_team_logo: z.string().nullable(),
  date: z.string().transform((v) => new Date(v)),
  period_count: z.number(),
  period_duration: z.number(),
  allowed_timeouts: z.number().nullable(),
  allowed_substitutions: z.number().nullable(),
  completed: z.boolean().transform((v) => !!v),
});
export const ListMatchesRequestSchema = z.object({
  ...PaginationSchema.shape,
});

export const EventIdSchema = z.number().brand<"Event">();
export const EventTypeSchema = z.enum([
  "score",
  "timeout",
  "substitution",
  "card",
  "time",
  "note",
]);
export const ScoreTypeSchema = z.enum([
  "close",
  "medium",
  "long",
  "running-in",
  "penalty",
  "free-throw",
]);
export const CardTypeSchema = z.union([
  z.literal("yellow"),
  z.literal("red"),
  z.literal("green"),
  z.literal("white"),
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
  team: TeamSchema.nullable(),
  type: EventTypeSchema,
  player_1: PlayerId.nullable(),
  player_2: PlayerId.nullable(),
  score_type: ScoreTypeSchema.nullable(),
  card_type: CardTypeSchema.nullable(),
  note: z.string().nullable(),
  match_time: z.number(),
  date: z.date(),
});
export const CreateEventRequestSchema = z.object({
  match: MatchIdSchema,
  team: TeamIdSchema,
  type: EventTypeSchema,
  score_type: ScoreTypeSchema.optional().nullable(),
  card_type: CardTypeSchema.optional().nullable(),
  match_time: z.number(),
});
export const ListMatchEventsRequestSchema = z.object({
  ...PaginationSchema.shape,
  match: MatchIdSchema,
});
export type ListMatchEventsRequest = z.infer<
  typeof ListMatchEventsRequestSchema
>;
export const UpdateEventRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("score"),
    score_type: ScoreTypeSchema,
    player_1: PlayerId.optional().nullable(),
    player_2: PlayerId.optional().nullable(),
  }),
  z.object({
    type: z.literal("substitution"),
    player_1: PlayerId,
    player_2: PlayerId,
  }),
  z.object({
    type: z.literal("card"),
    player_1: PlayerId,
    card_type: CardTypeSchema,
    note: z.string(),
  }),
]);
export const ReadEventResponseSchema = z.object({
  id: EventIdSchema,
  match: MatchIdSchema,
  team: TeamIdSchema,
  type: EventTypeSchema,
  player_1: PlayerId.nullable(),
  player_2: PlayerId.nullable(),
  score_type: ScoreTypeSchema.nullable(),
  card_type: CardTypeSchema.nullable(),
  note: z.string().nullable(),
  match_time: z.number(),
  date: z.string(),
});

export type Team<T = string[]> = Omit<z.infer<typeof TeamSchema>, "colors"> & {
  colors: T;
};
export type Match = z.infer<typeof MatchSchema>;
export type MatchId = z.infer<typeof MatchIdSchema>;
export type Event = z.infer<typeof EventSchema>;
export type EventId = z.infer<typeof EventIdSchema>;

export type ReadEvent = z.infer<typeof ReadEventResponseSchema>;
export type CreateEvent = z.infer<typeof CreateEventRequestSchema>;

export type ScoreType = z.infer<typeof ScoreTypeSchema>;
export type CardType = z.infer<typeof CardTypeSchema>;
export type EventType = z.infer<typeof EventTypeSchema>;

export type Endpoint = {
  readonly url_path: string;
  POST?: (req: BunRequest<any>) => Promise<Response>;
  PUT?: (req: BunRequest<any>) => Promise<Response>;
  GET?: (req: BunRequest<any>) => Promise<Response>;
  DELETE?: (req: BunRequest<any>) => Promise<Response>;
};
