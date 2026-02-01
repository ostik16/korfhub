import z from "zod";

export const CreateTeamRequestSchema = z.object({
  name: z.string(),
  short_name: z.string().max(3),
  colors: z.array(z.string()).max(2),
  logo: z.string().nullable(),
});

export const ListTeamsSchema = z.object({
  page: z.number().min(1).optional().default(1),
  items_per_page: z.number().min(1).max(100).optional().default(10),
});

export type Team = {
  id: number;
  slug: string;
  name: string;
  short_name: string;
  colors: [string, string];
  logo: string | null;
};
