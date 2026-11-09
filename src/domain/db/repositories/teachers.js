import { validateTeachersUpdate } from "../validate.js";

/*
    Teachers repository (profesores): CRUD.
*/
export function createTeachersRepository(db) {
    return {
        getAllTeachers() {
            const sql = db.prepare(`SELECT
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
        },

        addTeacher(teacherData) {
            const sql = db.prepare(`
                    INSERT INTO teachers (name, division_id, amount)
                    VALUES (?, ?, ?)
                `);
            const data = sql.run(teacherData.name,
                teacherData.division_id,
                teacherData.amount);

            return data;
        },

        deleteTeacherById(id) {
            const sql = db.prepare(`DELETE FROM teachers WHERE id = ?`);
            const teacher = sql.run(id);
            return teacher
        },

        updateTeacher(data) {
            const keys = validateTeachersUpdate(data);
            if (!keys) return {
                success: false,
                transaction: null
            }

            const setClause = keys.map(k => `${k} = ?`).join(", ");
            const values = keys.map(k => data.fields[k]);

            const stmt = db.prepare(`
                    UPDATE teachers
                    SET ${setClause}
                    WHERE id = ?
            `);
            const result = stmt.run(...values, data?.id);
            return {
                success: true,
                result: result.changes
            }
        },
    };
}
