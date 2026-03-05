import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, ArrowLeft, Calendar, Clock, Users } from "lucide-react";
import type { Match } from "@/routes/data-server/types";
import { getMatch, deleteMatch } from "@/services/match";
import MatchForm from "@/components/form/MatchForm";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const MatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      loadMatch(parseInt(id));
    }
  }, [id]);

  async function loadMatch(matchId: number) {
    setIsLoading(true);
    try {
      const data = await getMatch(matchId as any);
      setMatch(data);
    } catch (error) {
      console.error("Failed to load match:", error);
      toast.error("Failed to load match");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditClick() {
    if (match) {
      setEditingMatch(match);
    }
  }

  function handleEditSuccess(updatedMatch: Match) {
    setMatch(updatedMatch);
    setEditingMatch(null);
    toast.success("Match updated successfully");
  }

  function handleCloseEditDialog() {
    setEditingMatch(null);
  }

  function handleDeleteClick() {
    setIsDeleting(true);
  }

  async function handleDeleteConfirm() {
    if (!match) return;

    try {
      await deleteMatch(match.id);
      toast.success("Match deleted successfully");
      navigate("/matches");
    } catch (error) {
      console.error("Failed to delete match:", error);
      toast.error("Failed to delete match");
    } finally {
      setIsDeleting(false);
    }
  }

  function handleCloseDeleteDialog() {
    setIsDeleting(false);
  }

  function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0
      ? `${minutes}:${secs.toString().padStart(2, "0")}`
      : `${minutes}:00`;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading match...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <PageWithBreadcrumbs>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Match Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The match you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/matches">
              <ArrowLeft size={16} className="mr-2" />
              Back to Matches
            </Link>
          </Button>
        </div>
      </PageWithBreadcrumbs>
    );
  }

  return (
    <>
      <PageWithBreadcrumbs>
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" asChild className="self-start -ml-4">
            <Link to="/matches">
              <ArrowLeft size={16} className="mr-2" />
              Back to Matches
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Match Details</h1>
              <p className="text-muted-foreground">{match.slug}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleEditClick}
                variant="outline"
                className="gap-2"
              >
                <Edit size={16} />
                Edit
              </Button>
              <Button
                onClick={handleDeleteClick}
                variant="destructive"
                className="gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Match Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Match Overview</CardTitle>
              <Badge variant={match.completed ? "default" : "secondary"}>
                {match.completed ? "Completed" : "Scheduled"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Teams */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="text-center">
                <div className="flex flex-col items-center gap-3">
                  {match.home_team.logo && (
                    <img
                      src={match.home_team.logo}
                      alt={match.home_team.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg">
                      {match.home_team.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.home_team.short_name}
                    </div>
                    {match.home_team_roster && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Roster: {match.home_team_roster.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  vs
                </div>
              </div>

              <div className="text-center">
                <div className="flex flex-col items-center gap-3">
                  {match.away_team.logo && (
                    <img
                      src={match.away_team.logo}
                      alt={match.away_team.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <div className="font-bold text-lg">
                      {match.away_team.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {match.away_team.short_name}
                    </div>
                    {match.away_team_roster && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Roster: {match.away_team_roster.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{formatDate(match.date)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium">
                    {match.match_info.period_count} periods ×{" "}
                    {formatTime(match.match_info.period_duration)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">League</div>
                  <div className="font-medium">{match.home_team.league}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Match Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Match Configuration</CardTitle>
            <CardDescription>Game rules and settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Period Duration
                </div>
                <div className="font-medium text-lg">
                  {formatTime(match.match_info.period_duration)}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Number of Periods
                </div>
                <div className="font-medium text-lg">
                  {match.match_info.period_count}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Allowed Timeouts
                </div>
                <div className="font-medium text-lg">
                  {match.match_info.allowed_timeouts}
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Allowed Substitutions
                </div>
                <div className="font-medium text-lg">
                  {match.match_info.allowed_substitutions}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Team</CardTitle>
              <CardDescription>{match.home_team.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Short Name:</span>
                <span className="font-medium">
                  {match.home_team.short_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">League:</span>
                <span className="font-medium">{match.home_team.league}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Colors:</span>
                <div className="flex gap-1">
                  {match.home_team.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              {match.home_team_roster && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roster:</span>
                  <span className="font-medium">
                    {match.home_team_roster.name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Away Team</CardTitle>
              <CardDescription>{match.away_team.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Short Name:</span>
                <span className="font-medium">
                  {match.away_team.short_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">League:</span>
                <span className="font-medium">{match.away_team.league}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Colors:</span>
                <div className="flex gap-1">
                  {match.away_team.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              {match.away_team_roster && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Roster:</span>
                  <span className="font-medium">
                    {match.away_team_roster.name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWithBreadcrumbs>

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
      <Dialog open={isDeleting} onOpenChange={handleCloseDeleteDialog as any}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the match between "
              {match.home_team.name}" and "{match.away_team.name}". This action
              cannot be undone.
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

export default MatchDetailPage;
