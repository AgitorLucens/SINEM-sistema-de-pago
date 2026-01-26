import { useState } from "react";
import DatePicker from "../generic/datepicker/DatePicker.jsx";
import {handleFieldChange} from "../generic/function/Function.jsx"
import { formatCRC } from "../generic/function/Function.jsx";

const ExpensesForm = ({ formData, handleChange, onSubmit, isLoading }) => {
    const [value, setValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const displayValue = isEditing
        ? value
        : value === "" ? "" : formatCRC(value);


    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/[^\d.]/g, "");

        // permitir borrar completamente
        if (raw === "") {
            setValue("");
            return;
        }

        // solo un punto decimal
        if ((raw.match(/\./g) || []).length > 1) return;

        setValue(raw);
        formData.amount = value;
    };

    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ marginBottom: '1.5rem', color: '#4b5563' }}>Ingrese los detalles del egreso.</p>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
                {/* Campo Nombre del Estudiante/Participante */}
                <div>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        Detalle
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        placeholder="Detalle"
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
                {/* Campo Monto y Fecha (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="amount" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Monto (₡)
                        </label>
                        <input
                            type="text"
                            id="amount"
                            name="amount"
                            value={displayValue}
                            onChange={handleAmountChange}
                            onFocus={() => setIsEditing(true)}
                            onBlur={() => {
                                setIsEditing(false);
                                if (value !== "") {
                                    setValue(Number(value)); // normalizar
                                }
                            }}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                            placeholder="₡0,00"
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
                    Guardar Egreso
                </button>
            </form>
        </div>
    );
};

export default ExpensesForm;