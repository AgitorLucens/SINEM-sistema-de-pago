/*
    Schema definition, migrations and startup repair.

    Every function takes the raw better-sqlite3 `db` handle explicitly —
    no module-level state, no electron imports. Adding a schema change:
    append one entry to MIGRATIONS with the next version; existing
    databases apply it on the next launch inside a single transaction
    that also stamps PRAGMA user_version.
*/

/*
    Registro de migraciones del esquema.

    Cada entrada aplica exactamente UNA versión: up(db) ejecuta los cambios
    y la versión se registra en PRAGMA user_version dentro de la misma
    transacción. Para agregar un cambio de esquema se agrega una nueva
    entrada con la versión siguiente; las bases existentes la aplican sola
    en el próximo arranque. Las bases creadas antes de este sistema
    (tablas presentes pero user_version = 0) se detectan al arranque y se
    sellan en la versión 1 sin volver a ejecutar el DDL inicial.
*/
export const MIGRATIONS = [
    {
        version: 1,
        name: 'initial_schema',
        up: (db) => buildInitialSchema(db),
    },
];

export const LATEST_SCHEMA_VERSION = MIGRATIONS[MIGRATIONS.length - 1].version;

export const MIGRATIONS_REGISTRY = MIGRATIONS;

export function buildInitialSchema(db) {

        /*
            Tabla Estudiantes
        */
        const createStudentsTable = `
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                reference TEXT,
                phone TEXT,
                email TEXT,
                active INTEGER NOT NULL, -- 1 para true, 0 para false
                scholarship INTEGER NOT NULL DEFAULT 0, -- 1 para beca, 0 no beca
                scholarship_amount REAL DEFAULT 0
            );
        `;

        db.exec(createStudentsTable);

        /*
            Tabla Profesores
        */
        const createTeachersTable = `
            CREATE TABLE IF NOT EXISTS teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                division_id INTEGER UNIQUE,
                amount REAL,
                FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
            );
        `;

        db.exec(createTeachersTable);

        /*
            Tabla Concepto de Pagos
        */
        const createPaymentConceptsTable = `
            CREATE TABLE IF NOT EXISTS payment_concepts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL UNIQUE, -- Corresponde a ConceptType (MATRICULA, MENSUALIDAD, etc.)
                amount REAL,
                description TEXT
            );
        `;
        db.exec(createPaymentConceptsTable);

        const seedPaymentConcepts = `
            INSERT OR IGNORE INTO payment_concepts (type, amount, description) VALUES
                ('Matricula', 0, 'Pago de matrícula'),
                ('Mensualidad', 0, 'Pago mensual'),
                ('Otros', 0, 'Otros pagos');
            `;
        db.exec(seedPaymentConcepts);
        /*
            Tabla Curso / División
        */
        const createDivisionsTable = `
            CREATE TABLE IF NOT EXISTS divisions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE, -- Corresponde a DivisionType (SINEM, Taller, etc.)
                amount REAL,
                description TEXT
            );
        `;
        db.exec(createDivisionsTable);
        const seedDivisions = `
            INSERT OR IGNORE INTO divisions (name, description) VALUES
                ('SINEM', 'Cursos a menores de edad'),
                ('Ventas Accesorios', 'Ventas de accesorios para cursos'),
                ('Ventas Varias', 'Ventas Varias');
            `;
        db.exec(seedDivisions);

        const createDivisionConceptTable = `
            CREATE TABLE IF NOT EXISTS division_payment_concepts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                division_id INTEGER, --NULL para Pago Otros
                concept_id INTEGER NOT NULL,
                amount REAL NOT NULL,

                UNIQUE (division_id, concept_id),

                FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
                FOREIGN KEY (concept_id) REFERENCES payment_concepts(id) ON DELETE CASCADE
            );
        `;
        db.exec(createDivisionConceptTable);

        // Seed division_payment_concepts
        const divisions = db.prepare("SELECT id, name FROM divisions").all();
        const concepts = db.prepare("SELECT id, type FROM payment_concepts WHERE type != 'Otros'").all();

        const insertDivisionConcept = db.prepare(`
            INSERT OR IGNORE INTO division_payment_concepts (division_id, concept_id, amount)
            VALUES (@division_id, @concept_id, 0)
        `);

        const transaction = db.transaction(() => {
            for (const div of divisions) {
                for (const concept of concepts) {
                    insertDivisionConcept.run({ division_id: div.id, concept_id: concept.id });
                }
            }
        });

        transaction();

        /*
            Tabla Pagos
        */
        const createPaymentsTable = `
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                amount REAL NOT NULL,
                payment_method TEXT NOT NULL, -- Corresponde a PaymentMethod (EFECTIVO, TRANSFERENCIA)
                concept_id INTEGER,   -- Matricula, Mensualidad, Otros
                division_id INTEGER,  -- Corresponde a Taller, SINEM, etc.
                student_id INTEGER,
                status TEXT NOT NULL, -- Corresponde a PaymentStatus (ACTIVE, CANCELED)
                timestamp TEXT NOT NULL,
                month INTEGER, -- Corresponde al mes al que se aplica el pago (1-12)
                semester INTEGER, -- Corresponde aa Matricula 1 o Matricula 2
                receipt TEXT,
                -- consecutivo
                year INTEGER NOT NULL, -- Corresponde al año para el concecutivo
                sequence INTEGER NOT NULL, -- Número de secuencia para el consecutivo
                -- FKs
                FOREIGN KEY (concept_id) REFERENCES payment_concepts(id) ON DELETE SET NULL,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE SET NULL
            );
        `;
        db.exec(createPaymentsTable);

        const createIndexConsecutivePaymentsTable = `
            CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_year_sequence
            ON payments (year, sequence);
        `;
        db.exec(createIndexConsecutivePaymentsTable);

        const createIndexSemesterPaymentsTable = `
            CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_matricula
            ON payments(student_id, division_id, year, semester)
            WHERE concept_id = 1;
        `;
        db.exec(createIndexSemesterPaymentsTable);

        /*
            Tabla Gastos
        */
        const createExpensesTable = `
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                description TEXT NOT NULL,
                reference TEXT,
                type TEXT NOT NULL, -- Corresponde Profesores, Administrativo, Otros Pagos
                account_64 REAL,
                account_19 REAL,
                total_amount REAL NOT NULL
            );
        `;
        db.exec(createExpensesTable);

        /*
            Tabla Imagenes
        */
        const createImagesTable = `
            CREATE TABLE IF NOT EXISTS images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                image BLOB NOT NULL,
                current_image INTEGER -- 1 si lo es, 0 si no
            );
        `;
        db.exec(createImagesTable);

        /*
            Tabla Caja
        */
        const createCashRegisterTable = `
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
        `;
        db.exec(createCashRegisterTable);
}

