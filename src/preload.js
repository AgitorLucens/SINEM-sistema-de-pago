// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

const api = {
    // Pagina Pagos
    addPayment: (paymentData) => ipcRenderer.invoke('add-payment', paymentData),
    getAllPayments: () => ipcRenderer.invoke('get-all-payments'),
    deletePayment: (id) => ipcRenderer.invoke('delete-payment', id),
    getPaymentConcepts: () => ipcRenderer.invoke('get-payment-concepts'),
    getPaymentDivisions: () => ipcRenderer.invoke('get-payment-divisions'),
}

contextBridge.exposeInMainWorld('api', api);