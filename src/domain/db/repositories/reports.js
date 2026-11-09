/*
    Reports repository: cross-entity queries for the Report page —
    cash register, delay aggregation and expected income.
    These span payments + expenses + pricing, so they live apart
    from the per-entity repositories.
*/
export function createReportsRepository(db) {
    return {
        getDelayPayments(years) {
            if (!years) throw new Error("falta años de Ingresos")

            let yearFilter = '';
            let params = [];

            if (years.length > 0) {
                yearFilter = `AND p.year IN (${years.map(() => '?').join(',')})`;
                params = years;
            }

            const stmt = db.prepare(`
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
        },

        getExpectedIncome(years) {
            if (!years || years.length === 0) return { matricula1: 0, matricula2: 0, monthly1: 0, monthly2: 0, activeStudents: 0 };

            const yearPlaceholders = years.map(() => '?').join(',');

            const sql = db.prepare(`
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

            const activeCountStmt = db.prepare('SELECT COUNT(*) AS count FROM students WHERE active = 1');
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
        },

        getCashRegister() {
            const sql = db.prepare(`
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
        },
    };
}
