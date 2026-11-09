import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Teachers repository contract tests.
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-teachers-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.db.exec('DELETE FROM teachers');
});

describe('Teachers repository', () => {
  let divisionId;

  beforeEach(() => {
    const d = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
    divisionId = d.id;
  });

  it('addTeacher inserts teacher', () => {
    const result = db.teachers.addTeacher({ name: 'Prof A', division_id: divisionId, amount: 300000 });
    expect(result.lastInsertRowid).toBeGreaterThan(0);
  });

  it('getAllTeachers returns teachers with division name', () => {
    db.teachers.addTeacher({ name: 'Prof A', division_id: divisionId, amount: 300000 });
    const teachers = db.teachers.getAllTeachers();
    expect(teachers).toHaveLength(1);
    expect(teachers[0].division_name).toBe('SINEM');
  });

  it('updateTeacher updates fields', () => {
    const r = db.teachers.addTeacher({ name: 'Old', division_id: divisionId, amount: 100 });
    const id = r.lastInsertRowid;
    const result = db.teachers.updateTeacher({ id, fields: { name: 'New' }, list: ['name'] });
    expect(result.success).toBe(true);
    const row = db.db.prepare('SELECT name FROM teachers WHERE id = ?').get(id);
    expect(row.name).toBe('New');
  });

  it('deleteTeacherById removes teacher', () => {
    const r = db.teachers.addTeacher({ name: 'Del', division_id: divisionId, amount: 100 });
    const id = r.lastInsertRowid;
    db.teachers.deleteTeacherById(id);
    const row = db.db.prepare('SELECT * FROM teachers WHERE id = ?').get(id);
    expect(row).toBeUndefined();
  });
});
