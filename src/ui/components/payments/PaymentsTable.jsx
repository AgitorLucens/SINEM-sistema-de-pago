import { updatePayment } from "../../constant/DBFunctions.jsx"
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import EditableCellInput from '../generic/table/EditableCellInput.jsx';
import EditableCellDate from '../generic/table/EditableCellDate.jsx';
import EditableCellSearchDropdown from "../generic/table/EditableCellSearchDropdown.jsx";
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import Pagination from '../generic/pagination/Pagination';
import PaginationInput from '../generic/pagination/PaginationInput';
import useTableControls from '../../hooks/useTableControls';
import useResizableTable from '../../hooks/useResizableTable';
import DeleteButton from '../generic/table/DeleteButton';
import { paymentMethods } from '../../constant/paymentMethods.js';

import './paymentstable.css';

const COLUMN_KEYS = [
    'invoice_number',
    'date',
    'student_name',
    'payment_method',
    'division_name',
    'teacher_name',
    'concept_type',
    'amount',
    'receipt',
];

const getPaymentSortValue = (payment, key) => {
    if (key === 'invoice_number') {
        return `${payment.year}-${String(payment.sequence).padStart(5, '0')}`;
    }
    return payment[key];
};

// Componente para visualizar el historial de pagos con redimensionamiento manual
const PaymentsTable = ({ concepts, divisions, payments, students, minTableWidth = '800px', onDeletePayment, onRowClick, confirmingId, handleTableUpdate }) => {
    const { tableWidth, handleMouseDown } = useResizableTable("paymentsTableWidth", parseInt(minTableWidth, 10) || 600);

    const {
        visibleColumns,
        toggleColumn,
        requestSort,
        getSortIndicator,
        currentPage,
        totalPages,
        currentItems,
        paginate,
    } = useTableControls(payments, COLUMN_KEYS, { getSortValue: getPaymentSortValue });

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
                    <PaginationInput
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
                                                        options={paymentMethods}
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
                                            <DeleteButton
                                                id={p.id}
                                                confirmingId={confirmingId}
                                                onDelete={onDeletePayment}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {payments.length === 0 && (
                                    <tr>
<td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>No hay pagos registrados.</td>
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default PaymentsTable;
