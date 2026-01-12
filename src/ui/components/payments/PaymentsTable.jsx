import { useState, useEffect, useRef } from 'react';
import { updatePayment }               from "../../constant/DBFunctions.jsx"
import EditableCellDropdown            from '../generic/table/EditableCellDropdown';
import EditableCellInput               from '../generic/table/EditableCellInput.jsx';
import EditableCellDate                from '../generic/table/EditableCellDate.jsx';
import EditableCellSearchDropdown      from "../generic/table/EditableCellSearchDropdown.jsx";

import './paymentstable.css';

// Componente para visualizar el historial de pagos con redimensionamiento manual
const PaymentsTable = ({ concepts, divisions, payments, students, minTableWidth = '800px' , onDeletePayment, onRowClick, confirmingId, handleTableUpdate}) => {
    // Convertir el prop de cadena a número para cálculos
    const minWidthValue = parseInt(minTableWidth, 10) || 600;
    const [isDragging, setIsDragging] = useState(false);
    const [tableWidth, setTableWidth] = useState(minWidthValue);
    
    // Ref para almacenar temporalmente el estado del arrastre (posición inicial, ancho inicial)
    const dragState = useRef(null);

    // ====================================================================
    // Lógica de Redimensionamiento
    // ====================================================================

    // Inicia el proceso de redimensionamiento
    const handleMouseDown = (e) => {
        e.preventDefault(); 
        
        // Almacenar el estado inicial para el cálculo de movimiento
        dragState.current = {
            startX: e.clientX,
            startWidth: tableWidth,
        };
        
        // Adjuntar listeners globales al objeto window para capturar el movimiento
        // incluso si el cursor se sale del resizer.
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        // Evitar la selección de texto durante el arrastre
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    };

    // Actualiza el ancho de la tabla mientras se arrastra
    const handleMouseMove = (e) => {
        if (!dragState.current) return;
        
        const deltaX = e.clientX - dragState.current.startX;
        let newWidth = dragState.current.startWidth + deltaX;

        // Aplicar la restricción de ancho mínimo
        if (newWidth < minWidthValue) {
            newWidth = minWidthValue;
        }

        // Aplicar la restricción de ancho máximo (no exceder el ancho del viewport)
        const maxAllowedWidth = window.innerWidth * 0.95; // 95% del ancho de la ventana
        if (newWidth > maxAllowedWidth) {
             newWidth = maxAllowedWidth;
        }

        setTableWidth(newWidth);
    };

    // Finaliza el proceso de redimensionamiento
    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        dragState.current = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    // Limpieza de listeners al desmontar el componente (CRUCIAL)
    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []); 

    // ====================================================================
    // Renderizado
    // ==================================================================== 
    return (
        <div 
            className="payments-container"
            style={{ width: `${tableWidth}px` }}
        >
            <div className="payments-table-wrapper">
                <div className="payments-scroll-area"> 
                    <table className="payments-table">
                        <thead className="payments-thead">
                            <tr>
                                <th className='payments-th text-center'># Factura</th>
                                <th className='payments-th'>Fecha</th>
                                <th className='payments-th'>Estudiante</th>
                                <th className='payments-th'>Modo Pago</th>
                                <th className='payments-th'>Curso</th>
                                <th className='payments-th text-center'>Tipo Pago</th>
                                <th className='payments-th text-center'>Monto</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((p, index) => (
                                <tr key={p.id} className="payments-tr"
                                    style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                                    <td onClick={() => onRowClick?.(p)}
                                        className="payments-td">
                                            <span className="badge-id">
                                                {p.year && p.sequence ? `${p.year}-${String(p.sequence).padStart(5, '0')}` : '---'}
                                            </span>
                                    </td>
                                    <td className="payments-td">
                                        <EditableCellDate
                                            value={p.date}
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: p.id, fields: { date: val } },
                                                    updatePayment
                                                )
                                            }
                                        />
                                        {/*formatDate(p.date)*/}
                                    </td>
                                    <td className="payments-td">
                                        <EditableCellSearchDropdown 
                                            value={p.student_name}
                                            options={students.map(s => ({value: s.id, label: s.name }))}
                                            valueKey="value"
                                            labelKey="label"
                                            onSave={(value)=>console.log(value)}
                                        />
                                            
                                        {/*p.student_name*/}
                                    </td>
                                    <td className="payments-td">
                                        <span className={`badge-method ${p.payment_method?.toLowerCase().includes('trans') ? 'method-transfer' : 'method-other'}`}>
                                            <EditableCellDropdown
                                                options={[
                                                    { value: "Transferencia", label: "Transferencia" },
                                                    { value: "Efectivo", label: "Efectivo" },
                                                ]}
                                                value={p.payment_method}
                                                onSave={(val) => handleTableUpdate({id: p.id, fields: {payment_method: val}}, updatePayment)}
                                            />
                                        </span> 
                                    </td>
                                    <td className="payments-td">
                                        <EditableCellDropdown
                                            options={divisions}
                                            value={p.division_name}
                                            valueKey='id'
                                            labelKey='name'
                                            onSave={(val) => handleTableUpdate({id: p.id, fields: {division_id: val}}, updatePayment)}
                                        />
                                    </td>
                                    <td className="payments-td">
                                        <EditableCellDropdown
                                            options={concepts}
                                            value={p.concept_type}
                                            valueKey='id'
                                            labelKey='name'
                                            onSave={(val) => handleTableUpdate({id: p.id, fields: {concept_id: val}}, updatePayment)}
                                        />
                                    </td>
                                
                                    {/* Mostrar monto con dos decimales */}
                                    <td className='payments-td amount-column'>
                                        <EditableCellInput
                                            value={p.amount}
                                            type="number"
                                            formatDisplay={(val) =>
                                                new Intl.NumberFormat("es-CR", {
                                                    style: "currency",
                                                    currency: "CRC",
                                                    minimumFractionDigits: 2,
                                                }).format(val)
                                            }
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: p.id, fields: { amount: parseFloat(val) } },
                                                    updatePayment
                                                )
                                            }
                                        />
                                    </td>
                                    {/* Boton Borrado  */}
                                    <td className="payments-td" style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={(e) => onDeletePayment(e, p.id)}
                                            className={`delete-btn ${confirmingId === p.id ? 'confirming' : ''}`}
                                        >
                                            {confirmingId === p.id ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                </svg>
                                            )}
                                        </button>
                                    </td>             
                                </tr>
                            ))}
                            {payments.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>No hay pagos registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Handle de Redimensionamiento (Barra arrastrable) */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    width: '10px',
                    cursor: 'col-resize',
                    backgroundColor: '#4f46e5', // Color visible
                    height: '100%',
                    position: 'absolute',
                    right: '-5px', // Se superpone ligeramente al borde para ser más fácil de arrastrar
                    top: 0,
                    zIndex: 10,
                    borderRadius: '0.25rem',
                    opacity: 0.7,
                }}
                title="Arrastra para ajustar el ancho de la tabla"
            />
        </div>
    );
};

export default PaymentsTable;