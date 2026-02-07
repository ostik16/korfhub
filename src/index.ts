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
  // hostname: Bun.env.BASE_URL,
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,
    ...routes,

    // "/api/hello": {
    //   async GET(req) {
    //     return Response.json({
    //       message: "Hello, world!",
    //       method: "GET",
    //     });
    //   },
    //   async PUT(req) {
    //     return Response.json({
    //       message: "Hello, world!",
    //       method: "PUT",
    //     });
    //   },
    // },

    // "/api/hello/:name": async (req) => {
    //   const name = req.params.name;
    //   return Response.json({
    //     message: `Hello, ${name}!`,
    //   });
    // },
  },

  development: Bun.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

const scoreboard = serve({
  port: Number(Bun.env.SCOREBOARD_PORT),
  // hostname: Bun.env.BASE_URL,
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

console.log(`🚀 [:${frontend.port}] Frontend running at ${frontend.url}`);
console.log(`🚀 [:${scoreboard.port}] Scoreboard running at ${scoreboard.url}`);
// console.log(`🚀 [:${data.port}] Data service running at ${data.url}`);
