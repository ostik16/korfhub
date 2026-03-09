import { GlobalContext } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { calculate_match_time, cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Calendar,
  CalendarX2,
  ChevronDown,
  ChevronUp,
  ClockPlus,
  Edit,
  Ellipsis,
  Minus,
  MoreHorizontalIcon,
  Plus,
  RectangleVertical,
  Settings,
  Space,
  Timer,
  Volleyball,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import TimeControls from "@/components/controller/TimeControls";
import MatchSettings from "@/components/controller/MatchSettings";
import {
  createScoreEvent,
  createTimeoutEvent,
  deleteEvent,
  listMatchEvents,
} from "@/services/event";
import {
  EventTypeSchema,
  type Event,
  type EventId,
  type EventType,
} from "@/routes/data-server/types";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TeamControls from "@/components/controller/TeamControls";
import { Dialog } from "@/components/ui/dialog";
import UpdateEventForm from "@/components/form/UpdateEventForm";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdvancedController = () => {
  const { state, webSocketControls } = useContext(GlobalContext);

  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event>();

  useEffect(() => {
    if (!state || !state.id) return;

    listMatchEvents({ match: state.id! }).then((res) => setEvents(res));

    const interval = setInterval(() => {
      listMatchEvents({ match: state.id! }).then((res) => setEvents(res));
    }, 1000);

    return () => clearInterval(interval);
  }, [state?.id]);

  function handleCloseModal() {
    setEditingEvent(undefined);
  }

  function handleDeleteEvent(id: EventId) {
    deleteEvent(id).then(() => {
      setEvents((prev) => prev.filter((e) => e.id !== id));
    });
  }

  function handleUpdateEvent(event: Event) {
    setEditingEvent(event);
  }

  function getEventTypeActionIcon(type: EventType) {
    const size = 18;
    switch (type) {
      case "score":
        return <Volleyball size={size} />;
      case "card":
        return <RectangleVertical size={size} />;
      case "timeout":
        return <Timer size={size} />;
      case "substitution":
        return <ArrowLeftRight size={size} />;
      default:
        return <Calendar size={size} />;
    }
  }

  function handleScoreboardVisibility() {
    if (state?.scoreboard_visible === true) {
      webSocketControls?.setScoreboard({ scoreboard_visible: false });
      return;
    }
    webSocketControls?.setScoreboard({ scoreboard_visible: true });
  }

  if (!state) return null;

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @4xl/main:grid-cols-3">
        {/* TIME */}
        <div className="flex flex-col gap-4">
          <TimeControls />
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2 col-span-2 @4xl/col-span-3">
                <Switch
                  id="scoreboard_visible"
                  defaultChecked={!!state.scoreboard_visible}
                  onClick={handleScoreboardVisibility}
                />
                <Label htmlFor="scoreboard_visible">Scoreboard Visible</Label>
              </div>
            </CardContent>
          </Card>
          <MatchSettings />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-8 w-200">
          <TeamControls events={events} setEvents={setEvents} />

          <div className="col-span-2 min-h-96">
            {/*{!events.length && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CalendarX2 />
                  </EmptyMedia>
                  <EmptyTitle>No Events</EmptyTitle>
                  <EmptyDescription>
                    No events have been recrded so far for this match
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button>Add data</Button>
                </EmptyContent>
              </Empty>
            )}*/}
            <Table>
              <TableCaption>A list of recently created events.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>MT</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Match Time</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableHead>
                  <TableHead className="w-40">Type</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((e) => {
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">
                        {e.match_time}
                      </TableCell>
                      <TableCell className="flex items-center gap-2">
                        {getEventTypeActionIcon(e.type)}

                        <div
                          style={
                            {
                              "--gradient": `180deg,${e.team?.colors?.[0] ?? "#000000"},${e.team?.colors?.[1] ?? "#000000"}`,
                            } as React.CSSProperties
                          }
                          className={cn(
                            `bg-linear-(--gradient) h-5 rounded-sm w-1`,
                          )}
                        ></div>

                        {e.type}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {e.type === "score" && (
                            <div>
                              <div className="font-medium capitalize">
                                {e.score_type?.replace("-", " ")}
                              </div>
                              {e.player_1_obj && (
                                <div className="text-sm text-muted-foreground">
                                  {e.player_1_obj.number &&
                                    `#${e.player_1_obj.number} `}
                                  {e.player_1_obj.name}
                                </div>
                              )}
                              {e.player_2_obj && (
                                <div className="text-xs text-muted-foreground">
                                  Assist:{" "}
                                  {e.player_2_obj.number &&
                                    `#${e.player_2_obj.number} `}
                                  {e.player_2_obj.name}
                                </div>
                              )}
                            </div>
                          )}
                          {e.type === "card" && (
                            <div>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-4 rounded-sm border"
                                  style={{
                                    backgroundColor:
                                      e.card_type === "yellow"
                                        ? "#fbbf24"
                                        : e.card_type === "red"
                                          ? "#ef4444"
                                          : e.card_type === "green"
                                            ? "#22c55e"
                                            : "#ffffff",
                                    borderColor:
                                      e.card_type === "white"
                                        ? "#d1d5db"
                                        : "transparent",
                                  }}
                                />
                                <span className="capitalize font-medium">
                                  {e.card_type}
                                </span>
                              </div>
                              {e.player_1_obj && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {e.player_1_obj.number &&
                                    `#${e.player_1_obj.number} `}
                                  {e.player_1_obj.name}
                                </div>
                              )}
                            </div>
                          )}
                          {e.type === "substitution" && (
                            <div>
                              <div className="font-medium">
                                Player substitution
                              </div>
                              {e.player_1_obj && (
                                <div className="text-sm text-muted-foreground">
                                  In:{" "}
                                  {e.player_1_obj.number &&
                                    `#${e.player_1_obj.number} `}
                                  {e.player_1_obj.name}
                                </div>
                              )}
                              {e.player_2_obj && (
                                <div className="text-sm text-muted-foreground">
                                  Out:{" "}
                                  {e.player_2_obj.number &&
                                    `#${e.player_2_obj.number} `}
                                  {e.player_2_obj.name}
                                </div>
                              )}
                            </div>
                          )}
                          {e.type === "timeout" && (
                            <div className="text-muted-foreground">
                              Team timeout
                            </div>
                          )}
                          {e.note && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {e.note}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 w-16"
                            onClick={() => handleUpdateEvent(e)}
                            disabled={e.type === "timeout"}
                          >
                            <Edit />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleUpdateEvent(e)}
                                disabled={e.type === "timeout"}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDeleteEvent(e.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      {/* create dialog form to update event information */}
      <Dialog
        open={!!editingEvent}
        onOpenChange={(open) => !open && handleCloseModal()}
      >
        {editingEvent && (
          <UpdateEventForm
            closeModal={handleCloseModal}
            event={editingEvent}
            setEvents={setEvents}
          />
        )}
      </Dialog>
    </>
  );
};

export default AdvancedController;
