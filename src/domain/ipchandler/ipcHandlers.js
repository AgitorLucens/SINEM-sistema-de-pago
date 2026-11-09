import { ipcMain } from 'electron';
import { registerPaymentHandlers } from './paymentsHandlers.js';
import { registerExpensesHandlers } from './expensesHandlers.js';
import { registerStudentHandlers } from './studentsHandlers.js';
import { registerTeacherHandlers } from './teachersHandlers.js';
import { registerPricingHandlers } from './pricingHandlers.js';
import { registerReportsHandlers } from './reportsHandlers.js';
import { registerExcelHandlers } from './excelHandlers.js';
import { registerAppHandlers } from './appHandlers.js';

/*
    IPC wiring composition: each registrar receives only the
    repositories it actually uses (interface segregation at the
    wiring level). Channel names live in the registrar files —
    they move to a single channels.js spec in a later phase.

    `db` is the repository bundle returned by createDb()
    (see src/domain/db/index.js).
*/
export default function setUpHandlers(db, excel) {
    registerPaymentHandlers(ipcMain, {
        payments: db.payments,
        pricing: db.pricing,
        reports: db.reports,
    });
    registerExpensesHandlers(ipcMain, db.expenses);
    registerStudentHandlers(ipcMain, db.students);
    registerTeacherHandlers(ipcMain, db.teachers);
    registerPricingHandlers(ipcMain, db.pricing);
    registerReportsHandlers(ipcMain, db.reports);
    registerExcelHandlers(ipcMain, excel);
    registerAppHandlers(ipcMain, db.images);
}
