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

export async function getPaymentById(paymentId) {
    try {
        return await window.api.getPaymentById(paymentId);
    }
    catch (error) {
        console.error('Error al obtener pago por ID:', error.message);
        return null; 
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
        console.error('Error al obtener estudiantes:', error.message);
        return []; 
    }
}

export async function addStudent(studentData) {
    try {
        return await window.api.addStudent(studentData);
    } catch (error) {
        console.error('Error al agregar estudiante:', error.message);
        return []; 
    }
}

/*
    Excel
*/
export async function exportPaymentsToExcel(paymentData) {
    try {
        return await window.api.exportPaymentsToExcel(paymentData);
    } catch (error) {
        console.error('Error al exportar pago a excel:', error.message);
        return []; 
    }
}

export default {
    getPaymentConcepts,
    getPaymentDivisions,
    getPaymentById,
    getAllExpenses,
    addExpense,
    getAllStudents,
    exportPaymentsToExcel
};