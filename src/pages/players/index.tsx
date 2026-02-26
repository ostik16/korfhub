import { useEffect, useState } from "react";
import { Link } from "react-router";
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
import type { Player } from "@/routes/data-server/types";
import { listPlayers } from "@/services/player";
import PlayerForm from "@/components/form/PlayerForm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const PlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    setIsLoading(true);
    try {
      const data = await listPlayers();
      setPlayers(data);
    } catch (error) {
      console.error("Failed to load players:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreateSuccess(player: Player) {
    setPlayers((prev) => [player, ...prev]);
    setIsCreateDialogOpen(false);
  }

  function handleEditSuccess(player: Player) {
    setPlayers((prev) => prev.map((p) => (p.id === player.id ? player : p)));
    setEditingPlayer(null);
  }

  function handleEditClick(player: Player) {
    setEditingPlayer(player);
  }

  function handleCloseDialog() {
    setIsCreateDialogOpen(false);
  }

  function handleCloseEditDialog() {
    setEditingPlayer(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading players...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Players</h1>
            <p className="text-muted-foreground mt-1">
              Manage your team players
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus size={18} />
            New Player
          </Button>
        </div>

        {/* Players Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Players</CardTitle>
            <CardDescription>
              Total: {players.length} player{players.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {players.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Plus />
                  </EmptyMedia>
                  <EmptyTitle>No Players</EmptyTitle>
                  <EmptyDescription>
                    No players have been created yet. Start by adding your first
                    player.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus size={18} />
                    Create Player
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Number</TableHead>
                      <TableHead>Birthday</TableHead>
                      <TableHead>Default Team</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">
                          <Link
                            to={`/players/${player.id}`}
                            className="hover:underline"
                          >
                            {player.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          {player.number ? `#${player.number}` : "-"}
                        </TableCell>
                        <TableCell>
                          {player.birthday
                            ? new Date(player.birthday).toLocaleDateString()
                            : "-"}
                        </TableCell>
                        <TableCell>{player.default_team_id ?? "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(player)}
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
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Player Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Player</DialogTitle>
            <DialogDescription>
              Add a new player to your system
            </DialogDescription>
          </DialogHeader>
          <PlayerForm
            onSuccess={handleCreateSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Player Dialog */}
      <Dialog open={!!editingPlayer} onOpenChange={setEditingPlayer as any}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player information</DialogDescription>
          </DialogHeader>
          {editingPlayer && (
            <PlayerForm
              player={editingPlayer}
              onSuccess={handleEditSuccess}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayersPage;
