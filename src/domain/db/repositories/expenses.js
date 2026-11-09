import { validateExpensesUpdate } from "../validate.js";

/*
    Expenses repository (gastos): CRUD + year filters.
*/
export function createExpensesRepository(db) {
    return {
        getAllExpenses() {
            const sql = db.prepare(`SELECT
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
        },

        getExpensesByYear(year) {
            let sql;
            let expenses;
            if (year) {
                sql = db.prepare(`SELECT
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
                sql = db.prepare(`SELECT
                                    e.id,
                                    e.date,
                                    e.description,
                                    e.reference,
                                    e.total_amount AS amount
                                   FROM
                                     expenses e
                                   ORDER BY
                                     date ASC;`
                );
                expenses = sql.all();
            }
            return expenses;
        },

        getYearsOfExpenses() {
            const sql = db.prepare(`SELECT DISTINCT
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
        },

        addExpense(expenseData) {
            const sql = db.prepare(`
                    INSERT INTO expenses (date, description, reference, type, total_amount)
                    VALUES (?, ?, ?, ?, ?)
                `);
            const data = sql.run(expenseData.date,
                expenseData.description,
                expenseData.reference,
                expenseData.type,
                expenseData.amount);
            return data.lastInsertRowid;
        },

        updateExpense(data) {
            const keys = validateExpensesUpdate(data);
            if (!keys) return {
                success: false,
                transaction: null
            }

            const setClause = keys.map(k => `${k} = ?`).join(", ");
            const values = keys.map(k => data.fields[k]);

            const stmt = db.prepare(`
                    UPDATE expenses
                    SET ${setClause}
                    WHERE id = ?
            `);
            const result = stmt.run(...values, data?.id);
            return {
                success: true,
                result: result.changes
            }
        },

        deleteExpenseById(id) {
            const sql = db.prepare(`DELETE FROM expenses WHERE id = ?`);
            const expense = sql.run(id);
            return expense;
        },
    };
}
