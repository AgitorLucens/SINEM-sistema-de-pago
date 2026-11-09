import { openDatabase, enableForeignKeys, closeDatabase } from './connection.js';
import { runMigrations, repairOrphanedRows } from './schema.js';
import defaultDbPath from './defaultDbPath.js';
import { createStudentsRepository } from './repositories/students.js';
import { createPaymentsRepository } from './repositories/payments.js';
import { createExpensesRepository } from './repositories/expenses.js';
import { createTeachersRepository } from './repositories/teachers.js';
import { createPricingRepository } from './repositories/pricing.js';
import { createReportsRepository } from './repositories/reports.js';
import { createImagesRepository } from './repositories/images.js';

export { MIGRATIONS_REGISTRY, LATEST_SCHEMA_VERSION } from './schema.js';

/*
    Composition entry point for the persistence layer.

    Returns a bundle of per-domain repositories sharing one connection:
        const db = createDb();            // real userData path (electron)
        const db = createDb({ dbPath });  // test/alternative path

    Every repository is created here and nowhere else; nothing in the
    rest of the app constructs better-sqlite3 handles directly.
*/
export function createDb({ dbPath } = {}) {
    const db = openDatabase(dbPath ?? defaultDbPath());
    runMigrations(db);
    repairOrphanedRows(db);
    enableForeignKeys(db);

    return {
        // raw handle — needed by migration tests and maintenance code
        db,
        students: createStudentsRepository(db),
        payments: createPaymentsRepository(db),
        expenses: createExpensesRepository(db),
        teachers: createTeachersRepository(db),
        pricing: createPricingRepository(db),
        reports: createReportsRepository(db),
        images: createImagesRepository(db),
        close: () => closeDatabase(db),
    };
}
