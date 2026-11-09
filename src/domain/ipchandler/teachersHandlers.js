import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for the Profesores page.
*/
export function registerTeacherHandlers(ipcMain, teachers) {
    handle(ipcMain, CHANNELS.teachers.getAllTeachers, () => teachers.getAllTeachers());

    handle(ipcMain, CHANNELS.teachers.addTeacher, (_, teacherData) => teachers.addTeacher(teacherData));

    handle(ipcMain, CHANNELS.teachers.deleteTeacherById, (_, id) => teachers.deleteTeacherById(id));

    handle(ipcMain, CHANNELS.teachers.updateTeacher, (_, teacherData) => teachers.updateTeacher(teacherData));
}
