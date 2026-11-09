import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import Pagination from '../generic/pagination/Pagination';
import PaginationInput from '../generic/pagination/PaginationInput';
import EditableCellInput from '../generic/table/EditableCellInput';
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import { updateTeacher } from '../../constant/DBFunctions';
import useTableControls from '../../hooks/useTableControls';
import useResizableTable from '../../hooks/useResizableTable';
import DeleteButton from '../generic/table/DeleteButton';

import './teacherstable.css';

const COLUMN_KEYS = ['name', 'courseDivision', 'amount'];
const getTeacherSortValue = (teacher, key) =>
    key === 'courseDivision' ? teacher.division_name : teacher[key];

const TeachersTable = ({
    teachers,
    divisions,
    minTableWidth = '550px',
    handleTableUpdate,
    onDeleteTeacher,
    confirmingId
}) => {
    const { tableWidth, handleMouseDown } = useResizableTable('teachersTableWidth', parseInt(minTableWidth, 10) || 600);

    const {
        visibleColumns,
        toggleColumn,
        requestSort,
        getSortIndicator,
        currentPage,
        totalPages,
        currentItems,
        paginate,
    } = useTableControls(teachers, COLUMN_KEYS, { getSortValue: getTeacherSortValue });

    const teacherColumns = [
        { key: 'name', label: 'Nombre' },
        { key: 'courseDivision', label: 'Curso/Division' },
        { key: 'amount', label: 'Monto' },
    ];

    return (
        <div
            className="table-teacher-container"
            style={{ width: '100%', maxWidth: `${tableWidth}px` }}
        >
            {/* Top Bar: Column Visibility and Pagination Input */}
            <div className="table-top-bar">
                <ColumnToggleMenu
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                    columns={teacherColumns}
                    buttonLabel="Columnas"
                />

                {teachers && teachers.length > 0 && (
                    <PaginationInput
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                )}

                
            </div>

            {/* Table */}
            <div className="teachers-table-wrapper">
                <div className="teachers-scroll-area">
                    <table className="teachers-table">
                        <thead className="teachers-table-head">
                            <tr>
                                {visibleColumns.name && (
                                    <th
                                        className="teachers-table-th"
                                        onClick={() => requestSort('name')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Nombre {getSortIndicator('name')}
                                    </th>
                                )}
                                {visibleColumns.courseDivision && (
                                    <th
                                        className="teachers-table-th"
                                        onClick={() => requestSort('courseDivision')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Curso/Division {getSortIndicator('courseDivision')}
                                    </th>
                                )}
                                {visibleColumns.amount && (
                                    <th
                                        className="teachers-table-th"
                                        onClick={() => requestSort('amount')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Monto {getSortIndicator('amount')}
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems && currentItems.length > 0 ? (
                                currentItems.map((teacher, index) => (
                                    <tr key={teacher.id || index} className="teachers-table-row">
                                        {visibleColumns.name && (
                                            <td className="teachers-table-cell cell-primary">
                                                <EditableCellInput
                                                    value={teacher.name}
                                                    type="text"
                                                    onSave={(val) =>
                                                        handleTableUpdate(
                                                            { id: teacher.id, fields: { name: val } },
                                                            updateTeacher
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        {visibleColumns.courseDivision && (
                                            <td className="teachers-table-cell division-column">
                                                <EditableCellDropdown
                                                    options={divisions}
                                                    value={teacher.division_name}
                                                    valueKey="id"
                                                    labelKey="name"
                                                    onSave={(val) => handleTableUpdate({ id: teacher.id, fields: { division_id: val } }, updateTeacher)}
                                                />
                                            </td>
                                        )}
                                        {visibleColumns.amount && (
                                            <td className="teachers-table-cell amount-column">
                                                <EditableCellInput
                                                    value={teacher.amount}
                                                    type="number"
                                                    formatDisplay={(val) =>
                                                        new Intl.NumberFormat('es-CR', {
                                                            style: 'currency',
                                                            currency: 'CRC',
                                                            minimumFractionDigits: 2,
                                                        }).format(val)
                                                    }
                                                    onSave={(val) =>
                                                        handleTableUpdate(
                                                            { id: teacher.id, fields: { amount: parseFloat(val) } },
                                                            updateTeacher
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        {/* Boton Borrado  */}
                                        <td className="payments-td" style={{ textAlign: 'center' }}>
                                            <DeleteButton
                                                id={teacher.id}
                                                confirmingId={confirmingId}
                                                onDelete={onDeleteTeacher}
                                            />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
<td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} className="teachers-table-empty">
                                        No hay profesores registrados.
                                    </td>
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
                        backgroundColor: '#4f46e5',
                        height: '100%',
                        position: 'absolute',
                        right: '-5px',
                        top: 0,
                        zIndex: 10,
                        borderRadius: '0.25rem',
                        opacity: 0.7,
                    }}
                    title="Arrastra para ajustar el ancho de la tabla"
                />
            </div>

            {/* Pagination Controls */}
            {teachers && teachers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default TeachersTable;



