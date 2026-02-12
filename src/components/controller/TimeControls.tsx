import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Kbd } from "../ui/kbd";
import { ClockPlus, Space } from "lucide-react";
import { Badge } from "../ui/badge";
import { getPeriodName } from "@/routes/scoreboard-server/utils";
import { useContext } from "react";
import { GlobalContext } from "@/App";

const TimeControls = () => {
  const { state, webSocketControls } = useContext(GlobalContext);

  const isTimeRunning = !!state?.time_started_at;

  function handleTime() {
    isTimeRunning
      ? webSocketControls?.stopTime()
      : webSocketControls?.startTime();
  }

  function handleAdjustTime(time: number) {
    webSocketControls?.adjustTime(time);
  }

  return (
    <>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle
            className={cn(
              "font-semibold tabular-nums text-6xl",
              isTimeRunning ? "text-inherit" : "text-red-400",
            )}
          >
            {state?.time_remaining_formatted}
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">{state?.period_formatted}</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Button
            variant="default"
            block
            onClick={handleTime}
            className="uppercase h-25"
          >
            {isTimeRunning ? "stop" : "start"}
          </Button>
        </CardContent>
        <CardContent>
          {/*
          add timeout for the tip so that it disappears when used or after some time
          also hide when the device is a mobile phone or similar without a keyboard
        */}
          <span className="text-gray-500">
            Tip: you can press{" "}
            <Kbd>
              <Space />
            </Kbd>{" "}
            to toggle the time
          </span>
        </CardContent>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Adjust Time</CardTitle>
          <CardAction>
            <ClockPlus size={18} />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => handleAdjustTime(5)}>
              +5s
            </Button>
            <Button variant="outline" onClick={() => handleAdjustTime(1)}>
              +1s
            </Button>
            <Button variant="outline" onClick={() => handleAdjustTime(-5)}>
              -5s
            </Button>
            <Button variant="outline" onClick={() => handleAdjustTime(-1)}>
              -1s
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TimeControls;
