import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useContext, useRef, useState, type FormEvent } from "react";
import { ws_message_routes } from "./routes/scoreboard-server";
import { useCountdown } from "./hooks/useCountdown";
import TimerDisplay from "./components/scoreboard/Countdown";
import { GlobalContext } from "./App";

// const socket = new WebSocket("ws://localhost:3000");

export function APITester() {
  // const responseInputRef = useRef<HTMLTextAreaElement>(null);
  // const socket = useRef<WebSocket>(() => {
  //   const ws = new WebSocket("ws://localhost:3000");
  //   ws.addEventListener("message", (event) => {
  //     const data = JSON.parse(event.data);

  //     if (data.type === "INIT" || data.type === "UPDATE") {
  //       console.log(data.state);
  //       setRemainingTime(data.state.time_remaining);
  //       setTimeRunningSince(data.state.time_started_at);
  //     }
  //   });
  //   return ws;
  // });

  const [remainingTime, setRemainingTime] = useState<string>("");
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);

  const { state, ws: socket } = useContext(GlobalContext);

  // const [mm, ss] = useCountdown(
  //   timeRunningSince ?? Date.now() + remainingTime * 1000,
  // );

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const type = formData.get("ws-type") as string;
      const payload = JSON.parse(formData.get("ws-payload") as string);

      socket.send(
        JSON.stringify({
          type: type,
          payload: payload,
        }),
      );
    } catch {
      // responseInputRef.current!.value = String(error);
    }
  };

  // const socket = new WebSocket("ws://localhost:3000");

  // // 1. Listen for messages from Bun
  socket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "INIT" || data.type === "INFO") {
      // console.log(data.state);
      setRemainingTime(data.state.time_remaining_formatted);
      setHomeScore(data.state.home_score);
      setAwayScore(data.state.away_score);
    }
  });

  function startTime() {
    socket.send(
      JSON.stringify({
        type: ws_message_routes.v1.time_start.ws_message_type,
        payload: null,
      }),
    );
  }
  function stopTime() {
    socket.send(
      JSON.stringify({
        type: ws_message_routes.v1.time_stop.ws_message_type,
        payload: null,
      }),
    );
  }
  function resetTime() {
    socket.send(
      JSON.stringify({
        type: ws_message_routes.v1.time_reset.ws_message_type,
        payload: null,
      }),
    );
  }
  function setTime() {
    socket.send(
      JSON.stringify({
        type: ws_message_routes.v1.time_set.ws_message_type,
        payload: { time: 61 },
      }),
    );
  }
  function adjustTime() {
    socket.send(
      JSON.stringify({
        type: ws_message_routes.v1.time_adjust.ws_message_type,
        payload: { time: -5 },
      }),
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 w-full justify-around">
        <span>
          {homeScore} {state?.home_score}
        </span>
        <span>{remainingTime}</span>
        <span>
          {awayScore} {state?.away_score}
        </span>
      </div>
      <Button onClick={startTime}>START</Button>
      <Button onClick={stopTime}>STOP</Button>
      <Button onClick={resetTime}>RESET</Button>
      <Button onClick={setTime}>SET</Button>
      <Button onClick={adjustTime}>ADJUST</Button>
      <form onSubmit={testEndpoint} className="flex items-center gap-2">
        <Label htmlFor="method" className="sr-only">
          Method
        </Label>
        <Select name="ws-type" defaultValue="time_start">
          <SelectTrigger id="method">
            <SelectValue placeholder="WS Type" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="time_start">time_start</SelectItem>
            <SelectItem value="time_stop">time_stop</SelectItem>
            <SelectItem value="time_reset">time_reset</SelectItem>
            <SelectItem value="time_set">time_set</SelectItem>
            <SelectItem value="time_adjust">time_adjust</SelectItem>
            <SelectItem value="time_info">time_info</SelectItem>
            <SelectItem value="score_home">score_home</SelectItem>
            <SelectItem value="score_away">score_away</SelectItem>
            <SelectItem value="score_reset">score_reset</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="payload" className="sr-only">
          WS Payload
        </Label>
        <Input
          id="payload"
          type="text"
          name="ws-payload"
          defaultValue="null"
          placeholder="payload"
        />
        <Button type="submit" variant="secondary">
          Send
        </Button>
      </form>
    </div>
  );
}
