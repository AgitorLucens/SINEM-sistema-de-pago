import './reporttable.css';
const ReportTable = ({matrixData, totalGeneral, columnTotals,selectedCourses,selectedMethods}) => {
    return (
        <div className="table-container">
            <div className="scroll-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th className="corner">Método / Curso</th>
                                {selectedCourses.map(c => <th key={c.id}>{c.name}</th>)}
                            <th style={{textAlign: 'right'}}>Total Fila</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedMethods.map(method => {
                            const rowSum = selectedCourses.reduce(
                                (acc, c) => acc + (matrixData[method.value]?.[c.id] || 0),0);

                            return (
                                <tr key={method.value}>
                                    <td className="row-label">{method.label}</td>

                                    {selectedCourses.map(course => (
                                        <td key={course.id}>
                                            {matrixData[method.value]?.[course.id] > 0
                                                ? `₡${matrixData[method.value][course.id].toLocaleString()}`
                                                : <span className="empty-val">₡0</span>
                                            }
                                        </td>
                                    ))}
                                    <td className="total-cell">
                                        ₡{rowSum.toLocaleString()}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className='td-income'>TOTAL GENERAL</td>
                                {selectedCourses.map(c => (
                                    <td style={{ textAlign: 'right', color: '#34d399', fontSize: '16px' }}
                                        key={c.id}>
                                        ₡{columnTotals[c.id].toLocaleString()}
                                    </td>
                                ))}
                            <td style={{textAlign: 'right', color: '#34d399', fontSize: '16px'}}>
                                ₡{totalGeneral.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
      </div>
    );
};

export default ReportTable;