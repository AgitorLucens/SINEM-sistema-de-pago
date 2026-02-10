import { useEffect, useState } from "react";
import SelectRadix from "../generic/select/SelectRadix.jsx";
import DatePicker from "../generic/datepicker/DatePicker.jsx";
import {onRadixChange,handleFieldChange, formatConsecutive, formatCRC} from "../generic/function/Function.jsx";

const PaymentsForm = ({ formData, handleChange, handleConcept, handleDivision, handleAmount, handleDate, onSubmit, isLoading, concepts, divisions, students, months }) => {
    const [value, setValue] = useState(formData.amount);
    const [isEditing, setIsEditing] = useState(false);
    let displayValue = isEditing
        ? value
        : value === "" ? "" : formatCRC(value);

    const handleAmountChange = (e) => {
        const raw = e.target.value.replace(/[^\d.]/g, "");

        // permitir borrar completamente
        if (raw === "") {
            setValue("");
            handleAmount({ target: { name: 'amount', value: "" } });
            return;
        }

        // solo un punto decimal
        if ((raw.match(/\./g) || []).length > 1) return;

        setValue(raw);
        handleAmount({ target: { name: 'amount', value: raw } });
    };

    useEffect(()=>{
        setValue(formData.amount ?? "");
    }, [formData.amount])

    return (
        <div style={{ padding: '0.5rem' }}>
            <p className="card-text" style={{ color: '#4b5563' }}>Ingrese los detalles del pago recibido.</p>

            <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>              

                {/* Campo Estudiantes y Mes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="studentName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Nombre del Estudiante
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
                                { value: "Efectivo", label: "Efectivo" },
                                { value: "Transferencia", label: "Transferencia" },
                            ]}
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
                                 onChange={handleConcept}
                                 options={concepts}
                        />   
                    </div>
                
                    {/* Campo Método de Pago */}
                    <div>
                        {(formData && (formData.concept === "2" || formData.concept === "3")) && (
                            <>
                                <label htmlFor="month" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                                Mes
                                </label>
                                <SelectRadix
                                 label=""
                                 name="month"
                                 placeholder="Selecciones un mes"
                                 value={formData.month}
                                 valueKey="value"
                                 labelKey="label"
                                 onChange={onRadixChange(handleChange,"month")}
                                 options={months}
                                />  
                            </>   
                        )}
                                            
                        {(formData && formData.concept === "1") && (
                            <>
                                <label htmlFor="month" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                                Matricula
                                </label>
                                <SelectRadix
                                 label=""
                                 name="month"
                                 placeholder="Selecciones un semestre"
                                 value={formData.semester}
                                 valueKey="value"
                                 labelKey="label"
                                 onChange={onRadixChange(handleChange,"semester")}
                                 options={[
                                    { value: "1", label: "Matricula 1" },
                                    { value: "2", label: "Matricula 2" },
                                 ]}  
                                /> 
                            </>   
                        )}
                    </div>
                </div>

                {/* Campo Monto y Fecha (en una fila) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                            onChange={handleDivision}
                            options={divisions}
                        />
                    </div>
                    <div>
                        <label htmlFor="date" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            Fecha del Pago
                        </label>
                        <DatePicker
                             value={formData.date}
                             onChange={handleDate}
                        />
                    </div>
                </div>
                {/* Campo Curso y Consecutivo */}
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
                            placeholder="Ej: 50.00"
                        />      
                    </div>
                    <div>
                        <label htmlFor="consecutive" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                            # Consecutivo
                        </label>
                        <input
                            type="text"
                            id="consecutive"
                            name="consecutive"
                            value={formData.year && formData.consecutive
                                ? formatConsecutive(formData.year, formData.consecutive)
                                : ""}
                            readOnly
                            min="0.01"
                            step="0.01"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="receipt" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.875rem' }}>
                        # Comprobante (opcional)
                    </label>
                    <input
                        type="text"
                        id="receipt"
                        name="receipt"
                        value={formData.receipt}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', boxSizing: 'border-box' }}
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