import { Database } from "bun:sqlite";

const db = new Database("./data/database.sqlite", {
  create: true,
  strict: true,
});

// --- Insert Teams ---
const teams = [
  {
    slug: "team-alpha",
    name: "Team Alpha",
    short_name: "ALP",
    logo: null,
    league: "A",
    roster: null,
    color_1: "#FF0000",
    color_2: "#0000FF",
  },
  {
    slug: "team-beta",
    name: "Team Beta",
    short_name: "BET",
    logo: null,
    league: "A",
    roster: null,
    color_1: "#00FF00",
    color_2: "#FFFF00",
  },
];

for (const t of teams) {
  db.query(
    `INSERT INTO teams (slug, name, short_name, logo, league, roster, color_1, color_2) VALUES ($slug, $name, $short_name, $logo, $league, $roster, $color_1, $color_2)`,
  ).run(t);
}

// --- Insert Players ---
const players = [
  {
    slug: "alice-smith",
    name: "Alice Smith",
    number: 1,
    bithday: "2000-01-01",
    picture: null,
    default_team_id: 1,
  },
  {
    slug: "bob-jones",
    name: "Bob Jones",
    number: 2,
    bithday: "2000-02-02",
    picture: null,
    default_team_id: 1,
  },
  {
    slug: "carol-lee",
    name: "Carol Lee",
    number: 3,
    bithday: "2000-03-03",
    picture: null,
    default_team_id: 2,
  },
  {
    slug: "dan-miller",
    name: "Dan Miller",
    number: 4,
    bithday: "2000-04-04",
    picture: null,
    default_team_id: 2,
  },
  {
    slug: "eve-wilson",
    name: "Eve Wilson",
    number: 5,
    bithday: "2000-05-05",
    picture: null,
    default_team_id: 1,
  },
  {
    slug: "frank-moore",
    name: "Frank Moore",
    number: 6,
    bithday: "2000-06-06",
    picture: null,
    default_team_id: 2,
  },
  {
    slug: "grace-taylor",
    name: "Grace Taylor",
    number: 7,
    bithday: "2000-07-07",
    picture: null,
    default_team_id: 1,
  },
  {
    slug: "henry-brown",
    name: "Henry Brown",
    number: 8,
    bithday: "2000-08-08",
    picture: null,
    default_team_id: 2,
  },
];

for (const p of players) {
  db.query(
    `INSERT INTO players (slug, name, number, bithday, default_team_id) VALUES ($slug, $name, $number, $bithday, $default_team_id)`,
  ).run(p);
}

// --- Insert Rosters ---
const rosters = [
  {
    name: "Alpha Starters",
    player_1: 1,
    player_2: 2,
    player_3: 5,
    player_4: 7,
    player_5: 3,
    player_6: 4,
    player_7: 6,
    player_8: 8,
    player_9: null,
    player_10: null,
    player_11: null,
    player_12: null,
    player_13: null,
    player_14: null,
    player_15: null,
    player_16: null,
  },
  {
    name: "Beta Starters",
    player_1: 3,
    player_2: 4,
    player_3: 6,
    player_4: 8,
    player_5: 1,
    player_6: 2,
    player_7: 5,
    player_8: 7,
    player_9: null,
    player_10: null,
    player_11: null,
    player_12: null,
    player_13: null,
    player_14: null,
    player_15: null,
    player_16: null,
  },
];

for (const r of rosters) {
  db.query(
    `INSERT INTO rosters (name, player_1, player_2, player_3, player_4, player_5, player_6, player_7, player_8, player_9, player_10, player_11, player_12, player_13, player_14, player_15, player_16) VALUES ($name, $player_1, $player_2, $player_3, $player_4, $player_5, $player_6, $player_7, $player_8, $player_9, $player_10, $player_11, $player_12, $player_13, $player_14, $player_15, $player_16)`,
  ).run(r);
}

// --- Insert Matches ---
const matches = [
  {
    slug: "alpha-vs-beta",
    home_team_id: 1,
    away_team_id: 2,
    date: "2026-02-17T10:00:00Z",
    period_duration: 10,
    period_count: 4,
    allowed_timeouts: 2,
    allowed_substitutions: 5,
    completed: 0,
  },
];

for (const m of matches) {
  db.query(
    `INSERT INTO matches (slug, home_team_id, away_team_id, date, period_duration, period_count, allowed_timeouts, allowed_substitutions, completed) VALUES ($slug, $home_team_id, $away_team_id, $date, $period_duration, $period_count, $allowed_timeouts, $allowed_substitutions, $completed)`,
  ).run(m);
}

// --- Insert Events ---
const events = [
  {
    match: 1,
    team: 1,
    type: "score",
    player_1: 1,
    player_2: null,
    score_type: "close",
    card_type: null,
    note: "First goal",
    match_time: 1,
    date: "2026-02-17T10:05:00Z",
  },
  {
    match: 1,
    team: 2,
    type: "score",
    player_1: 3,
    player_2: null,
    score_type: "medium",
    card_type: null,
    note: "Equalizer",
    match_time: 2,
    date: "2026-02-17T10:10:00Z",
  },
];

for (const e of events) {
  db.query(
    `INSERT INTO events (match, team, type, player_1, player_2, score_type, card_type, note, match_time, date) VALUES ($match, $team, $type, $player_1, $player_2, $score_type, $card_type, $note, $match_time, $date)`,
  ).run(e);
}

console.log("Database populated with placeholder data.");
