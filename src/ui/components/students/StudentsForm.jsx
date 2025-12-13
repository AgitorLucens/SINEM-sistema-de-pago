const ExpensesForm = ({ formData, handleChange, onSubmit, isLoading }) => {
    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Ingrese los detalles del estudiante.</p>

            <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: '1rem' }}>
                {/* Campo Nombre del Estudiante/Participante */}
                <div>
                    <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        placeholder="Nombre"
                    />
                </div>
                <div>
                    <label htmlFor="reference" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Referencia
                    </label>
                    <input
                        type="text"
                        id="reference"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        placeholder="Referencia"
                    />
                </div>
                <div>
                    <label htmlFor="active" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Activo
                    </label>
                    <select
                            id="active"
                            name="active"
                            value={formData.active}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        >
                            <option value="" selected>
                                {'--- Seleccione un Metodo de Pago ---'}
                            </option>
                            <option value="1">Activo</option>
                            <option value="0">No Activo</option>
                    </select>
                </div>
                {/* Campo Monto y Fecha (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="phone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Telefono
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="Ej: 888-8888"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="example@hotmail.com"
                        />
                    </div>
                </div>

                {/* Campo Concepto y Método de Pago (en una fila) */}

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
                    Guardar Estudiante
                </button>
            </form>
        </div>
    );
};

export default ExpensesForm;