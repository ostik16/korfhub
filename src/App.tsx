import { createContext, useEffect, useRef, useState } from "react";
import type { SSState } from "./routes/scoreboard-server/types";
import { BrowserRouter } from "react-router";
import { Routes } from "react-router";
import { Route } from "react-router";
import PV from "./pages/scoreboard/pv";
import Index from "./pages";
import { useLocation } from "react-router";

const contextState: { ws: WebSocket; state: SSState | null } = {
  ws: new WebSocket("ws://localhost:3001"),
  state: null,
};
export const GlobalContext = createContext(contextState);

export function App() {
  let location = useLocation();
  const [state, setState] = useState<SSState | null>(null);
  const [webSocket, setWebSocket] = useState<WebSocket>(contextState.ws);

  useEffect(() => {
    // console.log(window.location);
    setWebSocket(new WebSocket(`ws://${window.location.hostname}:3001`));
  }, []);

  webSocket.addEventListener("message", (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "INIT" || data.type === "INFO") {
      // console.log(data.state);
      // setRemainingTime(data.state.time_remaining_formatted);
      // setHomeScore(data.state.score_home);
      // setAwayScore(data.state.score_away);
      setState(data.state);
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
