import { Database } from "bun:sqlite";
import type { SSState } from "./types";
import config from "./settings.jsonc";
import { time } from "./time";
import { score } from "./score";
import { match } from "./match";
import { period } from "./period";

export let sharedState = config as SSState;

export const ws_message_routes = {
  v1: {
    time_start: time.start,
    time_stop: time.stop,
    time_reset: time.reset,
    time_adjust: time.adjust,
    time_set: time.set,

    score_home: score.home,
    score_away: score.away,
    score_reset: score.reset,

    period_set: period.set,
    period_limit: period.limit,

    match_set: match.set,
    match_info: match.info,
  },
};

export const websocket: Bun.WebSocketHandler<SSState> = {
  data: {} as SSState, // set ws object type
  idleTimeout: 900, // 15 minutes
  // Called when a client connects
  open(ws) {
    console.log("Client connected");

    // Subscribe this connection to the "global" channel
    ws.subscribe("global");

    // Send the current state immediately to the NEW user only
    ws.send(JSON.stringify({ type: "INIT", state: sharedState }));

    // send info to all clients
    setInterval(() => {
      ws.send(
        JSON.stringify({
          type: "INFO",
          state: ws_message_routes.v1.match_info.handler(null, sharedState),
        }),
      );
    }, 1000 / 10); // 50fps
  },

  // Called when the client sends data
  message(ws, message) {
    try {
      const { type, payload } = JSON.parse(String(message));

      // let updatedState = { ...sharedState };

      switch (type) {
        case ws_message_routes.v1.time_start.ws_message_type:
          sharedState = ws_message_routes.v1.time_start.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.time_stop.ws_message_type:
          sharedState = ws_message_routes.v1.time_stop.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.time_reset.ws_message_type:
          sharedState = ws_message_routes.v1.time_reset.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.time_adjust.ws_message_type:
          sharedState = ws_message_routes.v1.time_adjust.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.time_set.ws_message_type:
          sharedState = ws_message_routes.v1.time_set.handler(
            payload,
            sharedState,
          );
          break;

        case ws_message_routes.v1.score_home.ws_message_type:
          sharedState = ws_message_routes.v1.score_home.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.score_away.ws_message_type:
          sharedState = ws_message_routes.v1.score_away.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.score_reset.ws_message_type:
          sharedState = ws_message_routes.v1.score_reset.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.period_set.ws_message_type:
          sharedState = ws_message_routes.v1.period_set.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.period_limit.ws_message_type:
          sharedState = ws_message_routes.v1.period_limit.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.match_set.ws_message_type:
          sharedState = ws_message_routes.v1.match_set.handler(
            payload,
            sharedState,
          );
          break;
        case ws_message_routes.v1.match_info.ws_message_type:
          sharedState = ws_message_routes.v1.match_info.handler(
            payload,
            sharedState,
          );
          break;
      }

      ws.publish(
        "global",
        JSON.stringify({
          type: "UPDATE",
          state: sharedState,
        }),
      );
    } catch (error) {
      console.error("Failed to parse message", error);
    }
  },

  close(ws) {
    console.log("Client disconnected");
    ws.unsubscribe("global");
  },
};
