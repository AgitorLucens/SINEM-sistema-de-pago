import { useState, useMemo, useEffect } from 'react';

const useTableControls = (items, columnKeys, { itemsPerPage = 5, getSortValue } = {}) => {
    const [visibleColumns, setVisibleColumns] = useState(() =>
        Object.fromEntries(columnKeys.map(k => [k, true]))
    );

    const toggleColumn = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'default' });

    const sortedItems = useMemo(() => {
        let sortableItems = [...(items || [])];
        if (sortConfig.direction !== 'default' && sortConfig.key) {
            sortableItems.sort((a, b) => {
                let aValue = getSortValue ? getSortValue(a, sortConfig.key) : a[sortConfig.key];
                let bValue = getSortValue ? getSortValue(b, sortConfig.key) : b[sortConfig.key];

                if (aValue === null || aValue === undefined) aValue = '';
                if (bValue === null || bValue === undefined) bValue = '';

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
    }, [items, sortConfig, getSortValue]);

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
            return null;
        }
        if (sortConfig.direction === 'ascending') {
            return '\u2191';
        }
        if (sortConfig.direction === 'descending') {
            return '\u2193';
        }
        return null;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = sortedItems.length ? Math.ceil(sortedItems.length / itemsPerPage) : 0;

    useEffect(() => {
        setCurrentPage(prev => {
            if (totalPages === 0) return prev === 1 ? prev : 1;
            return prev > totalPages ? totalPages : prev;
        });
    }, [totalPages]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return {
        visibleColumns,
        toggleColumn,
        sortConfig,
        requestSort,
        getSortIndicator,
        currentPage,
        totalPages,
        currentItems,
        paginate,
    };
};

export default useTableControls;
