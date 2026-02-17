import { Database } from "bun:sqlite";

const db = new Database("./data/database.sqlite", {
  create: true,
  strict: true,
});

db.run("DROP TABLE IF EXISTS teams");
db.run("DROP TABLE IF EXISTS rosters");
db.run("DROP TABLE IF EXISTS players");
db.run("DROP TABLE IF EXISTS matches");
db.run("DROP TABLE IF EXISTS events");

// create rosters table
// due to the fact that player can be in multiple rosters/teams
// enhance the teams table with league - two teams with the same name will have different rosters
// when creating a match

db.run(`
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    logo TEXT,
    league TEXT NOT NULL,
    roster INTEGER,
    color_1 TEXT,
    color_2 TEXT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS rosters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    player_1 INTEGER NOT NULL,
    player_2 INTEGER NOT NULL,
    player_3 INTEGER NOT NULL,
    player_4 INTEGER NOT NULL,
    player_5 INTEGER NOT NULL,
    player_6 INTEGER NOT NULL,
    player_7 INTEGER NOT NULL,
    player_8 INTEGER NOT NULL,
    player_9 INTEGER,
    player_10 INTEGER,
    player_11 INTEGER,
    player_12 INTEGER,
    player_13 INTEGER,
    player_14 INTEGER,
    player_15 INTEGER,
    player_16 INTEGER
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    number INTEGER,
    bithday TEXT,
    picture TEXT,
    default_team_id INTEGER
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    home_team_id INTEGER NOT NULL,
    away_team_id INTEGER NOT NULL,
    date TEXT,
    period_duration INTEGER NOT NULL, -- update the endpoints
    period_count INTEGER NOT NULL, -- update the endpoints
    -- also update time counting based on the latest event
    allowed_timeouts INTEGER, -- update the endpoints
    allowed_substitutions INTEGER, -- update the endpoints
    completed BIT
  );
`);

db.run(`
  CREATE TABLE IF NOT EXISTS events (
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
