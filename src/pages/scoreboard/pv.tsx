import { GlobalContext } from "@/App";
import { cn } from "@/lib/utils";
import type { Team } from "@/routes/data-server/types";
import { useContext } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SlidingNumber } from "@/components/animate-ui/primitives/texts/sliding-number";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import pv from "../../../public/logos/prostejov.png";
import kob from "../../../public/logos/koblov.png";

import pattern from "../../../public/patterns/claw-10.png";
import { Timer } from "lucide-react";

const logoPicker = (name: string | null) => {
  switch (name) {
    case "pv":
      return pv;
    case "kob":
      return kob;
  }
};

type ColorStripProps = {
  colors: string[];
  size?: "sm" | "standard";
};

const ColorStrip = ({ colors, size = "standard" }: ColorStripProps) => {
  return (
    <div className="flex flex-col h-10">
      <div
        style={{ "--color": colors[0] } as React.CSSProperties}
        className={cn(
          "h-1/2 rounded-t-sm bg-(--color)",
          size === "sm" ? "w-1" : "w-1.5",
        )}
      ></div>
      <div
        style={{ "--color": colors[1] } as React.CSSProperties}
        className={cn(
          "h-1/2 rounded-b-sm bg-(--color)",
          size === "sm" ? "w-1" : "w-1.5",
        )}
      ></div>
    </div>
  );
};

type TeamProps = {
  team: Team;
  score: number;
};

const Team = ({ team, score }: TeamProps) => {
  return (
    <CardContent className="flex px-4 justify-between gap-8 items-center">
      <div className="flex items-center gap-2">
        <img src={logoPicker(team.logo)} className="w-10" />
        <ColorStrip colors={team.colors} />
        <div>{team.name}</div>
      </div>
      <Score score={score} />
    </CardContent>
  );
};

type ScoreProps = {
  score: number;
};

const Score = ({ score }: ScoreProps) => {
  return (
    <div className="text-2xl font-bold min-w-10 text-right">
      <SlidingNumber number={score} />
    </div>
  );
};

type TimeProps = {
  time_formatted: string;
  period_formatted: string;
};

const Time = ({ time_formatted, period_formatted }: TimeProps) => {
  return (
    <div className="flex gap-4 px-4 items-center">
      <div className="text-sm w-5">{period_formatted}</div>
      <div className="text-lg w-14">{time_formatted}</div>
    </div>
  );
};

type TimeoutProps = {
  team: Team | null;
  time_formatted: number;
};

const Timeout = ({ team, time_formatted }: TimeoutProps) => {
  if (!team) return null;
  return (
    <div className="flex gap-2 px-4 items-center min-w-36">
      <img src={logoPicker(team.logo)} className="w-8" />
      <ColorStrip colors={team.colors} />
      <Timer />
      <div className="text-lg">{time_formatted}</div>
    </div>
  );
};

const PV = () => {
  const { state } = useContext(GlobalContext);

  if (state === null) return null;

  const isVisible = state.scoreboard_visible;
  const isTimeout = state.timeout_started_at;

  return (
    <div className="flex flex-col gap-2 p-4">
      <Card
        style={{ backgroundImage: `url(${pattern})`, backgroundSize: "cover" }}
        className={cn(
          "py-4 w-max duration-500 -ml-125",
          isVisible ? "ml-0" : "delay-75",
        )}
      >
        <Team team={state.home_team} score={state.home_score} />
        <Team team={state.away_team} score={state.away_score} />
      </Card>
      <div className="flex gap-2">
        <Card
          className={cn(
            "py-4 w-max duration-500 delay-75 -ml-96 z-20",
            isVisible ? "ml-0" : "delay-0",
          )}
        >
          <Time
            time_formatted={state.time_remaining_formatted}
            period_formatted={state.period_formatted}
          />
        </Card>
        <Card
          className={cn(
            "py-2 w-max duration-500 delay-75 -ml-96 z-10",
            isTimeout ? "ml-0" : "delay-0",
          )}
        >
          <Timeout
            time_formatted={state.timeout_time_remaining}
            team={state.timeout_for}
          />
        </Card>
      </div>
    </div>
  );
};

export default PV;
