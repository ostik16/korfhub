import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import type { Player, Roster, Team } from "@/routes/data-server/types";
import { RosterId } from "@/routes/data-server/types";
import { createRoster, updateRoster } from "@/services/roster";
import { listPlayers } from "@/services/player";
import { listTeams } from "@/services/team";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Roster name is required"),
  team_id: z.string().nullable(),
  category: z.string().nullable(),
  player_1: z.string().min(1, "Player 1 is required"),
  player_2: z.string().min(1, "Player 2 is required"),
  player_3: z.string().min(1, "Player 3 is required"),
  player_4: z.string().min(1, "Player 4 is required"),
  player_5: z.string().min(1, "Player 5 is required"),
  player_6: z.string().min(1, "Player 6 is required"),
  player_7: z.string().min(1, "Player 7 is required"),
  player_8: z.string().min(1, "Player 8 is required"),
  player_9: z.string().nullable(),
  player_10: z.string().nullable(),
  player_11: z.string().nullable(),
  player_12: z.string().nullable(),
  player_13: z.string().nullable(),
  player_14: z.string().nullable(),
  player_15: z.string().nullable(),
  player_16: z.string().nullable(),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  roster?: Roster;
  onSuccess: (roster: Roster) => void;
  onCancel: () => void;
};

const RosterForm = (props: Props) => {
  const { roster, onSuccess, onCancel } = props;
  const isEditing = !!roster;
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  const form = useForm<FormSchema>({
    defaultValues: {
      name: roster?.name ?? "",
      team_id: roster?.team_id ? String(roster.team_id) : "NONE",
      category: roster?.category ?? "",
      player_1: roster?.player_1 ? String(roster.player_1) : "",
      player_2: roster?.player_2 ? String(roster.player_2) : "",
      player_3: roster?.player_3 ? String(roster.player_3) : "",
      player_4: roster?.player_4 ? String(roster.player_4) : "",
      player_5: roster?.player_5 ? String(roster.player_5) : "",
      player_6: roster?.player_6 ? String(roster.player_6) : "",
      player_7: roster?.player_7 ? String(roster.player_7) : "",
      player_8: roster?.player_8 ? String(roster.player_8) : "",
      player_9: roster?.player_9 ? String(roster.player_9) : "NONE",
      player_10: roster?.player_10 ? String(roster.player_10) : "NONE",
      player_11: roster?.player_11 ? String(roster.player_11) : "NONE",
      player_12: roster?.player_12 ? String(roster.player_12) : "NONE",
      player_13: roster?.player_13 ? String(roster.player_13) : "NONE",
      player_14: roster?.player_14 ? String(roster.player_14) : "NONE",
      player_15: roster?.player_15 ? String(roster.player_15) : "NONE",
      player_16: roster?.player_16 ? String(roster.player_16) : "NONE",
    },
  });

  useEffect(() => {
    loadPlayers();
    loadTeams();
  }, []);

  async function loadPlayers() {
    try {
      const data = await listPlayers({ items_per_page: 1000 });
      setPlayers(data);
    } catch (error) {
      console.error("Failed to load players:", error);
      toast.error("Failed to load players");
    } finally {
      setIsLoadingPlayers(false);
    }
  }

  async function loadTeams() {
    try {
      const data = await listTeams({ items_per_page: 1000 });
      setTeams(data);
    } catch (error) {
      console.error("Failed to load teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setIsLoadingTeams(false);
    }
  }

  async function handleSubmit(data: FormSchema) {
    try {
      const parsePlayerId = (
        value: string | null | undefined,
      ): number | null => {
        if (!value || value === "" || value === "NONE") return null;
        const num = parseInt(value, 10);
        return isNaN(num) ? null : num;
      };

      const rosterData = {
        name: data.name,
        team_id:
          data.team_id && data.team_id !== "NONE"
            ? parseInt(data.team_id, 10)
            : null,
        category: data.category && data.category !== "" ? data.category : null,
        player_1: parsePlayerId(data.player_1) || 0,
        player_2: parsePlayerId(data.player_2) || 0,
        player_3: parsePlayerId(data.player_3) || 0,
        player_4: parsePlayerId(data.player_4) || 0,
        player_5: parsePlayerId(data.player_5) || 0,
        player_6: parsePlayerId(data.player_6) || 0,
        player_7: parsePlayerId(data.player_7) || 0,
        player_8: parsePlayerId(data.player_8) || 0,
        player_9: parsePlayerId(data.player_9),
        player_10: parsePlayerId(data.player_10),
        player_11: parsePlayerId(data.player_11),
        player_12: parsePlayerId(data.player_12),
        player_13: parsePlayerId(data.player_13),
        player_14: parsePlayerId(data.player_14),
        player_15: parsePlayerId(data.player_15),
        player_16: parsePlayerId(data.player_16),
      };

      let result: Roster;

      if (isEditing && roster) {
        result = await updateRoster(
          roster.id as z.infer<typeof RosterId>,
          rosterData,
        );
        toast.success("Roster updated successfully");
      } else {
        result = await createRoster(rosterData);
        toast.success("Roster created successfully");
      }

      onSuccess(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error saving roster:", error);
      console.error("Form data:", {
        name: data.name,
        players: {
          player_1: data.player_1,
          player_2: data.player_2,
          player_3: data.player_3,
          player_4: data.player_4,
          player_5: data.player_5,
          player_6: data.player_6,
          player_7: data.player_7,
          player_8: data.player_8,
          player_9: data.player_9,
          player_10: data.player_10,
          player_11: data.player_11,
          player_12: data.player_12,
          player_13: data.player_13,
          player_14: data.player_14,
          player_15: data.player_15,
          player_16: data.player_16,
        },
      });
      toast.error(`Failed to save roster: ${errorMessage}`);
    }
  }

  if (isLoadingPlayers || isLoadingTeams) {
    return (
      <div className="flex items-center justify-center p-8">
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Roster Name</FieldLegend>
          <FieldDescription>Enter the roster name</FieldDescription>
          <Input
            placeholder="e.g., Team A - 2024"
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
          <FieldLegend>Team Assignment</FieldLegend>
          <FieldDescription>
            Assign this roster to a team (optional)
          </FieldDescription>
          <Controller
            name="team_id"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value || "NONE"}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a team (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No team selected</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={String(team.id)}>
                      {team.name} ({team.short_name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Category</FieldLegend>
          <FieldDescription>
            Roster category (e.g., "Senior", "Junior", "Women", "Mixed")
          </FieldDescription>
          <Input
            placeholder="e.g., Senior Men"
            {...form.register("category")}
            aria-invalid={!!form.formState.errors.category}
          />
          {form.formState.errors.category && (
            <FieldError>{form.formState.errors.category.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Required Players (1-8)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((playerNum) => {
            const fieldName = `player_${playerNum}` as keyof FormSchema;
            return (
              <FieldGroup key={`player_${fieldName}`}>
                <FieldSet>
                  <FieldLegend>Player {playerNum}</FieldLegend>
                  <Controller
                    name={fieldName}
                    control={form.control}
                    rules={{ required: `Player ${playerNum} is required` }}
                    render={({ field }) => (
                      <Select
                        value={field.value || ""}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a player" />
                        </SelectTrigger>
                        <SelectContent>
                          {players.map((player) => (
                            <SelectItem
                              key={player.id}
                              value={String(player.id)}
                            >
                              {player.name}
                              {player.number && ` (#${player.number})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors[fieldName] && (
                    <FieldError>
                      {form.formState.errors[fieldName]?.message}
                    </FieldError>
                  )}
                </FieldSet>
              </FieldGroup>
            );
          })}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Optional Players (9-16)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[9, 10, 11, 12, 13, 14, 15, 16].map((playerNum) => {
            const fieldName = `player_${playerNum}` as keyof FormSchema;
            return (
              <FieldGroup key={`player_${fieldName}`}>
                <FieldSet>
                  <FieldLegend>Player {playerNum}</FieldLegend>
                  <Controller
                    name={fieldName}
                    control={form.control}
                    render={({ field }) => (
                      <Select
                        value={field.value || "NONE"}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a player (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NONE">
                            No player selected
                          </SelectItem>
                          {players.map((player) => (
                            <SelectItem
                              key={player.id}
                              value={String(player.id)}
                            >
                              {player.name}
                              {player.number && ` (#${player.number})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FieldSet>
              </FieldGroup>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 justify-end border-t pt-6">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEditing ? "Update Roster" : "Create Roster"}
        </Button>
      </div>
    </form>
  );
};

export default RosterForm;
