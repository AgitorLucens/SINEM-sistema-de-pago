import SelectRadix from "../generic/select/SelectRadix.jsx"
import DatePicker from "../generic/datepicker/DatePicker.jsx";
import {onRadixChange,handleFieldChange} from "../generic/function/Function.jsx"

const PaymentsForm = ({ formData, handleChange, onSubmit, isLoading, concepts, divisions, students }) => {
   
    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Ingrese los detalles del pago recibido.</p>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
                {/* Campo Nombre del Estudiante/Participante */}
                <div>
                    <label htmlFor="studentName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Nombre del Estudiante/Participante
                    </label>
                    <SelectRadix
                                 label=""
                                 name="student"
                                 placeholder="Seleccione un estudiante"
                                 value={formData.student_id}
                                 valueKey="id"
                                 labelKey="name"
                                 onChange={onRadixChange(handleChange,"student_id")}
                                 options={students}
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
                        <DatePicker
                             value={formData.date}
                             onChange={handleFieldChange(handleChange,"date")}
                        />
                    </div>
                </div>

                {/* Campo Concepto y Método de Pago (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="concept" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Tipo de Pago
                        </label>
                        
                        <SelectRadix
                                 label=""
                                 name="concept"
                                 placeholder="Seleccione concepto de pago"
                                 value={formData.concept}
                                 valueKey="id"
                                 labelKey="name"
                                 onChange={onRadixChange(handleChange,"concept")}
                                 options={concepts}
                        />   
                    </div>
                
                    {/* Campo Método de Pago */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Método de Pago
                        </label>

                        <SelectRadix
                                 label=""
                                 name="method"
                                 placeholder="Seleccione metodo de pago"
                                 value={formData.method}
                                 valueKey="value"
                                 labelKey="label"
                                 onChange={onRadixChange(handleChange,"method")}
                                 options={[
                                    { value: "cash", label: "Efectivo" },
                                    { value: "transfer", label: "Transferencia" },
                                 ]}
                        />
                    </div>
                </div>

                <div>
                        <label htmlFor="division" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Curso
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