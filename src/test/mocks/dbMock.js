import { openDatabase, enableForeignKeys } from '../../domain/db/connection.js';
import { runMigrations } from '../../domain/db/schema.js';
import { mkdtempSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/*
    Throwaway database with the REAL application schema.
    Single source of truth: domain/db/schema.js — the DDL is never
    duplicated here. Mirrors the app's startup order: open (WAL) →
    migrations (seeds included) → foreign keys enabled.
*/
export function createTestDb() {
  const dir = mkdtempSync(join(tmpdir(), 'sinem-test-'));
  const db = openDatabase(join(dir, 'test.db'));
  runMigrations(db);
  enableForeignKeys(db);
  return { db, dir };
}

export function destroyTestDb(db) {
  if (db) db.close();
}
