import {ipcMain} from 'electron';

export default function setUpHandlers(dbInstance) {
    ipcMain.handle('add-payment', async ( _ , paymentData) => {
        return dbInstance.addPayment(paymentData);
    });

    ipcMain.handle('get-all-payments', async () => {
        return dbInstance.getAllPayments();
    });

    ipcMain.handle('delete-payment', async ( _ , id) => {
        return dbInstance.deletePayment(id);
    });

    ipcMain.handle('get-payment-concepts', async ( _ , id) => {
        return dbInstance.getPaymentsConcepts(id);
    });

}