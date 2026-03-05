import { Database } from "bun:sqlite";

const db = new Database("./data/database.sqlite", {
  create: false,
  strict: true,
});

console.log("🔄 Starting migration: Add team_id and category to rosters table");

try {
  // Check if columns already exist
  const tableInfo = db.query("PRAGMA table_info(rosters)").all();
  const columns = tableInfo.map((col: any) => col.name);

  const hasTeamId = columns.includes("team_id");
  const hasCategory = columns.includes("category");

  if (hasTeamId && hasCategory) {
    console.log("✅ Columns already exist. No migration needed.");
    process.exit(0);
  }

  console.log("📋 Current columns:", columns);

  // Create a backup table
  console.log("📦 Creating backup of rosters table...");
  db.run("DROP TABLE IF EXISTS rosters_backup");
  db.run("CREATE TABLE rosters_backup AS SELECT * FROM rosters");

  // Get all data from old table
  const oldRosters = db.query("SELECT * FROM rosters").all();
  console.log(`📊 Found ${oldRosters.length} rosters to migrate`);

  // Drop old table
  console.log("🗑️  Dropping old rosters table...");
  db.run("DROP TABLE rosters");

  // Create new table with team_id and category
  console.log("🏗️  Creating new rosters table with team_id and category...");
  db.run(`
    CREATE TABLE rosters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      team_id INTEGER,
      category TEXT,
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
      player_16 INTEGER,
      FOREIGN KEY (team_id) REFERENCES teams(id)
    )
  `);

  // Migrate data
  console.log("📥 Migrating roster data...");
  const insertStmt = db.prepare(`
    INSERT INTO rosters (
      id, name, team_id, category,
      player_1, player_2, player_3, player_4,
      player_5, player_6, player_7, player_8,
      player_9, player_10, player_11, player_12,
      player_13, player_14, player_15, player_16
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?
    )
  `);

  for (const roster of oldRosters as any[]) {
    insertStmt.run(
      roster.id,
      roster.name,
      null, // team_id - default to null
      null, // category - default to null
      roster.player_1,
      roster.player_2,
      roster.player_3,
      roster.player_4,
      roster.player_5,
      roster.player_6,
      roster.player_7,
      roster.player_8,
      roster.player_9,
      roster.player_10,
      roster.player_11,
      roster.player_12,
      roster.player_13,
      roster.player_14,
      roster.player_15,
      roster.player_16,
    );
  }

  // Verify migration
  const newRostersCount = db
    .query("SELECT COUNT(*) as count FROM rosters")
    .get() as any;
  console.log(
    `✅ Migration complete! Migrated ${newRostersCount.count} rosters`,
  );

  // Keep backup table for safety
  console.log(
    "💾 Backup table 'rosters_backup' kept for safety. You can drop it manually once verified.",
  );

  console.log("\n🎉 Migration successful!");
  console.log("   - Added 'team_id' column (nullable, references teams table)");
  console.log("   - Added 'category' column (nullable)");
  console.log(
    "\n⚠️  Remember to run this migration before starting the application.",
  );
} catch (error) {
  console.error("❌ Migration failed:", error);
  process.exit(1);
}
