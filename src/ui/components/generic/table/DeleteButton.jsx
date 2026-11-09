const DeleteButton = ({ id, confirmingId, onDelete }) => (
    <button
        onClick={(e) => onDelete(e, id)}
        className={`delete-btn ${confirmingId === id ? 'confirming' : ''}`}
    >
        {confirmingId === id ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
        )}
    </button>
);

export default DeleteButton;
