import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for the Estudiantes page.
*/
export function registerStudentHandlers(ipcMain, students) {
    handle(ipcMain, CHANNELS.students.getAllStudents, () => students.getAllStudents());

    handle(ipcMain, CHANNELS.students.getStudentsByActive, (_, active) => students.getStudentsByActive(active));

    handle(ipcMain, CHANNELS.students.getStudentsActive, () => students.getStudentsActive());

    handle(ipcMain, CHANNELS.students.getStudentCount, () => students.getStudentCount());

    handle(ipcMain, CHANNELS.students.addStudent, (_, studentsData) => students.addStudent(studentsData));

    handle(ipcMain, CHANNELS.students.updateStudent, (_, studentsData) => students.updateStudent(studentsData));

    handle(ipcMain, CHANNELS.students.deleteStudentById, (_, id) => students.deleteStudentById(id));

    handle(ipcMain, CHANNELS.students.importStudents, (_, studentsData) => students.importStudents(studentsData));
}
