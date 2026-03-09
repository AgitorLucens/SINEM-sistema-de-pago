import { useState, useEffect, useRef, useMemo } from 'react';
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import TeachersPagination from './TeachersPagination';
import TeachersPaginationInput from './TeachersPaginationInput';
import EditableCellInput from '../generic/table/EditableCellInput';
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import { updateTeacher } from '../../constant/DBFunctions';

import './teacherstable.css';

const TeachersTable = ({
    teachers,
    divisions,
    minTableWidth = '550px',
    handleTableUpdate,
    onDeleteTeacher,
    confirmingId
}) => {
    const minWidthValue = parseInt(minTableWidth, 10) || 600;

    const [tableWidth, setTableWidth] = useState(() => {
        const saved = localStorage.getItem('teachersTableWidth');
        return saved ? Number(saved) : minWidthValue;
    });

    // State for column visibility
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        courseDivision: true,
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

    const teacherColumns = [
        { key: 'name', label: 'Nombre' },
        { key: 'courseDivision', label: 'Curso/Division' },
        { key: 'amount', label: 'Monto' },
    ];

    // Sorting Logic
    const sortedTeachers = useMemo(() => {
        const sortableItems = [...(teachers || [])];
        if (sortConfig.direction !== 'default' && sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue;
                let bValue;

                if (sortConfig.key === 'name') {
                    aValue = a.name;
                    bValue = b.name;
                } else if (sortConfig.key === 'courseDivision') {
                    aValue = a.division_name || '';
                    bValue = b.division_name || '';
                } else if (sortConfig.key === 'amount') {
                    aValue = a.amount;
                    bValue = b.amount;
                }

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
    }, [teachers, sortConfig]);

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
    const currentItems = sortedTeachers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedTeachers.length ? Math.ceil(sortedTeachers.length / itemsPerPage) : 0;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const dragState = useRef(null);
    const handleMouseDown = (e) => {
        e.preventDefault();

        dragState.current = {
            startX: e.clientX,
            startWidth: tableWidth,
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'col-resize';
    };

    const handleMouseMove = (e) => {
        if (!dragState.current) return;

        const deltaX = e.clientX - dragState.current.startX;
        let newWidth = dragState.current.startWidth + deltaX;

        if (newWidth < minWidthValue) {
            newWidth = minWidthValue;
        }

        const maxAllowedWidth = window.innerWidth * 0.95;
        if (newWidth > maxAllowedWidth) {
            newWidth = maxAllowedWidth;
        }

        setTableWidth(newWidth);
        localStorage.setItem('teachersTableWidth', newWidth);
    };

    const handleMouseUp = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        dragState.current = null;
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

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
                    <TeachersPaginationInput
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
                                                            { id: ex.id, fields: { total_amount: parseFloat(val) } },
                                                            updateExpense
                                                        )
                                                    }
                                                />
                                            </td>
                                        )}
                                        {/* Boton Borrado  */}
                                        <td className="payments-td" style={{ textAlign: 'center' }}>
                                            <button
                                                onClick={(e) => onDeleteTeacher(e, teacher.id)}
                                                className={`delete-btn ${confirmingId === teacher.id ? 'confirming' : ''}`}
                                            >
                                                {confirmingId === teacher.id ? (
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
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="teachers-table-empty">
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
                <TeachersPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default TeachersTable;



