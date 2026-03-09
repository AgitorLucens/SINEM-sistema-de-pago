import { useState, useEffect, useRef, useMemo } from 'react';
import { updatePayment } from "../../constant/DBFunctions.jsx"
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import EditableCellInput from '../generic/table/EditableCellInput.jsx';
import EditableCellDate from '../generic/table/EditableCellDate.jsx';
import EditableCellSearchDropdown from "../generic/table/EditableCellSearchDropdown.jsx";
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import PaymentsPagination from './PaymentsPagination';
import PaymentsPaginationInput from './PaymentsPaginationInput';

import './paymentstable.css';

// Componente para visualizar el historial de pagos con redimensionamiento manual
const PaymentsTable = ({ concepts, divisions, payments, students, minTableWidth = '800px', onDeletePayment, onRowClick, confirmingId, handleTableUpdate }) => {
    // Convertir el prop de cadena a número para cálculos
    const minWidthValue = parseInt(minTableWidth, 10) || 600;
    const [tableWidth, setTableWidth] = useState(() => {
        const saved = localStorage.getItem("paymentsTableWidth");
        return saved ? Number(saved) : minWidthValue;
    });

    const [visibleColumns, setVisibleColumns] = useState({
        invoice_number: true,
        date: true,
        student_name: true,
        payment_method: true,
        division_name: true,
        teacher_name: true,
        concept_type: true,
        amount: true,
        receipt: true,
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

    const paymentColumns = [
        { key: 'invoice_number', label: '# Factura' },
        { key: 'date', label: 'Fecha' },
        { key: 'student_name', label: 'Estudiante' },
        { key: 'payment_method', label: 'Modo Pago' },
        { key: 'division_name', label: 'Curso' },
        { key: 'teacher_name', label: 'Profesor' },
        { key: 'concept_type', label: 'Tipo Pago' },
        { key: 'amount', label: 'Monto' },
        { key: 'receipt', label: '# Comprobante' },
    ];

    // Sorting Logic
    const sortedPayments = useMemo(() => {
        let sortableItems = [...(payments || [])];
        if (sortConfig.direction !== 'default' && sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // Handle special case for invoice_number (composite)
                if (sortConfig.key === 'invoice_number') {
                    aValue = `${a.year}-${String(a.sequence).padStart(5, '0')}`;
                    bValue = `${b.year}-${String(b.sequence).padStart(5, '0')}`;
                }

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
    }, [payments, sortConfig]);

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
    const currentItems = sortedPayments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedPayments.length ? Math.ceil(sortedPayments.length / itemsPerPage) : 0;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        localStorage.setItem("paymentsTableWidth", newWidth);
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


    // Renderizado
    return (
        <div
            className="payments-container"
            style={{ width: `${tableWidth}px` }}
        >
            {/* Top Bar: Column Visibility and Pagination Input */}
            <div className="table-top-bar">

                <ColumnToggleMenu
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    columns={paymentColumns}
                    buttonLabel="Columnas"
                />

                {payments && payments.length > 0 && (
                    <PaymentsPaginationInput
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                )}
            </div>

            <div className="payments-table-wrapper">
                <div className="payments-scroll-area">
                    <table className="payments-table">
                            <thead className="payments-thead">
                                <tr>
                                    {visibleColumns.invoice_number && (
                                        <th
                                            className='payments-th text-center'
                                            onClick={() => requestSort('invoice_number')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            # Factura {getSortIndicator('invoice_number')}
                                        </th>
                                    )}
                                    {visibleColumns.date && (
                                        <th
                                            className='payments-th'
                                            onClick={() => requestSort('date')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Fecha {getSortIndicator('date')}
                                        </th>
                                    )}
                                    {visibleColumns.student_name && (
                                        <th
                                            className='payments-th'
                                            onClick={() => requestSort('student_name')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Estudiante {getSortIndicator('student_name')}
                                        </th>
                                    )}
                                    {visibleColumns.payment_method && (
                                        <th
                                            className='payments-th'
                                            onClick={() => requestSort('payment_method')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Modo Pago {getSortIndicator('payment_method')}
                                        </th>
                                    )}
                                    {visibleColumns.division_name && (
                                        <th
                                            className='payments-th'
                                            onClick={() => requestSort('division_name')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Curso {getSortIndicator('division_name')}
                                        </th>
                                    )}
                                    {visibleColumns.teacher_name && (
                                        <th
                                            className='payments-th'
                                            onClick={() => requestSort('teacher_name')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Profesor {getSortIndicator('teacher_name')}
                                        </th>
                                    )}

                                    {visibleColumns.concept_type && (
                                        <th
                                            className='payments-th text-center'
                                            onClick={() => requestSort('concept_type')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Tipo Pago {getSortIndicator('concept_type')}
                                        </th>
                                    )}
                                    {visibleColumns.amount && (
                                        <th
                                            className='payments-th text-center'
                                            onClick={() => requestSort('amount')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Monto {getSortIndicator('amount')}
                                        </th>
                                    )}
                                    {visibleColumns.receipt && (
                                        <th
                                            className='payments-th text-center'
                                            onClick={() => requestSort('receipt')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            # Comprobante {getSortIndicator('receipt')}
                                        </th>
                                    )}
                                    <th className='payments-th text-center'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((p, index) => (
                                    <tr key={p.id} className="payments-tr"
                                        style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}
                                    >
                                        {visibleColumns.invoice_number && (
                                            <td onClick={() => onRowClick?.(p)}
                                                className="payments-td">
                                                <span className="badge-id">
                                                    {p.year && p.sequence ? `${p.year}-${String(p.sequence).padStart(5, '0')}` : '---'}
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.date && (
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
                                        )}
                                        {visibleColumns.student_name && (
                                            <td className="payments-td">
                                                <EditableCellSearchDropdown
                                                    value={p.student_name}
                                                    options={students.map(s => ({ value: s.id, label: s.name }))}
                                                    valueKey="value"
                                                    labelKey="label"
                                                    onSave={(val) =>
                                                        handleTableUpdate(
                                                            { id: p.id, fields: { student_id: val } },
                                                            updatePayment
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        {visibleColumns.payment_method && (
                                            <td className="payments-td">
                                                <span className={`badge-method ${p.payment_method?.toLowerCase().includes('trans') ? 'method-transfer' : 'method-other'}`}>
                                                    <EditableCellDropdown
                                                        options={[
                                                            { value: "Transferencia", label: "Transferencia" },
                                                            { value: "Efectivo", label: "Efectivo" },
                                                        ]}
                                                        value={p.payment_method}
                                                        onSave={(val) => handleTableUpdate({ id: p.id, fields: { payment_method: val } }, updatePayment)}
                                                    />
                                                </span>
                                            </td>
                                        )}
                                        {visibleColumns.division_name && (
                                            <td className="payments-td">
                                                <EditableCellDropdown
                                                    options={divisions}
                                                    value={p.division_name}
                                                    valueKey='id'
                                                    labelKey='name'
                                                    onSave={(val) => handleTableUpdate({ id: p.id, fields: { division_id: val } }, updatePayment)}
                                                />
                                            </td>
                                        )}
                                        {visibleColumns.teacher_name && (
                                            <td className="payments-td">
                                                {p.teacher_name ? p.teacher_name : "—"}
                                            </td>
                                        )}

                                        {visibleColumns.concept_type && (
                                            <td className="payments-td">
                                                <EditableCellDropdown
                                                    options={concepts}
                                                    value={p.concept_type}
                                                    valueKey="id"
                                                    labelKey="name"
                                                    onSave={(val) => handleTableUpdate({ id: p.id, fields: { concept_id: val } }, updatePayment)}
                                                />
                                            </td>
                                        )}

                                        {/* Mostrar monto con dos decimales */}
                                        {visibleColumns.amount && (
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
                                        )}

                                        {visibleColumns.receipt && (
                                            <td className='payments-td'>
                                                <EditableCellInput
                                                    value={p.receipt}
                                                    type="text"
                                                    onSave={(val) =>
                                                        handleTableUpdate(
                                                            { id: p.id, fields: { receipt: val } },
                                                            updatePayment
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}

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
            {payments && payments.length > 0 && (
                <PaymentsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default PaymentsTable;
