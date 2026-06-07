import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { createTestDb, destroyTestDb } from '../../test/mocks/dbMock.js';

describe('Database CRUD integration', () => {
  let db;

  beforeAll(() => {
    const result = createTestDb();
    db = result.db;
  });

  afterAll(() => {
    destroyTestDb(db);
  });

beforeEach(() => {
  db.exec('DELETE FROM payments');
  db.exec('DELETE FROM expenses');
  db.exec('DELETE FROM students');
  db.exec('DELETE FROM teachers');
  db.exec('DELETE FROM division_payment_concepts');
  db.exec('DELETE FROM divisions');
  db.prepare("INSERT OR IGNORE INTO divisions (name, description) VALUES (?, ?)").run('SINEM', 'Cursos a menores de edad');
});

  describe('Students', () => {
    it('inserts and retrieves a student', () => {
      const insert = db.prepare(`
        INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const info = insert.run('Juan Perez', '8888-1234', 'juan@test.com', 'REF1', 1, 0, 0);
      expect(info.lastInsertRowid).toBeGreaterThan(0);

      const row = db.prepare('SELECT * FROM students WHERE id = ?').get(info.lastInsertRowid);
      expect(row.name).toBe('Juan Perez');
      expect(row.active).toBe(1);
    });

    it('updates a student name', () => {
      const insert = db.prepare(`
        INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const { lastInsertRowid } = insert.run('Ana', '', '', '', 1, 0, 0);
      db.prepare('UPDATE students SET name = ? WHERE id = ?').run('Ana Maria', lastInsertRowid);
      const row = db.prepare('SELECT name FROM students WHERE id = ?').get(lastInsertRowid);
      expect(row.name).toBe('Ana Maria');
    });

    it('deletes a student', () => {
      const insert = db.prepare(`
        INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      const { lastInsertRowid } = insert.run('ToDelete', '', '', '', 1, 0, 0);
      db.prepare('DELETE FROM students WHERE id = ?').run(lastInsertRowid);
      const row = db.prepare('SELECT * FROM students WHERE id = ?').get(lastInsertRowid);
      expect(row).toBeUndefined();
    });

    it('filters students by active status', () => {
      const insert = db.prepare(`
        INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run('Active', '', '', '', 1, 0, 0);
      insert.run('Inactive', '', '', '', 0, 0, 0);

      const active = db.prepare('SELECT * FROM students WHERE active = 1').all();
      expect(active).toHaveLength(1);
      expect(active[0].name).toBe('Active');
    });
  });

  describe('Payments', () => {
    let studentId;
    let conceptId;
    let divisionId;

  beforeEach(() => {
    const student = db.prepare(`
      INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run('Student1', '', '', '', 1, 0, 0);
    studentId = student.lastInsertRowid;

    const concept = db.prepare('SELECT id FROM payment_concepts WHERE type = ?').get('Matricula');
    conceptId = concept.id;

    const division = db.prepare('SELECT id FROM divisions WHERE name = ?').get('SINEM');
    divisionId = division.id;
  });

    it('inserts a payment with consecutive numbering', () => {
      const insert = db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, year, sequence, status, timestamp, month, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run('2024-01-15', 10000, 'Efectivo', conceptId, divisionId, studentId, 2024, 1, 'ACTIVE', '2024-01-15T10:00:00', 1, 1);

      const nextSeq = db.prepare('SELECT COALESCE(MAX(sequence), 0) + 1 AS nextSeq FROM payments WHERE year = ?').get(2024);
      expect(nextSeq.nextSeq).toBe(2);
    });

    it('retrieves payments with JOINs', () => {
      db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, year, sequence, status, timestamp, month, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run('2024-03-15', 5000, 'Transferencia', conceptId, divisionId, studentId, 2024, 1, 'ACTIVE', '2024-03-15T10:00:00', 3, 1);

      const rows = db.prepare(`
        SELECT p.id, s.name AS student_name, c.type AS concept_type, d.name AS division_name
        FROM payments p
        INNER JOIN payment_concepts c ON p.concept_id = c.id
        INNER JOIN divisions d ON p.division_id = d.id
        INNER JOIN students s ON p.student_id = s.id
      `).all();

      expect(rows).toHaveLength(1);
      expect(rows[0].student_name).toBe('Student1');
      expect(rows[0].concept_type).toBe('Matricula');
      expect(rows[0].division_name).toBe('SINEM');
    });

    it('gets distinct years from payments', () => {
      db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, year, sequence, status, timestamp, month, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run('2024-01-15', 10000, 'Efectivo', conceptId, divisionId, studentId, 2024, 1, 'ACTIVE', '2024-01-15T10:00:00', 1, 1);
      db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, year, sequence, status, timestamp, month, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run('2023-06-01', 5000, 'Efectivo', conceptId, divisionId, studentId, 2023, 1, 'ACTIVE', '2023-06-01T10:00:00', 6, 1);

      const years = db.prepare("SELECT DISTINCT year FROM payments ORDER BY year").all();
      expect(years.map(y => y.year)).toEqual([2023, 2024]);
    });

    it('deletePaymentById removes the payment', () => {
      const { lastInsertRowid } = db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, year, sequence, status, timestamp, month, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run('2024-01-15', 10000, 'Efectivo', conceptId, divisionId, studentId, 2024, 1, 'ACTIVE', '2024-01-15T10:00:00', 1, 1);

      db.prepare('DELETE FROM payments WHERE id = ?').run(lastInsertRowid);
      const row = db.prepare('SELECT * FROM payments WHERE id = ?').get(lastInsertRowid);
      expect(row).toBeUndefined();
    });
  });

  describe('Expenses', () => {
    it('inserts and retrieves an expense', () => {
      db.prepare(`
        INSERT INTO expenses (date, description, reference, type, total_amount)
        VALUES (?, ?, ?, ?, ?)
      `).run('2024-02-01', 'Rent', 'REF1', 'Administrativo', 500000);

      const expenses = db.prepare('SELECT * FROM expenses').all();
      expect(expenses).toHaveLength(1);
      expect(expenses[0].description).toBe('Rent');
      expect(expenses[0].total_amount).toBe(500000);
    });

    it('filters expenses by year', () => {
      db.prepare(`INSERT INTO expenses (date, description, reference, type, total_amount) VALUES (?, ?, ?, ?, ?)`)
        .run('2024-01-01', 'A', '', 'T1', 100);
      db.prepare(`INSERT INTO expenses (date, description, reference, type, total_amount) VALUES (?, ?, ?, ?, ?)`)
        .run('2023-06-01', 'B', '', 'T2', 200);

      const result = db.prepare("SELECT * FROM expenses WHERE strftime('%Y', date) = ?").all('2024');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('A');
    });
  });

  describe('Teachers', () => {
  it('inserts and retrieves a teacher with division', () => {
    const division = db.prepare('SELECT id FROM divisions WHERE name = ?').get('SINEM');
    const divId = division.id;
    db.prepare('INSERT INTO teachers (name, division_id, amount) VALUES (?, ?, ?)').run('Prof Lopez', divId, 300000);

      const teachers = db.prepare(`
        SELECT t.id, t.name, d.name AS division_name, t.amount
        FROM teachers t INNER JOIN divisions d ON t.division_id = d.id
      `).all();
      expect(teachers).toHaveLength(1);
      expect(teachers[0].name).toBe('Prof Lopez');
      expect(teachers[0].division_name).toBe('SINEM');
    });
  });

  describe('Import students (field mapping)', () => {
    it('maps Spanish field names to DB columns with Si/No conversion', () => {
      const importData = [
        { nombre: 'Maria', telefono: '8888-5678', correo: 'maria@test.com', referencia: 'R1', activo: 'Si', scholarship: 'No', scholarship_amount: 0 },
        { nombre: 'Pedro', telefono: '', correo: '', referencia: '', activo: 'No', scholarship: 'Si', scholarship_amount: 2000 },
      ];

      const insert = db.prepare(`
        INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      importData.forEach(s => {
        insert.run(
          s.nombre || '',
          s.telefono || '',
          s.correo || '',
          s.referencia || '',
          s.activo.toLowerCase() === 'si' ? 1 : 0,
          s.scholarship.toLowerCase() === 'si' ? 1 : 0,
          s.scholarship_amount || 0
        );
      });

      const students = db.prepare('SELECT * FROM students ORDER BY id ASC').all();
      expect(students).toHaveLength(2);
      expect(students[0].name).toBe('Maria');
      expect(students[0].active).toBe(1);
      expect(students[0].scholarship).toBe(0);
      expect(students[1].name).toBe('Pedro');
      expect(students[1].active).toBe(0);
      expect(students[1].scholarship).toBe(1);
      expect(students[1].scholarship_amount).toBe(2000);
    });
  });

  describe('Delay payments aggregation', () => {
    let studentId, conceptId, divisionId;

  beforeEach(() => {
    const s = db.prepare(`INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount) VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run('S1', '', '', '', 1, 0, 0);
    studentId = s.lastInsertRowid;

    const c = db.prepare('SELECT id FROM payment_concepts WHERE type = ?').get('Mensualidad');
    conceptId = c.id;

    const d = db.prepare('SELECT id FROM divisions WHERE name = ?').get('SINEM');
    divisionId = d.id;
  });

    it('aggregates payments by month and type', () => {
      const insert = db.prepare(`
        INSERT INTO payments (date, amount, payment_method, concept_id, division_id, student_id, year, sequence, status, timestamp, month, semester)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insert.run('2024-01-15', 5000, 'Efectivo', conceptId, divisionId, studentId, 2024, 1, 'ACTIVE', '2024-01-15T10:00:00', 1, 1);
      insert.run('2024-02-15', 5000, 'Efectivo', conceptId, divisionId, studentId, 2024, 2, 'ACTIVE', '2024-02-15T10:00:00', 2, 1);

      const rows = db.prepare(`
        SELECT p.year, p.month, p.semester, c.type, SUM(p.amount) AS total
        FROM payments p
        INNER JOIN payment_concepts c ON p.concept_id = c.id
        WHERE p.year IN (?, ?)
        GROUP BY p.year, p.month, p.semester, c.type
      `).all(2024, 2023);

      expect(rows).toHaveLength(2);
      expect(rows[0].total).toBe(5000);
      expect(rows[1].total).toBe(5000);
    });
  });
});
