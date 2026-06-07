import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';
import { validatePaymentsUpdate, validateExpensesUpdate, validateStudentsUpdate, validateTeachersUpdate } from "./validate.js";

class AppDB {
    constructor() {
        const dbPath = path.join(app.getPath('userData'), 'sinem.sqlite');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
    }

    _run(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.run(...params);
        } catch (error) {
            console.error(`DB Error: ${error.message}`, { sql, params });
            throw error;
        }
    }

    _all(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.all(...params);
        } catch (error) {
            console.error(`DB Error: ${error.message}`, { sql, params });
            throw error;
        }
    }

    _get(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.get(...params);
        } catch (error) {
            console.error(`DB Error: ${error.message}`, { sql, params });
            throw error;
        }
    }

    _transaction(fn) {
        return this.db.transaction(fn);
    }

    setUpDatabase() {

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

        this.db.exec(createStudentsTable);

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

        this.db.exec(createTeachersTable);

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
        this.db.exec(createPaymentConceptsTable);

        const seedPaymentConcepts = `
            INSERT OR IGNORE INTO payment_concepts (type, amount, description) VALUES
                ('Matricula', 0, 'Pago de matrícula'),
                ('Mensualidad', 0, 'Pago mensual'),
                ('Otros', 0, 'Otros pagos');
            `;
        this.db.exec(seedPaymentConcepts);
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
        this.db.exec(createDivisionsTable);
        const seedDivisions = `
            INSERT OR IGNORE INTO divisions (name, description) VALUES
                ('SINEM', 'Cursos a menores de edad'),
                ('Ventas Accesorios', 'Ventas de accesorios para cursos'),
                ('Ventas Varias', 'Ventas Varias');
            `;
        this.db.exec(seedDivisions);

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
        this.db.exec(createDivisionConceptTable);

        // Seed division_payment_concepts
        const divisions = this.db.prepare("SELECT id, name FROM divisions").all();
        const concepts = this.db.prepare("SELECT id, type FROM payment_concepts WHERE type != 'Otros'").all();

        const insertDivisionConcept = this.db.prepare(`
            INSERT OR IGNORE INTO division_payment_concepts (division_id, concept_id, amount)
            VALUES (@division_id, @concept_id, 0)
        `);

        const transaction = this.db.transaction(() => {
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
        this.db.exec(createPaymentsTable);

        const createIndexConcecutivePaymentsTable = `
            CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_year_sequence
            ON payments (year, sequence);
        `;
        this.db.exec(createIndexConcecutivePaymentsTable);

        const createIndexSemesterPaymentsTable = `
            CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_matricula
            ON payments(student_id, division_id, year, semester)
            WHERE concept_id = 1;
        `;
        this.db.exec(createIndexSemesterPaymentsTable);

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
        this.db.exec(createExpensesTable);

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
        this.db.exec(createImagesTable);

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
        this.db.exec(createCashRegisterTable);

    }


    /**
     * Añade un nuevo pago (ADAPTACIÓN DE LA FUNCIÓN ANTERIOR).
     * Ahora esta función es solo una demostración de cómo se insertaría un pago
     * usando FKs (asumiendo que student_id y concept_id ya existen).
     * @param {object} paymentData - Datos del pago.
     * @returns {Promise<number>} El ID del nuevo registro.
     */
    addPayment(payment) {
        const db = this.db;

        const transaction = db.transaction((payment) => {
            const year = new Date(payment.date).getFullYear();

            const seqStmt = db.prepare(`
                SELECT COALESCE(MAX(sequence), 0) + 1 AS nextSeq
                FROM payments
                WHERE year = ?
            `);

            const { nextSeq } = seqStmt.get(year);

            const insertStmt = db.prepare(`
                INSERT INTO payments (
                    date,
                    amount,
                    payment_method,
                    concept_id,
                    division_id,
                    student_id,
                    year,
                    sequence,
                    status,
                    timestamp
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

            const result = insertStmt.run(
                payment.date,
                payment.amount,
                payment.payment_method,
                payment.concept_id,
                payment.division_id,
                payment.student_id,
                year,
                nextSeq,
                payment.status,
                payment.timestamp
            );
            const insertedId = result.lastInsertRowid;
            const createdPayment = db.prepare(`
                SELECT *
                FROM payments
                WHERE id = ?
            `).get(insertedId);

            return { year, sequence: nextSeq, createdPayment: createdPayment };
        });

        return {
            success: true,
            transaction: transaction(payment)
        }
    }

    updatePayment(data) {
        const keys = validatePaymentsUpdate(data);
        if (!keys) return {
            success: false,
            transaction: null
        }

        const setClause = keys.map(k => `${k} = ?`).join(", ");
        const values = keys.map(k => data.fields[k]);

        const stmt = this.db.prepare(`
                UPDATE payments
                SET ${setClause}
                WHERE id = ?
        `);
        const result = stmt.run(...values, data?.id);
        return {
            success: true,
            result: result.changes
        }
    }

    getNextConsecutiveByYear(year) {
        const stmt = this.db.prepare(`
            SELECT COALESCE(MAX(sequence), 0) + 1 AS nextSeq
            FROM payments
            WHERE year = ?
        `);
        return stmt.get(year)?.nextSeq ?? 0;
    }

    addPaymentWithConsecutive(payment) {
        const sql = this.db.prepare(`
                INSERT INTO payments (
                    date,
                    amount,
                    receipt,
                    payment_method,
                    concept_id,
                    division_id,
                    student_id,
                    semester,
                    year,
                    month,
                    sequence,
                    status,
                    timestamp
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
        const data = sql.run(payment.date,
            payment.amount,
            payment.receipt || "",
            payment.payment_method,
            payment.concept_id,
            payment.division_id,
            payment.student_id,
            payment.semester,
            payment.year,
            payment.month,
            payment.sequence,
            payment.status,
            payment.timestamp);
        const insertedId = data.lastInsertRowid;
        const createdPayment = this.db.prepare(`
            SELECT
                p.id,
                p.date,
                s.name AS student_name,
                p.student_id,
                p.payment_method,
                d.name AS division_name,
                p.division_id,
                c.type AS concept_type,
                p.concept_id,
                p.amount,
                p.month,
                p.year,
                p.semester,
                p.sequence,
                p.receipt
            FROM
                payments p
            INNER JOIN
                payment_concepts c ON p.concept_id = c.id
            INNER JOIN  
                divisions d ON p.division_id = d.id
            INNER JOIN
                students s ON p.student_id = s.id
            WHERE p.id = ?
        `).get(insertedId);
        return {
            success: true,
            payment: createdPayment
        };
    }

    getAllPayments() {
        const sql = this.db.prepare(`
                                    SELECT
                                        p.id,
                                        p.date,
                                        s.name AS student_name,
                                        p.student_id,
                                        p.payment_method,
                                        d.name AS division_name,
                                        t.name AS teacher_name,
                                        p.division_id,
                                        c.type AS concept_type,
                                        p.concept_id,
                                        p.amount,
                                        p.month,
                                        p.semester,
                                        p.year,
                                        p.sequence,
                                        p.receipt
                                    FROM 
                                        payments p
                                    INNER JOIN 
                                        payment_concepts c ON p.concept_id = c.id
                                    LEFT JOIN 
                                        divisions d ON p.division_id = d.id
                                    LEFT JOIN 
                                        teachers t ON d.id = t.division_id
                                    LEFT JOIN 
                                        students s ON p.student_id = s.id
                                    ORDER BY p.id DESC;`
        );
        const payments = sql.all();
        return payments;
    }

    getAllPaymentsByYear(year) {
        const sql = this.db.prepare(`SELECT
                                        p.id,
                                        p.date,
                                        s.name AS student_name,
                                        p.payment_method,
                                        d.name AS division_name,
                                        c.type AS concept_type,
                                        p.amount,
                                        p.month                
                                     FROM
                                        payments p
                                     INNER JOIN
                                        payment_concepts c ON p.concept_id = c.id
                                     INNER JOIN  
                                        divisions d ON p.division_id = d.id
                                     INNER JOIN
                                        students s ON p.student_id = s.id
                                     WHERE
                                        strftime('%Y', p.date) = ?
                                     ORDER BY
                                        p.id DESC;`
        );
        const payments = sql.all(year);
        return payments;
    }

    getPaymentsByYear(year) {
        let sql = ``;
        let payments = [];
        if (year) {
            sql = this.db.prepare(`SELECT
                                    p.id,
                                    p.date,
                                    s.name AS student_name,
                                    p.payment_method,
                                    d.name AS division_name,
                                    c.type AS concept_type,
                                    p.amount,
                                    p.year,
                                    p.sequence,
                                    p.month
                                   FROM 
                                    payments p
                                   INNER JOIN
                                    payment_concepts c ON p.concept_id = c.id
                                   INNER JOIN  
                                    divisions d ON p.division_id = d.id
                                   INNER JOIN
                                    students s ON p.student_id = s.id
                                   WHERE 
                                    strftime('%Y', date) = ?
                                   ORDER BY 
                                    date ASC;`
            );
            payments = sql.all(year);
        } else {
            sql = this.db.prepare(`SELECT *
                                   FROM 
                                    payments
                                   ORDER BY 
                                    date ASC;`
            );
            payments = sql.all();
        }
        return payments;
    }

    getYearsOfPayments() {
        const sql = this.db.prepare(`SELECT DISTINCT 
                                        strftime('%Y', date) 
                                     AS 
                                        year
                                     FROM 
                                        payments
                                     ORDER BY 
                                        year;`
        );
        const years = sql.all();
        return years;
    }

    getDateOfPayments() {
        const sql = this.db.prepare(`SELECT DISTINCT
                                        strftime('%d-%m-%Y', date) AS date_only
                                     FROM 
                                        payments
                                     ORDER BY 
                                        strftime('%Y-%m-%d', date);
                                    `);
        const years = sql.all();
        return years;
    }

    getPaymentByStudentId(id) {
        const sql = this.db.prepare(`SELECT  
                                        p.id,
                                        p.date,
                                        s.name AS student_name,
                                        p.payment_method,
                                        d.name AS division_name,
                                        c.type AS concept_type,
                                        p.amount,
                                        p.year,
                                        p.sequence,
                                        p.month,
                                        p.semester,
                                        p.status
                                     FROM 
                                        payments p
                                     INNER JOIN
                                        payment_concepts c ON p.concept_id = c.id
                                     INNER JOIN  
                                        divisions d ON p.division_id = d.id
                                     INNER JOIN
                                        students s ON p.student_id = s.id
                                     WHERE 
                                        student_id = ?`);
        const payment = sql.all(id)
        return payment;
    }

    deletePaymentById(id) {
        const sql = this.db.prepare(`DELETE FROM payments WHERE id = ?`);
        const payment = sql.run(id);
        return payment
    }

    getPaymentsConcepts() {
        const sql = this.db.prepare('SELECT id, type AS name, amount FROM payment_concepts ORDER BY id ASC');
        const result = sql.all();
        return result;
    }

    getPaymentsDivisions() {
        const sql = this.db.prepare('SELECT id,amount, name AS name FROM divisions ORDER BY id ASC');
        const result = sql.all();
        return result;
    }

    getDelayPayments(years) {
        if (!years) return new Error("falta años de Ingresos")

        let yearFilter = '';
        let params = [];

        if (years.length > 0) {
            yearFilter = `AND p.year IN (${years.map(() => '?').join(',')})`;
            params = years;
        }

        const stmt = this.db.prepare(`
                SELECT
                    p.year,
                    p.month,
                    p.semester,
                    c.type,
                    SUM(p.amount) AS total
                FROM payments p
                INNER JOIN payment_concepts c ON p.concept_id = c.id
                WHERE 1=1
                ${yearFilter}
                GROUP BY p.year, p.month, p.semester, c.type
        `);

        const rows = stmt.all(...params);

        const report = {
            matricula1: 0,
            matricula2: 0,
            months: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0,
                12: 0
            }
        };

        rows.forEach(r => {

            // MATRÍCULAS
            if (r.type === 'Matricula') {
                if (r.semester === 1) {
                    report.matricula1 += r.total;
                }

                if (r.semester === 2) {
                    report.matricula2 += r.total;
                }
            }

            // MENSUALIDADES
            if (r.type === 'Mensualidad' && r.month) {
                report.months[r.month] += r.total;
            }

        });

        return report;
    }

    getExpectedIncome(years) {
        if (!years || years.length === 0) return { matricula1: 0, matricula2: 0, monthly1: 0, monthly2: 0 };

        const yearPlaceholders = years.map(() => '?').join(',');

        const sql = this.db.prepare(`
            SELECT
                p.semester,
                COUNT(*) as student_count,
                SUM(dpc.amount) as monthly_total
            FROM payments p
            JOIN payment_concepts pc_matricula ON p.concept_id = pc_matricula.id 
            LEFT JOIN division_payment_concepts dpc ON p.division_id = dpc.division_id
            LEFT JOIN payment_concepts pc_monthly ON dpc.concept_id = pc_monthly.id 
            WHERE 
                pc_matricula.type = 'Matricula' 
                AND pc_monthly.type = 'Mensualidad'
                AND p.year IN (${yearPlaceholders})
            GROUP BY p.semester
        `);

        const results = sql.all(...years);
        const income = {
            matricula1: 0,
            matricula2: 0,
            monthly1: 0,
            monthly2: 0,
            activeStudents: 0
        };

        // Active students check (global, as initially requested)
        // Or should this be sum of student_sem1 + student_sem2? 
        // User asked for "amount of student active in the system" previously.
        // I will keep the previous global active check for the header, OR sum the unique students in the period?
        // Let's keep the global active for the header if that's what "Active Students" means in context, 
        // but for the report columns use the calculated values.
        // Actually, let's just use the global count for the header as implemented before.
        const activeCountStmt = this.db.prepare('SELECT COUNT(*) AS count FROM students WHERE active = 1');
        income.activeStudents = activeCountStmt.get().count;

        results.forEach(row => {
            if (row.semester === 1) {
                income.matricula1 = row.student_count * 10000;
                income.monthly1 = row.monthly_total || 0;
            } else if (row.semester === 2) {
                income.matricula2 = row.student_count * 10000;
                income.monthly2 = row.monthly_total || 0;
            }
        });

        return income;
    }

    /*
        Gastos
    */
    getAllExpenses() {
        const sql = this.db.prepare(`SELECT
                                        e.id,
                                        e.date,
                                        e.description,
                                        e.reference,
                                        e.total_amount AS amount
                                     FROM
                                        expenses e
                                     ORDER BY
                                        e.id DESC;
                                        `);
        const expenses = sql.all();
        return expenses;
    }

    getExpensesByYear(year) {
        let sql = ``;
        let expenses = [];
        if (year) {
            sql = this.db.prepare(`SELECT
                                    e.id,
                                    e.date,
                                    e.description,
                                    e.reference,
                                    e.total_amount AS amount
                                   FROM 
                                    expenses e
                                   WHERE 
                                    strftime('%Y', date) = ?
                                   ORDER BY 
                                    date ASC;`
            );
            expenses = sql.all(year);
        } else {
            sql = this.db.prepare(`SELECT
                                    e.id,
                                    e.date,
                                    e.description,
                                    e.reference,
                                    e.total_amount AS amount
                                   FROM 
                                    expenses
                                   ORDER BY 
                                    date ASC;`
            );
            expenses = sql.all();
        }
        return expenses;
    }

    getYearsOfExpenses() {
        const sql = this.db.prepare(`SELECT DISTINCT 
                                        strftime('%Y', date) 
                                     AS 
                                        year
                                     FROM 
                                        expenses
                                     ORDER BY 
                                        year;`
        );
        const years = sql.all();
        return years;
    }

    addExpense(expenseData) {
        const sql = this.db.prepare(`
                INSERT INTO expenses (date, description, reference, type, total_amount)
                VALUES (?, ?, ?, ?, ?)
            `);
        const data = sql.run(expenseData.date,
            expenseData.description,
            expenseData.reference,
            expenseData.type,
            expenseData.amount);
        return data.lastInsertRowid;
    }

    updateExpense(data) {
        const keys = validateExpensesUpdate(data);
        if (!keys) return {
            success: false,
            transaction: null
        }

        const setClause = keys.map(k => `${k} = ?`).join(", ");
        const values = keys.map(k => data.fields[k]);

        const stmt = this.db.prepare(`
                UPDATE expenses
                SET ${setClause}
                WHERE id = ?
        `);
        const result = stmt.run(...values, data?.id);
        return {
            success: true,
            result: result.changes
        }
    }

    deleteExpenseById(id) {
        const sql = this.db.prepare(`DELETE FROM expenses WHERE id = ?`);
        const expense = sql.run(id);
        return expense;
    }

    /*
        Estudiantes
    */
    getAllStudents() {
        const sql = this.db.prepare(`SELECT
                                        s.id,
                                        s.name,
                                        s.phone,
                                        s.email,
                                        s.reference,
                                        s.active,
                                        s.scholarship,
                                        s.scholarship_amount
                                     FROM
                                        students s
                                     ORDER BY
                                        s.id DESC;
                                    `);
        const students = sql.all();
        return students;
    }

    getStudentsByActive(active) {
        let sql = ``;
        let students = [];
        if (active) {
            sql = this.db.prepare(`SELECT 
                                    s.id,
                                    s.name,
                                    s.phone,
                                    s.email,
                                    s.reference,
                                    s.active
                                   FROM  
                                    students s
                                   WHERE
                                    active = ?;`
            );
            students = sql.all(active);
        } else {
            sql = this.db.prepare(`SELECT
                                    s.id,
                                    s.name,
                                    s.phone,
                                    s.email,
                                    s.reference,
                                    s.active
                                   FROM  
                                    students s;`
            );
            students = sql.all();
        }
        return students;
    }

    getStudentsActive() {
        const sql = this.db.prepare(`
                            SELECT DISTINCT 
                                active
                            FROM  
                                students;`
        );
        const students = sql.all();
        return students;
    }


    getStudentCount() {
        const sql = this.db.prepare(`
                            SELECT COUNT(*) 
                            FROM students 
                            WHERE active = 1;
                                `);
        const students = sql.all();
        return students;
    }

    getPaymentAmount(divisionId, conceptId) {
        // First check if it's "Otros"
        const conceptStmt = this.db.prepare('SELECT type, amount FROM payment_concepts WHERE id = ?');
        const concept = conceptStmt.get(conceptId);

        if (!concept) return 0;

        if (concept.type === 'Otros') {
            return concept.amount;
        }

        // If not "Otros", get from division_payment_concepts
        const divisionStmt = this.db.prepare(`
            SELECT amount 
            FROM division_payment_concepts 
            WHERE division_id = ? AND concept_id = ?
        `);
        const result = divisionStmt.get(divisionId, conceptId);

        return result ? result.amount : 0;
    }

    addStudent(studentData) {
        const sql = this.db.prepare(`
                INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
        const data = sql.run(studentData.name,
            studentData.phone,
            studentData.email,
            studentData.reference,
            studentData.active,
            studentData.scholarship,
            studentData.scholarship_amount);
        return data.lastInsertRowid;
    }

    updateStudent(data) {
        const keys = validateStudentsUpdate(data);
        if (!keys) return {
            success: false,
            transaction: null
        }

        const setClause = keys.map(k => `${k} = ?`).join(", ");
        const values = keys.map(k => data.fields[k]);

        const stmt = this.db.prepare(`
                UPDATE students
                SET ${setClause}
                WHERE id = ?
        `);
        const result = stmt.run(...values, data?.id);
        return {
            success: true,
            result: result.changes
        }
    }

    deleteStudentById(id) {
        const sql = this.db.prepare(`DELETE FROM students WHERE id = ?`);
        const student = sql.run(id);
        return student;
    }

    importStudents(studentsData) {
        if (!studentsData) return { error: "Datos Estudiantes no encontrados." }

        studentsData.forEach(s => {
            const sql = this.db.prepare(`
                INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            const data = sql.run(
                s.nombre || "",
                s.telefono || "",
                s.correo || "",
                s.referencia || "",
                s.activo.toLowerCase() === "si" ? 1 : 0,
                s.scholarship.toLowerCase() === "si" ? 1 : 0,
                s.scholarship_amount || "");
        })

        return {
            success: true,
        }
    }

    /*
        Profesores
    */
    getAllTeachers() {
        const sql = this.db.prepare(`SELECT
                                        t.id,
                                        t.name,
                                        t.division_id,
                                        d.name AS division_name,
                                        t.amount
                                      FROM
                                        teachers t  
                                      INNER JOIN
                                        divisions d ON t.division_id = d.id
                                      ORDER BY
                                        t.id DESC;
                                    `);
        const teachers = sql.all();
        return teachers;
    }

    addTeacher(teacherData) {
        const sql = this.db.prepare(`
                INSERT INTO teachers (name, division_id, amount)
                VALUES (?, ?, ?)
            `);
        const data = sql.run(teacherData.name,
            teacherData.division_id,
            teacherData.amount);

        return data;
    }

    deleteTeacherById(id) {
        const sql = this.db.prepare(`DELETE FROM teachers WHERE id = ?`);
        const teacher = sql.run(id);
        return teacher
    }

    updateTeacher(data) {
        const keys = validateTeachersUpdate(data);
        if (!keys) return {
            success: false,
            transaction: null
        }

        const setClause = keys.map(k => `${k} = ?`).join(", ");
        const values = keys.map(k => data.fields[k]);

        const stmt = this.db.prepare(`
                UPDATE teachers
                SET ${setClause}
                WHERE id = ?
        `);
        const result = stmt.run(...values, data?.id);
        return {
            success: true,
            result: result.changes
        }
    }


    /*
        Precio
    */
    addDivision(division) {
        let result;
        const transaction = this.db.transaction(() => {
            const insertDivision = this.db.prepare(`
                INSERT INTO divisions (name)
                VALUES (?)
            `);
            result = insertDivision.run(division.name);
            const newDivisionId = result.lastInsertRowid;

            const concepts = this.db.prepare("SELECT id FROM payment_concepts WHERE type != 'Otros'").all();
            const insertConcept = this.db.prepare(`
                INSERT INTO division_payment_concepts (division_id, concept_id, amount)
                VALUES (?, ?, 0)
            `);

            for (const concept of concepts) {
                insertConcept.run(newDivisionId, concept.id);
            }
        });

        transaction();
        return result;
    }


    deleteDivision(id) {
        const sql = this.db.prepare("DELETE FROM divisions WHERE id = ?");
        return sql.run(id);
    }

    updateDivision(id, name) {
        const sql = this.db.prepare("UPDATE divisions SET name = ? WHERE id = ?");
        const result = sql.run(name, id);
        return {
            success: true,
            result: result.changes
        }
    }

    getAllDivisionPaymentConcepts() {
        const sql = this.db.prepare(`
            SELECT
                dpc.id,
                dpc.division_id,
                d.name AS division_name,
                dpc.concept_id,
                c.type AS concept_name,
                dpc.amount
            FROM
                division_payment_concepts dpc
            JOIN
                divisions d ON dpc.division_id = d.id
            JOIN
                payment_concepts c ON dpc.concept_id = c.id
            ORDER BY
                d.name, c.type
        `);
        return sql.all();
    }

    updateDivisionPaymentConcept(id, amount) {
        const sql = this.db.prepare(`
            UPDATE division_payment_concepts
            SET amount = ?
            WHERE id = ?
        `);
        const result = sql.run(amount, id);
        return result.changes;
    }

    updatePriceConcept(concept) {
        const sql = this.db.prepare(`
                UPDATE payment_concepts
                SET
                    amount = ?
                WHERE 
                    id = ?;
            `);
        const data = sql.run(concept.amount,
            concept.id);
        return data.lastInsertRowid;
    }

    updatePriceDivision(division) {
        const sql = this.db.prepare(`
                UPDATE divisions
                SET
                    amount = ?
                WHERE 
                    id = ?;
            `);
        const data = sql.run(division.amount,
            division.id);
        return data.lastInsertRowid;
    }

    /* 
        Reporte 
    */

    getCashRegister() {
        const sql = this.db.prepare(`
            SELECT
                p.date AS date,
                p.payment_method AS tipo,
                'Ingreso' AS status,
                p.year AS year,
                p.sequence AS sequence,
                s.name AS subject,
                c.type AS concept,
                p.amount AS amount,
                'Ingreso' AS rubro,
                p.receipt AS detail
            FROM payments p
            JOIN students s ON s.id = p.student_id
            JOIN payment_concepts c ON c.id = p.concept_id

        UNION ALL

            SELECT
                e.date AS date,
                'Egreso' AS tipo,
                e.type AS status,
                NULL AS year,
                e.id AS sequence,
                e.description AS subject,
                'Gasto' AS concept,
                e.total_amount AS amount,
                'Egreso' AS rubro,
                e.description AS detail
            FROM expenses e

            ORDER BY date ASC
        `);

        return sql.all();
    }


    getDelayByTeacherReport() {
        const sql = this.db.prepare(`
            
        `);
        return sql.all();
    }

    /*
        Functionality
    */
    addImage(imageData) {
        const sql = this.db.prepare(`
                INSERT INTO images (image,current_image)
                VALUES (?,?)
            `);
        const data = sql.run(imageData.image, 0);
        return data.lastInsertRowid;
    }

    setImage(imageState) {
        const reset = this.db.prepare(`
                UPDATE images
                SET
                    current_image = 0
                WHERE
                    current_image = 1;
            `);
        const res = reset.run();
        //console.log("res "+JSON.stringify(imageState));

        const sql = this.db.prepare(`
                UPDATE images
                SET
                    current_image = ?
                WHERE 
                    id = ?;
            `);
        const data = sql.run(imageState.current_image,
            imageState.id);
        return data.lastInsertRowid;
    }

    getImages() {
        const sql = this.db.prepare(`SELECT * FROM images`);
        const data = sql.all();
        return data;
    }

    getCurrentImage() {
        const sql = this.db.prepare(`SELECT * FROM images WHERE current_image = 1`);
        const data = sql.get();
        return data;
    }

    deleteImageById(id) {
        const sql = this.db.prepare(`DELETE FROM images WHERE id = ?`);
        const image = sql.run(id);
        return image;
    }

    close() {
        this.db.close();
    }
}

export default AppDB;