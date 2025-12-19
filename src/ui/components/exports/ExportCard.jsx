const ExportCard = ({ title, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        background: "white",
      }}
    >
      
      <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
        Exportar
      </p>
        <h3 style={{ fontWeight: 600 }}>{title}</h3>
    </div>
  );
};

export default ExportCard;