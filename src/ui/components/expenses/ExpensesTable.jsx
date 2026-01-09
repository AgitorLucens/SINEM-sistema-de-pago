import { useState, useEffect, useRef } from 'react';
import        { formatDate }           from "../generic/function/Function.jsx"
import       { updateExpense }         from "../../constant/DBFunctions.jsx"
import        EditableCellInput        from '../generic/table/EditableCellInput.jsx';
import        EditableCellDate         from '../generic/table/EditableCellDate.jsx';

import './expensestable.css';
const ExpensesTable = ({expenses, minTableWidth = '700px', handleTableUpdate, onDeleteExpense, onRowClick, confirmingId}) => {

    const minWidthValue = parseInt(minTableWidth, 10) || 600;
    
    const [tableWidth, setTableWidth] = useState(minWidthValue);

    const dragState = useRef(null);
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

    return (
        <div 
            className='expenses-container'
            style={{width: `${tableWidth}px` }}
        >
            <div className="expenses-table-wrapper">
                {/* Contenedor de la tabla: permite el scroll horizontal si el contenido de la tabla es > tableWidth */}
                <div className='expenses-scroll-area'> 
                    <table className='expenses-table'>
                        <thead className='expenses-thead'> {/* bg-indigo-50 */}
                            <tr>
                                <th className='expenses-th'>Fecha</th>
                                <th className='expenses-th'>Detalle</th>
                                <th className='expenses-th'>Referencia</th>
                                <th className='expenses-th'>Monto</th> 
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((ex, index) => (
                                // Asegura que el ID sea único
                                <tr key={ex.id} className='expenses-tr'
                                    style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                                    <td className='expenses-td'>
                                        <EditableCellDate
                                            value={ex.date}
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: ex.id, fields: { date: val } },
                                                    updateExpense
                                                )
                                            }
                                        />
                                        {/*formatDate(ex.date)*/}
                                    </td>
                                    <td className='expenses-td'>
                                        <EditableCellInput
                                            value={ex.description}
                                            type="text"
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: ex.id, fields: { description: val} },
                                                    updateExpense
                                                )
                                            }
                                        />
                                    </td>
                                    <td className='expenses-td'>
                                        <EditableCellInput
                                            value={ex.reference}
                                            type="text"
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: ex.id, fields: { reference: val} },
                                                    updateExpense
                                                )
                                            }
                                        />
                                    </td>
                                    {/* Mostrar monto con dos decimales */}
                                    <td className='expenses-td amount-column'>
                                        <EditableCellInput
                                            value={ex.amount}
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
                                                    { id: ex.id, fields: { total_amount: parseFloat(val) } },
                                                    updateExpense
                                                )
                                            }
                                        />
                                    </td>         
                                    {/* Boton Borrado  */}
                                    <td className="expenses-td" style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={(e) => onDeleteExpense(e, ex.id)}
                                            className={`delete-btn ${confirmingId === ex.id ? 'confirming' : ''}`}
                                        >
                                            {confirmingId === ex.id ? (
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
                            {expenses.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>No hay gastos registrados.</td>
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
}

export default ExpensesTable;