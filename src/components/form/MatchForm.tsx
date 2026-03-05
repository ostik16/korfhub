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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import z from "zod";
import type { Match, Team, Roster } from "@/routes/data-server/types";
import { MatchIdSchema } from "@/routes/data-server/types";
import { createMatch, updateMatch } from "@/services/match";
import { listTeams } from "@/services/team";
import { listRosters } from "@/services/roster";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const formSchema = z.object({
  home_team_id: z.string().min(1, "Home team is required"),
  away_team_id: z.string().min(1, "Away team is required"),
  home_team_roster_id: z.string().optional(),
  away_team_roster_id: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  period_duration: z
    .number()
    .min(1, "Period duration must be at least 1 second"),
  period_count: z.number().min(1, "Must have at least 1 period"),
  allowed_timeouts: z.number().min(0, "Cannot be negative"),
  allowed_substitutions: z.number().min(0, "Cannot be negative"),
});

type FormSchema = z.infer<typeof formSchema>;

type Props = {
  match?: Match;
  onSuccess: (match: Match) => void;
  onCancel: () => void;
};

const MatchForm = (props: Props) => {
  const { match, onSuccess, onCancel } = props;
  const isEditing = !!match;

  const [teams, setTeams] = useState<Team[]>([]);
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [homeTeamRosters, setHomeTeamRosters] = useState<Roster[]>([]);
  const [awayTeamRosters, setAwayTeamRosters] = useState<Roster[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingRosters, setIsLoadingRosters] = useState(true);

  const form = useForm<FormSchema>({
    defaultValues: {
      home_team_id: match?.home_team.id.toString() ?? "",
      away_team_id: match?.away_team.id.toString() ?? "",
      home_team_roster_id: match?.home_team_roster?.id?.toString() ?? "",
      away_team_roster_id: match?.away_team_roster?.id?.toString() ?? "",
      date: match?.date
        ? new Date(match.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      period_duration: match?.match_info.period_duration ?? 600,
      period_count: match?.match_info.period_count ?? 2,
      allowed_timeouts: match?.match_info.allowed_timeouts ?? 2,
      allowed_substitutions: match?.match_info.allowed_substitutions ?? 999,
    },
  });

  const homeTeamId = form.watch("home_team_id");
  const awayTeamId = form.watch("away_team_id");

  useEffect(() => {
    loadTeams();
    loadRosters();
  }, []);

  useEffect(() => {
    if (homeTeamId && rosters.length > 0) {
      const filtered = rosters.filter(
        (r) => r.team_id?.toString() === homeTeamId,
      );
      setHomeTeamRosters(filtered);
    } else {
      setHomeTeamRosters([]);
    }
  }, [homeTeamId, rosters]);

  useEffect(() => {
    if (awayTeamId && rosters.length > 0) {
      const filtered = rosters.filter(
        (r) => r.team_id?.toString() === awayTeamId,
      );
      setAwayTeamRosters(filtered);
    } else {
      setAwayTeamRosters([]);
    }
  }, [awayTeamId, rosters]);

  async function loadTeams() {
    setIsLoadingTeams(true);
    try {
      const data = await listTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to load teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setIsLoadingTeams(false);
    }
  }

  async function loadRosters() {
    setIsLoadingRosters(true);
    try {
      const data = await listRosters();
      setRosters(data);
    } catch (error) {
      console.error("Failed to load rosters:", error);
      toast.error("Failed to load rosters");
    } finally {
      setIsLoadingRosters(false);
    }
  }

  async function handleSubmit(data: FormSchema) {
    try {
      let result: Match;

      const matchData = {
        home_team_id: data.home_team_id,
        away_team_id: data.away_team_id,
        home_team_roster_id:
          data.home_team_roster_id && data.home_team_roster_id !== ""
            ? parseInt(data.home_team_roster_id)
            : null,
        away_team_roster_id:
          data.away_team_roster_id && data.away_team_roster_id !== ""
            ? parseInt(data.away_team_roster_id)
            : null,
        date: new Date(data.date),
        period_duration: data.period_duration,
        period_count: data.period_count,
        allowed_timeouts: data.allowed_timeouts,
        allowed_substitutions: data.allowed_substitutions,
      };

      if (isEditing && match) {
        result = await updateMatch(match.id as z.infer<typeof MatchIdSchema>, {
          home_team_id: parseInt(matchData.home_team_id),
          away_team_id: parseInt(matchData.away_team_id),
          home_team_roster_id: matchData.home_team_roster_id,
          away_team_roster_id: matchData.away_team_roster_id,
          date: matchData.date,
          period_duration: matchData.period_duration,
          period_count: matchData.period_count,
          allowed_timeouts: matchData.allowed_timeouts,
          allowed_substitutions: matchData.allowed_substitutions,
        });
        toast.success("Match updated successfully");
      } else {
        result = await createMatch(matchData);
        toast.success("Match created successfully");
      }

      onSuccess(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error saving match:", error);
      toast.error(`Failed to save match: ${errorMessage}`);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Home Team</FieldLegend>
            <FieldDescription>Select the home team</FieldDescription>
            <Select
              value={form.watch("home_team_id")}
              onValueChange={(value) => {
                form.setValue("home_team_id", value);
                form.setValue("home_team_roster_id", "");
              }}
              disabled={isLoadingTeams}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select home team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.home_team_id && (
              <FieldError>
                {form.formState.errors.home_team_id.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Away Team</FieldLegend>
            <FieldDescription>Select the away team</FieldDescription>
            <Select
              value={form.watch("away_team_id")}
              onValueChange={(value) => {
                form.setValue("away_team_id", value);
                form.setValue("away_team_roster_id", "");
              }}
              disabled={isLoadingTeams}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select away team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id.toString()}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.away_team_id && (
              <FieldError>
                {form.formState.errors.away_team_id.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Home Team Roster</FieldLegend>
            <FieldDescription>Optional roster selection</FieldDescription>
            <Select
              value={form.watch("home_team_roster_id") || "none"}
              onValueChange={(value) =>
                form.setValue(
                  "home_team_roster_id",
                  value === "none" ? "" : value,
                )
              }
              disabled={isLoadingRosters || !homeTeamId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select roster (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No roster</SelectItem>
                {homeTeamRosters.map((roster) => (
                  <SelectItem key={roster.id} value={roster.id.toString()}>
                    {roster.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.home_team_roster_id && (
              <FieldError>
                {form.formState.errors.home_team_roster_id.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Away Team Roster</FieldLegend>
            <FieldDescription>Optional roster selection</FieldDescription>
            <Select
              value={form.watch("away_team_roster_id") || "none"}
              onValueChange={(value) =>
                form.setValue(
                  "away_team_roster_id",
                  value === "none" ? "" : value,
                )
              }
              disabled={isLoadingRosters || !awayTeamId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select roster (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No roster</SelectItem>
                {awayTeamRosters.map((roster) => (
                  <SelectItem key={roster.id} value={roster.id.toString()}>
                    {roster.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.away_team_roster_id && (
              <FieldError>
                {form.formState.errors.away_team_roster_id.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>
      </div>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>Match Date</FieldLegend>
          <FieldDescription>Date when the match is/was played</FieldDescription>
          <Input
            type="date"
            {...form.register("date")}
            aria-invalid={!!form.formState.errors.date}
          />
          {form.formState.errors.date && (
            <FieldError>{form.formState.errors.date.message}</FieldError>
          )}
        </FieldSet>
      </FieldGroup>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Period Duration (seconds)</FieldLegend>
            <FieldDescription>
              Length of each period in seconds
            </FieldDescription>
            <Input
              type="number"
              {...form.register("period_duration", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.period_duration}
            />
            {form.formState.errors.period_duration && (
              <FieldError>
                {form.formState.errors.period_duration.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Number of Periods</FieldLegend>
            <FieldDescription>Total periods in the match</FieldDescription>
            <Input
              type="number"
              {...form.register("period_count", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.period_count}
            />
            {form.formState.errors.period_count && (
              <FieldError>
                {form.formState.errors.period_count.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Allowed Timeouts</FieldLegend>
            <FieldDescription>Timeouts per team</FieldDescription>
            <Input
              type="number"
              {...form.register("allowed_timeouts", { valueAsNumber: true })}
              aria-invalid={!!form.formState.errors.allowed_timeouts}
            />
            {form.formState.errors.allowed_timeouts && (
              <FieldError>
                {form.formState.errors.allowed_timeouts.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>

        <FieldGroup>
          <FieldSet>
            <FieldLegend>Allowed Substitutions</FieldLegend>
            <FieldDescription>Substitutions per team</FieldDescription>
            <Input
              type="number"
              {...form.register("allowed_substitutions", {
                valueAsNumber: true,
              })}
              aria-invalid={!!form.formState.errors.allowed_substitutions}
            />
            {form.formState.errors.allowed_substitutions && (
              <FieldError>
                {form.formState.errors.allowed_substitutions.message}
              </FieldError>
            )}
          </FieldSet>
        </FieldGroup>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {isEditing ? "Update Match" : "Create Match"}
        </Button>
      </div>
    </form>
  );
};

export default MatchForm;
