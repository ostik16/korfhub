import { useEffect, useState } from "react";
import z from "zod";
import { useParams, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import type { Player } from "@/routes/data-server/types";
import { PlayerId } from "@/routes/data-server/types";
import { getPlayer } from "@/services/player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlayerForm from "@/components/form/PlayerForm";

const PlayerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    loadPlayer();
  }, [id]);

  async function loadPlayer() {
    setIsLoading(true);
    try {
      const playerId = parseInt(id!) as z.infer<typeof PlayerId>;
      const data = await getPlayer(playerId);
      if (data) {
        setPlayer(data);
      } else {
        navigate("/players");
      }
    } catch (error) {
      console.error("Failed to load player:", error);
      navigate("/players");
    } finally {
      setIsLoading(false);
    }
  }

  function handleEditSuccess(updatedPlayer: Player) {
    setPlayer(updatedPlayer);
    setIsEditDialogOpen(false);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading player...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Player not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/players")}
          className="gap-2"
        >
          <ArrowLeft size={18} />
          Back to Players
        </Button>

        {/* Player Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="text-3xl">{player.name}</CardTitle>
              <CardDescription>Player Details</CardDescription>
            </div>
            <Button onClick={() => setIsEditDialogOpen(true)} className="gap-2">
              <Edit size={18} />
              Edit Player
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Player Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Jersey Number
                </h3>
                <p className="text-lg mt-1">
                  {player.number ? `#${player.number}` : "Not assigned"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Birthday
                </h3>
                <p className="text-lg mt-1">
                  {player.birthday
                    ? new Date(player.birthday).toLocaleDateString()
                    : "Not provided"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Default Team
                </h3>
                <p className="text-lg mt-1">
                  {player.default_team_id
                    ? `Team #${player.default_team_id}`
                    : "Not assigned"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Slug
                </h3>
                <p className="text-lg mt-1 font-mono">{player.slug}</p>
              </div>
            </div>

            {/* Player ID */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">
                Player ID
              </h3>
              <p className="text-sm mt-1 font-mono text-muted-foreground">
                {player.id}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Player Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Player</DialogTitle>
            <DialogDescription>Update player information</DialogDescription>
          </DialogHeader>
          <PlayerForm
            player={player}
            onSuccess={handleEditSuccess}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerDetailPage;
