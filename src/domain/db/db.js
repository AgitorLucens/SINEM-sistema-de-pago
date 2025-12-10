import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';

class AppDB {
    constructor() {
        const dbPath = path.join(app.getPath('userData'),'sinem.sqlite');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');
        this.setUpDatabase();
    }

    setUpDatabase() {
        const createStudentsTable = `
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                birth_date TEXT,
                phone TEXT,
                email TEXT,
                active INTEGER NOT NULL -- 1 para true, 0 para false
            );
        `;
        this.db.exec(createStudentsTable);
        const createPaymentConceptsTable = `
            CREATE TABLE IF NOT EXISTS payment_concepts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL, -- Corresponde a ConceptType (MATRICULA, MENSUALIDAD, etc.)
                description TEXT
            );
        `;
        this.db.exec(createPaymentConceptsTable);
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
        const createPaymentsTable = `
            CREATE TABLE IF NOT EXISTS payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                amount REAL NOT NULL,
                payment_method TEXT NOT NULL, -- Corresponde a PaymentMethod (EFECTIVO, TRANSFERENCIA)
                concept_id INTEGER,
                student_id INTEGER,
                invoice_id INTEGER,
                created_by INTEGER, -- Asumiendo un ID de usuario (UUID simulado por INTEGER)
                status TEXT NOT NULL, -- Corresponde a PaymentStatus (ACTIVE, CANCELED)
                timestamp TEXT NOT NULL,

                FOREIGN KEY (concept_id) REFERENCES payment_concepts(id) ON DELETE SET NULL,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
            );
        `;
        this.db.exec(createPaymentsTable);
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
        const createIncomeCategoriesTable = `
            CREATE TABLE IF NOT EXISTS income_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                total_income REAL,
                total_expense REAL,
                available_cash REAL
            );
        `;
        this.db.exec(createIncomeCategoriesTable);
    }


    /**
     * Añade un nuevo pago (ADAPTACIÓN DE LA FUNCIÓN ANTERIOR).
     * Ahora esta función es solo una demostración de cómo se insertaría un pago
     * usando FKs (asumiendo que student_id y concept_id ya existen).
     * @param {object} paymentData - Datos del pago.
     * @returns {Promise<number>} El ID del nuevo registro.
     */
    addPayment(paymentData) {
            const sql = this.db.prepare(`
                INSERT INTO payments (date, amount, payment_method, concept_id, student_id, invoice_id, created_by, status, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            const data = sql.run(paymentData.date, 
                                paymentData.amount, 
                                paymentData.payment_method, 
                                paymentData.concept_id, 
                                paymentData.student_id, 
                                paymentData.invoice_id, 
                                paymentData.created_by, 
                                paymentData.status, 
                                paymentData.timestamp);
            return data.lastInsertRowid;
    }

    /**
     * Lee todos los pagos (ADAPTACIÓN CON JOINS).
     * En un modelo real, usamos JOIN para obtener el nombre del estudiante y el concepto.
     * @returns {Promise<Array<object>>} Lista de pagos enriquecidos.
     */
    getAllPayments() {
        
        const sql = this.db.prepare(`SELECT
                                        p.id,
                                        p.date,
                                        p.amount,
                                        p.payment_method,
                                        c.type AS concept_type,
                                        p.student_id
                                     FROM
                                        payments p
                                     INNER JOIN
                                        payment_concepts c ON p.concept_id = c.id 
                                     ORDER BY
                                        p.id DESC;`
                                    );
        const payments = sql.all();
        console.log("Pagos obtenidos:", payments);
        return payments;
    }

    /**
     * Elimina un pago por su ID. (No cambia).
     */
    deletePayment(id) {
            const sql = this.db.prepare(`DELETE FROM payments WHERE id = ?`);
            const stmt = this.db.prepare(sql);
    }

    getPaymentsConcepts() {
        const sql = this.db.prepare('SELECT id, type AS name FROM payment_concepts ORDER BY id DESC');
        const result =  sql.all(); 
        return result; 
    }


    close () {
        this.db.close();
    }
}

export default AppDB;