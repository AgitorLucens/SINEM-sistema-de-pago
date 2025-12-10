import getPaymentConcepts from "../../constant/PaymentConcepts"

const PaymentsForm = ({ formData, handleChange, onSubmit, isLoading, concepts }) => {
   
    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Ingrese los detalles del pago recibido.</p>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
                {/* Campo Nombre del Estudiante/Participante */}
                <div>
                    <label htmlFor="studentName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Nombre del Estudiante/Participante
                    </label>
                    <input
                        type="text"
                        id="studentName"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        placeholder="Ej: Juan Pérez"
                    />
                </div>

                {/* Campo Monto y Fecha (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Monto (₡)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="0.01"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="Ej: 50.00"
                        />
                    </div>
                    <div>
                        <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Fecha del Pago
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                {/* Campo Concepto */}
                <div>
                    <label htmlFor="concept" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Concepto
                    </label>
                    <select
                        id="concept"
                        name="concept"
                        value={formData.concept}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                    >
                        {concepts.length === 0 ? (
                            <option value="" disabled>{isLoading ? 'Cargando conceptos...' : 'No hay conceptos disponibles'}</option>
                            ) : (
                            // 1. Usamos el método map() para iterar sobre el array 'paymentConcepts'
                            concepts.map((concept) => (
                            // 2. Por cada objeto, creamos un elemento <option>
                            <option 
                                key={concept.id}      // Clave única para React (obligatoria)
                                value={concept.id}    // El valor que se guarda en formData (el ID de Firestore)
                            >
                                {concept.name}        {/* El texto visible en el dropdown */}
                            </option>
                    ))
                )}
                    </select>
                </div>
                
                {/* Campo Método de Pago */}
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Método de Pago
                    </label>
                    <select
                        id="method"
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                    >
                        <option value="cash">Efectivo</option>
                        <option value="transfer">Transferencia</option>
                        <option value="card">Tarjeta</option>
                        <option value="check">Cheque</option>
                    </select>
                </div>

                <button
                    type="submit"
                    style={{
                        backgroundColor: '#10b981', // bg-emerald-500
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'} // hover:bg-emerald-600
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                    Guardar Registro
                </button>
            </form>
        </div>
    );
};

export default PaymentsForm;