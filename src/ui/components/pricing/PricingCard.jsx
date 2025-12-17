const PricingCard = ({ price, onClick }) => {
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
      <h3 style={{ fontWeight: 600 }}>{price.title}</h3>
      <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
        {price.name}
      </p>

      <div style={{ marginTop: "0.5rem", fontWeight: 700 }}>
        {price.amount != null
            ? `₡${price.amount.toLocaleString("es-CR")}`
            : "No hay precio"}
      </div>
    </div>
  );
};

export default PricingCard;