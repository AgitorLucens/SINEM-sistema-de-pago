import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb, MIGRATIONS_REGISTRY, LATEST_SCHEMA_VERSION } from './index.js';
import { repairOrphanedRows } from './schema.js';

/*
    createDb lifecycle tests: connection pragmas, foreign keys,
    startup repair and the migration chain.

    dbPath is injected — no electron involved (see defaultDbPath.js).
*/
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-createdb-'));
const DB_PATH = path.join(tmpDir, 'sinem.sqlite');

let db;

beforeAll(() => {
  db = createDb({ dbPath: DB_PATH });
});

afterAll(() => {
  db.close();
});

describe('Foreign keys', () => {
  it('foreign_keys pragma is enabled on the connection', () => {
    const row = db.db.prepare('PRAGMA foreign_keys').get();
    expect(row.foreign_keys).toBe(1);
  });

  it('deleting a student cascades to their payments', () => {
    const sId = db.db.prepare("INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount) VALUES (?, ?, ?, ?, ?, ?, ?)").run('Cascade', '', '', '', 1, 0, 0).lastInsertRowid;
    db.db.prepare(`
      INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, status, timestamp, year, sequence)
      VALUES ('2024-01-01', 1000, 'Efectivo', NULL, NULL, ?, 'ACTIVE', '2024-01-01T10:00:00', 2099, 999001)
    `).run(sId);

    expect(db.db.prepare('SELECT COUNT(*) AS n FROM payments WHERE student_id = ?').get(sId).n).toBe(1);

    db.students.deleteStudentById(sId);
    expect(db.db.prepare('SELECT COUNT(*) AS n FROM payments WHERE student_id = ?').get(sId).n).toBe(0);
  });

  it('rejects inserting a payment referencing a missing student', () => {
    expect(() =>
      db.db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, status, timestamp, year, sequence)
        VALUES ('2024-01-01', 1000, 'Efectivo', NULL, NULL, 999999, 'ACTIVE', '2024-01-01T10:00:00', 2099, 999002)
      `).run()
    ).toThrow(/FOREIGN KEY/);
  });

  it('repairOrphanedRows removes orphaned payments and nullifies dangling references', () => {
    db.db.pragma('foreign_keys = OFF');
    try {
      db.db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, status, timestamp, year, sequence)
        VALUES ('2024-01-01', 1000, 'Efectivo', NULL, NULL, 888888, 'ACTIVE', '2024-01-01T10:00:00', 2099, 999003)
      `).run();

      db.db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, status, timestamp, year, sequence)
        VALUES ('2024-01-02', 2000, 'Efectivo', 777777, NULL, NULL, 'ACTIVE', '2024-01-02T10:00:00', 2099, 999004)
      `).run();
    } finally {
      db.db.pragma('foreign_keys = ON');
    }

    const summary = repairOrphanedRows(db.db);
    expect(summary.deletedPayments).toBe(1);
    expect(summary.nullifiedPaymentConcepts).toBe(1);

    expect(db.db.prepare('SELECT COUNT(*) AS n FROM payments WHERE student_id = 888888').get().n).toBe(0);
    const repaired = db.db.prepare('SELECT student_id, concept_id FROM payments WHERE sequence = 999004').get();
    expect(repaired.student_id).toBeNull();
    expect(repaired.concept_id).toBeNull();
  });

  it('repairOrphanedRows returns zeros when there is nothing to repair', () => {
    const summary = repairOrphanedRows(db.db);
    expect(Object.values(summary).every(n => n === 0)).toBe(true);
  });
});

describe('Migrations', () => {
  it('fresh database is stamped at the latest schema version', () => {
    const version = db.db.pragma('user_version', { simple: true });
    expect(version).toBe(LATEST_SCHEMA_VERSION);
    expect(MIGRATIONS_REGISTRY[MIGRATIONS_REGISTRY.length - 1].version).toBe(LATEST_SCHEMA_VERSION);
    expect(MIGRATIONS_REGISTRY.map(m => m.version)).toEqual(
      MIGRATIONS_REGISTRY.map(m => m.version).sort((a, b) => a - b)
    );
  });

  it('reopening the database does not re-run migrations and preserves data', () => {
    db.students.addStudent({ name: 'Migration Canary', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    const before = db.db.prepare('SELECT COUNT(*) AS n FROM students WHERE name = ?').get('Migration Canary').n;
    expect(before).toBe(1);

    const reopen = createDb({ dbPath: DB_PATH });
    try {
      const version = reopen.db.pragma('user_version', { simple: true });
      expect(version).toBe(LATEST_SCHEMA_VERSION);
      const canary = reopen.db.prepare('SELECT COUNT(*) AS n FROM students WHERE name = ?').get('Migration Canary').n;
      expect(canary).toBe(1);
    } finally {
      reopen.close();
    }
  });

  it('legacy database (tables but user_version = 0) is stamped without re-running DDL', () => {
    db.students.addStudent({ name: 'Legacy Canary', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.db.pragma('user_version = 0');
    expect(db.db.pragma('user_version', { simple: true })).toBe(0);

    const legacy = createDb({ dbPath: DB_PATH });
    try {
      const version = legacy.db.pragma('user_version', { simple: true });
      expect(version).toBe(LATEST_SCHEMA_VERSION);
      const canary = legacy.db.prepare('SELECT COUNT(*) AS n FROM students WHERE name = ?').get('Legacy Canary').n;
      expect(canary).toBe(1);
    } finally {
      legacy.close();
    }
  });

  it('empty database with version 0 runs the full migration chain from scratch', () => {
    db.db.exec(`
      DROP TABLE cash_register;
      DROP TABLE images;
      DROP TABLE expenses;
      DROP TABLE payments;
      DROP TABLE division_payment_concepts;
      DROP TABLE teachers;
      DROP TABLE divisions;
      DROP TABLE payment_concepts;
      DROP TABLE students;
    `);
    db.db.pragma('user_version = 0');

    const rebuilt = createDb({ dbPath: DB_PATH });
    try {
      const version = rebuilt.db.pragma('user_version', { simple: true });
      expect(version).toBe(LATEST_SCHEMA_VERSION);
      const tables = rebuilt.db.prepare(`
        SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
      `).all().map(r => r.name).sort();
      expect(tables).toEqual(['cash_register', 'division_payment_concepts', 'divisions', 'expenses', 'images', 'payment_concepts', 'payments', 'students', 'teachers']);
      const concepts = rebuilt.db.prepare('SELECT COUNT(*) AS n FROM payment_concepts').get().n;
      expect(concepts).toBeGreaterThanOrEqual(3);
    } finally {
      rebuilt.close();
    }
  });
});
