import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import type { Team } from "@/routes/data-server/types";
import { TeamIdSchema } from "@/routes/data-server/types";
import { createTeam, updateTeam } from "@/services/team";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Team name is required"),
  short_name: z
    .string()
    .min(1, "Short name is required")
    .max(3, "Short name must be 3 characters or less"),
  league: z.string().min(1, "League is required"),
  color_1: z.string().min(1, "Primary color is required"),
  color_2: z.string().optional(),
  logo: z.string().optional().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  team?: Team;
  onSuccess: (team: Team) => void;
  onCancel: () => void;
};

const TeamForm = (props: Props) => {
  const { team, onSuccess, onCancel } = props;
  const isEditing = !!team;

  const form = useForm<FormSchema>({
    defaultValues: {
      name: team?.name ?? "",
      short_name: team?.short_name ?? "",
      league: team?.league ?? "",
      color_1: team?.colors[0] ?? "#000000",
      color_2: team?.colors[1] ?? "#ffffff",
      logo: team?.logo ?? "",
    },
  });

  async function handleSubmit(data: FormSchema) {
    try {
      let result: Team;

      const colors = [data.color_1];
      if (data.color_2) {
        colors.push(data.color_2);
      }

      const teamData = {
        name: data.name,
        short_name: data.short_name,
        league: data.league,
        logo: data.logo && data.logo !== "" ? data.logo : null,
      };

      if (isEditing && team) {
        result = await updateTeam(team.id as z.infer<typeof TeamIdSchema>, {
          ...teamData,
          color_1: data.color_1,
          color_2: data.color_2,
        });
        toast.success("Team updated successfully");
      } else {
        result = await createTeam({
          ...teamData,
          colors,
        });
        toast.success("Team created successfully");
      }

      onSuccess(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error saving team:", error);
      toast.error(`Failed to save team: ${errorMessage}`);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Team Name</FieldLegend>
          <FieldDescription>Enter the full team name</FieldDescription>
          <Input
            placeholder="e.g., Prague Korfball Club"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <FieldError>{form.formState.errors.name.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Short Name</FieldLegend>
          <FieldDescription>
            Team abbreviation (max 3 characters)
          </FieldDescription>
          <Input
            placeholder="e.g., PKC"
            maxLength={3}
            {...form.register("short_name")}
            aria-invalid={!!form.formState.errors.short_name}
          />
          {form.formState.errors.short_name && (
            <FieldError>{form.formState.errors.short_name.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>League</FieldLegend>
          <FieldDescription>League or competition name</FieldDescription>
          <Input
            placeholder="e.g., Czech Korfball League"
            {...form.register("league")}
            aria-invalid={!!form.formState.errors.league}
          />
          {form.formState.errors.league && (
            <FieldError>{form.formState.errors.league.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Primary Color</FieldLegend>
            <FieldDescription>Team's main color</FieldDescription>
            <Input
              type="color"
              {...form.register("color_1")}
              aria-invalid={!!form.formState.errors.color_1}
            />
            {form.formState.errors.color_1 && (
              <FieldError>{form.formState.errors.color_1.message}</FieldError>
            )}
          </FieldSet>
        </FieldGroup>

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Secondary Color</FieldLegend>
            <FieldDescription>Optional secondary color</FieldDescription>
            <Input
              type="color"
              {...form.register("color_2")}
              aria-invalid={!!form.formState.errors.color_2}
            />
            {form.formState.errors.color_2 && (
              <FieldError>{form.formState.errors.color_2.message}</FieldError>
            )}
          </FieldSet>
        </FieldGroup>
      </div>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Logo URL</FieldLegend>
          <FieldDescription>Optional team logo image URL</FieldDescription>
          <Input
            type="url"
            placeholder="https://example.com/logo.png"
            {...form.register("logo")}
            aria-invalid={!!form.formState.errors.logo}
          />
          {form.formState.errors.logo && (
            <FieldError>{form.formState.errors.logo.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEditing ? "Update Team" : "Create Team"}
        </Button>
      </div>
    </form>
  );
};

export default TeamForm;
