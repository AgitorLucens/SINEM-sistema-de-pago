import { validateStudentsUpdate } from "../validate.js";

/*
    Students repository: CRUD + bulk Excel import.
*/
export function createStudentsRepository(db) {
    return {
        getAllStudents() {
            const sql = db.prepare(`SELECT
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
        },

        getStudentsByActive(active) {
            let sql;
            let students;
            if (active) {
                sql = db.prepare(`SELECT
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
                sql = db.prepare(`SELECT
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
        },

        getStudentsActive() {
            const sql = db.prepare(`
                            SELECT DISTINCT
                                active
                            FROM
                                students;`
            );
            const students = sql.all();
            return students;
        },


        getStudentCount() {
            const sql = db.prepare(`
                            SELECT COUNT(*)
                            FROM students
                            WHERE active = 1;
                                `);
            const students = sql.all();
            return students;
        },

        addStudent(studentData) {
            const sql = db.prepare(`
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
        },

        updateStudent(data) {
            const keys = validateStudentsUpdate(data);
            if (!keys) return {
                success: false,
                transaction: null
            }

            const setClause = keys.map(k => `${k} = ?`).join(", ");
            const values = keys.map(k => data.fields[k]);

            const stmt = db.prepare(`
                    UPDATE students
                    SET ${setClause}
                    WHERE id = ?
            `);
            const result = stmt.run(...values, data?.id);
            return {
                success: true,
                result: result.changes
            }
        },

        deleteStudentById(id) {
            const sql = db.prepare(`DELETE FROM students WHERE id = ?`);
            const student = sql.run(id);
            return student;
        },

        importStudents(studentsData) {
            if (!Array.isArray(studentsData) || studentsData.length === 0) {
                return { error: "Datos Estudiantes no encontrados." };
            }

            const normalizeFlag = (value) => String(value ?? "").trim().toLowerCase() === "si" ? 1 : 0;
            const normalizeAmount = (value) => {
                const parsed = parseFloat(value);
                return Number.isFinite(parsed) ? parsed : 0;
            };

            const insert = db.prepare(`
                    INSERT INTO students (name, phone, email, reference, active, scholarship, scholarship_amount)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

            const insertAll = db.transaction((rows) => {
                rows.forEach(s => {
                    insert.run(
                        String(s?.nombre ?? ""),
                        String(s?.telefono ?? ""),
                        String(s?.correo ?? ""),
                        String(s?.referencia ?? ""),
                        normalizeFlag(s?.activo),
                        normalizeFlag(s?.scholarship),
                        normalizeAmount(s?.scholarship_amount)
                    );
                });
            });

            try {
                insertAll(studentsData);
            } catch (error) {
                console.error(`DB Error importing students: ${error.message}`);
                return { success: false, error: error.message };
            }

            return {
                success: true,
            }
        },
    };
}
