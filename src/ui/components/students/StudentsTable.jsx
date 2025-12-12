import { useState, useEffect, useRef } from 'react';

const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        // Utiliza 'es-ES' para formato día/mes/año
        return date.toLocaleDateString('es-ES'); 
    } catch (e) {
        // En caso de error, devuelve la cadena original
        return dateString;
    }
};

const StudentsTable = ({students, minTableWidth = '800px'}) => {

    const minWidthValue = parseInt(minTableWidth, 10) || 600;
    
    const [tableWidth, setTableWidth] = useState(minWidthValue);

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
            style={{ 
                display: 'flex', 
                // Contenedor que establece el ancho redimensionable
                width: `${tableWidth}px`, 
                maxWidth: '100%', 
                minWidth: `${minWidthValue}px`,
                marginBottom: '2rem',
                position: 'relative', // Necesario para posicionar el handle
            }}
        >
            {/* Contenedor de la tabla: permite el scroll horizontal si el contenido de la tabla es > tableWidth */}
            <div style={{ overflowX: 'auto', width: '100%' }}> 
                <table style={{ 
                    // Asegura que la tabla interior ocupe el 100% del ancho del contenedor
                    width: '100%', 
                    // Mantenemos un minWidth a nivel de tabla para asegurar que las celdas no se colapsen
                    minWidth: '600px', 
                    borderCollapse: 'collapse', 
                    borderRadius: '0.75rem', 
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}>
                    <thead style={{ backgroundColor: '#eef2ff' }}> {/* bg-indigo-50 */}
                        <tr>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', color: '#4f46e5', minWidth: '100px' }}>Nombre</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', color: '#4f46e5', minWidth: '150px' }}>Referencia</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', color: '#4f46e5', minWidth: '100px' }}>Tel.</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', color: '#4f46e5', minWidth: '90px' }}>Correo</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '700', color: '#4f46e5', minWidth: '90px' }}>Activo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((s, index) => (
                            // Asegura que el ID sea único
                            <tr key={s.id} style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                                <td style={{ padding: '0.75rem', color: '#6b7280' }}>{s.name}</td>
                                <td style={{ padding: '0.75rem', fontWeight: '500', color: '#1f2937' }}>{s.reference}</td>
                                <td style={{ padding: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{s.phone}</td>
                                {/* Mostrar monto con dos decimales */}
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#065f46' }}>{s.email}</td>         
                                <td style={{ padding: '0.75rem', fontWeight: '600', color: '#065f46' }}>{s.active}</td>  
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
                    right: '-5px', // Se superpone ligeramente al borde para ser más fácil de arrastrar
                    top: 0,
                    zIndex: 10,
                    borderRadius: '0.25rem',
                    opacity: 0.7,
                }}
                title="Arrastra para ajustar el ancho de la tabla"
            />
        </div>
    );
}

export default StudentsTable;