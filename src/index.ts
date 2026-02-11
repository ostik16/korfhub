import { serve, type BunRequest } from "bun";
import index from "./index.html";
import {
  sharedState,
  websocket,
  ws_message_routes,
} from "./routes/scoreboard-server";
import { routes } from "./routes/data-server";
import { Database } from "bun:sqlite";

const frontend = serve({
  port: Number(Bun.env.FRONTEND_PORT),
  routes: {
    "/*": index,
    ...routes,
  },

  development: Bun.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

const scoreboard = serve({
  // support also standard endpoints to allow controlling of the scoreboard without websocket connection (StreamDeck)
  port: Number(Bun.env.SCOREBOARD_PORT),
  async fetch(req, server) {
    const url = new URL(req.url);
    // console.log(url);

    // if (url.pathname === ws_message_routes.v1.match_set.ws_endpoint) {
    // }

    const headers: Bun.HeadersInit = {
      "Access-Control-Allow-Origin": "*",
    };
    const success = server.upgrade(req, { headers, data: sharedState });
    return success
      ? undefined
      : new Response("WebSocket upgrade error", { status: 400 });
  },
  websocket,
  development: Bun.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

// const data = serve({
//   port: Number(process.env.DATASERVICE_PORT),
//   // hostname: Bun.env.BASE_URL,
//   routes,
// });

export const db = new Database("./data/database.sqlite", {
  create: true,
  strict: true,
});

console.log(
  `🚀 [:${frontend.port}] Frontend and Data server running at ${frontend.url}`,
);
console.log(`🚀 [:${scoreboard.port}] Scoreboard running at ${scoreboard.url}`);
// console.log(`🚀 [:${data.port}] Data service running at ${data.url}`);
