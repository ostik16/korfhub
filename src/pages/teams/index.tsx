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
import type { Team } from "@/routes/data-server/types";
import { listTeams, deleteTeam } from "@/services/team";
import TeamForm from "@/components/form/TeamForm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "sonner";

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    setIsLoading(true);
    try {
      const data = await listTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to load teams:", error);
      toast.error("Failed to load teams");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreateSuccess(team: Team) {
    setTeams((prev) => [team, ...prev]);
    setIsCreateDialogOpen(false);
  }

  function handleEditSuccess(team: Team) {
    setTeams((prev) => prev.map((t) => (t.id === team.id ? team : t)));
    setEditingTeam(null);
  }

  function handleEditClick(team: Team) {
    setEditingTeam(team);
  }

  function handleDeleteClick(team: Team) {
    setDeletingTeam(team);
  }

  async function handleDeleteConfirm() {
    if (!deletingTeam) return;

    try {
      await deleteTeam(deletingTeam.id);
      setTeams((prev) => prev.filter((t) => t.id !== deletingTeam.id));
      toast.success("Team deleted successfully");
    } catch (error) {
      console.error("Failed to delete team:", error);
      toast.error("Failed to delete team");
    } finally {
      setDeletingTeam(null);
    }
  }

  function handleCloseDialog() {
    setIsCreateDialogOpen(false);
  }

  function handleCloseEditDialog() {
    setEditingTeam(null);
  }

  function handleCloseDeleteDialog() {
    setDeletingTeam(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading teams...</p>
      </div>
    );
  }

  return (
    <>
      <PageWithBreadcrumbs>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Teams</h1>
            <p className="text-muted-foreground mt-1">
              Manage your korfball teams
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus size={18} />
            New Team
          </Button>
        </div>

        {/* Teams Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
            <CardDescription>
              Total: {teams.length} team{teams.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {teams.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Plus />
                  </EmptyMedia>
                  <EmptyTitle>No Teams</EmptyTitle>
                  <EmptyDescription>
                    No teams have been created yet. Start by adding your first
                    team.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus size={18} />
                    Create Team
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Short Name</TableHead>
                      <TableHead>League</TableHead>
                      <TableHead>Colors</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => (
                      <TableRow key={team.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {team.logo && (
                              <img
                                src={team.logo}
                                alt={team.name}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            {team.name}
                          </div>
                        </TableCell>
                        <TableCell>{team.short_name}</TableCell>
                        <TableCell>{team.league}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {team.colors.map((color, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(team)}
                              className="size-8"
                            >
                              <Edit size={16} />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(team)}
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
      </PageWithBreadcrumbs>

      {/* Create Team Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>Add a new team to your system</DialogDescription>
          </DialogHeader>
          <TeamForm
            onSuccess={handleCreateSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={!!editingTeam} onOpenChange={setEditingTeam as any}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team information</DialogDescription>
          </DialogHeader>
          {editingTeam && (
            <TeamForm
              team={editingTeam}
              onSuccess={handleEditSuccess}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog
        open={!!deletingTeam}
        onOpenChange={handleCloseDeleteDialog as any}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the team "{deletingTeam?.name}". This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="secondary" onClick={handleCloseDeleteDialog}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TeamsPage;
