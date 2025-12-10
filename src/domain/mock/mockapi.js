export const mockApi = {
    // Inicializa datos mock para FKs (Students y Concepts)
    initMock: () => {
        // Simular tabla de estudiantes
        if (!localStorage.getItem('mockStudents')) {
            localStorage.setItem('mockStudents', JSON.stringify([
                { id: 1, name: 'Ana Fernández', email: 'ana@example.com' },
                { id: 2, name: 'Carlos Ruiz', email: 'carlos@example.com' }
            ]));
        }
        // Simular tabla de conceptos de pago
        if (!localStorage.getItem('mockConcepts')) {
            localStorage.setItem('mockConcepts', JSON.stringify([
                { id: 1, name: 'Mensualidad Enero', amount: 120.00 },
                { id: 2, name: 'Taller Intensivo', amount: 50.00 }
            ]));
        }
    },
    
    // Función de ayuda para simular la consulta JOIN de SQL (asocia IDs con nombres)
    getPaymentsWithJoins: (payments) => {
        const students = JSON.parse(localStorage.getItem('mockStudents') || '[]');
        const concepts = JSON.parse(localStorage.getItem('mockConcepts') || '[]');
        
        return payments.map(p => ({
            ...p,
            student_name: students.find(s => s.id === p.student_id)?.name || `Estudiante ID ${p.student_id} (Missing)`,
            concept_name: concepts.find(c => c.id === p.concept_id)?.name || `Concepto ID ${p.concept_id} (Missing)`
        }));
    },
    
    // Simula la llamada IPC para obtener todos los pagos
    getAllPayments: async () => {
        mockApi.initMock();
        const rawPayments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
        return mockApi.getPaymentsWithJoins(rawPayments);
    },
    
    // Simula la llamada IPC para añadir un pago
    addPayment: async (data) => {
        mockApi.initMock();
        
        let payments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
        const newId = payments.length > 0 ? Math.max(...payments.map(p => p.id)) + 1 : 1;
        
        // Simulación: Asignación de IDs de claves foráneas
        const newPayment = { 
            ...data, 
            id: newId, 
            timestamp: new Date().toISOString(),
            student_id: 1, // Hardcodeado para la demo (Ana Fernández)
            concept_id: 1, // Hardcodeado para la demo (Mensualidad Enero)
        };
        payments.push(newPayment);
        localStorage.setItem('mockPayments', JSON.stringify(payments));
        return newId;
    },
    
    // Simula la llamada IPC para eliminar un pago
    deletePayment: async (id) => {
        let payments = JSON.parse(localStorage.getItem('mockPayments') || '[]');
        payments = payments.filter(p => p.id !== id);
        localStorage.setItem('mockPayments', JSON.stringify(payments));
        return true;
    },
};