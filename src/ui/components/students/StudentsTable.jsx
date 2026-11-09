import { formatPhone } from "../generic/function/Function.jsx"
import { updateStudent } from "../../constant/DBFunctions.jsx"
import { PersonIcon } from "@radix-ui/react-icons";
import EditableCellDropdown from '../generic/table/EditableCellDropdown';
import EditableCellInput from '../generic/table/EditableCellInput.jsx';
import ColumnToggleMenu from '../generic/table/ColumnToggleMenu';
import Pagination from '../generic/pagination/Pagination';
import PaginationInput from '../generic/pagination/PaginationInput';
import useTableControls from '../../hooks/useTableControls';
import useResizableTable from '../../hooks/useResizableTable';
import DeleteButton from '../generic/table/DeleteButton';

import './studentstable.css';

const COLUMN_KEYS = ['details', 'name', 'reference', 'phone', 'email', 'active', 'scholarship', 'scholarship_amount'];

const StudentsTable = ({ students, loadStudent, minTableWidth = '700px', handleTableUpdate, onDeleteStudent, modalDetailOpen, onRowClick, confirmingId }) => {
    const { tableWidth, handleMouseDown } = useResizableTable("studentsTableWidth", parseInt(minTableWidth, 10) || 600);

    const {
        visibleColumns,
        toggleColumn,
        requestSort,
        getSortIndicator,
        currentPage,
        totalPages,
        currentItems,
        paginate,
    } = useTableControls(students, COLUMN_KEYS);

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
                    <PaginationInput
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
                                        <DeleteButton
                                            id={s.id}
                                            confirmingId={confirmingId}
                                            onDelete={onDeleteStudent}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr>
<td colSpan={Object.values(visibleColumns).filter(Boolean).length + 1} style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>No hay estudiantes registrados.</td>
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
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={paginate}
                />
            )}
        </div>
    );
};

export default StudentsTable;

