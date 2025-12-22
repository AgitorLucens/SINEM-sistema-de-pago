const AlertMessage = ({ type = "info", message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: {
      bg: "#d1fae5",
      color: "#065f46",
    },
    error: {
      bg: "#fee2e2",
      color: "#991b1b",
    },
    info: {
      bg: "#e0e7ff",
      color: "#3730a3",
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        backgroundColor: current.bg,
        color: current.color,
        fontWeight: 500,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>{message}</span>

      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            fontSize: "1rem",
            cursor: "pointer",
            color: current.color,
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AlertMessage;