import React, { useState } from 'react';
import { ArchiveIcon } from "@radix-ui/react-icons";

import './tableedit.css';
const TableEdit = ({ visibleColumns, toggleColumn }) => {
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
                                checked={visibleColumns.courseDivision} 
                                onChange={() => toggleColumn('courseDivision')}
                            />
                            Curso/División
                        </label>
                    </div>
                    <div>
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.amount} 
                                onChange={() => toggleColumn('amount')}
                            />
                            Monto
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableEdit;
