import { validatePaymentsUpdate } from "../validate.js";

/*
    Payments repository: CRUD + yearly consecutive numbering.
    All methods are closures over the shared better-sqlite3 handle.
*/
export function createPaymentsRepository(db) {
    return {
        /**
         * Añade un nuevo pago calculando el consecutivo del año.
         * @param {object} payment - Datos del pago.
         * @returns {{success: boolean, transaction: {year: number, sequence: number, createdPayment: object}}}
         */
        addPayment(payment) {
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
        },

        updatePayment(data) {
            const keys = validatePaymentsUpdate(data);
            if (!keys) return {
                success: false,
                transaction: null
            }

            const setClause = keys.map(k => `${k} = ?`).join(", ");
            const values = keys.map(k => data.fields[k]);

            const stmt = db.prepare(`
                    UPDATE payments
                    SET ${setClause}
                    WHERE id = ?
            `);
            const result = stmt.run(...values, data?.id);
            return {
                success: true,
                result: result.changes
            }
        },

        getNextConsecutiveByYear(year) {
            const stmt = db.prepare(`
                SELECT COALESCE(MAX(sequence), 0) + 1 AS nextSeq
                FROM payments
                WHERE year = ?
            `);
            return stmt.get(year)?.nextSeq ?? 0;
        },

        addPaymentWithConsecutive(payment) {
            const sql = db.prepare(`
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
            const createdPayment = db.prepare(`
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
        },

        getAllPayments() {
            const sql = db.prepare(`
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
        },

        getAllPaymentsByYear(year) {
            const sql = db.prepare(`SELECT
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
        },

        getPaymentsByYear(year) {
            let sql;
            let payments;
            if (year) {
                sql = db.prepare(`SELECT
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
                sql = db.prepare(`SELECT *
                                   FROM
                                    payments
                                   ORDER BY
                                    date ASC;`
                );
                payments = sql.all();
            }
            return payments;
        },

        getYearsOfPayments() {
            const sql = db.prepare(`SELECT DISTINCT
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
        },

        getDateOfPayments() {
            const sql = db.prepare(`SELECT DISTINCT
                                            strftime('%d-%m-%Y', date) AS date_only
                                         FROM
                                            payments
                                         ORDER BY
                                            strftime('%Y-%m-%d', date);
                                     `);
            const years = sql.all();
            return years;
        },

        getPaymentByStudentId(id) {
            const sql = db.prepare(`SELECT
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
        },

        deletePaymentById(id) {
            const sql = db.prepare(`DELETE FROM payments WHERE id = ?`);
            const payment = sql.run(id);
            return payment
        },
    };
}
