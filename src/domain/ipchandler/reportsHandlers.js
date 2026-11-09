import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for the Reporte page (cash register).
*/
export function registerReportsHandlers(ipcMain, reports) {
    handle(ipcMain, CHANNELS.reports.getCashRegister, () => reports.getCashRegister());
}
