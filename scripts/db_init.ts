import { Database } from "bun:sqlite";

const db = new Database("./data/database.sqlite", {
  create: true,
  strict: true,
});

db.run(`
  CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      short_name TEXT NOT NULL,
      logo TEXT,
      colors TEXT CHECK(json_valid(colors))
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      home_team_id INTEGER NOT NULL,
      away_team_id INTEGER NOT NULL,
      date TEXT
      -- add amount of timeouts and subs available in a match
  );
`);
// db.run("DROP TABLE events");
db.run(`
  CREATE TABLE IF NOT EXISTS events (
      -- non changeable
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match INTEGER NOT NULL,
      team INTEGER,
      type TEXT,
      --
      player_1 INTEGER,
      player_2 INTEGER,
      score_type TEXT,
      card_type TEXT,
      note TEXT,
      match_time INTEGER,
      date TEXT
  );
`);
