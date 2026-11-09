import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Pricing repository contract tests: divisions, concepts and the
    division×concept price matrix.
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-pricing-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

describe('Pricing lookups (seeded data)', () => {
  it('getPaymentsConcepts returns payment concepts', () => {
    const concepts = db.pricing.getPaymentsConcepts();
    expect(concepts.length).toBeGreaterThanOrEqual(3);
    expect(concepts.map(c => c.name)).toContain('Matricula');
  });

  it('getPaymentsDivisions returns divisions', () => {
    const divisions = db.pricing.getPaymentsDivisions();
    expect(divisions.length).toBeGreaterThanOrEqual(3);
    expect(divisions.map(d => d.name)).toContain('SINEM');
  });
});

describe('Pricing mutations', () => {
  beforeEach(() => {
    db.db.exec('DELETE FROM division_payment_concepts');
    db.db.exec('DELETE FROM divisions');
    db.db.exec('DELETE FROM teachers');
    const sinemDiv = db.db.prepare("INSERT INTO divisions (name, description) VALUES (?, ?)").run('SINEM', 'Test division');
    const sinemId = sinemDiv.lastInsertRowid;
    const concepts = db.db.prepare("SELECT id FROM payment_concepts WHERE type != 'Otros'").all();
    const insertLink = db.db.prepare("INSERT INTO division_payment_concepts (division_id, concept_id, amount) VALUES (?, ?, 0)");
    for (const c of concepts) {
      insertLink.run(sinemId, c.id);
    }
  });

  it('addDivision creates division and links concepts', () => {
    const result = db.pricing.addDivision({ name: 'NewDivTest' });
    expect(result.lastInsertRowid).toBeGreaterThan(0);
    const links = db.db.prepare("SELECT * FROM division_payment_concepts WHERE division_id = ?").all(result.lastInsertRowid);
    expect(links.length).toBeGreaterThanOrEqual(2);
  });

  it('deleteDivision removes division', () => {
    const r = db.pricing.addDivision({ name: 'DelDivTest' });
    const id = r.lastInsertRowid;
    db.pricing.deleteDivision(id);
    const row = db.db.prepare('SELECT * FROM divisions WHERE id = ?').get(id);
    expect(row).toBeUndefined();
  });

  it('updateDivision renames division', () => {
    const r = db.pricing.addDivision({ name: 'OldDivTest' });
    const id = r.lastInsertRowid;
    const result = db.pricing.updateDivision(id, 'RenamedDivTest');
    expect(result.success).toBe(true);
    const row = db.db.prepare('SELECT name FROM divisions WHERE id = ?').get(id);
    expect(row.name).toBe('RenamedDivTest');
  });

  it('getAllDivisionPaymentConcepts returns all links', () => {
    const links = db.pricing.getAllDivisionPaymentConcepts();
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveProperty('division_name');
    expect(links[0]).toHaveProperty('concept_name');
  });

  it('updateDivisionPaymentConcept updates amount', () => {
    const link = db.pricing.getAllDivisionPaymentConcepts()[0];
    const changes = db.pricing.updateDivisionPaymentConcept(link.id, 99999);
    expect(changes).toBe(1);
    const updated = db.db.prepare('SELECT amount FROM division_payment_concepts WHERE id = ?').get(link.id);
    expect(updated.amount).toBe(99999);
  });

  it('updatePriceConcept updates concept amount', () => {
    const concept = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Matricula'").get();
    db.pricing.updatePriceConcept({ id: concept.id, amount: 50000 });
    const row = db.db.prepare('SELECT amount FROM payment_concepts WHERE id = ?').get(concept.id);
    expect(row.amount).toBe(50000);
  });

  it('updatePriceDivision updates division amount', () => {
    const div = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
    db.pricing.updatePriceDivision({ id: div.id, amount: 99999 });
    const row = db.db.prepare('SELECT amount FROM divisions WHERE id = ?').get(div.id);
    expect(row.amount).toBe(99999);
  });

  it('getPaymentAmount returns amount from division_payment_concepts', () => {
    const d = db.db.prepare("SELECT id FROM divisions WHERE name = 'SINEM'").get();
    const mens = db.db.prepare("SELECT id, type FROM payment_concepts WHERE type = 'Mensualidad'").get();
    const amount = db.pricing.getPaymentAmount(d.id, mens.id);
    expect(typeof amount).toBe('number');
  });

  it('getPaymentAmount returns 0 for unknown concept', () => {
    const amount = db.pricing.getPaymentAmount(1, 99999);
    expect(amount).toBe(0);
  });

  it('getPaymentAmount returns concept amount for Otros', () => {
    db.db.prepare("UPDATE payment_concepts SET amount = 12345 WHERE type = 'Otros'").run();
    const otros = db.db.prepare("SELECT id FROM payment_concepts WHERE type = 'Otros'").get();
    const amount = db.pricing.getPaymentAmount(null, otros.id);
    expect(amount).toBe(12345);
  });
});
