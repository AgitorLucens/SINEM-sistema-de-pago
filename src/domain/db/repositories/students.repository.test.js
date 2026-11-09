import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Students repository contract tests.
    Each repository test file owns an isolated database instance —
    createDb injects a temp path, so no electron is involved.
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-students-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.db.exec('DELETE FROM payments');
  db.db.exec('DELETE FROM students');
});

describe('Students repository', () => {
  it('addStudent inserts and returns lastInsertRowid', () => {
    const id = db.students.addStudent({ name: 'Juan', phone: '8888', email: 'j@t.com', reference: 'R1', active: 1, scholarship: 0, scholarship_amount: 0 });
    expect(id).toBeGreaterThan(0);
  });

  it('getAllStudents returns all students', () => {
    db.students.addStudent({ name: 'A', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.students.addStudent({ name: 'B', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
    const students = db.students.getAllStudents();
    expect(students).toHaveLength(2);
    expect(students[0].name).toBe('B');
  });

  it('getStudentsByActive filters active students', () => {
    db.students.addStudent({ name: 'Active', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.students.addStudent({ name: 'Inactive', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
    const active = db.students.getStudentsByActive(1);
    expect(active).toHaveLength(1);
    expect(active[0].name).toBe('Active');
  });

  it('getStudentsByActive with falsy returns all', () => {
    db.students.addStudent({ name: 'X', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    const all = db.students.getStudentsByActive(0);
    expect(all.length).toBeGreaterThanOrEqual(1);
  });

  it('getStudentsActive returns distinct active values', () => {
    db.students.addStudent({ name: 'A', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.students.addStudent({ name: 'B', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
    const res = db.students.getStudentsActive();
    expect(res.length).toBeGreaterThanOrEqual(1);
  });

  it('getStudentCount returns count of active students', () => {
    db.students.addStudent({ name: 'A', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.students.addStudent({ name: 'B', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.students.addStudent({ name: 'C', phone: '', email: '', reference: '', active: 0, scholarship: 0, scholarship_amount: 0 });
    const count = db.students.getStudentCount();
    expect(count[0]['COUNT(*)']).toBe(2);
  });

  it('updateStudent updates fields successfully', () => {
    const id = db.students.addStudent({ name: 'Old', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    const result = db.students.updateStudent({ id, fields: { name: 'New' }, list: ['name'] });
    expect(result.success).toBe(true);
    const row = db.db.prepare('SELECT name FROM students WHERE id = ?').get(id);
    expect(row.name).toBe('New');
  });

  it('updateStudent fails gracefully on empty fields', () => {
    expect(db.students.updateStudent({ id: 1, fields: {} })).toEqual({ success: false, transaction: null });
    expect(db.students.updateStudent({ id: 1, fields: { hacker: 'x' } })).toEqual({ success: false, transaction: null });
    expect(db.students.updateStudent(null)).toEqual({ success: false, transaction: null });
  });

  it('deleteStudentById removes student', () => {
    const id = db.students.addStudent({ name: 'Del', phone: '', email: '', reference: '', active: 1, scholarship: 0, scholarship_amount: 0 });
    db.students.deleteStudentById(id);
    const row = db.db.prepare('SELECT * FROM students WHERE id = ?').get(id);
    expect(row).toBeUndefined();
  });

  it('importStudents inserts multiple students with Si/No conversion', () => {
    const data = [
      { nombre: 'M', telefono: '1', correo: 'm@t.com', referencia: 'R1', activo: 'Si', scholarship: 'No', scholarship_amount: 0 },
      { nombre: 'P', telefono: '', correo: '', referencia: '', activo: 'no', scholarship: 'si', scholarship_amount: 5000 },
    ];
    const result = db.students.importStudents(data);
    expect(result.success).toBe(true);
    const rows = db.students.getAllStudents();
    expect(rows).toHaveLength(2);
    expect(rows[0].active).toBe(0);
    expect(rows[0].scholarship).toBe(1);
    expect(rows[0].scholarship_amount).toBe(5000);
    expect(rows[1].active).toBe(1);
    expect(rows[1].scholarship).toBe(0);
  });

  it('importStudents returns error when data is null', () => {
    const result = db.students.importStudents(null);
    expect(result.error).toBe('Datos Estudiantes no encontrados.');
  });

  it('importStudents tolerates null cells and string amounts', () => {
    const result = db.students.importStudents([
      { nombre: 'Nulls', telefono: null, correo: undefined, referencia: null, activo: null, scholarship: null, scholarship_amount: null },
      { nombre: 'StrAmount', activo: 'SI', scholarship: 'No', scholarship_amount: '7500' },
    ]);
    expect(result.success).toBe(true);
    const rows = db.students.getAllStudents();
    const nullRow = rows.find(r => r.name === 'Nulls');
    expect(nullRow.active).toBe(0);
    expect(nullRow.scholarship).toBe(0);
    expect(nullRow.scholarship_amount).toBe(0);
    const strRow = rows.find(r => r.name === 'StrAmount');
    expect(strRow.active).toBe(1);
    expect(strRow.scholarship_amount).toBe(7500);
  });
});
