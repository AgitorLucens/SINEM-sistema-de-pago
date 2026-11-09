import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';
import { createDb } from '../index.js';

/*
    Images repository contract tests: app logo gallery stored as BLOBs.
*/
let db;

beforeAll(() => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sinem-images-repo-'));
  db = createDb({ dbPath: path.join(dir, 'test.sqlite') });
});

afterAll(() => {
  db.close();
});

beforeEach(() => {
  db.db.exec('DELETE FROM images');
});

describe('Images repository', () => {
  it('addImage inserts image', () => {
    const id = db.images.addImage({ image: Buffer.from('test') });
    expect(id).toBeGreaterThan(0);
  });

  it('getImages returns all images', () => {
    db.images.addImage({ image: Buffer.from('img1') });
    db.images.addImage({ image: Buffer.from('img2') });
    const images = db.images.getImages();
    expect(images).toHaveLength(2);
  });

  it('setImage updates current_image flag', () => {
    const id = db.images.addImage({ image: Buffer.from('img') });
    db.images.setImage({ id, current_image: 1 });
    const current = db.images.getCurrentImage();
    expect(current.id).toBe(id);
  });

  it('deleteImageById removes image', () => {
    const id = db.images.addImage({ image: Buffer.from('del') });
    db.images.deleteImageById(id);
    const row = db.db.prepare('SELECT * FROM images WHERE id = ?').get(id);
    expect(row).toBeUndefined();
  });
});
