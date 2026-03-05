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
import { Badge } from "@/components/ui/badge";

import { Plus, Edit, Trash2, Eye } from "lucide-react";
import type { Match } from "@/routes/data-server/types";
import { listMatches, deleteMatch } from "@/services/match";
import MatchForm from "@/components/form/MatchForm";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { toast } from "sonner";

const MatchesPage = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [deletingMatch, setDeletingMatch] = useState<Match | null>(null);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    setIsLoading(true);
    try {
      const data = await listMatches();
      setMatches(data);
    } catch (error) {
      console.error("Failed to load matches:", error);
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCreateSuccess(match: Match) {
    setMatches((prev) => [match, ...prev]);
    setIsCreateDialogOpen(false);
  }

  function handleEditSuccess(match: Match) {
    setMatches((prev) => prev.map((m) => (m.id === match.id ? match : m)));
    setEditingMatch(null);
  }

  function handleEditClick(match: Match) {
    setEditingMatch(match);
  }

  function handleDeleteClick(match: Match) {
    setDeletingMatch(match);
  }

  async function handleDeleteConfirm() {
    if (!deletingMatch) return;

    try {
      await deleteMatch(deletingMatch.id);
      setMatches((prev) => prev.filter((m) => m.id !== deletingMatch.id));
      toast.success("Match deleted successfully");
    } catch (error) {
      console.error("Failed to delete match:", error);
      toast.error("Failed to delete match");
    } finally {
      setDeletingMatch(null);
    }
  }

  function handleCloseDialog() {
    setIsCreateDialogOpen(false);
  }

  function handleCloseEditDialog() {
    setEditingMatch(null);
  }

  function handleCloseDeleteDialog() {
    setDeletingMatch(null);
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading matches...</p>
      </div>
    );
  }

  return (
    <>
      <PageWithBreadcrumbs>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Matches</h1>
            <p className="text-muted-foreground mt-1">
              Manage your korfball matches
            </p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus size={18} />
            New Match
          </Button>
        </div>

        {/* Matches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Matches</CardTitle>
            <CardDescription>
              Total: {matches.length} match{matches.length !== 1 ? "es" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Plus />
                  </EmptyMedia>
                  <EmptyTitle>No Matches</EmptyTitle>
                  <EmptyDescription>
                    No matches have been created yet. Start by adding your first
                    match.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="gap-2"
                  >
                    <Plus size={18} />
                    Create Match
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Home Team</TableHead>
                      <TableHead>Away Team</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          {formatDate(match.date)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {match.home_team.logo && (
                              <img
                                src={match.home_team.logo}
                                alt={match.home_team.name}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {match.home_team.name}
                              </div>
                              {match.home_team_roster && (
                                <div className="text-xs text-muted-foreground">
                                  {match.home_team_roster.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {match.away_team.logo && (
                              <img
                                src={match.away_team.logo}
                                alt={match.away_team.name}
                                className="w-6 h-6 object-contain"
                              />
                            )}
                            <div>
                              <div className="font-medium">
                                {match.away_team.name}
                              </div>
                              {match.away_team_roster && (
                                <div className="text-xs text-muted-foreground">
                                  {match.away_team_roster.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {match.match_info.period_count} ×{" "}
                          {formatTime(match.match_info.period_duration)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={match.completed ? "default" : "secondary"}
                          >
                            {match.completed ? "Completed" : "Scheduled"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="size-8"
                            >
                              <Link to={`/matches/${match.id}`}>
                                <Eye size={16} />
                                <span className="sr-only">View</span>
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(match)}
                              className="size-8"
                            >
                              <Edit size={16} />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(match)}
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

      {/* Create Match Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Match</DialogTitle>
            <DialogDescription>
              Add a new match to your system
            </DialogDescription>
          </DialogHeader>
          <MatchForm
            onSuccess={handleCreateSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Match Dialog */}
      <Dialog open={!!editingMatch} onOpenChange={setEditingMatch as any}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Match</DialogTitle>
            <DialogDescription>Update match information</DialogDescription>
          </DialogHeader>
          {editingMatch && (
            <MatchForm
              match={editingMatch}
              onSuccess={handleEditSuccess}
              onCancel={handleCloseEditDialog}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Match Confirmation Dialog */}
      <Dialog
        open={!!deletingMatch}
        onOpenChange={handleCloseDeleteDialog as any}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the match between "
              {deletingMatch?.home_team.name}" and "
              {deletingMatch?.away_team.name}". This action cannot be undone.
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

export default MatchesPage;
