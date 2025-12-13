const StudentsModal = ({ isOpen, onClose, children, title }) => {
        if (!isOpen) {
        return null;
    }

    return (
        // Fondo oscuro y fijo que cubre toda la pantalla
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000, // Asegura que esté por encima de otros elementos
                padding: '1rem'
            }}
        >
            {/* Contenedor del contenido del modal */}
            <div 
                style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxWidth: '500px',
                    maxHeight: '90vh', // Máximo 90% del viewport height
                    overflowY: 'auto', // Scroll si el contenido es demasiado largo
                    position: 'relative'
                }}
            >
                {/* Título y botón de cerrar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.75rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                        {title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            color: '#9ca3af' // text-gray-400
                        }}
                    >
                        &times; {/* Símbolo de "X" para cerrar */}
                    </button>
                </div>

                {/* Contenido dinámico del modal */}
                {children}
            </div>
        </div>
    );
};

export default StudentsModal;
