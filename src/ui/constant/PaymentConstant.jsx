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

export async function getPaymentsByYear(year) {
    try {
        return await window.api.getPaymentsByYear(year);
    } catch (error) {
        console.error('Error al obtener pagos por año:', error.message);
        return []; 
    }
}

export async function getYearsOfPayments() {
    try {
        return await window.api.getYearsOfPayments();
    } catch (error) {
        console.error('Error al obtener año de pagos:', error.message);
        return []; 
    }
}

export async function getPaymentById(paymentId) {
    try {
        return await window.api.getPaymentById(paymentId);
    }
    catch (error) {
        console.error('Error al obtener pago por ID:', error.message);
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

export async function getExpensesByYear(year) {
    try {
        return await window.api.getExpensesByYear(year);
    } catch (error) {
        console.error('Error al obtener gastos por año:', error.message);
        return []; 
    }
}

export async function getYearsOfExpenses() {
    try {
        return await window.api.getYearsOfExpenses();
    } catch (error) {
        console.error('Error al obtener año de gastos:', error.message);
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

export async function getStudentsByActive(active) {
    try {
        return await window.api.getStudentsByActive(active);
    } catch (error) {
        console.error('Error al obtener estudiantes por estado:', error.message);
        return []; 
    }
}

export async function getStudentsActive() {
    try {
        return await window.api.getStudentsActive();
    } catch (error) {
        console.error('Error al obtener estado de estudiantes:', error.message);
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
    Concepto de Pago
*/
export async function updatePriceConcept(paymentData) {
    try {
        return await window.api.updatePriceConcept(paymentData);
    } catch (error) {
        console.error('Error al exportar pago a excel:', error.message);
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

export async function exportPaymentsByYearToExcel(paymentData) {
    try {
        return await window.api.exportPaymentsByYearToExcel(paymentData);
    } catch (error) {
        console.error('Error al exportar pagos por año a excel:', error.message);
        return []; 
    }
}

export async function exportExpensesByYearToExcel(expenseData) {
    try {
        return await window.api.exportExpensesByYearToExcel(expenseData);
    } catch (error) {
        console.error('Error al exportar egresos por año a excel:', error.message);
        return []; 
    }
}

export async function exportStudentsByActiveToExcel(studentData) {
    try {
        return await window.api.exportStudentsByActiveToExcel(studentData);
    } catch (error) {
        console.error('Error al exportar estudiantes por estado a excel:', error.message);
        return []; 
    }
}

export default {
    //Pagos
    getYearsOfPayments,
    getPaymentsByYear,
    getPaymentConcepts,
    getPaymentDivisions,
    getPaymentById,
    //Gastos
    getAllExpenses,
    getExpensesByYear,
    getYearsOfExpenses,
    addExpense,
    //Estudiantes
    getAllStudents,
    getStudentsByActive,
    getStudentsActive,
    //Precios
    updatePriceConcept,
    //Exportar
    exportPaymentsToExcel,
    exportPaymentsByYearToExcel,
    exportStudentsByActiveToExcel
};