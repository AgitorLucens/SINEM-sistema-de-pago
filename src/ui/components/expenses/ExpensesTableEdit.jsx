import React, { useState } from 'react';
import { ArchiveIcon } from "@radix-ui/react-icons";

// We can reuse the css from teachers or create a new one. 
// For now, let's assume we might want specific styles or just reuse the pattern.
// Since the prompt implied copying the functionality, I'll use a similar structure.
import '../teachers/tableedit.css'; 

const ExpensesTableEdit = ({ visibleColumns, toggleColumn }) => {
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
                                checked={visibleColumns.date} 
                                onChange={() => toggleColumn('date')}
                            />
                            Fecha
                        </label>
                    </div>
                    <div className="column-menu-item">
                        <label className="column-menu-label">
                            <input 
                                type="checkbox" 
                                checked={visibleColumns.description} 
                                onChange={() => toggleColumn('description')}
                            />
                            Detalle
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

export default ExpensesTableEdit;
