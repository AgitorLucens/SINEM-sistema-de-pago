import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';
import {validatePaymentsUpdate,validateExpensesUpdate, validateStudentsUpdate} from "./validate.js";

class AppDB {
    constructor() {
        const dbPath = path.join(app.getPath('userData'),'sinem.sqlite');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
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
                active INTEGER NOT NULL -- 1 para true, 0 para false
            );
        `;
        this.db.exec(createStudentsTable);

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
                description TEXT
            );
        `;
        this.db.exec(createDivisionsTable);
        const seedDivisions = `
            INSERT OR IGNORE INTO divisions (name, description) VALUES
                ('SINEM', 'Cursos a menores de edad'),
                ('Talleres', 'Cursos dados a la poblacion en Comun'),
                ('Ventas Accesorios', 'Ventas de accesorios para cursos'),
                ('Ventas Varias', 'Ventas Varias');
            `;
        this.db.exec(seedDivisions);

        /*
            Tabla ----
        */
        const createInvoicesTable = `
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_number INTEGER NOT NULL UNIQUE,
                date TEXT NOT NULL,
                month_charged TEXT,
                student_name TEXT NOT NULL, -- Desnormalizado del estudiante para la factura
                course TEXT,
                total_amount REAL NOT NULL
                -- Nota: payment_id (UUID) será agregado al crear la tabla Payments,
                -- ya que la factura depende del pago para la referencia.
            );
        `;
        this.db.exec(createInvoicesTable);

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

        /*
            Tabla Gastos
        */
        const createExpensesTable = `
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                description TEXT NOT NULL,
                reference TEXT,
                account_64 REAL,
                account_19 REAL,
                total_amount REAL NOT NULL,
                pending_payment INTEGER -- 1 para true, 0 para false
            );
        `;
        this.db.exec(createExpensesTable);

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

    updatePayment(data){
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
                    year,
                    month,
                    sequence,
                    status,
                    timestamp
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
        const data = sql.run(payment.date, 
                             payment.amount,
                             payment.receipt || "",
                             payment.payment_method, 
                             payment.concept_id, 
                             payment.division_id,
                             payment.student_id,  
                             payment.year,
                             payment.month || 0,
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
        
        const sql = this.db.prepare(`SELECT
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
                                     ORDER BY
                                        p.id DESC;`
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
                                     ORDER BY
                                        p.id DESC;`
                                    );
        const payments = sql.all();
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
                                    p.sequencp.month
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

    getYearsOfPayments(){
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

    getDateOfPayments(){
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
        const sql = this.db.prepare('SELECT id, type AS name, amount  FROM payment_concepts ORDER BY id ASC');
        const result =  sql.all(); 
        return result; 
    }

    getPaymentsDivisions() {
        const sql = this.db.prepare('SELECT id, name AS name FROM divisions ORDER BY id ASC');
        const result =  sql.all(); 
        return result; 
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

    getYearsOfExpenses(){
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
                INSERT INTO expenses (date, description, reference, total_amount)
                VALUES (?, ?, ?, ?)
            `);
            const data = sql.run(expenseData.date, 
                                expenseData.description,    
                                expenseData.reference,
                                expenseData.amount);
            return data.lastInsertRowid;
    }

    updateExpense(data){
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
    getAllStudents(){
        const sql = this.db.prepare(`SELECT
                                        s.id,
                                        s.name,
                                        s.phone,
                                        s.email,
                                        s.reference,
                                        s.active
                                     FROM
                                        students s
                                     ORDER BY
                                        s.id DESC;
                                    `);
        const students = sql.all();
        return students;    
    }

    getStudentsByActive(active){
        let sql = ``;
        let students = [];
        if(active){
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

    getStudentsActive(){
        const sql = this.db.prepare(`SELECT DISTINCT 
                                        active
                                     FROM  
                                        students;`
                                    );
        const students = sql.all();
        return students;    
    }


    addStudent(studentData){
        const sql = this.db.prepare(`
                INSERT INTO students (name, phone, email, reference, active)
                VALUES (?, ?, ?, ?, ?)
            `);
            const data = sql.run(studentData.name, 
                                 studentData.phone,    
                                 studentData.email,
                                 studentData.reference,
                                 studentData.active);
            return data.lastInsertRowid;
    }

    updateStudent(data){
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

    /*
        Concepto de Pago
    */
    updatePriceConcept(concept){
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

    close () {
        this.db.close();
    }
}

export default AppDB;