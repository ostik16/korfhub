import { calculate_match_time, cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  ArrowLeftRight,
  Minus,
  Plus,
  RectangleVertical,
  Timer,
} from "lucide-react";
import { Card } from "../ui/card";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { GlobalContext } from "@/App";
import type { Event } from "@/routes/data-server/types";
import { createScoreEvent, createTimeoutEvent } from "@/services/event";

type Props = {
  events: Event[];
  setEvents: Dispatch<SetStateAction<Event[]>>;
};

const TeamControls = (props: Props) => {
  const { events, setEvents } = props;
  const { state, webSocketControls } = useContext(GlobalContext);

  function handleScore(side: "home" | "away", score: number) {
    if (!state || !state.id) return;

    const team = side === "home" ? state.home_team.id : state.away_team.id;

    if (side === "home") {
      webSocketControls?.setHomeScore(score);
    }

    if (side === "away") {
      webSocketControls?.setAwayScore(score);
    }

    if (score > 0) {
      createScoreEvent({
        match: state.id,
        team,
        match_time: calculate_match_time(state),
      }).then((e) => setEvents((prev) => [e, ...prev]));
    }
  }

  function handleTimeout(side: "home" | "away") {
    // would be nice to somehow integrate the timeout into the scoreboard so that it is visible the duration left
    // will require to store the current state of the time and change period name
    // the toggle time button would change to "end timeout" button which would stop the countdown prematurely
    if (!state || !state.id) return;

    const team = side === "home" ? state.home_team.id : state.away_team.id;

    createTimeoutEvent({
      match: state.id,
      team,
      match_time: calculate_match_time(state),
    }).then((e) => setEvents((prev) => [e, ...prev]));
  }

  return (
    <>
      <div
        style={
          {
            "--home-gradient": `90deg,${state?.home_team.colors[0]},${state?.home_team.colors[1]}`,
          } as React.CSSProperties
        }
      >
        <div
          id="home-color-strip"
          className={cn("bg-linear-(--home-gradient) h-1 rounded-sm")}
        ></div>
        <span className="text-2xl text-center">{state?.home_team.name}</span>

        <div className="flex w-full py-4 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-25 h-25 text-center"
              onClick={() => handleTimeout("home")}
            >
              <Timer />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 w-25 h-25 text-center"
              onClick={() => handleScore("home", 1)}
            >
              <Plus />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-25 h-25 text-center"
            >
              <RectangleVertical />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-25 h-25 text-center"
              onClick={() => handleScore("home", -1)}
            >
              <Minus />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-full h-25 text-center col-span-2"
            >
              <ArrowLeftRight />
            </Button>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col items-center gap-1">
              <Card className="@container/card inline p-6 text-4xl w-36 text-center">
                {state?.home_score}
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div
        style={
          {
            "--away-gradient": `90deg,${state?.away_team.colors[0]},${state?.away_team.colors[1]}`,
          } as React.CSSProperties
        }
      >
        <div
          id="away-color-strip"
          className={cn("bg-linear-(--away-gradient) h-1 rounded-sm")}
        ></div>
        <span className="text-2xl text-center">{state?.away_team.name}</span>
        <div className="flex w-full py-4 gap-4">
          <div className="flex flex-col">
            <div className="flex flex-col items-center gap-1">
              <Card className="@container/card inline p-6 text-4xl w-36 text-center">
                {state?.away_score}
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="p-6 w-25 h-25 text-center"
              onClick={() => handleScore("away", 1)}
            >
              <Plus />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-25 h-25 text-center"
              onClick={() => handleTimeout("away")}
            >
              <Timer />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-25 h-25 text-center"
              onClick={() => handleScore("away", -1)}
            >
              <Minus />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-25 h-25 text-center"
            >
              <RectangleVertical />
            </Button>
            <Button
              asChild
              variant="outline"
              className="p-6 text-4xl w-full h-25 text-center col-span-2"
            >
              <ArrowLeftRight />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamControls;
