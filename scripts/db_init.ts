import { Database } from "bun:sqlite";

const db = new Database("./data/database.sqlite", {
  create: true,
  strict: true,
});

// db.run("DROP TABLE teams");
// db.run("DROP TABLE players");
// db.run("DROP TABLE matches");
// db.run("DROP TABLE events");

db.run(`
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    logo TEXT,
    colors TEXT CHECK(json_valid(colors)),
    color_1 TEXT,
    color_2 TEXT
    -- switch to new color storing schema
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    number INTEGER,
    bithday TEXT,
    default_team TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    home_team_id INTEGER NOT NULL,
    away_team_id INTEGER NOT NULL,
    home_team_roster TEXT CHECK(json_valid(home_team_roster)),
    away_team_roster TEXT CHECK(json_valid(away_team_roster)),
    date TEXT,
    completed BIT
    -- add amount of timeouts and subs available in a match
  );
`);
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
