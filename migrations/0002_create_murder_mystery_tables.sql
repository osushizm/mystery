
-- 0002_create_murder_mystery_tables.sql

-- Scenarios Table
CREATE TABLE IF NOT EXISTS scenarios (
    id TEXT PRIMARY KEY NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Characters Table
CREATE TABLE IF NOT EXISTS characters (
    id TEXT PRIMARY KEY NOT NULL,
    scenario_id TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT,
    backstory TEXT,
    goal TEXT,
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

-- Timelines Table
CREATE TABLE IF NOT EXISTS timelines (
    id TEXT PRIMARY KEY NOT NULL,
    scenario_id TEXT NOT NULL,
    event_time TEXT NOT NULL,
    event_description TEXT NOT NULL,
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE
);

-- Cards Table
CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY NOT NULL,
    scenario_id TEXT NOT NULL,
    card_type TEXT NOT NULL, -- e.g., 'clue', 'item', 'information'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    assigned_to_character_id TEXT,
    FOREIGN KEY (scenario_id) REFERENCES scenarios(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to_character_id) REFERENCES characters(id) ON DELETE SET NULL
);
