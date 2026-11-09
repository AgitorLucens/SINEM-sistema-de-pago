import { handle } from './handle.js';
import { CHANNELS } from '../../ipc/channels.js';

/*
    IPC handlers for the Pagos page.
    Channel names come from src/ipc/channels.js — never write them here.
*/
export function registerPaymentHandlers(ipcMain, { payments, pricing, reports }) {
    handle(ipcMain, CHANNELS.payments.addPayment, (_, paymentData) => payments.addPayment(paymentData));

    handle(ipcMain, CHANNELS.payments.updatePayment, (_, paymentData) => payments.updatePayment(paymentData));

    handle(ipcMain, CHANNELS.payments.addPaymentWithConsecutive, (_, paymentData) => payments.addPaymentWithConsecutive(paymentData));

    handle(ipcMain, CHANNELS.payments.getNextConsecutiveByYear, (_, year) => payments.getNextConsecutiveByYear(year));

    handle(ipcMain, CHANNELS.payments.getAllPayments, () => payments.getAllPayments());

    handle(ipcMain, CHANNELS.payments.getPaymentsByYear, (_, year) => payments.getPaymentsByYear(year));

    handle(ipcMain, CHANNELS.payments.getYearsOfPayments, () => payments.getYearsOfPayments());

    handle(ipcMain, CHANNELS.payments.getDateOfPayments, () => payments.getDateOfPayments());

    handle(ipcMain, CHANNELS.payments.getPaymentByStudentId, (_, id) => payments.getPaymentByStudentId(id));

    handle(ipcMain, CHANNELS.payments.deletePaymentById, (_, id) => payments.deletePaymentById(id));

    handle(ipcMain, CHANNELS.pricing.getPaymentConcepts, () => pricing.getPaymentsConcepts());

    handle(ipcMain, CHANNELS.pricing.getPaymentDivisions, () => pricing.getPaymentsDivisions());

    handle(ipcMain, CHANNELS.reports.getDelayPayments, (_, year) => reports.getDelayPayments(year));

    handle(ipcMain, CHANNELS.reports.getExpectedIncome, (_, data) => reports.getExpectedIncome(data));

    handle(ipcMain, CHANNELS.pricing.getPaymentAmount, (_, data) => {
        const { divisionId, conceptId } = data;
        return pricing.getPaymentAmount(divisionId, conceptId);
    });
}
