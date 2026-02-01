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
