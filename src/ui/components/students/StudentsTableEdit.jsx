import React, { useState } from 'react';
import { ArchiveIcon } from "@radix-ui/react-icons";
import '../teachers/tableedit.css'; 

const StudentsTableEdit = ({ visibleColumns, toggleColumn }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="table-controls">
            <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="column-toggle-btn"
            >
                <ArchiveIcon /> Columnas
            </button>
            
            {isMenuOpen && (
                <div className="column-menu">
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.details} 
                                onChange={() => toggleColumn('details')}
                            />
                            Detalles
                        </label>
                    </div>
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.name} 
                                onChange={() => toggleColumn('name')}
                            />
                            Nombre
                        </label>
                    </div>
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.reference} 
                                onChange={() => toggleColumn('reference')}
                            />
                            Referencia
                        </label>
                    </div>
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.phone} 
                                onChange={() => toggleColumn('phone')}
                            />
                            Tel.
                        </label>
                    </div>
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.email} 
                                onChange={() => toggleColumn('email')}
                            />
                            Correo
                        </label>
                    </div>
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.active} 
                                onChange={() => toggleColumn('active')}
                            />
                            Activo
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsTableEdit;
