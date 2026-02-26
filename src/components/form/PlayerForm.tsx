import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import type { Player } from "@/routes/data-server/types";
import { PlayerId } from "@/routes/data-server/types";
import { createPlayer, updatePlayer } from "@/services/player";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  number: z.string().optional().nullable(),
  birthday: z.string().nullable().optional(),
  default_team_id: z.string().optional().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  player?: Player;
  onSuccess: (player: Player) => void;
  onCancel: () => void;
};

const PlayerForm = (props: Props) => {
  const { player, onSuccess, onCancel } = props;
  const isEditing = !!player;

  const form = useForm<FormSchema>({
    defaultValues: {
      name: player?.name ?? "",
      number: player?.number ? String(player.number) : "",
      birthday: player?.birthday ?? null,
      default_team_id: player?.default_team_id
        ? String(player.default_team_id)
        : "",
    },
  });

  async function handleSubmit(data: FormSchema) {
    try {
      let result: Player;

      const parseNumber = (value: string | null | undefined): number | null => {
        if (!value || value === "") return null;
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
      };

      const playerData = {
        name: data.name,
        number: parseNumber(data.number),
        birthday: data.birthday && data.birthday !== "" ? data.birthday : null,
        default_team_id: parseNumber(data.default_team_id),
      };

      if (isEditing && player) {
        result = await updatePlayer(
          player.id as z.infer<typeof PlayerId>,
          playerData,
        );
        toast.success("Player updated successfully");
      } else {
        result = await createPlayer(playerData);
        toast.success("Player created successfully");
      }

      onSuccess(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error saving player:", error);
      console.error(
        "Full error details:",
        JSON.stringify({
          name: data.name,
          number: data.number,
          birthday: data.birthday,
          default_team_id: data.default_team_id,
        }),
      );
      toast.error(`Failed to save player: ${errorMessage}`);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Player Name</FieldLegend>
          <FieldDescription>Enter the player's full name</FieldDescription>
          <Input
            placeholder="e.g., John Doe"
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
          <FieldLegend>Jersey Number</FieldLegend>
          <FieldDescription>Optional player number</FieldDescription>
          <Input
            type="number"
            placeholder="e.g., 10"
            {...form.register("number")}
            aria-invalid={!!form.formState.errors.number}
          />
          {form.formState.errors.number && (
            <FieldError>{form.formState.errors.number.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Birthday</FieldLegend>
          <FieldDescription>Player's date of birth</FieldDescription>
          <Input
            type="date"
            {...form.register("birthday")}
            aria-invalid={!!form.formState.errors.birthday}
          />
          {form.formState.errors.birthday && (
            <FieldError>{form.formState.errors.birthday.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Default Team ID</FieldLegend>
          <FieldDescription>Optional default team assignment</FieldDescription>
          <Input
            type="number"
            placeholder="e.g., 1"
            {...form.register("default_team_id")}
            aria-invalid={!!form.formState.errors.default_team_id}
          />
          {form.formState.errors.default_team_id && (
            <FieldError>
              {form.formState.errors.default_team_id.message}
            </FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEditing ? "Update Player" : "Create Player"}
        </Button>
      </div>
    </form>
  );
};

export default PlayerForm;
