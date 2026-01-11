/*
    Pagos
*/
export async function getAllPayments() {
    try {
        return await window.api.getAllPayments();
    } catch (error) {
        console.error('Error al cargar datos:', error.message);
        return {
            error: "Error al cargar pagos.",
        };  
    }
}

export async function addPayment(payment) {
    try {
        return await window.api.addPayment(payment);;
    } catch (error) {
        console.error('Error al agregar pago:', error.message);
        return {
            error: "Error al agregar pago.",
        };  
    }
}

export async function addPaymentWithConsecutive(payment) {
    try {
        return await window.api.addPaymentWithConsecutive(payment);;
    } catch (error) {
        console.error('Error al agregar pago:', error.message);
        return {
            error: "Error al agregar pago.",
        }; 
    }
}

export async function updatePayment(payment) {
    try {
        return await window.api.updatePayment(payment);;
    } catch (error) {
        console.error('Error al agregar pago:', error.message);
        return {
            error: "Error al cambiar pago.",
        };  
    }
}

export async function getNextConsecutiveByYear(year){
    try {
        return await window.api.getNextConsecutiveByYear(year);
    } catch (error) {
        console.error('Error al obtener consecutivo:', error.message);
        return {
            error: "Error al obtener consecutivo.",
        }; 
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

export async function getDateOfPayments() {
    try {
        return await window.api.getDateOfPayments();
    } catch (error) {
        console.error('Error al obtener año de pagos:', error.message);
        return []; 
    }
}

export async function getPaymentByStudentId(id) {
    try {
        return await window.api.getPaymentByStudentId(id);
    }
    catch (error) {
        console.error('Error al obtener pago por ID de estudiante:', error.message);
        return {
            error: "Error al obtener pago por ID de estudiante",
        };
    }
}

export async function deletePaymentById(paymentId) {
    try {
        return await window.api.deletePaymentById(paymentId);
    }
    catch (error) {
        console.error('Error al eliminar pago por ID:', error.message);
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
        return {
            error: error.messsage,
        }
    }
}

export async function updateExpense(expense) {
    try {
        return await window.api.updateExpense(expense);
    } catch (error) {
        console.error('Error al cambiar gasto:', error.message);
        return {
            error: "Error al cambiar gasto",
        };  
    }
}

export async function deleteExpenseById(expenseId) {
    try {
        return await window.api.deleteExpenseById(expenseId);
    }
    catch (error) {
        console.error('Error al eliminar egreso por ID:', error.message);
        return []; 
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

export async function updateStudent(student) {
    try {
        return await window.api.updateStudent(student);;
    } catch (error) {
        console.error('Error al cambiar estudiante:', error.message);
        return {
            error: "Error al cambiar estudiante.",
        };  
    }
}

export async function deleteStudentById(studentId) {
    try {
        return await window.api.deleteStudentById(studentId);
    }
    catch (error) {
        console.error('Error al eliminar estudiante por ID:', error.message);
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
export async function exportPaymentsToExcel(payment) {
    try {
        return await window.api.exportPaymentsToExcel(payment);
    } catch (error) {
        console.error('Error al exportar pago a excel:', error.message);
        return {
            error: "Error al exportar recivo a excel. Revise que no tenga el archivo con el mismo nombre abierto.",
        }; 
    }
}

export async function exportReportToExcel(data) {
    try {
        return await window.api.exportReportToExcel(data);
    } catch (error) {
        console.error('Error al exportar reporte a excel:', error.message);
        return {
            error: "Error al exportar reporte a excel. Revise que no tengaa el archivo con el mismo nombre abierto.",
        }; 
    }
}

export async function exportPaymentsByYearToExcel(paymentData) {
    try {
        return await window.api.exportPaymentsByYearToExcel(paymentData);
    } catch (error) {
        console.error('Error al exportar pagos por año a excel:', error.message);
        return {
            error: "Error al exportar pagos por año a excel. Revise que no tengaa el archivo con el mismo nombre abierto.",
        }; 
    }
}

export async function exportExpensesByYearToExcel(expenseData) {
    try {
        return await window.api.exportExpensesByYearToExcel(expenseData);
    } catch (error) {
        console.error('Error al exportar egresos por año a excel:', error.message);
        return {
            error: "Error al exportar egresos por año a excel.",
        }; 
    }
}

export async function exportStudentsByActiveToExcel(studentData) {
    try {
        return await window.api.exportStudentsByActiveToExcel(studentData);
    } catch (error) {
        console.error('Error al exportar estudiantes por estado a excel:', error.message);
        return {
            error: "Error al exportar estudiantes por estado a excel.",
        }; 
    }
}

export async function exportHistoric(data) {
    try {
        return await window.api.exportHistoric(data);
    } catch (error) {
        console.error('Error al exportar respaldo por estado a excel:', error.message);
        return {
            error: "Error al exportar respaldo por estado a excel.",
        }; 
    }
}

export default {
    //Pagos
    addPayment,
    addPaymentWithConsecutive,
    getYearsOfPayments,
    getNextConsecutiveByYear,
    getDateOfPayments,
    getPaymentsByYear,
    getPaymentConcepts,
    getPaymentDivisions,
    getPaymentByStudentId,
    deletePaymentById,
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
    exportReportToExcel,
    exportPaymentsByYearToExcel,
    exportStudentsByActiveToExcel,
    exportHistoric
};