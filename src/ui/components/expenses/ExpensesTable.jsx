import { updateExpense } from "../../constant/DBFunctions.jsx"
import EditableCellInput from '../generic/table/EditableCellInput.jsx';
import EditableCellDate from '../generic/table/EditableCellDate.jsx';
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import Pagination from '../generic/pagination/Pagination';
import PaginationInput from '../generic/pagination/PaginationInput';
import useTableControls from '../../hooks/useTableControls';
import useResizableTable from '../../hooks/useResizableTable';
import DeleteButton from '../generic/table/DeleteButton';

import './expensestable.css';

const COLUMN_KEYS = ['date', 'description', 'reference', 'amount'];

const ExpensesTable = ({ expenses, minTableWidth = '700px', handleTableUpdate, onDeleteExpense, onRowClick, confirmingId }) => {
    const { tableWidth, handleMouseDown } = useResizableTable("expensesTableWidth", parseInt(minTableWidth, 10) || 600);

    const {
        visibleColumns,
        toggleColumn,
        requestSort,
        getSortIndicator,
        currentPage,
        totalPages,
        currentItems,
        paginate,
    } = useTableControls(expenses, COLUMN_KEYS);

    const expenseColumns = [
        { key: 'date', label: 'Fecha' },
        { key: 'description', label: 'Detalle' },
        { key: 'reference', label: 'Referencia' },
        { key: 'amount', label: 'Monto' },
    ];

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
                    <PaginationInput
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
                        <thead className='expenses-thead'>{/* bg-indigo-50 */}<tr>
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
                                                        { id: ex.id, fields: { total_amount: parseFloat(val) } },
                                                        updateExpense
                                                    )
                                                }
                                            />
                                        </td>
                                    )}
                                    {/* Boton Borrado  */}
                                    <td className="expenses-td" style={{ textAlign: 'center' }}>
                                        <DeleteButton
                                            id={ex.id}
                                            confirmingId={confirmingId}
                                            onDelete={onDeleteExpense}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {expenses.length === 0 && (
                                <tr>
<td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>No hay gastos registrados.</td>
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
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default ExpensesTable;



