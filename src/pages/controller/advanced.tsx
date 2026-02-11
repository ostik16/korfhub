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
import UpdateScoreEventForm from "@/components/form/UpdateScoreEventForm";

const AdvancedController = () => {
  const { state } = useContext(GlobalContext);

  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event>();
  const [updateForm, setUpdateForm] = useState<EventType>(
    EventTypeSchema.def.entries.score,
  );

  useEffect(() => {
    if (!state || !state.id) return;

    listMatchEvents({ match: state.id }).then((res) => setEvents(res));
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
    setUpdateForm(event.type);
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

  return (
    <>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @4xl/main:grid-cols-3">
        {/* TIME */}
        <div className="flex flex-col gap-4">
          <TimeControls />
          <MatchSettings />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-8 w-200">
          <TeamControls events={events} setEvents={setEvents} />

          <div className="col-span-2">
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
                              "--gradient": `180deg,${e.team?.colors[0]},${e.team?.colors[1]}`,
                            } as React.CSSProperties
                          }
                          className={cn(
                            `bg-linear-(--gradient) h-5 rounded-sm w-1`,
                          )}
                        ></div>

                        {e.type}
                      </TableCell>
                      <TableCell>{e.score_type}</TableCell>
                      <TableCell className="text-right">
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
      <Dialog open={!!editingEvent}>
        {editingEvent?.type === EventTypeSchema.def.entries.score && (
          <UpdateScoreEventForm
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
