import { createContext, useEffect, useRef, useState } from "react";
import type { SSState } from "./routes/scoreboard-server/types";
import { Routes } from "react-router";
import { Route } from "react-router";
import PV from "./pages/scoreboard/pv";
import Index from "./pages";
import { useLocation } from "react-router";
import { ws_message_routes } from "./routes/scoreboard-server";
import Controller from "./pages/controller";
import BasicController from "./pages/controller/basic";
import AdvancedController from "./pages/controller/advanced";
import EventController from "./pages/controller/event";
import ControlsNavigation from "./pages/controller/navigation";

type WebSocketControls = {
  // webSocket: WebSocket;
  startTime: () => void;
  stopTime: () => void;
  resetTime: () => void;
  setTime: (time: number) => void;
  adjustTime: (time: number) => void;

  setPeriod: ({ period, total }: { period?: number; total?: number }) => void;
  setPeriodLimit: (time: number) => void;

  setHomeScore: (score: number) => void;
  setAwayScore: (score: number) => void;
  resetScore: () => void;

  setMatch: (id: number) => void;
};

const contextState: {
  ws: WebSocket;
  state: SSState | null;
  webSocketControls: WebSocketControls | null;
} = {
  ws: new WebSocket("ws://localhost:3001"),
  state: null,
  webSocketControls: null,
};
export const GlobalContext = createContext(contextState);

export function App() {
  let location = useLocation();
  const [state, setState] = useState<SSState | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket>(contextState.ws);

  // possible memory leak, improve how a websocket connection is consumed

  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.hostname}:3001`);
    setWebSocket(socket);
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "INIT" || data.type === "INFO") {
        const state: SSState = {
          ...data.state,
        };

        setState(state);
      }
    });
  }, []);

  const webSocketControls: WebSocketControls = {
    startTime: () => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.time_start.ws_message_type,
          payload: null,
        }),
      );
    },
    stopTime: () => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.time_stop.ws_message_type,
          payload: null,
        }),
      );
    },
    resetTime: () => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.time_reset.ws_message_type,
          payload: null,
        }),
      );
    },
    setTime: (time) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.time_set.ws_message_type,
          payload: { time },
        }),
      );
    },
    adjustTime: (time: number) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.time_adjust.ws_message_type,
          payload: { time },
        }),
      );
    },
    setPeriod: ({ period, total }) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.period_set.ws_message_type,
          payload: { period, total },
        }),
      );
    },
    setPeriodLimit: (time) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.period_limit.ws_message_type,
          payload: { time },
        }),
      );
    },
    setHomeScore: (score) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.score_home.ws_message_type,
          payload: { score },
        }),
      );
    },
    setAwayScore: (score) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.score_away.ws_message_type,
          payload: { score },
        }),
      );
    },
    resetScore: () => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.score_reset.ws_message_type,
          payload: null,
        }),
      );
    },
    setMatch: (id) => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.match_set.ws_message_type,
          payload: { id },
        }),
      );
    },
  };

  return (
    <GlobalContext
      value={{ ...contextState, state, ws: webSocket, webSocketControls }}
    >
      <Routes>
        <Route index element={<Index />} />
        <Route path="controller" element={<Controller />}>
          <Route index element={<ControlsNavigation />} />
          <Route path="basic" element={<BasicController />} />
          <Route path="advanced" element={<AdvancedController />} />
          <Route path="event" element={<EventController />} />
        </Route>
        <Route path="scoreboard">
          <Route path="pv" element={<PV />} />
        </Route>
      </Routes>
    </GlobalContext>
  );
}

export default App;
