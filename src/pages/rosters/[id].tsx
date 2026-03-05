import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageWithBreadcrumbs from "@/components/layout/PageWithBreadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import type { Roster, Player, Team } from "@/routes/data-server/types";
import { getRoster } from "@/services/roster";
import { listPlayers } from "@/services/player";
import { listTeams } from "@/services/team";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RosterForm from "@/components/form/RosterForm";
import z from "zod";
import { RosterId } from "@/routes/data-server/types";

const RosterDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [roster, setRoster] = useState<Roster | null>(null);
  const [players, setPlayers] = useState<Map<number, Player>>(new Map());
  const [teams, setTeams] = useState<Map<number, Team>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    loadData();
  }, [id]);

  async function loadData() {
    setIsLoading(true);
    try {
      const rosterId = parseInt(id!) as z.infer<typeof RosterId>;
      const rosterData = await getRoster(rosterId);
      if (rosterData) {
        setRoster(rosterData);
      } else {
        navigate("/rosters");
      }

      const [playersData, teamsData] = await Promise.all([
        listPlayers({ items_per_page: 1000 }),
        listTeams({ items_per_page: 1000 }),
      ]);

      const playerMap = new Map();
      playersData.forEach((player) => {
        playerMap.set(player.id, player);
      });
      setPlayers(playerMap);

      const teamMap = new Map();
      teamsData.forEach((team) => {
        teamMap.set(team.id, team);
      });
      setTeams(teamMap);
    } catch (error) {
      console.error("Failed to load roster:", error);
      navigate("/rosters");
    } finally {
      setIsLoading(false);
    }
  }

  function getPlayerName(playerId: number | null): string {
    if (!playerId) return "-";
    const player = players.get(playerId);
    return player
      ? `${player.name}${player.number ? ` (#${player.number})` : ""}`
      : `Player #${playerId}`;
  }

  function getTeamName(teamId: number | null): string {
    if (!teamId) return "No team assigned";
    const team = teams.get(teamId);
    return team ? `${team.name} (${team.short_name})` : `Team #${teamId}`;
  }

  function handleEditSuccess(updatedRoster: Roster) {
    setRoster(updatedRoster);
    setIsEditDialogOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading roster...</p>
      </div>
    );
  }

  if (!roster) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Roster not found</p>
      </div>
    );
  }

  const requiredPlayers = [
    roster.player_1,
    roster.player_2,
    roster.player_3,
    roster.player_4,
    roster.player_5,
    roster.player_6,
    roster.player_7,
    roster.player_8,
  ];

  const optionalPlayers = [
    roster.player_9,
    roster.player_10,
    roster.player_11,
    roster.player_12,
    roster.player_13,
    roster.player_14,
    roster.player_15,
    roster.player_16,
  ].filter((p) => p !== null);

  return (
    <>
      <PageWithBreadcrumbs className="max-w-4xl">
        {/* Roster Header Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl">{roster.name}</CardTitle>
              <CardDescription>Roster Details</CardDescription>
            </div>
            <Button onClick={() => setIsEditDialogOpen(true)} className="gap-2">
              <Edit size={18} />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Team Assignment
                </p>
                <p className="text-lg">{getTeamName(roster.team_id)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Category
                </p>
                <p className="text-lg">{roster.category || "No category"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Players Section */}
        <Card>
          <CardHeader>
            <CardTitle>Required Players (1-8)</CardTitle>
            <CardDescription>
              These 8 players are mandatory in the roster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredPlayers.map((playerId, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Player {index + 1}
                    </p>
                    <p className="text-lg font-semibold">
                      {getPlayerName(playerId)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Optional Players Section */}
        {optionalPlayers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Optional Players (9-16)</CardTitle>
              <CardDescription>
                These players are optional additions to the roster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[9, 10, 11, 12, 13, 14, 15, 16].map((playerNum) => {
                  const playerId =
                    roster[`player_${playerNum}` as keyof Roster];
                  if (!playerId) return null;

                  return (
                    <div
                      key={playerNum}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Player {playerNum}
                        </p>
                        <p className="text-lg font-semibold">
                          {getPlayerName(playerId as number | null)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Roster Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Roster Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Roster ID
              </h3>
              <p className="text-sm font-mono text-muted-foreground">
                {roster.id}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Players
              </h3>
              <p className="text-lg">
                {requiredPlayers.length + optionalPlayers.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </PageWithBreadcrumbs>

      {/* Edit Roster Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Roster</DialogTitle>
            <DialogDescription>Update roster information</DialogDescription>
          </DialogHeader>
          <RosterForm
            roster={roster}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RosterDetailPage;
