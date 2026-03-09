import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import '../teachers/teacherstable.css'; // Reuse CSS

const PaymentsPaginationInput = ({ currentPage, totalPages, onPageChange }) => {
    const [inputVal, setInputVal] = useState(currentPage);

    useEffect(() => {
        setInputVal(currentPage);
    }, [currentPage]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handlePageCommit();
        }
    };

    const handleBlur = () => {
        handlePageCommit();
    };

    const handlePageCommit = () => {
        const page = parseInt(inputVal);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            onPageChange(page);
        } else {
            setInputVal(currentPage); // Reset on invalid
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination-input-controls">
            <button
                className="pagination-input-btn"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                title="Página Anterior"
            >
                <ChevronLeftIcon />
            </button>
            <div className="pagination-input-wrapper">
                <input
                    type="number"
                    className="pagination-input"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    min="1"
                    max={totalPages}
                />
                <span className="pagination-total"> / {totalPages}</span>
            </div>
            <button
                className="pagination-input-btn"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                title="Página Siguiente"
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
};

export default PaymentsPaginationInput;
