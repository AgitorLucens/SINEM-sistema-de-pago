import { useState, useEffect, useRef, useMemo } from 'react';
import { formatDate } from "../generic/function/Function.jsx"
import { updateExpense } from "../../constant/DBFunctions.jsx"
import EditableCellInput from '../generic/table/EditableCellInput.jsx';
import EditableCellDate from '../generic/table/EditableCellDate.jsx';
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import ExpensesPagination from './ExpensesPagination';
import ExpensesPaginationInput from './ExpensesPaginationInput';

import './expensestable.css';
const ExpensesTable = ({ expenses, minTableWidth = '700px', handleTableUpdate, onDeleteExpense, onRowClick, confirmingId }) => {

    const minWidthValue = parseInt(minTableWidth, 10) || 600;

    const [tableWidth, setTableWidth] = useState(() => {
        const saved = localStorage.getItem("expensesTableWidth");
        return saved ? Number(saved) : minWidthValue;
    });

    const [visibleColumns, setVisibleColumns] = useState({
        date: true,
        description: true,
        reference: true,
        amount: true
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

    const expenseColumns = [
        { key: 'date', label: 'Fecha' },
        { key: 'description', label: 'Detalle' },
        { key: 'reference', label: 'Referencia' },
        { key: 'amount', label: 'Monto' },
    ];

    // Sorting Logic
    const sortedExpenses = useMemo(() => {
        let sortableItems = [...(expenses || [])];
        if (sortConfig.direction !== 'default' && sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

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
    }, [expenses, sortConfig]);

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
    const currentItems = sortedExpenses.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedExpenses.length ? Math.ceil(sortedExpenses.length / itemsPerPage) : 0;

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
            className='expenses-container'
            style={{ width: `${tableWidth}px` }}
        >
            {/* Top Bar: Column Visibility and Pagination Input */}
            <div className="table-top-bar">

                <ColumnToggleMenu
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    columns={expenseColumns}
                    buttonLabel="Columnas"
                />

                {expenses && expenses.length > 0 && (
                    <ExpensesPaginationInput
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                )}


            </div>

            <div className="expenses-table-wrapper">
                {/* Contenedor de la tabla: permite el scroll horizontal si el contenido de la tabla es > tableWidth */}
                <div className='expenses-scroll-area'>
                    <table className='expenses-table'>
                        <thead className='expenses-thead'> {/* bg-indigo-50 */}
                            <tr>
                                {visibleColumns.date && (
                                    <th
                                        className='expenses-th'
                                        onClick={() => requestSort('date')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Fecha {getSortIndicator('date')}
                                    </th>
                                )}
                                {visibleColumns.description && (
                                    <th
                                        className='expenses-th'
                                        onClick={() => requestSort('description')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Detalle {getSortIndicator('description')}
                                    </th>
                                )}
                                {visibleColumns.reference && (
                                    <th
                                        className='expenses-th'
                                        onClick={() => requestSort('reference')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Referencia {getSortIndicator('reference')}
                                    </th>
                                )}
                                {visibleColumns.amount && (
                                    <th
                                        className='expenses-th'
                                        onClick={() => requestSort('amount')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Monto {getSortIndicator('amount')}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((ex, index) => (
                                // Asegura que el ID sea único
                                <tr key={ex.id} className='expenses-tr'
                                    style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                                    {visibleColumns.date && (
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
                                        </td>
                                    )}
                                    {visibleColumns.description && (
                                        <td className='expenses-td'>
                                            <EditableCellInput
                                                value={ex.description}
                                                type="text"
                                                onSave={(val) =>
                                                    handleTableUpdate(
                                                        { id: ex.id, fields: { description: val } },
                                                        updateExpense
                                                    )
                                                }
                                            />
                                        </td>
                                    )}
                                    {visibleColumns.reference && (
                                        <td className='expenses-td'>
                                            <EditableCellInput
                                                value={ex.reference}
                                                type="text"
                                                onSave={(val) =>
                                                    handleTableUpdate(
                                                        { id: ex.id, fields: { reference: val } },
                                                        updateExpense
                                                    )
                                                }
                                            />
                                        </td>
                                    )}
                                    {/* Mostrar monto con dos decimales */}
                                    {visibleColumns.amount && (
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
                                                        { id: teacher.id, fields: { amount: parseFloat(val) } },
                                                        updateExpense
                                                    )
                                                }
                                            />
                                        </td>
                                    )}
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
            {/* Pagination Controls */}
            {expenses && expenses.length > 0 && (
                <ExpensesPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default ExpensesTable;



