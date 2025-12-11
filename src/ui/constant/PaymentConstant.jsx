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

export async function getAllExpenses() {
    try {
        return await window.api.getAllExpenses();
    } catch (error) {
        console.error('Error al obtener egresos:', error.message);
        return []; 
    }
}

export default {
    getPaymentConcepts,
    getPaymentDivisions,
    getAllExpenses
};