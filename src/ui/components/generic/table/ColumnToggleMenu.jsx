import React, { useEffect, useRef, useState } from 'react';
import { ArchiveIcon, ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

import './columntogglemenu.css';

const ColumnToggleMenu = ({
    visibleColumns,
    toggleColumn,
    columns = [],
    buttonLabel = 'Columnas',
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuContainerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="table-controls" ref={menuContainerRef}>
            <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`column-toggle-btn ${isMenuOpen ? 'active' : ''}`}
            >
                <ArchiveIcon /> {buttonLabel} {isMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>

            {isMenuOpen && (
                <div className="column-menu">
                    {columns.map((column) => (
                        <div className="column-menu-item" key={column.key}>
                            <label className="column-menu-label">
                                <input
                                    className="column-menu-checkbox"
                                    type="checkbox"
                                    checked={Boolean(visibleColumns[column.key])}
                                    onChange={() => toggleColumn(column.key)}
                                />
                                {column.label}
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColumnToggleMenu;
