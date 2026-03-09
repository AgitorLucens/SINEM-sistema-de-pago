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
            error: "Error al agregar pago: " + error.message,
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

export async function getExpectedIncome(years) {
    try {
        return await window.api.getExpectedIncome(years);
    } catch (error) {
        console.error('Error al obtener ingreso esperado:', error.message);
        return { matricula: 0, monthly: 0 };
    }
}

export async function getPaymentAmount(divisionId, conceptId) {
    try {
        return await window.api.getPaymentAmount({ divisionId, conceptId });
    } catch (error) {
        console.error('Error al obtener monto de pago:', error.message);
        return 0;
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

export async function getDelayPayments(year) {
    try {
        return await window.api.getDelayPayments(year);
    } catch (error) {
        console.error('Error al morosidad por mes:', error.message);
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

export async function getStudentCount() {
    try {
        return await window.api.getStudentCount();
    } catch (error) {
        console.error('Error al obtener cantidad de estudiantes:', error.message);
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
    Profesores
*/
export async function getAllTeachers() {
    try {
        return await window.api.getAllTeachers();
    } catch (error) {
        console.error('Error al obtener profesores:', error.message);
        return {
            error: "Error al obtener profesores.",
        }; 
    }
}

export async function addTeacher(teacherData) {
    try {
        return await window.api.addTeacher(teacherData);
    } catch (error) {
        console.error('Error al agregar profesor:', error.message);
        return {
            error: "Error al agregar profesor: " + error.message,
        }; 
    }
}

export async function deleteTeacherById(teacherId) {
    try {
        return await window.api.deleteTeacherById(teacherId);
    } catch (error) {
        console.error('Error al eliminar profesor por ID:', error.message);
        return {
            error: "Error al eliminar profesor. " + error.message,
        }; 
    }
}

export async function updateTeacher(teacherData) {
    try {
        return await window.api.updateTeacher(teacherData);
    } catch (error) {
        console.error('Error al cambiar profesor:', error.message);
        return {
            error: "Error al cambiar profesor: " + error.message,
        }; 
    }
}

/*
    Precio
*/
export async function addDivision(division) {
    try {
        return await window.api.addDivision(division);
    } catch (error) {
        console.error('Error al agregar curso:', error.message);
        return []; 
    }
}

export async function deleteDivision(id) {
    try {
        return await window.api.deleteDivision(id);
    } catch (error) {
        console.error('Error al eliminar curso:', error.message);
        return [];
    }
}

export async function updateDivision(data) {
    try {
        return await window.api.updateDivision(data);
    } catch (error) {
        console.error('Error al actualizar curso:', error.message);
        return [];
    }
}

export async function updatePriceConcept(paymentData) {
    try {
        return await window.api.updatePriceConcept(paymentData);
    } catch (error) {
        console.error('Error al actualizar precio:', error.message);
        return []; 
    }
}

export async function updatePriceDivision(paymentData) {
    try {
        return await window.api.updatePriceDivision(paymentData);
    } catch (error) {
        console.error('Error al actualizar precio:', error.message);
        return [];
    }
}

export async function getAllDivisionPaymentConcepts() {
    try {
        return await window.api.getAllDivisionPaymentConcepts();
    } catch (error) {
        console.error('Error al obtener conceptos de pago por división:', error.message);
        return []; 
    }
}

export async function updateDivisionPaymentConcept(data) {
    try {
        return await window.api.updateDivisionPaymentConcept(data);
    } catch (error) {
        console.error('Error al actualizar precio por división:', error.message);
        return []; 
    }
}

/*
    Reporte
*/
export async function getCashRegister() {
    try {
        return await window.api.getCashRegister();
    } catch (error) {
        console.error('Error al adquirir estado de caja:', error.message);
        return []; 
    }
}


/*
    Excel
*/
export async function exportReceiptToExcel(payment) {
    try {
        return await window.api.exportReceiptToExcel(payment);
    } catch (error) {
        console.error('Error al exportar recivo a excel:', error.message);
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


export async function exportCashRegisterReportToExcel(data) {
    try {
        return await window.api.exportCashRegisterReportToExcel(data);
    } catch (error) {
        console.error('Error al exportar reporte de caja a excel:', error.message);
        return {
            error: "Error al exportar reporte de caja a excel.",
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

export async function exportTemplateStudents() {
    try {
        return await window.api.exportTemplateStudents();
    } catch (error) {
        console.error('Error al generar plantilla excel estudiantes:', error.message);
        return {
            error: "Error al generar plantilla excel estudiantes.",
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

export async function exportDelayByMonthReportToExcel(data) {
    try {
        return await window.api.exportDelayByMonthReportToExcel(data);
    } catch (error) {
        console.error('Error al exportar reporte de morosidad por mes a excel:', error.message);
        return {
            error: "Error al exportar reporte de morosidad por mes a excel.",
        }; 
    }
}


export async function exportDelayByTeacherReportToExcel(data) {
    try {
        return await window.api.exportDelayByTeacherReportToExcel(data);
    } catch (error) {
        console.error('Error al exportar reporte de morosidad por profesor a excel:', error.message);
        return {
            error: "Error al exportar reporte de morosidad por profesor a excel.",
        }; 
    }
}

export async function importStudentsFromExcel(studentsData) {
    try {
        return await window.api.importStudentsFromExcel(studentsData);
    } catch (error) {
        console.error('Error al importar estudiantes desde el excel:', error.message);
        return {
            error: "Error al exportar respaldo por estado a excel.",
        }; 
    }
}

export async function importStudents(studentsData) {
    try {
        return await window.api.importStudents(studentsData);
    } catch (error) {
        console.error('Error al importar estudiantes:', error.message);
        return {
            error: "Error al importar estudiantes: " + error.message,
        };
    }
}

/*
    Functionality
*/

export async function addImage(imageData) {
    try {
        return await window.api.addImage(imageData);
    } catch (error) {
        console.error('Error al agregar imagen:', error.message);
        return {
            error: "Error al agregar imagen.",
        }; 
    }
}

export async function getImages() {
    try {
        return await window.api.getImages();
    } catch (error) {
        console.error('Error al obtener imagenes:', error.message);
        return {
            error: "Error al obtener imagenes.",
        }; 
    }
}

export async function setImage(imageState) {
    try {
        return await window.api.setImage(imageState);
    } catch (error) {
        console.error('Error al establecer imagen:', error.message);
        return {
            error: "Error al establecer imagen.",
        }; 
    }
}

export async function getCurrentImage() {
    try {
        return await window.api.getCurrentImage();
    } catch (error) {
        console.error('Error al obtener imagen:', error.message);
        return {
            error: "Error al obtener imagen.",
        }; 
    }
}

export async function deleteImageById(id) {
    try {
        return await window.api.deleteImageById(id);
    } catch (error) {
        console.error('Error al eliminar imagen:', error.message);
        return {
            error: "Error al eliminar imagen.",
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
    //Profesores
    getAllTeachers,
    addTeacher,
    //Precios
    updatePriceConcept,
    getAllDivisionPaymentConcepts,
    getPaymentAmount,
    addDivision,
    deleteDivision,
    updateDivision,
    updateDivisionPaymentConcept,
    //Exportar
    exportReceiptToExcel,
    exportReportToExcel,
    exportPaymentsByYearToExcel,
    exportStudentsByActiveToExcel,
    exportTemplateStudents,
    exportHistoric,
    exportCashRegisterReportToExcel,
    exportDelayByMonthReportToExcel,
    importStudentsFromExcel,
    //Functionality
    addImage,
    getImages,
    setImage,
    getCurrentImage,
    deleteImageById,
    
};