/*
    Pricing repository (precios): divisions, payment concepts and the
    division×concept price matrix.
*/
export function createPricingRepository(db) {
    return {
        getPaymentsConcepts() {
            const sql = db.prepare('SELECT id, type AS name, amount FROM payment_concepts ORDER BY id ASC');
            const result = sql.all();
            return result;
        },

        getPaymentsDivisions() {
            const sql = db.prepare('SELECT id,amount, name AS name FROM divisions ORDER BY id ASC');
            const result = sql.all();
            return result;
        },

        getPaymentAmount(divisionId, conceptId) {
            // First check if it's "Otros"
            const conceptStmt = db.prepare('SELECT type, amount FROM payment_concepts WHERE id = ?');
            const concept = conceptStmt.get(conceptId);

            if (!concept) return 0;

            if (concept.type === 'Otros') {
                return concept.amount;
            }

            // If not "Otros", get from division_payment_concepts
            const divisionStmt = db.prepare(`
                SELECT amount
                FROM division_payment_concepts
                WHERE division_id = ? AND concept_id = ?
            `);
            const result = divisionStmt.get(divisionId, conceptId);

            return result ? result.amount : 0;
        },

        addDivision(division) {
            let result;
            const transaction = db.transaction(() => {
                const insertDivision = db.prepare(`
                    INSERT INTO divisions (name)
                    VALUES (?)
                `);
                result = insertDivision.run(division.name);
                const newDivisionId = result.lastInsertRowid;

                const concepts = db.prepare("SELECT id FROM payment_concepts WHERE type != 'Otros'").all();
                const insertConcept = db.prepare(`
                    INSERT INTO division_payment_concepts (division_id, concept_id, amount)
                    VALUES (?, ?, 0)
                `);

                for (const concept of concepts) {
                    insertConcept.run(newDivisionId, concept.id);
                }
            });

            transaction();
            return result;
        },

        deleteDivision(id) {
            const sql = db.prepare("DELETE FROM divisions WHERE id = ?");
            return sql.run(id);
        },

        updateDivision(id, name) {
            const sql = db.prepare("UPDATE divisions SET name = ? WHERE id = ?");
            const result = sql.run(name, id);
            return {
                success: true,
                result: result.changes
            }
        },

        getAllDivisionPaymentConcepts() {
            const sql = db.prepare(`
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
        },

        updateDivisionPaymentConcept(id, amount) {
            const sql = db.prepare(`
                UPDATE division_payment_concepts
                SET amount = ?
                WHERE id = ?
            `);
            const result = sql.run(amount, id);
            return result.changes;
        },

        updatePriceConcept(concept) {
            const sql = db.prepare(`
                    UPDATE payment_concepts
                    SET
                        amount = ?
                    WHERE
                        id = ?;
                `);
            const data = sql.run(concept.amount,
                concept.id);
            return data.lastInsertRowid;
        },

        updatePriceDivision(division) {
            const sql = db.prepare(`
                    UPDATE divisions
                    SET
                        amount = ?
                    WHERE
                        id = ?;
                `);
            const data = sql.run(division.amount,
                division.id);
            return data.lastInsertRowid;
        },
    };
}
