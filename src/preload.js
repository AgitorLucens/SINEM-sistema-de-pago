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
    // Pagina Egresos
    getAllExpenses: () => ipcRenderer.invoke('get-all-expenses'),
    addExpense: (expenseData) => ipcRenderer.invoke('add-expense', expenseData),


    //Pagina Estudiantes
    getAllStudents: () => ipcRenderer.invoke('get-all-students'),
}

contextBridge.exposeInMainWorld('api', api);