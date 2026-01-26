import { useState, useEffect, useRef } from 'react';
import { formatPhone } from "../generic/function/Function.jsx"
import { updateStudent } from "../../constant/DBFunctions.jsx"
import { PersonIcon } from "@radix-ui/react-icons";
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import EditableCellInput from '../generic/table/EditableCellInput.jsx';

import './studentstable.css';
const StudentsTable = ({ students, loadStudent, minTableWidth = '700px', handleTableUpdate, onDeleteStudent, modalDetailOpen, onRowClick, confirmingId }) => {

    const minWidthValue = parseInt(minTableWidth, 10) || 600;
    
    const [tableWidth, setTableWidth] = useState(() => {
        const saved = localStorage.getItem("studentsTableWidth");
        return saved ? Number(saved) : minWidthValue;
    });

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
        localStorage.setItem("expensesTableWidth", newWidth);
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
            className='students-container'
            style={{ width: `${tableWidth}px` }}
        >
            <div className="students-table-wrapper">
                {/* Contenedor de la tabla: permite el scroll horizontal si el contenido de la tabla es > tableWidth */}
                <div className="students-scroll-area"> 
                    <table className='students-table'>
                        <thead className='students-thead'>
                            <tr>
                                <th className='students-th'>Detalles</th>
                                <th className='students-th'>Nombre</th>
                                <th className='students-th'>Referencia</th>
                                <th className='students-th'>Tel.</th>
                                <th className='students-th'>Correo</th>
                                <th className='students-th'>Activo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, index) => (
                                // Asegura que el ID sea único
                                <tr key={s.id} className="studentrs-tr"
             
                                    style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                                    <td className={`students-td ${index % 2 === 0 ? 'cell-even' : 'cell-odd'}`} onClick={()=> {
                                        modalDetailOpen(true)
                                        loadStudent(s)
                                    }}>
                                        <div>
                                            <PersonIcon size={15}/>
                                        </div>
                                    </td>
                                    <td className='students-td'>
                                        <EditableCellInput
                                            value={s.name}
                                            type="text"
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: s.id, fields: { name: val} },
                                                    updateStudent
                                                )
                                            }
                                        />
                                    </td>
                                    <td className='students-td'>
                                        <EditableCellInput
                                            value={s.reference}
                                            type="text"
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: s.id, fields: { reference: val} },
                                                    updateStudent
                                                )
                                            }
                                        />
                                    </td>
                                    <td className='students-td'>
                                        <EditableCellInput
                                            value={formatPhone(s.phone)}
                                            type="text"
                                            pattern="^([0-9]{4}-[0-9]{4}|[0-9]{8})$"
                                            onSave={(val) => {
                                                const regex = new RegExp("^([0-9]{4}-[0-9]{4}|[0-9]{8})$");
                                                if (!regex.test(val)) {
                                                    return; 
                                                }
                                                handleTableUpdate(
                                                    { id: s.id, fields: { phone: val.replace(/\D/g, ""),} },
                                                    updateStudent
                                                )
                                            }}
                                        />    
                                    </td>
                                    <td className='students-td'>
                                        <EditableCellInput
                                            value={s.email}
                                            type="text"
                                            onSave={(val) =>
                                                handleTableUpdate(
                                                    { id: s.id, fields: { email: val} },
                                                    updateStudent
                                                )
                                            }
                                        />
                                    </td>         
                                    <td className='students-td'>
                                        <EditableCellDropdown
                                            options={[
                                                {value: 1, label: "Activo"},
                                                {value: 0, label: "Inactivo"}
                                            ]}
                                            value={s.active === 1 ? "Activo" : "Inactivo"}
                                            valueKey='value'
                                            labelKey='label'
                                            onSave={(val) => handleTableUpdate({id: s.id, fields: {active: val}}, updateStudent)}
                                        />
                                    </td>
                                    {/* Boton Borrado  */}
                                    <td className="payments-td" style={{ textAlign: 'center' }}>
                                        <button 
                                            onClick={(e) => onDeleteStudent(e, s.id)}
                                            className={`delete-btn ${confirmingId === s.id ? 'confirming' : ''}`}
                                        >
                                            {confirmingId === s.id ? (
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
                            {students.length === 0 && (
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

export default StudentsTable;