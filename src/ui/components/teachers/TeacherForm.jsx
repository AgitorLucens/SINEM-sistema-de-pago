import SelectRadix from "../generic/select/SelectRadix.jsx"
import {onRadixChange} from "../generic/function/Function.jsx"

const TeacherForm = ({ formData, divisions, handleChange, onSubmit, isLoading }) => {
    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Ingrese los detalles del profesor.</p>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
                {/* Campo Nombre del Profesor */}
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
                        placeholder="Nombre completo"
                    />
                </div>

                {/* Campo Curso/División */}
                <div>
                    <label htmlFor="courseDivision" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Curso/División
                    </label>
                    <SelectRadix
                        label=""
                        name="division"
                        placeholder="Seleccione curso"
                        value={formData.division}
                        valueKey="id"
                        labelKey="name"
                        onChange={onRadixChange(handleChange,"division")}
                        options={divisions}
                    />
                </div>
        
                {/* Campo Monto */}
                <div>
                    <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Monto
                    </label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        placeholder="Monto a pagar"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        backgroundColor: '#10b981', // bg-emerald-500
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        fontSize: '1rem',
                        border: 'none',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.7 : 1,
                        transition: 'background-color 0.2s',
                        marginTop: '1rem'
                    }}
                    onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#059669')} // hover:bg-emerald-600
                    onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#10b981')}
                >
                    {isLoading ? 'Guardando...' : 'Guardar Profesor'}
                </button>
            </form>
        </div>
    );
};

export default TeacherForm;