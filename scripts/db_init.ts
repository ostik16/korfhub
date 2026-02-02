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
      home_team_id TEXT NOT NULL,
      away_team_id TEXT NOT NULL,
      date TEXT
  );
`);

// timestamp shuld be play time
// date is just when it was created
// only team is required, the idea is to update the entry with more information
db.run(`
  CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team TEXT NOT NULL,
      player TEXT,
      type TEXT,
      timestamp TEXT,
      date TEXT
  );
`);
