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
  type TEXT NOT NULL UNIQUE,
  amount REAL,
  description TEXT
);

  CREATE TABLE IF NOT EXISTS divisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  amount REAL,
  description TEXT
);

  CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  scholarship INTEGER NOT NULL DEFAULT 0,
  scholarship_amount REAL DEFAULT 0,
  reference TEXT
);

  CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  division_id INTEGER UNIQUE,
  amount REAL,
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
);

  CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT NOT NULL,
  concept_id INTEGER,
  division_id INTEGER,
  student_id INTEGER,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  timestamp TEXT NOT NULL,
  month INTEGER,
  semester INTEGER,
  receipt TEXT,
  year INTEGER NOT NULL,
  sequence INTEGER NOT NULL,
  FOREIGN KEY (concept_id) REFERENCES payment_concepts(id) ON DELETE SET NULL,
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

  CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_year_sequence
  ON payments (year, sequence);

  CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  reference TEXT,
  type TEXT NOT NULL,
  account_64 REAL,
  account_19 REAL,
  total_amount REAL NOT NULL
);

  CREATE TABLE IF NOT EXISTS division_payment_concepts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  division_id INTEGER,
  concept_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  UNIQUE (division_id, concept_id),
  FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
  FOREIGN KEY (concept_id) REFERENCES payment_concepts(id) ON DELETE CASCADE
);

  CREATE TABLE IF NOT EXISTS cash_register (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  concept TEXT NOT NULL,
  entry_amount REAL,
  exit_amount REAL,
  balance REAL,
  related_payment_id INTEGER,
  related_expense_id INTEGER,
  FOREIGN KEY (related_payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  FOREIGN KEY (related_expense_id) REFERENCES expenses(id) ON DELETE SET NULL
);

  CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image BLOB NOT NULL,
  current_image INTEGER
);
`);

  const insertConcept = db.prepare("INSERT OR IGNORE INTO payment_concepts (type, amount, description) VALUES (?, ?, ?)");
  insertConcept.run('Matricula', 0, 'Pago de matrícula');
  insertConcept.run('Mensualidad', 0, 'Pago mensual');
  insertConcept.run('Otros', 0, 'Otros pagos');

  const insertDivision = db.prepare("INSERT OR IGNORE INTO divisions (name, description) VALUES (?, ?)");
  insertDivision.run('SINEM', 'Cursos a menores de edad');

  return { db, dir };
}

export function destroyTestDb(db, dir) {
  if (db) db.close();
}
