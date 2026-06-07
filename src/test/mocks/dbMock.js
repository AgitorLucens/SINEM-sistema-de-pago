import Database from 'better-sqlite3';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export function createTestDb() {
  const dir = mkdtempSync(join(tmpdir(), 'sinem-test-'));
  const db = new Database(join(dir, 'test.db'));

  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS divisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      active INTEGER DEFAULT 1,
      scholarship INTEGER DEFAULT 0,
      scholarship_amount REAL DEFAULT 0,
      reference TEXT
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      division_id INTEGER UNIQUE,
      amount REAL DEFAULT 0,
      FOREIGN KEY (division_id) REFERENCES divisions(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      payment_method TEXT,
      concept_id INTEGER,
      division_id INTEGER,
      student_id INTEGER,
      month INTEGER,
      semester INTEGER,
      year INTEGER,
      sequence INTEGER,
      receipt TEXT,
      status TEXT DEFAULT 'ACTIVE',
      timestamp TEXT,
      FOREIGN KEY (concept_id) REFERENCES payment_concepts(id),
      FOREIGN KEY (division_id) REFERENCES divisions(id),
      FOREIGN KEY (student_id) REFERENCES students(id)
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      description TEXT,
      reference TEXT,
      amount REAL NOT NULL,
      type TEXT
    );

    CREATE TABLE IF NOT EXISTS division_payment_concepts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      division_id INTEGER,
      concept_id INTEGER,
      amount REAL NOT NULL,
      FOREIGN KEY (division_id) REFERENCES divisions(id),
      FOREIGN KEY (concept_id) REFERENCES payment_concepts(id)
    );
  `);

  return { db, dir };
}

export function destroyTestDb(db, dir) {
  if (db) db.close();
}
