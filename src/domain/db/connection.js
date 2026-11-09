import Database from 'better-sqlite3';

/*
    Connection lifecycle for the app database.

    Only this module knows how a raw better-sqlite3 handle is created;
    everything else in domain/db receives an already-open `db`.
*/

export function openDatabase(dbPath) {
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    return db;
}

/*
    Foreign keys are enabled late on purpose: migrations and the orphan
    repair pass run first, so pre-existing rows that violate the
    constraints are neutralized before the constraints start being
    enforced (see schema.js repairOrphanedRows).
*/
export function enableForeignKeys(db) {
    db.pragma('foreign_keys = ON');
    db.pragma('busy_timeout = 5000');
}

export function closeDatabase(db) {
    db.close();
}
