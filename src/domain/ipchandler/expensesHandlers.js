import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for the Egresos page.
*/
export function registerExpensesHandlers(ipcMain, expenses) {
    handle(ipcMain, CHANNELS.expenses.getAllExpenses, () => expenses.getAllExpenses());

    handle(ipcMain, CHANNELS.expenses.getExpensesByYear, (_, year) => expenses.getExpensesByYear(year));

    handle(ipcMain, CHANNELS.expenses.getYearsOfExpenses, () => expenses.getYearsOfExpenses());

    handle(ipcMain, CHANNELS.expenses.addExpense, (_, expenseData) => expenses.addExpense(expenseData));

    handle(ipcMain, CHANNELS.expenses.updateExpense, (_, expenseData) => expenses.updateExpense(expenseData));

    handle(ipcMain, CHANNELS.expenses.deleteExpenseById, (_, id) => expenses.deleteExpenseById(id));
}
