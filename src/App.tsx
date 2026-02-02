import { createContext, useEffect, useRef, useState } from "react";
import type { SSState } from "./routes/scoreboard-server/types";
import { BrowserRouter } from "react-router";
import { Routes } from "react-router";
import { Route } from "react-router";
import PV from "./pages/scoreboard/pv";
import Index from "./pages";
import { useLocation } from "react-router";
import { ws_message_routes } from "./routes/scoreboard-server";

const contextState: { ws: WebSocket; state: SSState | null } = {
  ws: new WebSocket("ws://localhost:3001"),
  state: null,
};
export const GlobalContext = createContext(contextState);

export function App() {
  let location = useLocation();
  const [state, setState] = useState<SSState | null>(null);
  const [gameId, setGameId] = useState<number | null>(7);
  const [webSocket, setWebSocket] = useState<WebSocket>(contextState.ws);

  useEffect(() => {
    // console.log(window.location);
    setWebSocket(new WebSocket(`ws://${window.location.hostname}:3001`));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      webSocket.send(
        JSON.stringify({
          type: ws_message_routes.v1.match_set.ws_message_type,
          payload: { id: gameId },
        }),
      );
    }, 1000);
  }, [gameId]);

  webSocket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "INIT" || data.type === "INFO") {
      // console.log(data.state);
      // setRemainingTime(data.state.time_remaining_formatted);
      // setHomeScore(data.state.score_home);
      // setAwayScore(data.state.score_away);

      const state: SSState = {
        ...data.state,
        home_colors: JSON.parse(data.state.home_colors),
      };

      setState(state);
    }
  });

  return (
    <GlobalContext value={{ ...contextState, state, ws: webSocket }}>
      <Routes>
        <Route index element={<Index />} />
        <Route path="scoreboard">
          <Route path="pv" element={<PV />} />
        </Route>
      </Routes>
    </GlobalContext>
  );
}

export default App;
