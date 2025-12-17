import { useState } from "react";

const PricingForm = ({ price, onClose, onSave }) => {
  const [value, setValue] = useState(price?.amount ?? null);

  return (
    <div
      style={{
        inset: 0,
        display: "flex",

      }}
    >
      <div
        style={{
          background: "white",
          padding: "1.5rem",
          borderRadius: "0.75rem",
          width: "320px",
        }}
      >
        <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
          Editar {price.name}
        </h2>

        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #d1d5db",
            borderRadius: "0.375rem",
            marginTop: "0.5rem",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.5rem",
            marginTop: "1rem",
          }}
        >
          <button onClick={onClose}>Cancelar</button>
          <button
            onClick={() => onSave(price.id, value)}
            style={{
              background: "#4f46e5",
              color: "white",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.375rem",
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingForm;