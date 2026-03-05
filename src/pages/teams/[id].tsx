import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
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
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import type { Team, Roster } from "@/routes/data-server/types";
import { getTeam, deleteTeam } from "@/services/team";
import { listRosters } from "@/services/roster";
import TeamForm from "@/components/form/TeamForm";
import { toast } from "sonner";

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadTeam(Number(id) as any);
    }
  }, [id]);

  async function loadTeam(teamId: number) {
    setIsLoading(true);
    try {
      const [teamData, rostersData] = await Promise.all([
        getTeam(teamId as any),
        listRosters({ items_per_page: 1000 }),
      ]);

      if (teamData) {
        setTeam(teamData);
        // Filter rosters that belong to this team
        const teamRosters = rostersData.filter(
          (roster) => roster.team_id === teamId,
        );
        setRosters(teamRosters);
      } else {
        toast.error("Team not found");
        navigate("/teams");
      }
    } catch (error) {
      console.error("Failed to load team:", error);
      toast.error("Failed to load team");
      navigate("/teams");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditSuccess(updatedTeam: Team) {
    setTeam(updatedTeam);
    setIsEditDialogOpen(false);
    toast.success("Team updated successfully");
  }

  async function handleDeleteConfirm() {
    if (!team) return;

    try {
      await deleteTeam(team.id as any);
      toast.success("Team deleted successfully");
      navigate("/teams");
    } catch (error) {
      console.error("Failed to delete team:", error);
      toast.error("Failed to delete team");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading team...</p>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Team not found</p>
      </div>
    );
  }

  return (
    <>
      <PageWithBreadcrumbs>
        {/* Header */}
        <div className="flex flex-col gap-4">
          <Link to="/teams">
            <Button variant="ghost" className="gap-2 px-2">
              <ArrowLeft size={16} />
              Back to Teams
            </Button>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {team.logo && (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-16 h-16 object-contain"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <p className="text-muted-foreground mt-1">
                  {team.short_name} • {team.league}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                className="gap-2"
              >
                <Edit size={18} />
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="gap-2"
              >
                <Trash2 size={18} />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Team Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Team identification details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Full Name
                </p>
                <p className="text-lg">{team.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Short Name
                </p>
                <p className="text-lg">{team.short_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Slug
                </p>
                <p className="text-lg font-mono">{team.slug}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  League
                </p>
                <p className="text-lg">{team.league}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Identity</CardTitle>
              <CardDescription>Team colors and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Team Colors
                </p>
                <div className="flex gap-2">
                  {team.colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col gap-1 items-center">
                      <div
                        className="w-16 h-16 rounded-lg border-2"
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-mono">{color}</p>
                    </div>
                  ))}
                </div>
              </div>
              {team.logo && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Team Logo
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={team.logo}
                      alt={team.name}
                      className="w-24 h-24 object-contain border rounded-lg p-2"
                    />
                    <div className="text-xs text-muted-foreground break-all">
                      {team.logo}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Associated Rosters</CardTitle>
              <CardDescription>
                Rosters assigned to this team ({rosters.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rosters.length > 0 ? (
                <div className="space-y-3">
                  {rosters.map((roster) => (
                    <Link
                      key={roster.id}
                      to={`/rosters/${roster.id}`}
                      className="block p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{roster.name}</p>
                          {roster.category && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {roster.category}
                            </p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {
                            [
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
                            ].filter((p) => p !== null).length
                          }{" "}
                          players
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No rosters assigned to this team yet. Create a roster and
                  assign it to this team.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWithBreadcrumbs>

      {/* Edit Team Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>Update team information</DialogDescription>
          </DialogHeader>
          <TeamForm
            team={team}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Team Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the team "{team.name}". This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
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

export default TeamDetailPage;
