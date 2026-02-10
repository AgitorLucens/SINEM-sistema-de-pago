import SelectRadix from "../generic/select/SelectRadix.jsx"
import {onRadixChange} from "../generic/function/Function.jsx"

const ExpensesForm = ({ formData, handleChange, onSubmit, isLoading }) => {
    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Ingrese los detalles del estudiante.</p>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
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
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        placeholder="Referencia"
                    />
                </div>
                <div>
                    <SelectRadix 
                                label="Activo"
                                name="active"
                                placeholder="Seleccione estado de estudiante"
                                value={formData.active}
                                onChange={onRadixChange(handleChange,"active")}
                                valueKey="value"
                                labelKey="label"
                                options={[
                                    { value: "1", label: "Activo" },
                                    { value: "0", label: "No Activo" },
                                ]}
                    />
                </div>
                {/* Campo Telefono y Email (en una fila) */}
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
                            pattern="^([0-9]{4}-[0-9]{4}|[0-9]{8})$"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="Ej: 8888-8888"
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
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="example@hotmail.com"
                        />
                    </div>
                </div>
                            
                {/* Campo beca */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <SelectRadix 
                                label="Beca"
                                name="scholarship"
                                placeholder="Seleccione beca de estudiante"
                                value={formData.scholarship}
                                onChange={onRadixChange(handleChange,"active")}
                                valueKey="value"
                                labelKey="label"
                                options={[
                                    { value: "1", label: "Beca" },
                                    { value: "0", label: "Sin Beca" },
                                ]}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Monto Beca
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="example@hotmail.com"
                        />
                    </div>
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
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                    Guardar Estudiante
                </button>
            </form>
        </div>
    );
};

export default ExpensesForm;