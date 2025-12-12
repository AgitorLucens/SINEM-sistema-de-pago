/*
    Pagos
*/
export async function getAllPayments() {
    try {
        return await window.api.getAllPayments();
    } catch (error) {
        console.error('Error al obtener pagos:', error.message);
        return []; 
    }
}

export async function getPaymentConcepts() {
    try {
        return await window.api.getPaymentConcepts();
    } catch (error) {
        console.error('Error al obtener conceptos de pago:', error.message);
        return []; 
    }
}

export async function getPaymentDivisions() {
    try {
        return await window.api.getPaymentDivisions();
    } catch (error) {
        console.error('Error al obtener conceptos de pago:', error.message);
        return []; 
    }
}

/*
    Gastos
*/
export async function getAllExpenses() {
    try {
        return await window.api.getAllExpenses();
    } catch (error) {
        console.error('Error al obtener egresos:', error.message);
        return []; 
    }
}
export async function addExpense(expenseData) {
    try {
        return await window.api.addExpense(expenseData);
    } catch (error) {
        console.error('Error al agregar egreso:', error.message);
        throw error; 
    }
}

/*
    Estudiantes
*/
export async function getAllStudents() {
    try {
        return await window.api.getAllStudents();
    } catch (error) {
        console.error('Error al obtener egresos:', error.message);
        return []; 
    }
}


export default {
    getPaymentConcepts,
    getPaymentDivisions,
    getAllExpenses,
    addExpense,
    getAllStudents
};