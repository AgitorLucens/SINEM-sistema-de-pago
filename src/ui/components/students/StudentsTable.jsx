import { useState, useEffect, useRef, useMemo } from 'react';
import { formatPhone } from "../generic/function/Function.jsx"
import { updateStudent } from "../../constant/DBFunctions.jsx"
import { PersonIcon } from "@radix-ui/react-icons";
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import EditableCellInput from '../generic/table/EditableCellInput.jsx';
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import StudentsPagination from './StudentsPagination';
import StudentsPaginationInput from './StudentsPaginationInput';

import './studentstable.css';
const StudentsTable = ({ students, loadStudent, minTableWidth = '700px', handleTableUpdate, onDeleteStudent, modalDetailOpen, onRowClick, confirmingId }) => {

    const minWidthValue = parseInt(minTableWidth, 10) || 600;
    
    const [tableWidth, setTableWidth] = useState(() => {
        const saved = localStorage.getItem("studentsTableWidth");
        return saved ? Number(saved) : minWidthValue;
    });

    const [visibleColumns, setVisibleColumns] = useState({
        details: true,
        name: true,
        reference: true,
        phone: true,
        email: true,
        active: true,
        scholarship: true,
        scholarship_amount: true,
    });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Sorting State
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const studentColumns = [
        { key: 'details', label: 'Detalles' },
        { key: 'name', label: 'Nombre' },
        { key: 'reference', label: 'Referencia' },
        { key: 'phone', label: 'Tel.' },
        { key: 'email', label: 'Correo' },
        { key: 'active', label: 'Activo' },
        { key: 'scholarship', label: 'Beca' },
        { key: 'scholarship_amount', label: 'Monto Beca' },
    ];

    // Sorting Logic
    const sortedStudents = useMemo(() => {
        let sortableItems = [...(students || [])];
        if (sortConfig.direction !== 'default' && sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle active specifically if needed (assuming 1/0)
                // Handle null/undefined values safely
                if (aValue === null || aValue === undefined) aValue = '';
                if (bValue === null || bValue === undefined) bValue = '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [students, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'default';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (name) => {
        if (sortConfig.key !== name) {
            return null;
        }
        if (sortConfig.direction === 'ascending') {
            return <span>&uarr;</span>;
        }
        if (sortConfig.direction === 'descending') {
            return <span>&darr;</span>;
        }
        return null;
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedStudents.length ? Math.ceil(sortedStudents.length / itemsPerPage) : 0;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        localStorage.setItem("studentsTableWidth", newWidth);
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
            style={{ width: '100%', maxWidth: `${tableWidth}px` }}
        >
             {/* Top Bar: Column Visibility and Pagination Input */}
             <div className="table-top-bar">
                
                <ColumnToggleMenu
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    columns={studentColumns}
                    buttonLabel="Columnas"
                />

                {students && students.length > 0 && (
                    <StudentsPaginationInput
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                )}

                
            </div>

            <div className="students-table-wrapper">
                {/* Contenedor de la tabla: permite el scroll horizontal si el contenido de la tabla es > tableWidth */}
                <div className="students-scroll-area"> 
                    <table className='students-table'>
                        <thead className='students-thead'>
                            <tr>
                                {visibleColumns.details && <th className='students-th'>Detalles</th>}
                                
                                {visibleColumns.name && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('name')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Nombre {getSortIndicator('name')}
                                    </th>
                                )}
                                {visibleColumns.reference && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('reference')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Referencia {getSortIndicator('reference')}
                                    </th>
                                )}
                                {visibleColumns.phone && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('phone')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Tel. {getSortIndicator('phone')}
                                    </th>
                                )}
                                {visibleColumns.email && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('email')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Correo {getSortIndicator('email')}
                                    </th>
                                )}
                                {visibleColumns.active && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('active')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Activo {getSortIndicator('active')}
                                    </th>
                                )}
                                {visibleColumns.scholarship && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('scholarship')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Beca {getSortIndicator('scholarship')}
                                    </th>
                                )}
                                {visibleColumns.scholarship_amount && (
                                    <th 
                                        className='students-th'
                                        onClick={() => requestSort('scholarship_amount')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Monto Beca {getSortIndicator('scholarship_amount')}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((s, index) => (
                                // Asegura que el ID sea único
                                <tr key={s.id} className="studentrs-tr"
             
                                    style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                                    {visibleColumns.details && (
                                        <td className={`students-td ${index % 2 === 0 ? 'cell-even' : 'cell-odd'}`} onClick={()=> {
                                            modalDetailOpen(true)
                                            loadStudent(s)
                                        }}>
                                            <div>
                                                <PersonIcon size={15}/>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.name && (
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
                                    )}
                                    {visibleColumns.reference && (
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
                                    )}
                                    {visibleColumns.phone && (
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
                                    )}
                                    {visibleColumns.email && (
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
                                    )}
                                    {visibleColumns.active && (
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
                                    )}
                                    {visibleColumns.scholarship && (
                                        <td className='students-td'>
                                            <EditableCellDropdown
                                                options={[
                                                    {value: 1, label: "Beca"},
                                                    {value: 0, label: "No Beca"}
                                                ]}
                                                value={s.scholarship === 1 ? "Beca" : "No Beca"}
                                                valueKey='value'
                                                labelKey='label'
                                                onSave={(val) => handleTableUpdate({id: s.id, fields: {scholarship: val}}, updateStudent)}
                                            />
                                        </td>
                                    )}
                                    {visibleColumns.scholarship_amount && (
                                        <td className='students-td'>
                                            <EditableCellInput
                                                value={s.scholarship_amount}
                                                type="number"
                                                onSave={(val) => handleTableUpdate({id: s.id, fields: {scholarship_amount: val}}, updateStudent)}
                                            />
                                        </td>
                                    )}
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
                {/* Handle de Redimensionamiento (Barra arrastrable) */}
                <div
                    onMouseDown={handleMouseDown}
                    style={{
                        width: '10px',
                        cursor: 'col-resize',
                        backgroundColor: '#4f46e5', // Color visible
                        height: '100%',
                        position: 'absolute',
                        right: '-5px', // Se superpone ligeramente al borde para ser mas facil de arrastrar
                        top: 0,
                        zIndex: 10,
                        borderRadius: '0.25rem',
                        opacity: 0.7,
                    }}
                    title="Arrastra para ajustar el ancho de la tabla"
                />
            </div>
            {/* Pagination Controls */}
            {students && students.length > 0 && (
                <StudentsPagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default StudentsTable;

