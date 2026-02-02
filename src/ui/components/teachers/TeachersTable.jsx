import React, { useState } from 'react';
import TableEdit from './TableEdit';
import TeachersPagination from './TeachersPagination';
import TeachersPaginationInput from './TeachersPaginationInput';
import EditableCellInput from '../generic/table/EditableCellInput';
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import { updateTeacher } from '../../constant/DBFunctions';


import './teacherstable.css';
const TeachersTable = ({ teachers, divisions, handleTableUpdate, onDeleteTeacher, confirmingId }) => {
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

    // Sorting Logic
    const sortedTeachers = React.useMemo(() => {
        let sortableItems = [...(teachers || [])];
        if (sortConfig.direction !== 'default' && sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;

                // Handle specific keys if needed, currently mapping directly
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
            // return <span>&uarr;&darr;</span>; // Optional: show both arrows faded if not sorted
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


    // Pagination Logic (applied to sortedTeachers)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedTeachers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedTeachers.length ? Math.ceil(sortedTeachers.length / itemsPerPage) : 0;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="table-teacher-container">
            {/* Top Bar: Column Visibility and Pagination Input */}
            <div className="table-top-bar">
                {teachers && teachers.length > 0 && (
                    <TeachersPaginationInput 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={paginate}
                    />
                )}

                <TableEdit 
                    visibleColumns={visibleColumns}
                    toggleColumn={toggleColumn}
                />
            </div>

            {/* Table */}
            <div className="teachers-table-wrapper">
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
                                    Curso/División {getSortIndicator('courseDivision')}
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
                                                        { id: teacher.id, fields: { name: val} },
                                                        updateTeacher
                                                    )
                                                }
                                            />
                                        </td>
                                    )}
                                    {visibleColumns.courseDivision && (
                                        <td className="teachers-table-cell">
                                            <EditableCellDropdown
                                                options={divisions}
                                                value={teacher.division_name}
                                                valueKey="id"
                                                labelKey="name"
                                                onSave={(val) => handleTableUpdate({id: teacher.id, fields: {division_id: val}}, updateTeacher)}
                                            />
                                        </td>
                                    )}
                                    {visibleColumns.amount && (
                                        <td className="teachers-table-cell amount-column">
                                            <EditableCellInput
                                                value={teacher.amount}
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