export function runMigrations(db) {
    let currentVersion = db.pragma('user_version', { simple: true });

    if (currentVersion === 0 && hasExistingSchema(db)) {
        db.pragma('user_version = 1');
        currentVersion = 1;
        console.warn('DB Migration: legacy database detected (tables without version), stamped at version 1.');
    }

    for (const migration of MIGRATIONS) {
        if (migration.version <= currentVersion) continue;
        applyMigration(db, migration);
    }
}

export function hasExistingSchema(db) {
    const row = db.prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table' AND name = 'students'
    `).get();
    return Boolean(row);
}

export function applyMigration(db, migration) {
    const run = db.transaction(() => {
        migration.up(db);
        db.pragma(`user_version = ${migration.version}`);
    });

    try {
        run();
        console.log(`DB Migration ${migration.version} applied: ${migration.name}`);
    } catch (error) {
        console.error(`DB Migration ${migration.version} (${migration.name}) failed: ${error.message}`);
        throw error;
    }
}

/*
    SQLite ignora las llaves foraneas declaradas hasta que se activa
    PRAGMA foreign_keys. Antes de activarlas se eliminan/neutralizan
    filas huerfanas acumuladas mientras las restricciones estuvieron
    apagadas, para que los constraints no rompan escrituras futuras.
*/
export function repairOrphanedRows(db) {
    const cleanup = db.transaction(() => {
        const deletedPayments = db.prepare(`
                DELETE FROM payments
                WHERE student_id IS NOT NULL
                  AND student_id NOT IN (SELECT id FROM students)
            `).run().changes;

        const nullifiedPaymentConcepts = db.prepare(`
                UPDATE payments SET concept_id = NULL
                WHERE concept_id IS NOT NULL
                  AND concept_id NOT IN (SELECT id FROM payment_concepts)
            `).run().changes;

        const nullifiedPaymentDivisions = db.prepare(`
                UPDATE payments SET division_id = NULL
                WHERE division_id IS NOT NULL
                  AND division_id NOT IN (SELECT id FROM divisions)
            `).run().changes;

        const nullifiedTeacherDivisions = db.prepare(`
                UPDATE teachers SET division_id = NULL
                WHERE division_id IS NOT NULL
                  AND division_id NOT IN (SELECT id FROM divisions)
            `).run().changes;

        const nullifiedCashPayments = db.prepare(`
                UPDATE cash_register SET related_payment_id = NULL
                WHERE related_payment_id IS NOT NULL
                  AND related_payment_id NOT IN (SELECT id FROM payments)
            `).run().changes;

        const nullifiedCashExpenses = db.prepare(`
                UPDATE cash_register SET related_expense_id = NULL
                WHERE related_expense_id IS NOT NULL
                  AND related_expense_id NOT IN (SELECT id FROM expenses)
            `).run().changes;

        return { deletedPayments, nullifiedPaymentConcepts, nullifiedPaymentDivisions, nullifiedTeacherDivisions, nullifiedCashPayments, nullifiedCashExpenses };
    });

    try {
        const summary = cleanup();
        const totalRepairs = Object.values(summary).reduce((acc, n) => acc + n, 0);
        if (totalRepairs > 0) {
            console.warn(`DB Repair: ${totalRepairs} orphaned row(s) fixed`, summary);
        }
        return summary;
    } catch (error) {
        console.error(`DB Error repairing orphaned rows: ${error.message}`);
        return null;
    }
}
