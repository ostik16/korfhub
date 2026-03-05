import { useEffect, useState } from "react";
import { Link } from "react-router";
import PageWithBreadcrumbs from "@/components/layout/PageWithBreadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Roster, Player, Team } from "@/routes/data-server/types";
import { listRosters } from "@/services/roster";
import { listPlayers } from "@/services/player";
import { listTeams } from "@/services/team";
import RosterForm from "@/components/form/RosterForm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const RostersPage = () => {
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [players, setPlayers] = useState<Map<number, Player>>(new Map());
  const [teams, setTeams] = useState<Map<number, Team>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoster, setEditingRoster] = useState<Roster | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [rostersData, playersData, teamsData] = await Promise.all([
        listRosters(),
        listPlayers({ items_per_page: 1000 }),
        listTeams({ items_per_page: 1000 }),
      ]);
      setRosters(rostersData);

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
      console.error("Failed to load data:", error);
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
    if (!teamId) return "-";
    const team = teams.get(teamId);
    return team ? `${team.name}` : `Team #${teamId}`;
  }

  function handleCreateSuccess(roster: Roster) {
    setRosters((prev) => [roster, ...prev]);
    setIsCreateDialogOpen(false);
  }

  function handleEditSuccess(roster: Roster) {
    setRosters((prev) => prev.map((r) => (r.id === roster.id ? roster : r)));
    setEditingRoster(null);
  }

  function handleEditClick(roster: Roster) {
    setEditingRoster(roster);
  }

  function handleCloseDialog() {
    setIsCreateDialogOpen(false);
  }

  function handleCloseEditDialog() {
    setEditingRoster(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading rosters...</p>
      </div>
    );
  }

  return (
    <>
      <PageWithBreadcrumbs>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Rosters</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team rosters
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus size={18} />
            New Roster
          </Button>
        </div>

        {/* Rosters Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Rosters</CardTitle>
            <CardDescription>
              Total: {rosters.length} roster{rosters.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rosters.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Plus />
                  </EmptyMedia>
                  <EmptyTitle>No Rosters</EmptyTitle>
                  <EmptyDescription>
                    No rosters have been created yet. Start by adding your first
                    roster.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus size={18} />
                    Create Roster
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Players</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rosters.map((roster) => {
                      const playerCount = [
                        roster.player_1,
                        roster.player_2,
                        roster.player_3,
                        roster.player_4,
                        roster.player_5,
                        roster.player_6,
                        roster.player_7,
                        roster.player_8,
                        roster.player_9,
                        roster.player_10,
                        roster.player_11,
                        roster.player_12,
                        roster.player_13,
                        roster.player_14,
                        roster.player_15,
                        roster.player_16,
                      ].filter((p) => p !== null).length;

                      return (
                        <TableRow key={roster.id}>
                          <TableCell className="font-medium">
                            <Link
                              to={`/rosters/${roster.id}`}
                              className="hover:underline"
                            >
                              {roster.name}
                            </Link>
                          </TableCell>
                          <TableCell>{getTeamName(roster.team_id)}</TableCell>
                          <TableCell>{roster.category || "-"}</TableCell>
                          <TableCell>{playerCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(roster)}
                                className="size-8"
                              >
                                <Edit size={16} />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 size={16} />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </PageWithBreadcrumbs>

      {/* Create Roster Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Roster</DialogTitle>
            <DialogDescription>
              Create a new roster by selecting players
            </DialogDescription>
          </DialogHeader>
          <RosterForm
            onSuccess={handleCreateSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Roster Dialog */}
      <Dialog open={!!editingRoster} onOpenChange={setEditingRoster as any}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Roster</DialogTitle>
            <DialogDescription>Update roster information</DialogDescription>
          </DialogHeader>
          {editingRoster && (
            <RosterForm
              roster={editingRoster}
              onSuccess={handleEditSuccess}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RostersPage;
